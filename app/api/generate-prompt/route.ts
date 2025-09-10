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

// Build enhanced task for POD designs with template generation
function buildTask() {
  return (
    "TASK: Create one single highly-optimized, professional design prompt for generative design tools (Midjourney, SDXL, DALL·E). " +

    // Core Description
    "1. SUBJECT: Provide an ultra-specific and visually rich description of [SUBJECT]. Focus on fine details, unique attributes, and key defining features. " +
    "2. STYLE: Specify artistic style, movement, or school (e.g. Bauhaus, Surrealism, Ukiyo-e, Cyberpunk). Include references to famous artists or design techniques if appropriate. " +
    "3. COMPOSITION: Give precise layout instructions (symmetry, balance, focal point, perspective, background treatment). " +
    "4. COLOR: Define a deliberate color palette with exact hues (e.g. 'deep ultramarine blue', 'soft pastel peach'). " +
    "5. LIGHTING: Describe lighting setup (cinematic, natural, neon glow, chiaroscuro, backlit, golden hour). " +
    "6. MOOD: Convey emotional tone (e.g. calm, vibrant, nostalgic, futuristic). " +
    "7. MATERIAL/TEXTURE: Add tactile qualities (smooth metallic, rough canvas, glossy ceramic). " +
    "8. CAMERA/FORMAT: If relevant, specify angle, lens type, or vector-style (e.g. 'flat vector graphic, clean outlines'). " +
    "9. DIMENSIONS: If aspect ratio applies, include it (e.g. 1:1, 4:5, 16:9). " +

    // Print-on-Demand rules
    "MANDATORY for Print-on-Demand: The output must be a DESIGN-ONLY artwork prompt, never a mockup. " +
    "Required details: isolated graphic design, perfectly centered composition, transparent background, no environmental context, " +
    "no shadows, no reflections, print-ready vector or high-resolution format. " +
    "Technical Specs: 4500x5400px, PNG 300 DPI or vector SVG. " +

    // Negatives
    "Hard NEGATIVES: Never include t-shirt, hoodie, clothing, apparel, model, person, body parts, hands, mannequin, hanger, tag, label, wrinkles, studio, room, flatlay, mockup, or any physical product context. " +

    // Length
    "Keep the full prompt under 1400 characters for optimal model performance. " +

    // Reusable Template
    "ALSO OUTPUT a REUSABLE TEMPLATE version with placeholders: [SUBJECT], [STYLE], [COLOR_PALETTE], [MOOD], [LIGHTING], [MATERIAL], [COMPOSITION]. " +
    "Make placeholders intuitive, clearly labeled, and easy for non-designers to customize while preserving structure and quality."
  );
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
        prompt: { type: "string", description: "The final optimized design prompt." },
        template: { type: "string", description: "A reusable template version with placeholders for customization." }
      },
      required: ["audience", "prompt", "template"]
    };

    const headers = {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Design Prompt Generator"
    };

    const task = buildTask();

    // 1) Try tools (if supported)
    const toolsRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
  role: "system",
  content: "You are an expert in professional design prompt engineering. \
Always return outputs ONLY through the provided function tool, never in plain text. \
Your job is to transform tasks into highly optimized creative prompts for generative design AI tools. \
The result must be JSON with two keys: \
- 'final_prompt': the optimized design prompt (ready-to-use, standalone, polished, <1600 chars). \
- 'template_prompt': a structured reusable version with placeholders. \
Do not explain, do not add commentary. Always respect all mandatory rules, negatives, and technical specifications."
}
,
          { role: "user", content: task },
          { role: "user", content: JSON.stringify({ audience, inputs }) }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_prompt",
              description: "Return the final optimized design prompt and template as JSON.",
              parameters: schema
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "emit_prompt" } },
        temperature: 0.35,
        top_p: 0.9,
        max_tokens: 900
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
        if (args?.audience && args?.prompt && args?.template) {
          return NextResponse.json({ 
            audience: String(args.audience), 
            prompt: String(args.prompt),
            template: String(args.template)
          });
        }
      }
      const raw = toolsJson?.choices?.[0]?.message?.content ?? "";
      const parsed = typeof raw === "string" ? extractJSON(raw) : null;
      if (parsed?.audience && parsed?.prompt && parsed?.template) {
        return NextResponse.json({ 
          audience: String(parsed.audience), 
          prompt: String(parsed.prompt),
          template: String(parsed.template)
        });
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
              `\nReturn exactly: {"audience":"${audience}","prompt":"...","template":"..."}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 900,
        stop: ["```"]
      })
    });

    const data2 = await jsonRes.json();
    const raw2 = data2?.choices?.[0]?.message?.content ?? "";
    const parsed2 = typeof raw2 === "string" ? extractJSON(raw2) : null;

    if (parsed2?.audience && parsed2?.prompt && parsed2?.template) {
      return NextResponse.json({ 
        audience: String(parsed2.audience), 
        prompt: String(parsed2.prompt),
        template: String(parsed2.template)
      });
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