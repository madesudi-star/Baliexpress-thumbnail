import React from 'react';
import { Newspaper, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onLoadSample, onOpenGuide }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-600/30">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                NEWS THUMBNAIL MAKER
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                4:5 (1080×1350)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Create professional Facebook news thumbnails in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Muat Contoh Berita"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Contoh</span> Demo
          </button>
          
          <button
            onClick={onReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset Pengaturan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={onOpenGuide}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Panduan & Spesifikasi"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
