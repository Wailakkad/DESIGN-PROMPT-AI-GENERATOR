"use client";
import React from "react";
import { useRouter } from "next/navigation";
function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-neutral-900">DP</div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-neutral-900 transition-colors">Home</a>
            <a href="#" className="text-slate-600 hover:text-neutral-900 transition-colors">About</a>
            <a href="#" className="text-slate-600 hover:text-neutral-900 transition-colors">Blog</a>
          </nav>
          
          <button onClick={()=> router.push("/generate") } className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
            Try for free
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;