"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PromptResult = {
  audience: string;
  inputs: Record<string, string>;
  generated: string;
};

type PromptContextType = {
  prompts: PromptResult[];
  addPrompt: (prompt: PromptResult) => void;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [prompts, setPrompts] = useState<PromptResult[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("prompts");
    if (stored) setPrompts(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("prompts", JSON.stringify(prompts));
  }, [prompts]);

  const addPrompt = (prompt: PromptResult) => {
    setPrompts((prev) => [...prev, prompt]);
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePromptContext = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error("usePromptContext must be used within PromptProvider");
  return context;
};
