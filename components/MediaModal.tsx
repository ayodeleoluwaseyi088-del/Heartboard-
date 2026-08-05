import React, { useEffect, useState, useRef } from 'react';
import { Post, EntityType } from '../types';
import { X, ChevronLeft, ChevronRight, Share2, Sparkles, Heart } from 'lucide-react';

interface MediaModalProps {
  post: Post & { 
    theme?: string; 
    mediaType?: 'audio' | 'video' | 'image' | 'text' | 'note';
    sponsor?: string;
    sticker?: string;
    secondaryImage?: string;
    isBlurred?: boolean;
    statusBadge?: string;
  };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ post, onClose, onPrev, onNext }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset reveal state on post change
    setIsRevealed(false);
  }, [post]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!post) return null;

  // Render background style helper
  const getContainerBgStyle = () => {
    if (post.theme && post.theme.startsWith('#')) {
      return { backgroundColor: post.theme };
    }
    return {};
  };

  const getContainerBgClass = () => {
    if (post.theme && !post.theme.startsWith('#')) {
      return post.theme;
    }
    return 'bg-[#FAF5E8]'; // Sweet natural cream fallback
  };

  const isBlurred = post.isBlurred && !isRevealed;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/90 backdrop-blur-lg p-4 select-none">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Screen Navigation Triggers */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }} 
        className="fixed left-4 md:left-8 z-[1010] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }} 
        className="fixed right-4 md:right-8 z-[1010] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Main Container Container - Strictly Fixed 380px x 474px */}
      <div 
        onClick={() => { if (isBlurred) setIsRevealed(true); }}
        className={`relative z-[1005] ${getContainerBgClass()} rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer transform transition-all duration-300 hover:scale-[1.01]`}
        style={{ 
          width: '380px', 
          height: '474px', 
          ...getContainerBgStyle() 
        }}
      >
        {/* Lined paper texture background overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply rounded-[2.5rem]" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}
        ></div>

        {/* Floating Top Header Badges - Custom aligned */}
        <div className="absolute top-5 left-5 right-5 z-[50] flex items-center justify-end pointer-events-none">
          {post.statusBadge ? (
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider text-gray-800 uppercase">
              {post.statusBadge}
            </div>
          ) : (
            <div className="bg-[#FE6349] text-white px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase">
              ✨ HEARTH MEMORY
            </div>
          )}
        </div>

        {/* Expanded Content View (Right-aligned strictly) */}
        <div className={`w-full h-full p-8 flex flex-col justify-between relative transition-all duration-500 ${isBlurred ? 'blur-[8px] scale-98 pointer-events-none' : ''}`}>
          
          {/* Top spacer */}
          <div className="h-8" />

          {/* Central Appreciation Body */}
          <div className="flex-grow flex flex-col justify-center text-right select-text">
            {post.mediaType === 'audio' ? (
              <div className="flex flex-col items-end gap-4">
                <div className="w-14 h-14 bg-[#FE6349]/20 rounded-full flex items-center justify-center border border-[#FE6349]/30">
                  <Heart className="text-[#FE6349] animate-pulse" size={24} />
                </div>
                <p className="text-gray-900 font-extrabold text-lg leading-snug">
                  Play heart voice recording
                </p>
                <audio ref={audioRef} src={post.mediaUrl} controls className="w-full mt-2" autoPlay />
              </div>
            ) : post.mediaType === 'video' ? (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-black/10 relative">
                <video ref={videoRef} src={post.mediaUrl} className="w-full h-full object-cover" controls autoPlay loop playsInline />
              </div>
            ) : post.mediaType === 'image' ? (
              <div className="flex flex-col items-end gap-3">
                <div className="w-full max-h-60 rounded-none overflow-hidden border border-black/5 bg-gray-50 flex items-center justify-center p-1">
                  <img src={post.mediaUrl} className="max-w-full max-h-full w-auto h-auto object-contain rounded-none" alt="Memory" referrerPolicy="no-referrer" />
                </div>
                <p className="text-gray-800 handwriting text-xl leading-tight font-bold mt-2">
                  {post.content}
                </p>
              </div>
            ) : (
              // Standard text or note archetype
              <div className="space-y-4">
                <p className="handwriting text-[1.45rem] text-gray-800 font-extrabold leading-relaxed text-right">
                  "{post.content}"
                </p>
                {post.secondaryImage && (
                  <div className="flex justify-end mt-4">
                    <div className="w-24 h-32 bg-white p-1.5 rounded-xl border border-gray-100 rotate-3 ring-4 ring-black/5 overflow-hidden">
                      <img src={post.secondaryImage} className="w-full h-full object-cover rounded-lg" alt="Grandpa" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom reaction metrics signature (STRICTLY RIGHT-ALIGNED) */}
          <div className="flex flex-col items-end justify-end mt-6 text-right">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-full text-xs font-bold text-gray-800">
              <span className="text-rose-500">💖</span> {post.reactions.toLocaleString()} blown
            </div>
            <div className="mt-3">
              <p className="text-gray-950 font-extrabold text-sm tracking-tight inline-flex items-center gap-1">
                <span>By</span>
                <span className="underline decoration-[#FE6349] decoration-2">@{post.authorName}</span>
              </p>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wide mt-0.5">
                Target: {post.targetId} ({post.targetType.toLowerCase()})
              </p>
            </div>
          </div>
        </div>

        {/* Curiosity Lock Screen Overlay for Blurred Items */}
        {isBlurred && (
          <div className="absolute inset-0 bg-[#FAF5E8]/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center z-50">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center mb-4 animate-bounce">
              <Sparkles size={22} className="text-amber-400" />
            </div>
            <h3 className="text-gray-900 font-extrabold text-base tracking-tight uppercase">
              Tear-Jerker Locked 😭
            </h3>
            <p className="text-xs text-gray-600 font-bold mt-2 max-w-[240px] leading-relaxed">
              Tap inside this board to unlock and reveal the full heartwarming tribute page.
            </p>
          </div>
        )}

        {/* Top-Right Absolute Close Trigger (Only shows when revealed or not blurred) */}
        {(!isBlurred) && (
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="absolute top-5 right-5 z-[80] w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-800 hover:text-black hover:scale-105 transition-all"
          >
            <X size={15} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};
