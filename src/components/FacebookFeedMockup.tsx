import React from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe, CheckCircle2 } from 'lucide-react';

interface FacebookFeedMockupProps {
  canvasDataUrl: string | null;
  headline: string;
}

export const FacebookFeedMockup: React.FC<FacebookFeedMockupProps> = ({
  canvasDataUrl,
  headline,
}) => {
  return (
    <div className="bg-[#18191A] text-[#E4E6EB] rounded-2xl border border-slate-800 shadow-xl overflow-hidden max-w-[420px] mx-auto font-sans">
      {/* Header Facebook Post */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#E1251B] flex flex-col items-center justify-center font-black text-white text-[11px] leading-tight shadow-xs border border-white/20">
            <span className="text-[8px] font-serif font-bold text-white/90">JP</span>
            <span className="font-extrabold text-[10px] tracking-tight">BE</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-[#E4E6EB] hover:underline cursor-pointer">
                Koran Bali Express
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D88FF] fill-[#2D88FF] text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#B0B3B8]">
              <span>@koranbaliexpress</span>
              <span>•</span>
              <span>2 jam yang lalu</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <button type="button" className="text-[#B0B3B8] hover:text-white p-1 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Text */}
      <div className="px-3.5 pb-2 text-sm text-[#E4E6EB] leading-snug">
        <p className="line-clamp-2">
          {headline || 'Simak ulasan selengkapnya mengenai perkembangan terkini dan tanggapan berbagai pihak terkait peristiwa ini.'}
        </p>
      </div>

      {/* 4:5 News Thumbnail Image */}
      <div className="relative bg-black w-full aspect-4/5 flex items-center justify-center overflow-hidden">
        {canvasDataUrl ? (
          <img
            src={canvasDataUrl}
            alt="Facebook News Thumbnail Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-xs text-slate-400">Rendering thumbnail...</div>
        )}
      </div>

      {/* Interaction Counts */}
      <div className="px-3.5 py-2 flex items-center justify-between text-xs text-[#B0B3B8] border-b border-[#3A3B3C]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">
            👍
          </div>
          <div className="w-4 h-4 rounded-full bg-[#FA383E] flex items-center justify-center text-white text-[10px] -ml-2.5">
            ❤️
          </div>
          <span className="ml-1">1.4 rb</span>
        </div>
        <div className="flex items-center gap-3">
          <span>342 Komentar</span>
          <span>128 Dibagikan</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-[#B0B3B8]">
        <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer">
          <ThumbsUp className="w-4 h-4" />
          <span>Suka</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer">
          <MessageSquare className="w-4 h-4" />
          <span>Komentar</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer">
          <Share2 className="w-4 h-4" />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
};
