"use client";
import React, { useState } from "react";
import { usePromptContext } from "../app/context/PromptContext";

type PromptFormProps = {
  setResult: (result: string) => void;
  setTemplate: (template: string) => void; 
};

export const PromptForm: React.FC<PromptFormProps> = ({ setResult , setTemplate }) => {
  const { addPrompt } = usePromptContext();
  const [audience, setAudience] = useState("POD Seller");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fieldOptions = {
    "Product Type": [
      "T-shirt", "Hoodie", "Tank Top", "Long Sleeve", "Mug", "Coffee Cup", "Water Bottle", 
      "Tote Bag", "Canvas Bag", "Backpack", "Sticker", "Poster", "Canvas Print", 
      "Phone Case", "Laptop Case", "Pillow", "Blanket", "Hat", "Cap", "Notebook"
    ],
    "Print Area Style": [
      "Full front", "Pocket-size", "All-over print", "Back design", "Front chest", 
      "Sleeve print", "Side print", "Bottom hem", "Collar area", "Wrap-around"
    ],
    "Design Style": [
      "Vintage", "Minimalist", "Cartoon", "Streetwear", "Y2K", "Graffiti", "Cyberpunk", 
      "Retro 80s", "Hand-drawn", "Typography", "Abstract", "Geometric", "Watercolor", 
      "Sketch", "Pop Art", "Gothic", "Bohemian", "Modern", "Classic"
    ],
    "Format Preference": [
      "Illustration", "Typography", "Photo-style", "Mixed media", "Vector art", 
      "Hand lettering", "Digital painting", "Collage", "Line art", "Silhouette"
    ],
    "Mood / Tone": [
      "Playful", "Bold", "Dark", "Elegant", "Cute", "Energetic", "Calm", "Mysterious", 
      "Funny", "Inspirational", "Edgy", "Romantic", "Professional", "Casual", 
      "Rebellious", "Sophisticated", "Quirky", "Confident"
    ],
    "Color Palette": [
      "Monochrome", "Black & White", "Pastel", "Neon", "Earth tones", "Bright colors", 
      "Muted colors", "Rainbow", "Blue tones", "Warm colors", "Cool colors", 
      "Gold accent", "Silver accent", "Gradient", "Two-tone"
    ],
    "Background": [
      "Transparent", "Solid color", "White", "Black", "Gradient", "Patterned", 
      "Textured", "Distressed", "Clean", "Vintage paper", "Grunge", "Watercolor wash"
    ],
    "Target Audience": [
      "Teenagers", "Young Adults", "Gamers", "Pet owners", "Cat lovers", "Dog lovers", 
      "Moms", "Dads", "Fitness enthusiasts", "Yoga lovers", "College students", 
      "Streetwear fans", "Music lovers", "Artists", "Professionals", "Coffee lovers", 
      "Book lovers", "Travel enthusiasts", "Outdoor adventurers", "Tech enthusiasts"
    ]
  };

  const sectionConfig = [
    {
      id: "product",
      title: "Product Context",
      icon: "📦",
      color: "blue",
      fields: ["Product Type", "Print Area Style"]
    },
    {
      id: "design",
      title: "Design Style",
      icon: "🎨",
      color: "purple",
      fields: ["Design Style", "Format Preference"]
    },
    {
      id: "theme",
      title: "Theme & Concept",
      icon: "💡",
      color: "emerald",
      fields: ["Main Subject or Theme", "Mood / Tone"]
    },
    {
      id: "color",
      title: "Visual Preferences",
      icon: "🌈",
      color: "orange",
      fields: ["Color Palette", "Background"]
    },
    {
      id: "audience",
      title: "Target Market",
      icon: "👥",
      color: "rose",
      fields: ["Target Audience"]
    }
  ];

  const getFields = (): string[] => {
    return [
      "Product Type", "Print Area Style", "Design Style", "Format Preference",
      "Main Subject or Theme", "Mood / Tone", "Color Palette", "Background", "Target Audience"
    ];
  };

  const handleChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    localStorage.setItem("loadingPrompt", "true");
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, inputs })
      });
      const data = await res.json();
      setResult(data.prompt || "Error generating prompt");
      setTemplate(data.template || "Error generating template");
      addPrompt({ audience, inputs, generated: data.prompt || "" });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isFormValid = getFields().every(field => inputs[field]?.trim());
  const completedFields = getFields().filter(field => inputs[field]?.trim()).length;
  const totalFields = getFields().length;
  const progressPercentage = (completedFields / totalFields) * 100;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "bg-gradient-to-br from-blue-50/80 to-cyan-50/80",
        border: "border-l-blue-500",
        accent: "text-blue-700"
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-50/80 to-violet-50/80",
        border: "border-l-purple-500",
        accent: "text-purple-700"
      },
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50/80 to-green-50/80",
        border: "border-l-emerald-500",
        accent: "text-emerald-700"
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-50/80 to-amber-50/80",
        border: "border-l-orange-500",
        accent: "text-orange-700"
      },
      rose: {
        bg: "bg-gradient-to-br from-rose-50/80 to-pink-50/80",
        border: "border-l-rose-500",
        accent: "text-rose-700"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const renderField = (field: string) => {
    const isDropdown = fieldOptions[field as keyof typeof fieldOptions];
    const isSelected = inputs[field]?.trim();
    const isFocused = focusedField === field;
    
    if (isDropdown) {
      return (
        <div className="relative">
          <select
            id={field}
            value={inputs[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full px-4 py-3.5 text-sm font-medium bg-white/80 backdrop-blur-sm
              border-2 rounded-xl shadow-sm appearance-none cursor-pointer
              transition-all duration-200 ease-out
              ${isFocused 
                ? 'border-violet-500 ring-4 ring-violet-500/10 shadow-lg scale-[1.02]' 
                : isSelected
                ? 'border-emerald-300 hover:border-violet-400'
                : 'border-slate-200 hover:border-slate-300'
              }
              ${isSelected ? 'text-slate-900' : 'text-slate-500'}
              focus:outline-none group-hover:shadow-md
            `}
          >
            <option value="" disabled className="text-slate-400">
              Choose {field.toLowerCase()}...
            </option>
            {isDropdown.map((option) => (
              <option key={option} value={option} className="text-slate-900 py-2">
                {option}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className={`
            absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
            transition-all duration-200
            ${isFocused ? 'text-violet-500 rotate-180' : 'text-slate-400'}
          `}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      );
    }

    // Text input for "Main Subject or Theme"
    return (
      <div className="relative">
        <input
          id={field}
          type="text"
          placeholder="e.g., Skateboard Raccoon, Funny Cat Meme, Motivational Quote..."
          value={inputs[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          className={`
            w-full px-4 py-3.5 text-sm font-medium bg-white/80 backdrop-blur-sm
            border-2 rounded-xl shadow-sm
            transition-all duration-200 ease-out
            ${isFocused 
              ? 'border-violet-500 ring-4 ring-violet-500/10 shadow-lg scale-[1.02]' 
              : isSelected
              ? 'border-emerald-300 hover:border-violet-400'
              : 'border-slate-200 hover:border-slate-300'
            }
            ${isSelected ? 'text-slate-900' : 'text-slate-500'}
            placeholder:text-slate-400 focus:outline-none
          `}
        />
        
        {/* Character count or validation indicator */}
        {isSelected && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      {/* Animated gradient header */}
      <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-600 via-pink-600 to-orange-500 animate-pulse"></div>
      
      <div className="p-8 lg:p-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-violet-800 to-slate-900 bg-clip-text text-transparent mb-3">
            POD Design Prompt Generator
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
            Create professional design prompts with our intelligent form builder
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
              <span>Progress</span>
              <span>{completedFields}/{totalFields} fields</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sectionConfig.map((section) => {
            const colors = getColorClasses(section.color);
            const sectionCompleted = section.fields.every(field => inputs[field]?.trim());
            
            return (
              <div 
                key={section.id}
                className={`
                  group relative ${colors.bg} backdrop-blur-sm rounded-2xl p-6 
                  border-l-4 ${colors.border} transition-all duration-300 hover:shadow-lg
                  ${sectionCompleted ? 'ring-2 ring-emerald-200' : ''}
                `}
              >
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className={`text-lg font-semibold ${colors.accent}`}>
                      {section.title}
                    </h3>
                  </div>
                  
                  {/* Section completion indicator */}
                  {sectionCompleted && (
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Complete</span>
                    </div>
                  )}
                </div>

                {/* Fields grid */}
                <div className={`grid gap-6 ${section.fields.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                  {section.fields.map((field) => (
                    <div key={field} className="group/field space-y-3">
                      <label 
                        htmlFor={field} 
                        className="flex items-center text-sm font-semibold text-slate-700 group-hover/field:text-slate-900 transition-colors"
                      >
                        {field}
                        {inputs[field]?.trim() && (
                          <svg className="w-4 h-4 ml-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Enhanced Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`
                group relative w-full px-8 py-4 text-lg font-bold text-white rounded-2xl
                transition-all duration-300 ease-out transform
                ${isFormValid 
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/25 active:scale-[0.98]' 
                  : 'bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-4 focus:ring-violet-500/25
                disabled:transform-none disabled:shadow-none
              `}
            >
              {/* Button content */}
              <div className="flex items-center justify-center space-x-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Your Perfect Prompt...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Generate Professional POD Prompt</span>
                  </>
                )}
              </div>
              
              {/* Button glow effect */}
              {isFormValid && !loading && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              )}
            </button>

            {/* Helper text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 flex items-center justify-center space-x-2">
                <span>💡</span>
                <span>Complete all fields to unlock professional prompt generation</span>
              </p>
              {!isFormValid && (
                <p className="text-xs text-amber-600 mt-2 font-medium">
                  {totalFields - completedFields} fields remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};