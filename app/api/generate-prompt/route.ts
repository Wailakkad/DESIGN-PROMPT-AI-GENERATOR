import { NextResponse } from "next/server";

type Inputs = Record<string, unknown>;
function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function extractJSON(text: string) {
  try { return JSON.parse(text); } catch {}
  const m = typeof text === "string" ? text.match(/\{[\s\S]*\}/) : null;
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// Build task with POD-specific constraints to avoid mockups
function buildTask(audience: string) {
  const isPOD =
    /(^|\s)pod($|\s)/i.test(audience) ||
    /print[-\s]?on[-\s]?demand/i.test(audience);

  const base =
    "Create one highly optimized creative design prompt for generative design tools (Midjourney, SDXL, DALL·E, Figma/Framer). " +
    "Be specific and visual: subject, style, composition, color palette, lighting, mood, materials, camera/format or vector style, aspect if relevant. " +
    "Add useful art/era/technique refs. Optionally finish with a short 'avoid: …' clause. Keep under 1200 characters. Echo the audience exactly.";

  if (!isPOD) return base;

  // POD-only additions to prevent T-shirt mockups
  const podExtra =
    " IMPORTANT for Print-on-Demand: Generate a DESIGN-ONLY prompt (standalone artwork), not a product photo or mockup. " +
    "Must specify: 'isolated graphic, centered composition, transparent background (no scene, no shadows), print-ready'. " +
    "Hard negatives: no t-shirt, no clothing, no apparel, no model, no person, no hands, no mannequin, no hanger, no tag, no label, no wrinkles, no studio, no room, no flatlay, no mockup. " +
    "If dimensions needed, suggest 4500x5400 px, PNG 300 DPI (or vector/SVG).";

  return base + " " + podExtra;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!isObj(body)) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

    const audience = typeof body.audience === "string" ? body.audience.trim() : "";
    const inputs: Inputs = isObj(body.inputs) ? body.inputs : {};
    const model = typeof body.model === "string" ? body.model : "deepseek/deepseek-r1:free";

    if (!audience) return NextResponse.json({ error: "audience is required (string)" }, { status: 400 });
    if (!isObj(inputs)) return NextResponse.json({ error: "inputs is required (object)" }, { status: 400 });
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        audience: { type: "string", description: "Echo the provided audience exactly." },
        prompt: { type: "string", description: "The final optimized design prompt." }
      },
      required: ["audience", "prompt"]
    };

    const headers = {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Design Prompt Generator"
    };

    const task = buildTask(audience);

    // 1) Try tools (if supported)
    const toolsRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are an expert at crafting professional design prompts. Return results ONLY via the provided function tool. No explanations." },
          { role: "user", content: task },
          { role: "user", content: JSON.stringify({ audience, inputs }) }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_prompt",
              description: "Return the final optimized design prompt as JSON.",
              parameters: schema
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "emit_prompt" } },
        temperature: 0.35,
        top_p: 0.9,
        max_tokens: 700
      })
    });

    const toolsJson = await toolsRes.json().catch(() => null as any);
    const noToolSupport =
      toolsRes.status === 404 ||
      (toolsJson?.error?.message &&
        String(toolsJson.error.message).toLowerCase().includes("support tool use"));

    if (!noToolSupport) {
      const toolCall = toolsJson?.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.name === "emit_prompt") {
        const args = JSON.parse(toolCall.function.arguments || "{}");
        if (args?.audience && args?.prompt) {
          return NextResponse.json({ audience: String(args.audience), prompt: String(args.prompt) });
        }
      }
      const raw = toolsJson?.choices?.[0]?.message?.content ?? "";
      const parsed = typeof raw === "string" ? extractJSON(raw) : null;
      if (parsed?.audience && parsed?.prompt) {
        return NextResponse.json({ audience: String(parsed.audience), prompt: String(parsed.prompt) });
      }
    }

    // 2) Fallback: JSON-only flow
    const jsonRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You must return a single JSON object matching the provided schema. No prose, no markdown, no code fences."
          },
          { role: "user", content: task },
          {
            role: "user",
            content:
              "Schema: " + JSON.stringify(schema) +
              "\nContext: " + JSON.stringify({ audience, inputs }) +
              `\nReturn exactly: {"audience":"${audience}","prompt":"..."}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 700,
        stop: ["```"]
      })
    });

    const data2 = await jsonRes.json();
    const raw2 = data2?.choices?.[0]?.message?.content ?? "";
    const parsed2 = typeof raw2 === "string" ? extractJSON(raw2) : null;

    if (parsed2?.audience && parsed2?.prompt) {
      return NextResponse.json({ audience: String(parsed2.audience), prompt: String(parsed2.prompt) });
    }

    return NextResponse.json(
      { error: "Model did not return valid JSON", raw: raw2 || data2 },
      { status: 502 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}