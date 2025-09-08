"use client";

import React, { useState } from "react";
import { PromptForm } from "@/components/DynamicForm";
import { PromptResult } from "@/components/PromptResult";
import mid from "@/public/midjourney.png"
import leo from "@/public/leonardo.png"
import ideo from "@/public/ideogram.png"
import Image from "next/image";

export default function GeneratePage() {
  const [result, setResult] = useState("");

  const scrollToGenerator = () => {
    document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 overflow-hidden">
        {/* Multi-color glow gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,120,180,0.35),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.30),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.30),transparent_60%),radial-gradient(ellipse_at_bottom_center,rgba(16,185,129,0.25),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(253,224,71,0.30),transparent_70%)]" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-sm font-medium text-neutral-600 mb-4 tracking-wide uppercase">
            Improve your
          </p>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-4 tracking-tight text-balance">
            Prompt <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Generation</span>
          </h1>
          
          {/* Subline */}
          <p className="text-2xl md:text-3xl font-medium text-neutral-700 mb-8">
            with AI
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Tailored prompts for your audience. Generate, iterate, and ship faster.
          </p>
          
          {/* Primary CTA */}
          <button
            onClick={scrollToGenerator}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-full hover:from-violet-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/25"
          >
            Generate now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
        
        {/* Trust Logos Row */}
        <div className="relative z-10 mt-20 w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-8 md:space-x-12 opacity-40">
            <Image src={mid}  alt="Midjourney" className="h-22 w-auto grayscale" />
            <Image src={leo} alt="Leonardo AI" className="h-22 w-auto grayscale" />
            <Image src={ideo} alt="Ideogram" className="h-22 w-auto grayscale" />
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form Card */}
            <div className="order-2 lg:order-1">
              <PromptForm setResult={setResult} />
            </div>
            
            {/* Result Card */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <PromptResult result={result} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}