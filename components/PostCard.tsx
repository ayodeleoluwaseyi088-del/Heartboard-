
import React from 'react';
import { Post } from '../types';
import { ConfettiOverlay } from './ConfettiOverlay';
import { CanvasReadOnlyCard } from './CreateAppreciationModal';

interface PostCardProps {
  post: Post & { 
    theme?: string; 
    mediaType?: 'audio' | 'video' | 'image' | 'text' | 'note';
    sponsor?: string;
    sticker?: string;
    confetti?: string;
    secondaryImage?: string;
    category?: 'tears' | 'vouch' | 'hype';
    inactive?: boolean;
    disabled?: boolean;
  };
  onClick?: () => void;
  disabled?: boolean;
}

// Concentric Circular Vector Pattern matching attached design image
const ConcentricRingsBg: React.FC<{ isDark?: boolean }> = ({ isDark }) => (
  <svg 
    className="absolute inset-0 w-full h-full pointer-events-none opacity-70 scale-110" 
    viewBox="0 0 380 474" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="190" cy="237" r="40" stroke={isDark ? "rgba(255,255,255,0.18)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="80" stroke={isDark ? "rgba(255,255,255,0.15)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="120" stroke={isDark ? "rgba(255,255,255,0.12)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="160" stroke={isDark ? "rgba(255,255,255,0.1)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="200" stroke={isDark ? "rgba(255,255,255,0.08)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="240" stroke={isDark ? "rgba(255,255,255,0.06)" : "#F1DFD0"} strokeWidth="1.2" />
    <circle cx="190" cy="237" r="280" stroke={isDark ? "rgba(255,255,255,0.04)" : "#F1DFD0"} strokeWidth="1.2" />
  </svg>
);

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, disabled }) => {
  const isDarkTheme = post.theme === '#272835' || post.theme === 'bg-slate-900';
  const isInactive = disabled || post.disabled || post.inactive;

  const handleClick = (e: React.MouseEvent) => {
    if (isInactive) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.();
  };

  const getBgStyle = () => {
    if (post.theme && post.theme.startsWith('#')) {
      return { backgroundColor: post.theme };
    }
    return { backgroundColor: '#FAF0EC' }; // Cozy peach default frame color
  };

  const getBgClass = (fallback: string) => {
    if (post.theme && !post.theme.startsWith('#')) {
      return post.theme;
    }
    return fallback;
  };

  return (
    <div 
      className={`group h-full select-none ${isInactive ? 'cursor-default' : 'cursor-pointer'}`} 
      onClick={handleClick}
    >
      {/* 
        MAIN FRAME: Outer container with frame color background & concentric rings pattern.
        No shadow, clean filled style.
      */}
      <div 
        className={`relative overflow-hidden rounded-[2.5rem] p-5 aspect-[380/474] flex flex-col justify-between ${getBgClass('bg-[#FAF0EC]')}`}
        style={getBgStyle()}
      >
        {/* Concentric vector background pattern from attached image */}
        <ConcentricRingsBg isDark={isDarkTheme} />

        {/* 
          INNER FRAME: Nested white/dark rasterized card container designed by poster or curator.
        */}
        {post.canvasElements && post.canvasElements.length > 0 ? (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <CanvasReadOnlyCard
              canvasElements={post.canvasElements}
              selectedConfetti={post.confetti}
              content={post.content}
              uploadedImage={post.imageUrl || post.mediaUrl}
              authorName={post.authorName}
              recipient={Array.isArray((post as any).recipients) ? (post as any).recipients[0] : post.targetId}
            />
          </div>
        ) : (
          <div className="relative z-10 w-full h-full bg-white rounded-[2rem] p-5 flex flex-col justify-between overflow-hidden">
            {/* Confetti Animation Effect */}
            {post.confetti && <ConfettiOverlay type={post.confetti} />}
            
            {/* Top header area */}
            {post.sticker && (
              <div className="flex items-center justify-start w-full select-none">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-lg">
                  {post.sticker === 'heart_bubble' ? '❤️' :
                   post.sticker === 'star_glow' ? '⭐' :
                   post.sticker === 'medal_trophy' ? '🏆' :
                   post.sticker === 'party_celebrate' ? '🎉' : '😊'}
                </div>
              </div>
            )}

            {/* Central content / Rasterized Image created by curator */}
            <div className="flex-grow flex flex-col justify-center my-2 relative overflow-hidden rounded-none">
              {post.mediaUrl ? (
                <div className="relative w-full h-full min-h-[160px] rounded-none overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                  <img 
                    src={post.mediaUrl} 
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-none" 
                    alt={post.content || 'Curated tribute'} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-center px-1 text-right" style={{ direction: 'rtl' }}>
                  <p className="handwriting text-2xl text-gray-800 font-bold leading-snug">
                    "{post.content}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


