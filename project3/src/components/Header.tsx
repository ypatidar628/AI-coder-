'use client';

import React from 'react';
import { Menu, Settings, Sparkles, CheckCircle2, KeyRound, Sun, Moon } from 'lucide-react';
import { Persona } from '@/types/chat';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  activePersona: Persona;
  selectedModel: string;
  hasApiKey: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({
  onToggleSidebar,
  onOpenSettings,
  activePersona,
  selectedModel,
  hasApiKey,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-white/[0.07] bg-white/90 dark:bg-[#090d16]/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight truncate">
              AI Assistant
            </span>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-white/[0.08] truncate max-w-[110px] sm:max-w-none">
              {activePersona.name}
            </span>
            <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono border border-sky-500/20">
              {selectedModel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* API Key Status Pill */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
            hasApiKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
          }`}
          title={hasApiKey ? 'Gemini API is connected' : 'Click to add API Key'}
        >
          {hasApiKey ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Key</span>
            </>
          )}
        </button>

        {/* Light / Dark Mode Toggle button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-200" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Open settings"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
