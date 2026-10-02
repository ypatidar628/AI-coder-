'use client';

import React, { useState, useEffect } from 'react';
import { ChatSettings } from '@/types/chat';
import { AVAILABLE_MODELS, PERSONAS } from '@/lib/defaultPrompts';
import { X, KeyRound, Cpu, UserCheck, Sliders, ExternalLink, Eye, EyeOff, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSave: (newSettings: ChatSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel);
  const [selectedPersonaId, setSelectedPersonaId] = useState(settings.selectedPersonaId);
  const [customSystemInstruction, setCustomSystemInstruction] = useState(settings.customSystemInstruction || '');
  const [temperature, setTemperature] = useState(settings.temperature ?? 0.7);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey || '');
      setSelectedModel(settings.selectedModel);
      setSelectedPersonaId(settings.selectedPersonaId);
      setCustomSystemInstruction(settings.customSystemInstruction || '');
      setTemperature(settings.temperature ?? 0.7);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      apiKey,
      selectedModel,
      selectedPersonaId,
      customSystemInstruction,
      temperature,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <KeyRound className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Leave blank to use .env key"
                className="w-full bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-white/[0.1] focus:border-sky-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500/80 text-sky-900 dark:bg-sky-500/10 dark:border-sky-500/60 dark:text-white'
                        : 'bg-slate-50 dark:bg-[#080d17] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.16]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-0.5">{model.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{model.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              Default Persona
            </label>
            <select
              value={selectedPersonaId}
              onChange={(e) => setSelectedPersonaId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-white/[0.1] focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
            >
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#0e1526] text-slate-900 dark:text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-800 dark:text-slate-200">
                Temperature: <span className="text-sky-600 dark:text-sky-400 font-mono">{temperature}</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-sky-500 h-1.5 bg-slate-200 dark:bg-white/[0.1] rounded-lg cursor-pointer"
            />
          </div>

          {/* Additional instructions */}
          <div className="space-y-1.5">
            <label className="font-medium text-slate-800 dark:text-slate-200">
              System Instruction Override (Optional)
            </label>
            <textarea
              value={customSystemInstruction}
              onChange={(e) => setCustomSystemInstruction(e.target.value)}
              placeholder="e.g. Always respond with concise code and use TypeScript..."
              rows={2}
              className="w-full bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-white/[0.1] focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#090d16]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
