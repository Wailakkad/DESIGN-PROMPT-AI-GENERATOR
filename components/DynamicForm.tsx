"use client";
import React, { useState } from "react";
import { AudienceSelector } from "./AudienceSelector";
import { usePromptContext } from "../app/context/PromptContext";

type PromptFormProps = {
  setResult: (result: string) => void;
};

export const PromptForm: React.FC<PromptFormProps> = ({ setResult }) => {
  const { addPrompt } = usePromptContext();
  const [audience, setAudience] = useState("");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const getFields = (): string[] => {
    switch (audience) {
      case "POD Seller": return ["Product Type", "Design Style", "Target Audience"];
      case "Social Media Creator": return ["Platform", "Content Style", "Tone"];
      case "Graphic Designer": return ["Design Tool", "Theme", "Color Palette"];
      case "Brand Owner": return ["Industry", "Brand Personality", "Colors"];
      case "Marketing Agency": return ["Campaign Type", "Target Market", "Message"];
      default: return [];
    }
  };

  const handleChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, inputs })
      });
      const data = await res.json();
      setResult(data.prompt || "Error generating prompt");
      addPrompt({ audience, inputs, generated: data.prompt || "" });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isFormValid = audience && getFields().every(field => inputs[field]?.trim());

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      {/* Gradient header bar */}
      <div className="h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500"></div>
      
      <div className="p-6 lg:p-8">
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
            Create Your Prompt
          </h2>
          <p className="text-neutral-600">
            Fill in the details below to generate a tailored prompt
          </p>
        </div>

        <div className="space-y-6">
          {/* Audience Selector */}
          <AudienceSelector audience={audience} setAudience={setAudience} />
          
          {/* Dynamic Fields */}
          {getFields().map((field) => (
            <div key={field} className="space-y-2">
              <label htmlFor={field} className="text-sm font-medium text-neutral-700">
                {field}
              </label>
              <input
                id={field}
                type="text"
                placeholder={`Enter ${field.toLowerCase()}...`}
                value={inputs[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full px-4 py-3 text-neutral-900 bg-white border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors placeholder:text-neutral-400"
              />
            </div>
          ))}

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            aria-busy={loading}
            className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-700 hover:to-pink-700 disabled:from-neutral-300 disabled:to-neutral-300 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-violet-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Prompt"
            )}
          </button>

          {/* Helper Text */}
          {!audience && (
            <p className="text-sm text-neutral-500 text-center">
              Select an audience to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
};