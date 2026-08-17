import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Smartphone,
  Eye,
  Sparkles,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Coffee,
  Heart,
  X,
  Sliders,
} from 'lucide-react';
import { ThumbnailConfig } from '../types';
import {
  renderThumbnail,
  exportCanvasAsPNG,
  copyCanvasToClipboard,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../utils/canvasRenderer';
import { FacebookFeedMockup } from './FacebookFeedMockup';

interface ThumbnailPreviewProps {
  config: ThumbnailConfig;
  onChangeConfig?: (partial: Partial<ThumbnailConfig>) => void;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  config,
  onChangeConfig,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'feed'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCoffeeMessage, setShowCoffeeMessage] = useState(false);

  // Manual cursor dragging & positioning states
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialOffsets, setInitialOffsets] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Re-render canvas whenever config changes
  useEffect(() => {
    let isCancelled = false;

    const performRender = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);

      try {
        await renderThumbnail(canvasRef.current, config);
        if (!isCancelled && canvasRef.current) {
          const url = canvasRef.current.toDataURL('image/png', 1.0);
          setDataUrl(url);
        }
      } catch (err) {
        console.error('Error rendering thumbnail:', err);
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    performRender();

    return () => {
      isCancelled = true;
    };
  }, [config]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    exportCanvasAsPNG(canvasRef.current, config.headline);
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    const ok = await copyCanvasToClipboard(canvasRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Convert mouse/touch coordinates relative to 1080x1350 canvas
  const getCanvasScale = useCallback(() => {
    if (!containerRef.current) return { scale: 1, rect: { left: 0, top: 0, width: 340, height: 425 } };
    const rect = containerRef.current.getBoundingClientRect();
    const scale = CANVAS_WIDTH / (rect.width || 340);
    return { scale, rect };
  }, []);

  // Handle Manual Cursor Pan / Drag Start
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onChangeConfig || !config.imageSrc) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDraggingPhoto(true);
    setInitialOffsets({ x: config.imageOffsetX || 0, y: config.imageOffsetY || 0 });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!onChangeConfig || !isDraggingPhoto) return;

    const { scale } = getCanvasScale();
    const deltaX = (e.clientX - dragStart.x) * scale;
    const deltaY = (e.clientY - dragStart.y) * scale;

    const newX = Math.round(initialOffsets.x + deltaX);
    const newY = Math.round(initialOffsets.y + deltaY);
    onChangeConfig({ imageOffsetX: newX, imageOffsetY: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingPhoto) {
      setIsDraggingPhoto(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Wheel zoom with cursor
  const handleWheel = (e: React.WheelEvent) => {
    if (!onChangeConfig || !config.imageSrc) return;
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0015;
    const nextZoom = Math.min(3.5, Math.max(0.6, Number((config.imageZoom + zoomDelta).toFixed(2))));
    onChangeConfig({ imageZoom: nextZoom });
  };

  const hasPhoto = Boolean(config.imageSrc);
  const hasHeadline = Boolean(config.headline && config.headline.trim().length > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col h-full sticky top-20">
      {/* Header Preview & View Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            PREVIEW THUMBNAIL
          </h2>
          {isRendering && (
            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Rendering...
            </span>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              viewMode === 'canvas'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('feed')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              viewMode === 'feed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Feed FB</span>
          </button>
        </div>
      </div>

      {/* Hidden high-res canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="hidden"
      />

      {/* Interactive Manual Adjustment Toolbar (Studio Mode Only) */}
      {viewMode === 'canvas' && hasPhoto && (
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 bg-slate-100/90 p-2 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
              <Move className="w-3.5 h-3.5 text-red-600" />
              <span>Geser Manual:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Klik & Drag kursor pada foto
            </span>
          </div>

          {/* Quick Zoom & Reset Buttons */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-600 font-medium mr-0.5">Ukuran Foto:</span>
            <button
              type="button"
              onClick={() =>
                onChangeConfig?.({
                  imageZoom: Math.max(0.6, Number((config.imageZoom - 0.1).toFixed(2))),
                })
              }
              className="p-1 bg-white hover:bg-slate-200 active:bg-slate-300 rounded border border-slate-200 text-slate-700 cursor-pointer shadow-2xs"
              title="Perkecil Ukuran (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-800 font-bold px-1 min-w-[34px] text-center">
              {config.imageZoom.toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeConfig?.({
                  imageZoom: Math.min(3.5, Number((config.imageZoom + 0.1).toFixed(2))),
                })
              }
              className="p-1 bg-white hover:bg-slate-200 active:bg-slate-300 rounded border border-slate-200 text-slate-700 cursor-pointer shadow-2xs"
              title="Perbesar Ukuran (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeConfig?.({
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  imageZoom: 1.0,
                })
              }
              className="p-1 bg-white hover:bg-slate-200 active:bg-slate-300 rounded border border-slate-200 text-slate-700 cursor-pointer ml-1 shadow-2xs flex items-center gap-1 font-semibold"
              title="Reset Posisi Kursor & Skala Ukuran"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-[10px]">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] bg-slate-950/90 rounded-xl p-3 sm:p-5 relative overflow-hidden shadow-inner select-none">
        {/* Background Subtle Grid Texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {viewMode === 'canvas' ? (
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className={`relative w-full max-w-[340px] sm:max-w-[380px] aspect-4/5 rounded-lg overflow-hidden shadow-2xl border border-slate-700/60 bg-black group touch-none ${
              hasPhoto ? (isDraggingPhoto ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="1080x1350 News Thumbnail"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <div className="w-10 h-10 border-2 border-slate-600 border-t-red-500 rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold">Memuat thumbnail...</p>
              </div>
            )}

            {/* Quick Fullscreen Hover Trigger */}
            {dataUrl && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/70 hover:bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs shadow-md z-10"
                title="Perbesar Preview"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Quick On-canvas Tip Overlay */}
            {hasPhoto && (
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 bg-black/75 backdrop-blur-xs rounded-lg text-[11px] text-slate-200 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Drag kursor untuk geser posisi foto • Scroll untuk zoom ukuran</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-h-[500px] overflow-y-auto py-2 pr-1">
            <FacebookFeedMockup canvasDataUrl={dataUrl} headline={config.headline} />
          </div>
        )}

        {/* Resolution Indicator Spec */}
        <div className="mt-3.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/60 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>1080 × 1350 px • 4:5 Portrait HD</span>
        </div>
      </div>

      {/* Warnings / Guidance based on missing inputs */}
      {!hasPhoto ? (
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="block font-bold text-amber-800">Foto Utama Belum Ditambahkan</span>
            <span className="text-amber-700 font-normal text-[11px]">
              Silakan unggah foto berita pada panel <strong>2. FOTO UTAMA</strong> untuk mengaktifkan tombol unduh PNG.
            </span>
          </div>
        </div>
      ) : !hasHeadline ? (
        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Silakan masukkan judul berita untuk melengkapi thumbnail.</span>
        </div>
      ) : null}

      {/* Action Buttons Section */}
      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2.5">
        {/* Main Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!hasPhoto || !hasHeadline}
          className={`w-full py-3.5 px-4 font-extrabold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
            hasPhoto && hasHeadline
              ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-600/30 hover:shadow-lg cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
          title={
            !hasPhoto
              ? 'Tambahkan gambar terlebih dahulu untuk mengunduh'
              : !hasHeadline
              ? 'Masukkan judul berita terlebih dahulu'
              : 'Download Thumbnail 1080x1350 PNG'
          }
        >
          <Download className={`w-5 h-5 ${hasPhoto && hasHeadline ? 'text-white' : 'text-slate-400'}`} />
          <span>DOWNLOAD PNG (1080 × 1350)</span>
        </button>

        {/* Copy to Clipboard Button */}
        <button
          type="button"
          onClick={handleCopyClipboard}
          disabled={!hasPhoto || !hasHeadline}
          className={`w-full py-2.5 px-3 font-semibold text-xs sm:text-sm rounded-xl border transition-colors flex items-center justify-center gap-2 ${
            hasPhoto && hasHeadline
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
              : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Tersalin ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Salin Gambar ke Clipboard</span>
            </>
          )}
        </button>

        {/* Donation Button: Traktir secangkir kopi */}
        <button
          type="button"
          onClick={() => setShowCoffeeMessage((prev) => !prev)}
          className={`w-full py-2.5 px-3 font-bold text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
            showCoffeeMessage
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/40'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400'
          }`}
        >
          <Coffee className={`w-4 h-4 ${showCoffeeMessage ? 'text-white' : 'text-amber-700'}`} />
          <span>Traktir secangkir kopi</span>
          <Heart className={`w-3.5 h-3.5 ${showCoffeeMessage ? 'text-white fill-white' : 'text-red-500 fill-red-500'}`} />
        </button>

        {/* Donation Message Popup Card */}
        {showCoffeeMessage && (
          <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50/70 border border-amber-200 rounded-xl shadow-xs text-amber-950 text-center relative transition-all animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowCoffeeMessage(false)}
              className="absolute top-2.5 right-2.5 p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-md cursor-pointer transition-colors"
              title="Tutup pesan"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-2xs">
              <Coffee className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-amber-900 leading-snug">
              Jika aplikasi ini bermanfaat traktir saya secangkir kopi
            </p>
            <p className="text-xs text-amber-700/90 mt-1 font-medium">
              Terima kasih banyak atas apresiasi dan dukungan Anda! ☕✨
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && dataUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] aspect-4/5 bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={dataUrl}
              alt="Fullscreen 1080x1350 Thumbnail"
              className="max-h-[88vh] object-contain rounded-lg"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download (1080×1350)
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
                title="Tutup"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
