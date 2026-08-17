import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Layout, Eye, Cpu } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Panduan & Standar News Thumbnail Maker
            </h3>
            <p className="text-xs text-slate-500">
              Spesifikasi resmi rasio 4:5 (1080 × 1350 px) untuk feed Facebook
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
              <Layout className="w-4 h-4 text-red-600" />
              <span>Struktur Standar Thumbnail Media Berita</span>
            </div>
            <p className="text-red-800">
              Format portrait 4:5 (1080 × 1350 px) memakan ruang visual paling optimal di feed mobile Facebook tanpa terpotong. Foto utama ditempatkan di 70–75% area atas, diikuti gradasi hitam dramatis, garis merah tegas, area judul hitam pekat dengan background merah tegas pada tulisan paragraph judul dan teks putih kontras tinggi.
            </p>
          </div>

          {/* Section 2: Privacy & Integrity */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Keaslian Foto 100% Terjaga (Bukan Generative AI)</span>
            </div>
            <p className="text-emerald-800">
              Aplikasi memproses foto asli secara murni di browser (crop proporsional, scaling, blur, gradient overlay) tanpa mengubah wajah subjek, kendaraan, gedung, atau manipulasi isi kejadian demi integritas jurnalistik.
            </p>
          </div>

          {/* Key Checklist */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Fitur Utama & Tombol:</h4>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Auto-Fit Text Engine:</strong> Otomatis menghitung ukuran font (84px down to 32px) agar judul sepanjang apa pun tetap pas, tidak terpotong, dan sangat mudah dibaca.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Focal Point Adjuster:</strong> Geser fokus vertikal jika wajah atau objek penting berada di posisi atas/bawah.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Logo Bali Express (Pojok Kiri Atas):</strong> Penempatan watermark resmi Jawa Pos Group Bali Express dengan opsi badge putih kontras tinggi atau transparan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Icon Sosial Media & Watermark Bawah:</strong> Icon resmi TikTok, Facebook, dan Instagram beserta nama akun "koranbaliexpress" di bagian bawah thumbnail.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Simulasi Feed Facebook:</strong> Uji keterbacaan judul langsung dalam tampilan mockup feed mobile Facebook asli.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Download PNG 1080×1350:</strong> Ekspor hasil berkualitas tinggi tanpa kompresi blur.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
