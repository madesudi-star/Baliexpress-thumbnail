import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  ClipboardPaste,
  Check,
} from 'lucide-react';

interface ImageUploaderProps {
  imageSrc: string | null;
  imageFileName: string | null;
  onImageChange: (dataUrl: string, fileName: string) => void;
  onImageRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageSrc,
  imageFileName,
  onImageChange,
  onImageRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  const [justPasted, setJustPasted] = useState(false);

  const processFile = useCallback((file: File) => {
    setErrorMsg(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      setErrorMsg('Format file tidak didukung. Harap gunakan JPG, PNG, atau WEBP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageChange(e.target.result as string, file.name || `foto-berita-${Date.now()}.png`);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Paste from clipboard button click handler
  const handlePasteFromClipboard = async () => {
    setErrorMsg(null);
    setIsPasting(true);

    try {
      if (!navigator.clipboard) {
        setErrorMsg('Browser Anda tidak mendukung akses clipboard langsung. Silakan tekan Ctrl+V / Cmd+V pada keyboard.');
        setIsPasting(false);
        return;
      }

      // Try reading clipboard items (blob)
      if (navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        let foundImage = false;

        for (const item of clipboardItems) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], `clipboard-${Date.now()}.${imageType.split('/')[1] || 'png'}`, {
              type: imageType,
            });
            processFile(file);
            foundImage = true;
            setJustPasted(true);
            setTimeout(() => setJustPasted(false), 2000);
            break;
          }
        }

        if (!foundImage) {
          setErrorMsg('Tidak ditemukan gambar di clipboard. Salin gambar atau screenshot terlebih dahulu, lalu klik tombol ini lagi atau tekan Ctrl+V.');
        }
      } else {
        setErrorMsg('Silakan gunakan pintasan keyboard Ctrl+V (atau Cmd+V di Mac) untuk menempel gambar dari clipboard.');
      }
    } catch (err: any) {
      // Permission denied or other errors
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setErrorMsg('Izin akses clipboard ditolak browser. Anda tetap dapat menggunakan pintasan keyboard Ctrl+V.');
      } else {
        setErrorMsg('Silakan gunakan pintasan keyboard Ctrl+V (Cmd+V) untuk menempelkan gambar dari clipboard.');
      }
    } finally {
      setIsPasting(false);
    }
  };

  // Global window paste listener for Ctrl+V / Cmd+V
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // If user is currently typing in an input or textarea that is not file related, check if it's text
      const target = e.target as HTMLElement;
      const isTextInput = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text';
      const isTextArea = target.tagName === 'TEXTAREA';

      const items = e.clipboardData?.items;
      if (!items) return;

      let imageFile: File | null = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          imageFile = items[i].getAsFile();
          break;
        }
      }

      if (imageFile) {
        // If image found in clipboard, process it
        e.preventDefault();
        processFile(imageFile);
        setJustPasted(true);
        setTimeout(() => setJustPasted(false), 2000);
      } else if (!isTextInput && !isTextArea) {
        // User pasted non-image while not focused in text inputs
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [processFile]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. FOTO UTAMA
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          File / Clipboard (Ctrl+V)
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
        className="hidden"
      />

      {errorMsg && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      {!imageSrc ? (
        <div className="space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
              isDragging
                ? 'border-red-500 bg-red-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-red-400 bg-slate-50/70 hover:bg-slate-50'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Klik untuk upload atau drag & drop foto ke sini
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Mendukung file JPG, PNG, WEBP atau tempel langsung dari clipboard
              </p>
            </div>
          </div>

          {/* Action Buttons: Choose File & Paste from Clipboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Pilih File dari Perangkat</span>
            </button>

            <button
              type="button"
              onClick={handlePasteFromClipboard}
              disabled={isPasting}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                justPasted
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-red-50 hover:bg-red-100/90 text-red-700 border-red-200 hover:border-red-300 shadow-2xs'
              }`}
              title="Tempel gambar hasil screenshot/copy dari clipboard (Pintasan: Ctrl+V)"
            >
              {justPasted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Gambar Ditempel!</span>
                </>
              ) : (
                <>
                  <ClipboardPaste className="w-4 h-4 text-red-600" />
                  <span>{isPasting ? 'Membaca Clipboard...' : 'Tempel dari Clipboard (Ctrl+V)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Active Image Card */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative border border-slate-300 shadow-2xs">
              <img
                src={imageSrc}
                alt="Uploaded"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {imageFileName || 'Foto Utama Berita'}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Foto aktif • Geser langsung pada preview thumbnail
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Ganti dari File Komputer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onImageRemove}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Hapus Foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Clipboard Replace Option */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <span className="text-slate-500 text-[11px]">
              Ganti cepat foto dengan screenshot/copy:
            </span>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Tempel dari Clipboard (Ctrl+V)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
