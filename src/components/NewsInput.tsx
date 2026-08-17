import React from 'react';
import { Type, Tag } from 'lucide-react';

interface NewsInputProps {
  headline: string;
  onChangeHeadline: (text: string) => void;
  showBadge: boolean;
  onToggleBadge: (show: boolean) => void;
  badgeText: string;
  onChangeBadgeText: (text: string) => void;
}

const BADGE_PRESETS = [
  'BREAKING NEWS',
  'KABAR TERKINI',
  'UPDATE TERBARU',
  'SOROTAN UTAMA',
  'EKSKLUSIF',
];

export const NewsInput: React.FC<NewsInputProps> = ({
  headline,
  onChangeHeadline,
  showBadge,
  onToggleBadge,
  badgeText,
  onChangeBadgeText,
}) => {
  const charCount = headline.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            1. JUDUL BERITA
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              charCount === 0
                ? 'bg-slate-100 text-slate-500'
                : charCount > 150
                ? 'bg-amber-100 text-amber-800 font-bold'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {charCount} / 150 karakter
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={headline}
          onChange={(e) => onChangeHeadline(e.target.value)}
          placeholder="Masukkan judul berita yang menarik perhatian pembaca..."
          rows={3}
          className="w-full px-3.5 py-3 text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all resize-y placeholder:text-slate-400 font-medium leading-snug"
        />
        {charCount > 0 && (
          <button
            type="button"
            onClick={() => onChangeHeadline('')}
            className="absolute top-2.5 right-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Optional Badge Tag Option */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showBadge}
              onChange={(e) => onToggleBadge(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 accent-red-600"
            />
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Tampilkan Label Kategori / Status Berita
            </span>
          </label>
        </div>

        {showBadge && (
          <div className="mt-2.5 space-y-2">
            <input
              type="text"
              value={badgeText}
              onChange={(e) => onChangeBadgeText(e.target.value)}
              placeholder="Contoh: BREAKING NEWS"
              className="w-full text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
            <div className="flex flex-wrap gap-1">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangeBadgeText(preset)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    badgeText.toUpperCase() === preset
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
