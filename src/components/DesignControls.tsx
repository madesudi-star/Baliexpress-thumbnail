import React, { useState, useRef } from 'react';
import {
  Sliders,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Share2,
  AtSign,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ThumbnailConfig, LogoBadgeStyle, SocialFooterStyle } from '../types';

interface DesignControlsProps {
  config: ThumbnailConfig;
  onChangeConfig: (partial: Partial<ThumbnailConfig>) => void;
}

export const DesignControls: React.FC<DesignControlsProps> = ({
  config,
  onChangeConfig,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          onChangeConfig({
            logoSrc: ev.target.result,
            showLogo: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            4. PANEL PENGATURAN DESAIN
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Kustomisasi</span>
      </div>

      {/* A. Logo Bali Express (Pojok Kiri Atas) */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center text-red-700">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Logo Bali Express (Pojok Kiri Atas)
              </span>
              <span className="text-[11px] text-slate-500">
                Watermark resmi "Jawa Pos Group BALI EXPRESS" (Background Transparan)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeConfig({ showLogo: !config.showLogo })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              config.showLogo !== false ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                config.showLogo !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.showLogo !== false && (
          <div className="pt-2 border-t border-slate-200/60 space-y-3 text-xs">
            {/* Tampilan Background Logo */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Background Logo:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  {
                    id: 'transparent' as LogoBadgeStyle,
                    label: 'Transparan (Utama)',
                    desc: 'Background Transparan Alami',
                  },
                  {
                    id: 'white_badge' as LogoBadgeStyle,
                    label: 'Badge Putih',
                    desc: 'Kontras Tinggi di Semua Foto',
                  },
                  {
                    id: 'dark_badge' as LogoBadgeStyle,
                    label: 'Badge Gelap',
                    desc: 'Elegan & Bold',
                  },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChangeConfig({ logoBadgeStyle: style.id })}
                    className={`py-1.5 px-2 text-center rounded-lg border cursor-pointer transition-all ${
                      (config.logoBadgeStyle || 'transparent') === style.id
                        ? 'border-red-600 bg-red-50/80 text-red-700 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[11px]">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ukuran Logo Slider */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600 font-medium">Ukuran Logo:</span>
              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <input
                  type="range"
                  min="180"
                  max="360"
                  step="10"
                  value={config.logoSize || 260}
                  onChange={(e) => onChangeConfig({ logoSize: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <span className="text-slate-700 font-mono font-semibold w-9 text-right">
                  {config.logoSize || 260}px
                </span>
              </div>
            </div>

            {/* Custom Logo Upload & Reset */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/40">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-slate-500" />
                <span>Ganti File Logo</span>
              </button>

              {config.logoSrc && (
                <button
                  type="button"
                  onClick={() => onChangeConfig({ logoSrc: null })}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Logo Asli Bali Express</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* B. Media Sosial & Watermark (Bagian Bawah: TikTok, FB, IG) */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-700">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Icon Media Sosial & Akun (Bagian Bawah)
              </span>
              <span className="text-[11px] text-slate-500">
                TikTok, Facebook, Instagram & nama "koranbaliexpress"
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeConfig({ showSocialMedia: !config.showSocialMedia })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              config.showSocialMedia !== false ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                config.showSocialMedia !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.showSocialMedia !== false && (
          <div className="pt-2 border-t border-slate-200/60 space-y-3 text-xs">
            {/* Input Nama Akun / Handle */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Nama Akun / Handle Sosial Media:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={config.socialHandle || 'koranbaliexpress'}
                  onChange={(e) => onChangeConfig({ socialHandle: e.target.value })}
                  placeholder="koranbaliexpress"
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Checkbox Platform Icons */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Pilih Icon Media Sosial Aktif:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* TikTok */}
                <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={config.showTikTok !== false}
                    onChange={(e) => onChangeConfig({ showTikTok: e.target.checked })}
                    className="w-3.5 h-3.5 text-red-600 rounded border-slate-300 accent-red-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-black">
                      ♪
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">TikTok</span>
                  </div>
                </label>

                {/* Facebook */}
                <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={config.showFacebook !== false}
                    onChange={(e) => onChangeConfig({ showFacebook: e.target.checked })}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 accent-blue-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white text-[10px] flex items-center justify-center font-black">
                      f
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">Facebook</span>
                  </div>
                </label>

                {/* Instagram */}
                <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={config.showInstagram !== false}
                    onChange={(e) => onChangeConfig({ showInstagram: e.target.checked })}
                    className="w-3.5 h-3.5 text-pink-600 rounded border-slate-300 accent-pink-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-[10px] flex items-center justify-center font-black">
                      📷
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">Instagram</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Gaya Tampilan Footer Bar */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Gaya Tampilan Bar Bawah:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'sleek_bar' as SocialFooterStyle, label: 'Bar Hitam Elegan Bawah' },
                  { id: 'badge_pill' as SocialFooterStyle, label: 'Pill Floating Badge' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChangeConfig({ socialStyle: st.id })}
                    className={`py-1.5 px-2 text-center rounded-lg border cursor-pointer transition-all ${
                      (config.socialStyle || 'sleek_bar') === st.id
                        ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px]">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. Garis Merah Pembatas */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Garis Pembatas Merah
            </span>
            <span className="text-[11px] text-slate-500">
              Garis horizontal tegas antara foto dan area judul
            </span>
          </div>

          <button
            type="button"
            onClick={() => onChangeConfig({ showRedDivider: !config.showRedDivider })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              config.showRedDivider ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                config.showRedDivider ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.showRedDivider && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">Ketebalan Garis:</span>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <input
                type="range"
                min="4"
                max="16"
                step="2"
                value={config.dividerThickness}
                onChange={(e) => onChangeConfig({ dividerThickness: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-slate-700 font-mono font-semibold w-7 text-right">
                {config.dividerThickness}px
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Gradasi Hitam */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Gradasi Hitam (Dark Gradient)
            </span>
            <span className="text-[11px] text-slate-500">
              Transisi halus transparan → hitam di bagian bawah foto
            </span>
          </div>

          <button
            type="button"
            onClick={() => onChangeConfig({ showBlackGradient: !config.showBlackGradient })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              config.showBlackGradient ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                config.showBlackGradient ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.showBlackGradient && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">Kepekatan Gradasi:</span>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={config.gradientIntensity}
                onChange={(e) => onChangeConfig({ gradientIntensity: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-slate-700 font-mono font-semibold w-9 text-right">
                {Math.round(config.gradientIntensity * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Typographic & Color Tuning (Collapsible) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Pengaturan Tambahan (Font & Warna Judul)
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
            {/* Font Family */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Pilihan Jenis Font Judul:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['Inter', 'Montserrat', 'Oswald', 'Arial'] as const).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => onChangeConfig({ fontFamily: font })}
                    className={`py-1.5 px-2 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                      config.fontFamily === font
                        ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Transform Uppercase vs Normal */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Format Huruf Judul:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeConfig({ textTransform: 'uppercase' })}
                  className={`py-1.5 px-3 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    config.textTransform === 'uppercase'
                      ? 'border-red-600 bg-red-50 text-red-700 font-extrabold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  HURUF BESAR (KAPITAL)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeConfig({ textTransform: 'none' })}
                  className={`py-1.5 px-3 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    config.textTransform === 'none'
                      ? 'border-red-600 bg-red-50 text-red-700 font-extrabold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Sesuai Ketikan Asli
                </button>
              </div>
            </div>

            {/* Background Area Judul */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Warna Background Area Judul:
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Hitam Pekat (#000000)', color: '#000000' },
                  { name: 'Hitam Slate (#0F172A)', color: '#0F172A' },
                  { name: 'Hitam Charcoal (#18181B)', color: '#18181B' },
                  { name: 'Merah Berita (#D90000)', color: '#D90000' },
                  { name: 'Merah Gelap (#8B0000)', color: '#8B0000' },
                ].map(({ name, color }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChangeConfig({ headlineBgColor: color })}
                    title={name}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                      config.headlineBgColor === color
                        ? 'border-red-500 ring-2 ring-red-300 scale-105'
                        : 'border-white shadow-xs'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Paragraph/Tulisan Judul (Text Highlight) */}
            <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Background Merah Tulisan Judul
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Box highlight warna merah di belakang teks paragraph judul
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onChangeConfig({ showTextHighlight: !config.showTextHighlight })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    config.showTextHighlight ? 'bg-red-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      config.showTextHighlight ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {config.showTextHighlight && (
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Gaya Box Teks:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onChangeConfig({ textHighlightStyle: 'line_box' })}
                        className={`py-1 px-2 text-xs font-semibold rounded border cursor-pointer ${
                          config.textHighlightStyle === 'line_box'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Pita Per Baris (Ribbon)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeConfig({ textHighlightStyle: 'block_box' })}
                        className={`py-1 px-2 text-xs font-semibold rounded border cursor-pointer ${
                          config.textHighlightStyle === 'block_box'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Blok Utuh Paragraf
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Warna Highlight Teks:
                    </label>
                    <div className="flex items-center gap-2">
                      {[
                        { name: 'Merah Berita (#D90000)', color: '#D90000' },
                        { name: 'Merah Terang (#E50914)', color: '#E50914' },
                        { name: 'Merah Crimson (#C40C0C)', color: '#C40C0C' },
                        { name: 'Merah Ruby Gelap (#B00000)', color: '#B00000' },
                        { name: 'Kuning Bold (#EAB308)', color: '#EAB308' },
                      ].map(({ name, color }) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onChangeConfig({ textHighlightBgColor: color })}
                          title={name}
                          className={`w-6 h-6 rounded-md border-2 cursor-pointer transition-transform hover:scale-110 ${
                            config.textHighlightBgColor === color
                              ? 'border-slate-900 ring-2 ring-red-400 scale-105'
                              : 'border-white shadow-2xs'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Height Ratio */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Tinggi Area Judul:</span>
                <span className="font-mono text-slate-500">
                  {Math.round(config.headlineHeightRatio * 100)}% dari Canvas
                </span>
              </div>
              <input
                type="range"
                min="0.22"
                max="0.36"
                step="0.02"
                value={config.headlineHeightRatio}
                onChange={(e) => onChangeConfig({ headlineHeightRatio: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>22% (Kompak)</span>
                <span>28% (Standar Ideal)</span>
                <span>36% (Judul Sangat Panjang)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
