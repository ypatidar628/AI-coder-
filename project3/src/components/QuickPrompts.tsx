'use client';

import React from 'react';
import { Persona } from '@/types/chat';
import { ArrowUpRight } from 'lucide-react';

interface QuickPromptsProps {
  persona: Persona;
  onSelectPrompt: (prompt: string) => void;
}

export function QuickPrompts({ persona, onSelectPrompt }: QuickPromptsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 mt-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
        Suggested prompts
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {persona.suggestedStarters.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(starter)}
            className="flex items-center justify-between p-3 rounded-xl text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-all text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs group cursor-pointer"
          >
            <span className="pr-2 line-clamp-2 leading-relaxed">{starter}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 dark:text-slate-500 dark:group-hover:text-sky-400 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
