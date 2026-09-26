'use client';

import React from 'react';
import { Kanban } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#032147] flex items-center justify-center text-white shadow-xs">
            <Kanban size={20} className="text-[#ecad0a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#032147] tracking-tight">
                Project Kanban
              </h1>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ecad0a]" />
              <span className="text-xs font-medium text-[#209dd7]">
                Single Board
              </span>
            </div>
            <p className="text-xs text-[#888888]">
              Streamlined project management and workflow tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[#888888]">
              Client Rendered
            </span>
          </div>
        </div>
      </div>
      {/* Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#ecad0a] via-[#209dd7] to-[#753991]" />
    </header>
  );
};
