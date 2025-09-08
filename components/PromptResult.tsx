"use client";
import React, { useState } from "react";

type PromptResultProps = {
  result: string;
};

export const PromptResult: React.FC<PromptResultProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!result) {
    return (
      <div className="bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-violet-100 to-pink-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-700 mb-2">
          Your prompt will appear here
        </h3>
        <p className="text-neutral-500">
          Complete the form to generate a tailored prompt
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Generated Prompt
          </h2>
          <div aria-live="polite" className="sr-only">
            {result ? "Prompt generated successfully" : ""}
          </div>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-neutral-800 font-mono leading-relaxed">
            {result}
          </pre>
        </div>
        
        {/* Optional actions */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Use this prompt in your favorite AI tool
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded px-2 py-1"
          >
            Generate another
          </button>
        </div>
      </div>
    </div>
  );
};