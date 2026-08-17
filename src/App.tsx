import React, { useState } from 'react';
import { Header } from './components/Header';
import { NewsInput } from './components/NewsInput';
import { ImageUploader } from './components/ImageUploader';
import { StyleSelector } from './components/StyleSelector';
import { DesignControls } from './components/DesignControls';
import { ThumbnailPreview } from './components/ThumbnailPreview';
import { GuideModal } from './components/GuideModal';
import { Toast, ToastMessage } from './components/Toast';
import { ThumbnailConfig, StylePresetId } from './types';
import { DEFAULT_CONFIG, STYLE_PRESETS, SAMPLE_NEWS_ITEMS } from './data/samples';

export default function App() {
  const [config, setConfig] = useState<ThumbnailConfig>(DEFAULT_CONFIG);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Headline updates
  const handleHeadlineChange = (text: string) => {
    setConfig((prev) => ({ ...prev, headline: text }));
  };

  const handleToggleBadge = (show: boolean) => {
    setConfig((prev) => ({ ...prev, showBadge: show }));
  };

  const handleChangeBadgeText = (text: string) => {
    setConfig((prev) => ({ ...prev, badgeText: text }));
  };

  // 2. Photo updates
  const handleImageChange = (dataUrl: string, fileName: string) => {
    setConfig((prev) => ({
      ...prev,
      imageSrc: dataUrl,
      imageFileName: fileName,
    }));
    addToast('success', 'Foto utama berhasil dimuat.');
  };

  const handleImageRemove = () => {
    setConfig((prev) => ({
      ...prev,
      imageSrc: null,
      imageFileName: null,
    }));
    addToast('info', 'Foto utama dihapus.');
  };

  // 3. Style Preset selection
  const handleSelectPreset = (presetId: 'breaking' | 'clean' | 'dramatic') => {
    const preset = STYLE_PRESETS[presetId];
    setConfig((prev) => ({
      ...prev,
      stylePreset: presetId,
      headlineBgColor: preset.headlineBgColor,
      headlineTextColor: preset.headlineTextColor,
      textHighlightBgColor: preset.textHighlightBgColor,
      textHighlightStyle: preset.textHighlightStyle,
      showTextHighlight: preset.showTextHighlight,
      dividerColor: preset.dividerColor,
      dividerThickness: preset.dividerThickness,
      showRedDivider: preset.showRedDivider,
      showBlackGradient: preset.showBlackGradient,
      gradientIntensity: preset.gradientIntensity,
      fontFamily: preset.fontFamily,
      textTransform: preset.textTransform,
      headlineHeightRatio: preset.headlineHeightRatio,
      badgeText: preset.badgeText,
      showBadge: preset.showBadge,
    }));
    addToast('info', `Style "${preset.name}" diterapkan.`);
  };

  // 4. Custom design configuration
  const handlePartialConfigChange = (partial: Partial<ThumbnailConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...partial,
      stylePreset: 'custom' as StylePresetId,
    }));
  };

  // 5. Reset action
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    addToast('info', 'Pengaturan dikembalikan ke bawaan.');
  };

  // 8. Load Random Sample Action
  const handleLoadSample = () => {
    const randomItem =
      SAMPLE_NEWS_ITEMS[Math.floor(Math.random() * SAMPLE_NEWS_ITEMS.length)];
    const preset = STYLE_PRESETS[randomItem.preset as 'breaking' | 'clean' | 'dramatic'] || STYLE_PRESETS.breaking;

    setConfig((prev) => ({
      ...DEFAULT_CONFIG,
      headline: randomItem.title,
      imageSrc: prev.imageSrc, // Keep current user's image if already uploaded
      imageFileName: prev.imageFileName,
      stylePreset: randomItem.preset,
      headlineBgColor: preset.headlineBgColor,
      headlineTextColor: preset.headlineTextColor,
      dividerColor: preset.dividerColor,
      dividerThickness: preset.dividerThickness,
      showRedDivider: preset.showRedDivider,
      showBlackGradient: preset.showBlackGradient,
      gradientIntensity: preset.gradientIntensity,
      fontFamily: preset.fontFamily,
      textTransform: preset.textTransform,
      headlineHeightRatio: preset.headlineHeightRatio,
      badgeText: preset.badgeText,
      showBadge: preset.showBadge,
    }));
    addToast('success', `Contoh judul "${randomItem.category}" dimuat.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <Header
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input & Controls (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Judul Berita */}
            <NewsInput
              headline={config.headline}
              onChangeHeadline={handleHeadlineChange}
              showBadge={config.showBadge}
              onToggleBadge={handleToggleBadge}
              badgeText={config.badgeText}
              onChangeBadgeText={handleChangeBadgeText}
            />

            {/* 2. Foto Utama */}
            <ImageUploader
              imageSrc={config.imageSrc}
              imageFileName={config.imageFileName}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
            />

            {/* 3. Style & Template */}
            <StyleSelector
              selectedPreset={config.stylePreset}
              onSelectPreset={handleSelectPreset}
            />

            {/* 4. Panel Pengaturan Desain */}
            <DesignControls
              config={config}
              onChangeConfig={handlePartialConfigChange}
            />
          </div>

          {/* Right Column: Preview & Export (5 Cols on desktop) */}
          <div className="lg:col-span-5">
            <ThumbnailPreview
              config={config}
              onChangeConfig={handlePartialConfigChange}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            <strong>News Thumbnail Maker</strong> — Standar Format Portrait 4:5 (1080 × 1350 px) untuk Facebook Feed.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Panduan Ukuran
            </button>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">100% Client-Side Processing</span>
          </div>
        </div>
      </footer>

      {/* Specification & Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
