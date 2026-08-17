import React from 'react';
import { Palette, Flame, Sparkles, Film } from 'lucide-react';
import { StylePresetId } from '../types';
import { STYLE_PRESETS } from '../data/samples';

interface StyleSelectorProps {
  selectedPreset: StylePresetId;
  onSelectPreset: (presetId: 'breaking' | 'clean' | 'dramatic') => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  const styles: Array<{
    id: 'breaking' | 'clean' | 'dramatic';
    icon: React.ReactNode;
    color: string;
    accentBg: string;
  }> = [
    {
      id: 'breaking',
      icon: <Flame className="w-4 h-4 text-red-600" />,
      color: 'border-red-500 ring-2 ring-red-500/20 bg-red-50/30',
      accentBg: 'bg-red-600',
    },
    {
      id: 'clean',
      icon: <Sparkles className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30',
      accentBg: 'bg-slate-800',
    },
    {
      id: 'dramatic',
      icon: <Film className="w-4 h-4 text-purple-600" />,
      color: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/30',
      accentBg: 'bg-red-700',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            3. STYLE & TEMPLATE
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">3 Preset Berita</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {styles.map(({ id, icon, color, accentBg }) => {
          const preset = STYLE_PRESETS[id];
          const isSelected = selectedPreset === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectPreset(id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? color
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                      {preset.name}
                    </span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-red-600 bg-red-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 bg-slate-200/80 text-slate-700">
                  {preset.badge}
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Mini visual mockup card preview */}
              <div className="mt-2.5 w-full h-8 rounded bg-slate-900 overflow-hidden relative border border-slate-300/60 shadow-2xs">
                <div className="absolute inset-x-0 top-0 h-4 bg-slate-700" />
                <div className="absolute inset-x-0 bottom-0 h-4 bg-black flex items-center px-1.5 gap-1">
                  <div className={`h-2 px-1.5 ${accentBg} rounded-xs flex items-center`}>
                    <div className="w-6 h-0.5 bg-white rounded-xs" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
