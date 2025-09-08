"use client";
import React from "react";

type AudienceSelectorProps = {
  audience: string;
  setAudience: (audience: string) => void;
};

const audiences = [
  "POD Seller",
  "Social Media Creator",
  "Graphic Designer",
  "Brand Owner",
  "Marketing Agency"
];

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({ audience, setAudience }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="audience-select" className="text-sm font-medium text-neutral-700 uppercase tracking-wide">
          Target Audience
        </label>
        <p className="text-sm text-neutral-500">
          Choose your primary audience for tailored prompts
        </p>
      </div>
      <select
        id="audience-select"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        className="w-full px-4 py-3 text-neutral-900 bg-white border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
      >
        <option value="">-- Choose your audience --</option>
        {audiences.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
};