import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  PenLine, 
  Mic, 
  Video, 
  Plus, 
  Minus,
  Check, 
  Lock, 
  Globe, 
  Sparkles, 
  Smile, 
  Heart,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Sliders,
  Play,
  Square,
  Image as ImageIcon,
  Type,
  Palette,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader2,
  PartyPopper,
  Search,
  UserX
} from 'lucide-react';
import { refineText } from '../services/geminiService';
import { VectorPicker, PHOSPHOR_VECTORS } from './VectorPicker';
import { ChooseColor } from './ColorPicker';
import { ConfettiOverlay, ConfettiType } from './ConfettiOverlay';
import { ConfettiPickerModal } from './ConfettiPickerModal';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'vector' | 'bg';
  text?: string;
  isCursive?: boolean;
  fontFamily?: string;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  imageUrl?: string;
  strokeEnabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  vectorId?: string;
  vectorName?: string;
  emoji?: string;
  label?: string;
  bubbleColor?: string;
  bgHex?: string;
  frameName?: string;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}

interface RenderCanvasElementProps {
  el: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

const RenderCanvasElement: React.FC<RenderCanvasElementProps> = ({
  el,
  isSelected,
  onSelect,
  onEdit,
  onUpdate,
}) => {
  const isDraggingRef = useRef(false);
  const isScalingRef = useRef(false);
  const isRotatingRef = useRef(false);

  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  const startStateRef = useRef({
    clientX: 0,
    clientY: 0,
    initX: 0,
    initY: 0,
    initScale: 1,
    initRot: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(el.id);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current.time;
    const dist = Math.hypot(e.clientX - lastTapRef.current.x, e.clientY - lastTapRef.current.y);

    if (lastTapRef.current.time > 0 && timeSinceLastTap < 300 && dist < 25) {
      lastTapRef.current = { time: 0, x: 0, y: 0 };
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      onEdit(el.id);
      return;
    }

    lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };

    isDraggingRef.current = true;
    startStateRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initX: el.x || 0,
      initY: el.y || 0,
      initScale: el.scale || 1,
      initRot: el.rotation || 0,
    };
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    onEdit(el.id);
  };

  const handleScalePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    isScalingRef.current = true;
    startStateRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initX: el.x || 0,
      initY: el.y || 0,
      initScale: el.scale || 1,
      initRot: el.rotation || 0,
    };
  };

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    isRotatingRef.current = true;
    startStateRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initX: el.x || 0,
      initY: el.y || 0,
      initScale: el.scale || 1,
      initRot: el.rotation || 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) {
      const deltaX = e.clientX - startStateRef.current.clientX;
      const deltaY = e.clientY - startStateRef.current.clientY;
      onUpdate(el.id, {
        x: startStateRef.current.initX + deltaX,
        y: startStateRef.current.initY + deltaY,
      });
    } else if (isScalingRef.current) {
      const deltaX = e.clientX - startStateRef.current.clientX;
      const deltaY = e.clientY - startStateRef.current.clientY;
      const delta = (deltaX + deltaY) / 100;
      const newScale = Math.max(0.4, Math.min(3.5, startStateRef.current.initScale + delta));
      onUpdate(el.id, { scale: Number(newScale.toFixed(2)) });
    } else if (isRotatingRef.current) {
      const deltaX = e.clientX - startStateRef.current.clientX;
      const newRot = Math.round((startStateRef.current.initRot + deltaX) % 360);
      onUpdate(el.id, { rotation: newRot });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = false;
    isScalingRef.current = false;
    isRotatingRef.current = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(el.id);
      }}
      style={{
        transform: `translate3d(${el.x || 0}px, ${el.y || 0}px, 0) scale(${el.scale || 1}) rotate(${el.rotation || 0}deg)`,
        touchAction: 'none',
        userSelect: 'none',
      }}
      className={`absolute pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 select-none ${
        isSelected ? 'ring-2 ring-[#FF6B4A] ring-offset-2 z-20' : 'hover:opacity-95 z-10'
      }`}
    >
      {/* 1. Image Element */}
      {el.type === 'image' && el.imageUrl && (
        <img
          src={el.imageUrl}
          alt="Uploaded attachment"
          draggable={false}
          style={{
            borderRadius: `${el.cornerRadius || 0}px`,
            border: el.strokeEnabled ? `${el.strokeWidth ?? 3}px solid ${el.strokeColor || '#FF6B4A'}` : 'none',
          }}
          className="max-w-[220px] max-h-[220px] w-auto h-auto object-contain shadow-xs pointer-events-none select-none transition-all"
        />
      )}

      {/* 2. Vector / Sticker Element */}
      {el.type === 'vector' && (
        <div className="p-1 pointer-events-none select-none flex items-center justify-center">
          {(() => {
            const match = PHOSPHOR_VECTORS.find(v => v.id === (el.vectorId || 'heart'));
            const color = el.vectorColor || '#272835';
            if (match) {
              const IconComp = match.Icon;
              return <IconComp size={48} weight={match.weight || 'fill'} style={{ color }} className="drop-shadow-xs" />;
            }
            if (el.emoji) {
              return <span className="text-4xl leading-none">{el.emoji}</span>;
            }
            return <Heart className="w-10 h-10 drop-shadow-xs" style={{ color }} />;
          })()}
        </div>
      )}

      {/* 3. Text Element */}
      {el.type === 'text' && el.text && (
        <div className="w-full p-2 rounded-xl border border-transparent bg-orange-50/10 pointer-events-none select-none">
          <p 
            style={{ 
              color: el.color || '#1A1B25',
              fontFamily: el.fontFamily || (el.isCursive ? 'Playfair Display, cursive' : 'Nunito, sans-serif'),
              textAlign: el.align || 'center'
            }}
            className={`font-bold leading-snug break-words ${
              el.isCursive || el.fontFamily?.includes('Playfair') || el.fontFamily?.includes('Caveat') 
                ? 'text-xl sm:text-2xl' 
                : 'text-sm sm:text-base'
            }`}
          >
            "{el.text}"
          </p>
        </div>
      )}

      {/* 4. Background Element */}
      {el.type === 'bg' && (
        <div 
          style={{ backgroundColor: el.bgHex || '#FAF5E8' }}
          className="w-24 h-16 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col items-center justify-center p-2 text-center pointer-events-none select-none"
        >
          <span className="text-xs font-bold text-gray-700">{el.frameName || 'Background'}</span>
        </div>
      )}

      {/* Handles when element is selected */}
      {isSelected && (
        <>
          {/* Rotate Handle */}
          <div
            onPointerDown={handleRotatePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-xs font-bold shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-30"
            title="Drag to rotate"
          >
            ↻
          </div>

          {/* Scale / Resize Handle */}
          <div
            onPointerDown={handleScalePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={(e) => e.stopPropagation()}
            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-xs font-bold shadow-md cursor-nwse-resize hover:scale-110 transition-transform z-30"
            title="Drag to resize"
          >
            ↘
          </div>
        </>
      )}
    </div>
  );
};

export interface RenderCanvasElementReadOnlyProps {
  el: CanvasElement;
}

export const RenderCanvasElementReadOnly: React.FC<RenderCanvasElementReadOnlyProps> = ({ el }) => {
  return (
    <div
      style={{
        transform: `translate3d(${el.x || 0}px, ${el.y || 0}px, 0) scale(${el.scale || 1}) rotate(${el.rotation || 0}deg)`,
        userSelect: 'none',
      }}
      className="absolute pointer-events-none flex items-center justify-center select-none transition-transform duration-75 z-10"
    >
      {/* 1. Image Element */}
      {el.type === 'image' && el.imageUrl && (
        <img
          src={el.imageUrl}
          alt="Uploaded attachment"
          draggable={false}
          style={{
            borderRadius: `${el.cornerRadius || 0}px`,
            border: el.strokeEnabled ? `${el.strokeWidth ?? 3}px solid ${el.strokeColor || '#FF6B4A'}` : 'none',
          }}
          className="max-w-[220px] max-h-[220px] w-auto h-auto object-contain shadow-xs pointer-events-none select-none transition-all"
        />
      )}

      {/* 2. Vector / Sticker Element */}
      {el.type === 'vector' && (
        <div className="p-1 pointer-events-none select-none flex items-center justify-center">
          {(() => {
            const match = PHOSPHOR_VECTORS.find(v => v.id === (el.vectorId || 'heart'));
            const color = el.vectorColor || '#272835';
            if (match) {
              const IconComp = match.Icon;
              return <IconComp size={48} weight={match.weight || 'fill'} style={{ color }} className="drop-shadow-xs" />;
            }
            if (el.emoji) {
              return <span className="text-4xl leading-none">{el.emoji}</span>;
            }
            return <Heart className="w-10 h-10 drop-shadow-xs" style={{ color }} />;
          })()}
        </div>
      )}

      {/* 3. Text Element */}
      {el.type === 'text' && el.text && (
        <div className="w-full p-2 rounded-xl border border-transparent bg-orange-50/10 pointer-events-none select-none">
          <p 
            style={{ 
              color: el.color || '#1A1B25',
              fontFamily: el.fontFamily || (el.isCursive ? 'Playfair Display, cursive' : 'Nunito, sans-serif'),
              textAlign: el.align || 'center'
            }}
            className={`font-bold leading-snug break-words ${
              el.isCursive || el.fontFamily?.includes('Playfair') || el.fontFamily?.includes('Caveat') 
                ? 'text-xl sm:text-2xl' 
                : 'text-sm sm:text-base'
            }`}
          >
            "{el.text}"
          </p>
        </div>
      )}

      {/* 4. Background Element */}
      {el.type === 'bg' && (
        <div 
          style={{ backgroundColor: el.bgHex || '#FAF5E8' }}
          className="w-24 h-16 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col items-center justify-center p-2 text-center pointer-events-none select-none"
        >
          <span className="text-xs font-bold text-gray-700">{el.frameName || 'Background'}</span>
        </div>
      )}
    </div>
  );
};

export interface CanvasReadOnlyCardProps {
  canvasElements: CanvasElement[];
  selectedConfetti?: ConfettiType;
  content?: string;
  uploadedImage?: string | null;
  authorName?: string;
  recipient?: string;
  selectedHearts?: string[];
  activeType?: 'text' | 'audio' | 'video';
}

export const CanvasReadOnlyCard: React.FC<CanvasReadOnlyCardProps> = ({
  canvasElements = [],
  selectedConfetti,
  content,
  uploadedImage,
  authorName,
  recipient,
  selectedHearts = [],
  activeType = 'text',
}) => {
  const visibleElements = canvasElements.filter(el => {
    if (el.type === 'text') return Boolean(el.text && el.text.trim());
    if (el.type === 'image') return Boolean(el.imageUrl && el.imageUrl.trim());
    if (el.type === 'vector') return Boolean(el.vectorId || el.emoji);
    return false;
  });

  const hasCanvasContent = visibleElements.length > 0;
  const fallbackText = content?.trim();

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs w-full max-w-[254px] aspect-[254/304] max-h-full flex flex-col justify-between relative overflow-hidden shrink-0">
      {/* Confetti Animation Overlay */}
      <ConfettiOverlay type={selectedConfetti || null} />

      {/* Full Canvas Layer: Treats entire component as canvas area with zero internal clipping bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-10">
        {activeType === 'text' && (
          <>
            {hasCanvasContent ? (
              visibleElements.map((el) => (
                <RenderCanvasElementReadOnly key={el.id} el={el} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full p-4 pointer-events-none my-auto">
                {uploadedImage && (
                  <img src={uploadedImage} alt="Uploaded attachment" className="max-w-[200px] max-h-[140px] rounded-xl object-contain shadow-xs my-auto" />
                )}
                {fallbackText ? (
                  <div className="w-full p-2 my-auto text-center">
                    <p className="text-sm sm:text-base font-bold leading-snug break-words text-[#1A1B25]" style={{ fontFamily: 'Playfair Display, cursive' }}>
                      "{fallbackText}"
                    </p>
                  </div>
                ) : !uploadedImage && (
                  <div className="text-center w-full px-4 space-y-0.5 py-1 pointer-events-none">
                    <h3 className="text-[15px] font-semibold text-gray-600 tracking-tight">
                      Message Card
                    </h3>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Recipient tag */}
      <div className="w-full flex justify-end items-center pr-1 relative z-20 pointer-events-none select-none">
        {activeType === 'text' && recipient?.trim() ? (
          <span className="text-[10px] font-extrabold text-[#A4ABB8] uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 max-w-[130px] truncate">
            {recipient}
          </span>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {/* Central placeholder for audio/video if active */}
      {activeType !== 'text' && (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-2 relative z-0 w-full gap-2 pointer-events-none">
          {activeType === 'audio' && (
            <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
              <Mic className="w-12 h-12 stroke-[1.5]" style={{ color: '#EED8CE' }} />
              <h3 className="text-base font-semibold text-[#272835]">Audio tribute</h3>
            </div>
          )}

          {activeType === 'video' && (
            <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
              <Video className="w-12 h-12 stroke-[1.5]" style={{ color: '#EED8CE' }} />
              <h3 className="text-base font-semibold text-[#272835]">Video tribute</h3>
            </div>
          )}
        </div>
      )}

      {/* Card footer */}
      {activeType === 'text' ? (
        <div className="w-full flex justify-between items-center select-none pt-1 relative z-20 pointer-events-none">
          <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest">
            {authorName?.trim() ? `By ${authorName}` : ''}
          </span>
          {selectedHearts.length > 0 && (
            <div className="flex gap-1 bg-gray-50/70 p-1.5 rounded-full">
              {selectedHearts.map(id => (
                <span key={id} className="text-xs">
                  {SEMANTIC_HEARTS.find(h => h.id === id)?.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
};

import { moderateContent } from '../services/geminiService';
import { EntityType, PostVisibility } from '../types';

interface CreateAppreciationModalProps {
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

// Spacing System conforming to additional guide elements:
// Web: 3px, 6px, 12px, 24px, 48px, 96px
const SPACING = {
  web_3: '3px',
  web_6: '6px',
  web_12: '12px',
  web_24: '24px',
  web_48: '48px',
  web_96: '96px',
};

// Grayscale tokens conforming to instructions:
const GRAYS = {
  gray0: '#F8F9FB',
  gray25: '#F6F8FA',
  gray50: '#ECEFF3',
  gray100: '#DFE1E6',
  gray200: '#C1C7CF',
  gray300: '#A4ABB8',
  gray400: '#808897',
  gray500: '#666D80',
  gray600: '#353849',
  gray800: '#272835',
  gray900: '#1A1B25',
};

// Registered Users Dataset for Send Heart Selection
export interface RegisteredUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified?: boolean;
}

export const REGISTERED_USERS: RegisteredUser[] = [
  { 
    id: 'u-ronaldo', 
    name: 'Ronaldo', 
    handle: '@ronaldo', 
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150', 
    isVerified: true 
  },
  { 
    id: 'u-ronike', 
    name: 'Ronike', 
    handle: '@ronike', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 
    isVerified: false 
  },
  { 
    id: 'u-ronny', 
    name: 'Ronny', 
    handle: '@ronny', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
    isVerified: false 
  },
  { 
    id: 'u-messi', 
    name: 'Leo Messi', 
    handle: '@messi', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', 
    isVerified: true 
  },
  { 
    id: 'u-beyonce', 
    name: 'Beyoncé', 
    handle: '@beyonce', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 
    isVerified: true 
  },
  { 
    id: 'u-amino', 
    name: 'Amino', 
    handle: '@amino', 
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150', 
    isVerified: false 
  },
  { 
    id: 'u-sarah', 
    name: 'Sarah Connor', 
    handle: '@sarah', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 
    isVerified: false 
  },
  { 
    id: 'u-alex', 
    name: 'Alex Johnson', 
    handle: '@alexj', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 
    isVerified: false 
  },
];

// Semantic Heart Spectrum matching the 6 screenshot items
export interface SemanticHeart {
  id: string;
  label: string;
  details: string;
  emoji: string;
  bubbleColor: string;
}

export const SEMANTIC_HEARTS: SemanticHeart[] = [
  { id: 'loving', label: 'Loving', details: 'Express romantic connection & affection', emoji: '💛', bubbleColor: '#FFB800' },
  { id: 'reliable', label: 'Reliable', details: 'Celebrate dependable, rock-solid support', emoji: '🧡', bubbleColor: '#FF8A65' },
  { id: 'leadership', label: 'Leadership', details: 'Salute career-defining status & legacy', emoji: '💜', bubbleColor: '#7B62FF' },
  { id: 'hardworking', label: 'Hard working', details: 'Commend tireless ethics & dedication', emoji: '💚', bubbleColor: '#4CD964' },
  { id: 'visionary', label: 'Visionary', details: 'Recognize standard-setting motivation', emoji: '💖', bubbleColor: '#FF53C0' },
  { id: 'best', label: 'Best of all', details: 'The ultimate golden status token', emoji: '💙', bubbleColor: '#007A78' },
];

// Beautiful custom speech bubble with a smiley face heart inside (matches screenshot precisely)
const HeartBubbleSvg: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg width="56" height="56" viewBox="0 0 60 60" className="select-none transform transition-all duration-200">
      {/* Dynamic colored bubble with tail pointing to bottom-right */}
      <path 
        d="M 30 10 C 19.5 10 11 18.5 11 29 C 11 39.5 19.5 48 30 48 C 33.1 48 36.1 47.2 38.7 45.8 L 45.5 47.5 L 43.8 40.7 C 45.2 38.1 46 35.1 46 32 C 46 21.5 38.5 10 30 10 Z" 
        fill={color} 
      />
      {/* Filled white heart shape inside the bubble */}
      <path 
        d="M 30 20 C 30 20 27.6 16.5 24 19.5 C 20.4 22.5 30 33 30 33 C 30 33 39.6 22.5 36 19.5 C 32.4 16.5 30 20 30 20 Z" 
        fill="#FFFFFF" 
      />
      {/* Smiley face drawn in the bubble's original color overlaying the heart */}
      <circle cx="26.5" cy="22.5" r="1.3" fill={color} />
      <circle cx="33.5" cy="22.5" r="1.3" fill={color} />
      <path d="M 25 25.8 C 26.5 28.3 33.5 28.3 35 25.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
};

// Aesthetic Frame templates
interface FrameTemplate {
  id: string;
  name: string;
  bgHex: string;
  pillBg: string;
  pillText: string;
}

const FRAME_TEMPLATES: FrameTemplate[] = [
  { id: 'peach', name: 'Cozy Peach', bgHex: '#F7F0ED', pillBg: '#F7F0ED', pillText: '#808897' },
  { id: 'mint', name: 'Clean Mint', bgHex: '#ECEFE6', pillBg: '#ECEFE6', pillText: '#556644' },
  { id: 'slate', name: 'Cosmic Slate', bgHex: '#272835', pillBg: '#353849', pillText: '#DFE1E6' },
  { id: 'sunset', name: 'Soft Sunlight', bgHex: '#FAF5E8', pillBg: '#FAF5E8', pillText: '#806840' },
  { id: 'lavender', name: 'Dreamy Lavender', bgHex: '#EEF1FA', pillBg: '#EEF1FA', pillText: '#5A60A0' },
  { id: 'blush', name: 'Blush Rose', bgHex: '#FDE8E8', pillBg: '#FDE8E8', pillText: '#9B1C1C' },
  { id: 'sky', name: 'Sky Azure', bgHex: '#E0F2FE', pillBg: '#E0F2FE', pillText: '#0369A1' },
  { id: 'emerald', name: 'Sage Emerald', bgHex: '#E6F4EA', pillBg: '#E6F4EA', pillText: '#137333' },
  { id: 'amber', name: 'Warm Amber', bgHex: '#FEF3C7', pillBg: '#FEF3C7', pillText: '#92400E' },
  { id: 'lilac', name: 'Soft Lilac', bgHex: '#F3E8FF', pillBg: '#F3E8FF', pillText: '#6B21A8' },
];

// Stickers selection
interface StickerItem {
  id: string;
  emoji: string;
  label: string;
}

const STICKER_LIST: StickerItem[] = [
  { id: 'smile_bubble', emoji: '😊', label: 'Smile bubble' },
  { id: 'heart_bubble', emoji: '❤️', label: 'Heart bubble' },
  { id: 'star_glow', emoji: '⭐', label: 'Sparkling star' },
  { id: 'glow_vibes', emoji: '✨', label: 'Glow vibes' },
  { id: 'medal_trophy', emoji: '🏆', label: 'Trophy case' },
  { id: 'party_celebrate', emoji: '🎉', label: 'Tribute horn' },
];

const TEXT_TEMPLATES = [
  "So proud of your hard work and dedication! 🌟",
  "Thank you for inspiring our team every single day! 🙌",
  "Happy Birthday! Wishing you endless joy and success! 🎉",
  "You are an absolute legend in our workspace! 🏆",
  "Grateful for your endless guidance, kindness, and support. ❤️",
  "Brought so much positive energy to this milestone! ✨",
  "Reliable, brilliant, and an absolute pleasure to work with!"
];

const EVENT_TYPES = [
  'Graduation',
  'Wedding',
  'Birthday',
  'Anniversary',
  'Appreciation',
  'Congratulations',
  'Condolence',
  'Friendship',
  'Love',
  'Other',
];

const FONT_OPTIONS = [
  { id: 'nunito', name: 'Nunito (Clean Sans)', font: 'Nunito, sans-serif' },
  { id: 'playfair', name: 'Playfair Display (Serif)', font: 'Playfair Display, serif' },
  { id: 'caveat', name: 'Caveat (Handwritten)', font: 'Caveat, cursive' },
  { id: 'courier', name: 'Courier Prime (Mono)', font: 'Courier Prime, monospace' },
];

const COLOR_OPTIONS = [
  { hex: '#1A1B25', name: 'Charcoal' },
  { hex: '#FF6B4A', name: 'Coral' },
  { hex: '#4CB993', name: 'Mint' },
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#000000', name: 'Black' },
  { hex: '#4F46E5', name: 'Indigo' },
  { hex: '#D946EF', name: 'Fuchsia' },
  { hex: '#047857', name: 'Emerald' },
  { hex: '#0284C7', name: 'Sky' },
  { hex: '#A855F7', name: 'Violet' },
];

export const CreateAppreciationModal: React.FC<CreateAppreciationModalProps> = ({ onClose, onPostCreated }) => {
  const [activeType, setActiveType] = useState<'text' | 'audio' | 'video'>('text');
  
  // Customization & Core Information States
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [recipient, setRecipient] = useState('');
  
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate>(FRAME_TEMPLATES[0]);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [selectedConfetti, setSelectedConfetti] = useState<ConfettiType>(null);
  const [isConfettiPickerOpen, setIsConfettiPickerOpen] = useState(false);
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [isCursive, setIsCursive] = useState(true);
  const [canvasAspectRatio] = useState<'portrait'>('portrait');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Canvas Elements state
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  // Text Element Redesign states
  const [activeAccordion, setActiveAccordion] = useState<'font' | 'color' | 'template' | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  const toggleAccordion = (section: 'font' | 'color' | 'template') => {
    setActiveAccordion(prev => prev === section ? null : section);
  };

  const hasElementContent = (el: CanvasElement) => {
    if (el.type === 'text') return Boolean(el.text && el.text.trim());
    if (el.type === 'image') return Boolean(el.imageUrl && el.imageUrl.trim());
    if (el.type === 'vector') return Boolean(el.vectorId || el.emoji);
    return false;
  };

  // Handlers for adding new elements on toolbar button clicks
  const handleAddTextElement = () => {
    const newEl: CanvasElement = {
      id: 'text-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: 'text',
      text: '',
      isCursive: isCursive,
    };
    setCanvasElements(prev => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setEditingElementId(newEl.id);
  };

  const handleAddImageElement = () => {
    const newEl: CanvasElement = {
      id: 'image-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: 'image',
      imageUrl: '',
      strokeEnabled: false,
      strokeColor: '#FF6B4A',
      strokeWidth: 3,
      cornerRadius: 0,
    };
    setCanvasElements(prev => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setEditingElementId(newEl.id);
    setTimeout(() => {
      imageInputRef.current?.click();
    }, 50);
  };

  const handleAddVectorElement = () => {
    const defaultVector = PHOSPHOR_VECTORS[0];
    const newEl: CanvasElement = {
      id: 'vector-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: 'vector',
      vectorId: defaultVector.id,
      vectorName: defaultVector.name,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    setCanvasElements(prev => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setEditingElementId(newEl.id);
  };

  const handleAddBgElement = () => {
    const newEl: CanvasElement = {
      id: 'bg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: 'bg',
      bgHex: '#FAF5E8',
      frameName: 'Soft Sunlight',
    };
    setCanvasElements(prev => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setEditingElementId(newEl.id);
  };

  const handleDeleteElement = (id: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    if (editingElementId === id) {
      setEditingElementId(null);
    }
  };

  const updateCanvasElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const updateEditingElement = (updates: Partial<CanvasElement>) => {
    if (!editingElementId) return;
    setCanvasElements(prev => prev.map(el => el.id === editingElementId ? { ...el, ...updates } : el));
  };

  const editingElement = canvasElements.find(el => el.id === editingElementId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Advanced variables
  const [privacyLayer, setPrivacyLayer] = useState<PostVisibility>(PostVisibility.PUBLIC);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  
  // Preview Page State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(['@you']);
  const [newRecipientInput, setNewRecipientInput] = useState('');
  const [boardCapacity, setBoardCapacity] = useState<'collaborative' | 'solo'>('collaborative');
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Control States
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedActiveTool, setExpandedActiveTool] = useState<'none' | 'image' | 'text' | 'vector' | 'bg'>('none');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHeartsOnlyPickerOpen, setIsHeartsOnlyPickerOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  
  // Isolated Send Heart Component States
  const [isSendHeartOpen, setIsSendHeartOpen] = useState(false);
  const [selectedSendHeart, setSelectedSendHeart] = useState<string | null>(null);
  const [sendHeartSearchQuery, setSendHeartSearchQuery] = useState('');
  const [selectedSendHeartRecipients, setSelectedSendHeartRecipients] = useState<RegisteredUser[]>([]);
  const [sendHeartNote, setSendHeartNote] = useState('');
  const [isBlowingHeart, setIsBlowingHeart] = useState(false);
  const [sendHeartConfirmation, setSendHeartConfirmation] = useState<{
    heart: SemanticHeart;
    recipient: string;
  } | null>(null);
  const [createdPostConfirmation, setCreatedPostConfirmation] = useState<any | null>(null);

  // Filter registered users based on search query
  const filteredSendHeartUsers = REGISTERED_USERS.filter((u) => {
    if (!sendHeartSearchQuery.trim()) return true;
    const q = sendHeartSearchQuery.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q)
    );
  });
  
  // Moderation variables
  const [isModerating, setIsModerating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  // Audio recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto recipient tagging check
  const isHashtagRecipient = recipient.startsWith('#');

  useEffect(() => {
    if (isHashtagRecipient) {
      setPrivacyLayer(PostVisibility.PUBLIC);
    }
  }, [recipient, isHashtagRecipient]);

  // Audio Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(true);
    
    setTimeout(() => {
      setAudioUrl('demo_appreciation_voice.wav');
      setIsTranscribing(false);
      setContent("Checking in to let you know how much I appreciate your consistent reliability and work ethic. You are an absolute inspiration and workspace legend!");
      setIsCursive(true);
    }, 1800);
  };

  const handleHeartToggle = (heartId: string) => {
    if (selectedHearts.includes(heartId)) {
      setSelectedHearts(prev => prev.filter(id => id !== heartId));
    } else {
      setSelectedHearts(prev => [...prev, heartId]);
    }
  };

  const handlePublish = async () => {
    setIsPreviewOpen(true);
  };

  const handleFinalSubmitMessage = async () => {
    const textToWrite = caption.trim() || content.trim() || (canvasElements.find(el => el.type === 'text')?.text) || '';
    setIsModerating(true);
    setModerationError(null);

    const safeTextCheck = textToWrite || (activeType === 'audio' ? "Audio appreciation tribute" : "Visual video tribute");

    try {
      const result = await moderateContent(safeTextCheck);
      if (!result.isSafe) {
        setModerationError(result.reason || "Please ensure the message matches our positive platform code.");
        setIsModerating(false);
        return;
      }

      const finalRecipientsString = recipients.join(', ') || '@you';
      
      const newPost: any = {
        id: 'post-' + Math.random().toString(36).substring(2, 11),
        authorName: privacyLayer === PostVisibility.ANONYMOUS ? (authorName.trim().split(' ')[0] || 'Anonymous') : (authorName.trim() || 'Curator'),
        content: safeTextCheck,
        caption: caption.trim() || undefined,
        eventType: selectedEventType || undefined,
        recipients: recipients,
        boardCapacity: boardCapacity,
        type: activeType,
        mediaType: activeType === 'text' ? 'note' : activeType,
        targetId: finalRecipientsString.replace('#', ''),
        targetType: isHashtagRecipient ? EntityType.WALL : EntityType.BOARD,
        reactions: 0,
        aspectRatio: 'portrait',
        imageUrl: uploadedImage || undefined,
        createdAt: new Date().toISOString(),
        theme: selectedFrame.id === 'slate' ? 'bg-[#272835] text-white' : 
               selectedFrame.id === 'mint' ? 'bg-[#ECEFE6]' :
               selectedFrame.id === 'sunset' ? 'bg-[#FAF5E8]' :
               selectedFrame.id === 'lavender' ? 'bg-[#EEF1FA]' : 'bg-[#FAF0EC]',
        sticker: selectedSticker ? selectedSticker.id : undefined,
        confetti: selectedConfetti || undefined,
        sponsor: boardCapacity === 'collaborative' ? "Community Coauthored" : undefined,
        canvasElements: canvasElements.filter(hasElementContent),
      };

      // Enrich content with semantic hearts if set
      if (selectedHearts.length > 0) {
        const heartLabels = selectedHearts.map(id => SEMANTIC_HEARTS.find(h => h.id === id)?.label).filter(Boolean);
        newPost.content = `${newPost.content} (${heartLabels.join(', ')})`;
      }

      onPostCreated(newPost);
      setIsModerating(false);
      setCreatedPostConfirmation(newPost);
    } catch (e) {
      console.error(e);
      setModerationError("Network check failed. Sending direct tribute...");
      setIsModerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#FCF9F8] flex flex-col font-sans select-none overflow-y-auto antialiased">
      
      {/* Sticky Top Banner Header & Tabs */}
      <div className="sticky top-0 z-50 bg-[#ffffff] border-b border-gray-100 shrink-0">
        {/* 1. Header (Drop a message & Close button) */}
        <div className="w-full px-6 py-5 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-[#1A1B25] hover:bg-black/5 p-2 rounded-full transition-all active:scale-95"
            aria-label="Close message portal"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold text-[#1A1B25] tracking-tight text-center flex-grow -translate-x-3">
            Drop a message
          </h1>
          
          {/* Mirror spacer */}
          <div className="w-8" />
        </div>

        {/* 2. Media Tabs */}
        <div className="w-full flex justify-center pb-2">
          <div className="flex gap-16 relative">
            <button 
              onClick={() => setActiveType('text')}
              className={`flex items-center gap-2 pb-3 px-1 transition-all text-[16px] font-semibold relative cursor-pointer ${activeType === 'text' ? 'text-[#1A1B25]' : 'text-[#A4ABB8] hover:text-[#666D80]'}`}
            >
              <PenLine className="w-[20px] h-[20px]" />
              <span>Text</span>
              {activeType === 'text' && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#1A1B25] rounded-full" />
              )}
            </button>

            <button 
              onClick={() => setActiveType('audio')}
              className={`flex items-center gap-2 pb-3 px-1 transition-all text-[16px] font-semibold relative ${activeType === 'audio' ? 'text-[#1A1B25]' : 'text-[#A4ABB8] hover:text-[#666D80]'}`}
            >
              <Mic className="w-[20px] h-[20px]" />
              <span>Audio</span>
              {activeType === 'audio' && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#1A1B25] rounded-full" />
              )}
            </button>

            <button 
              onClick={() => setActiveType('video')}
              className={`flex items-center gap-2 pb-3 px-1 transition-all text-[16px] font-semibold relative ${activeType === 'video' ? 'text-[#1A1B25]' : 'text-[#A4ABB8] hover:text-[#666D80]'}`}
            >
              <Video className="w-[20px] h-[20px]" />
              <span>Video</span>
              {activeType === 'video' && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#1A1B25] rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pristine Centered Workspace */}
      <div className="flex-grow w-full flex flex-col items-center justify-center pt-[24px] pb-12 px-6 bg-[#FCF9F8] gap-[16px]">
        
        {/* A. Outer Cozy Peach / Color Fill Preview Frame (Fixed Aspect Ratios with Responsive Scaling) */}
        <div 
          onClick={() => activeType === 'text' && setIsExpanded(true)}
          style={{ 
            backgroundColor: selectedFrame.bgHex,
            height: 'min(480px, 65vh)'
          }}
          className="relative w-full max-w-[461px] rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-300 flex items-center justify-center p-4 sm:p-6 select-none border border-transparent cursor-pointer group hover:scale-[1.01] active:scale-[0.99]"
          title={activeType === 'text' ? "Click to expand into full workspace editor" : undefined}
        >

          {/* B. Center vertical or horizontal white card */}
          <div 
            onClick={() => setSelectedElementId(null)}
            className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white flex flex-col justify-between relative p-4 sm:p-6 transition-all duration-300 max-w-full max-h-full w-[254px] h-[350px] overflow-hidden shadow-xs cursor-default"
          >
            {/* Full Canvas Layer: Treats entire component as canvas area with zero internal clipping bounds */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-10">
              {activeType === 'text' && (
                <>
                  {(() => {
                    const visibleElements = canvasElements.filter(hasElementContent);
                    if (visibleElements.length === 0) {
                      return (
                        <div className="text-center w-full px-4 space-y-0.5 py-1 pointer-events-none">
                          <h3 className="text-[15px] font-semibold text-gray-600 tracking-tight">
                            Tap to create message
                          </h3>
                          <p className="text-[11px] text-[#808897] font-semibold">
                            Create beautiful message with stunning visuals
                          </p>
                        </div>
                      );
                    }
                    return visibleElements.map((el) => (
                      <RenderCanvasElement
                        key={el.id}
                        el={el}
                        isSelected={selectedElementId === el.id}
                        onSelect={(id) => setSelectedElementId(id)}
                        onEdit={(id) => setEditingElementId(id)}
                        onUpdate={updateCanvasElement}
                      />
                    ));
                  })()}
                </>
              )}
            </div>

            {/* Recipient meta badge if recipient is filled */}
            <div className="w-full flex justify-end items-center pr-1 relative z-20 pointer-events-none select-none">
              {activeType === 'text' && recipient.trim() ? (
                <span className="text-[10px] font-extrabold text-[#A4ABB8] uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 max-w-[130px] truncate pointer-events-auto">
                  {recipient}
                </span>
              ) : (
                <div className="h-6" /> // Empty space to protect layout alignment
              )}
            </div>

            {/* Central placeholder for audio/video if active */}
            <div className="flex-grow flex flex-col items-center justify-center text-center py-2 relative z-0 w-full gap-2 pointer-events-none">
              {activeType === 'audio' && (
                <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
                  <div className="p-1 mb-1">
                    <Mic className="w-14 h-14 stroke-[1.5]" style={{ color: '#EED8CE' }} />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#272835] tracking-tight">
                    Audio coming soon
                  </h3>
                  <div className="text-[12px] text-[#A4ABB8] font-semibold leading-tight">
                    <p>Send beautiful message</p>
                    <p>with your voice</p>
                  </div>
                </div>
              )}

              {activeType === 'video' && (
                <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
                  <div className="p-1 mb-1">
                    <Video className="w-14 h-14 stroke-[1.5]" style={{ color: '#EED8CE' }} />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#272835] tracking-tight">
                    Video coming soon
                  </h3>
                  <div className="text-[12px] text-[#A4ABB8] font-semibold leading-tight">
                    <p>Send beautiful message</p>
                    <p>with your video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pristine clean footer: absolutely no borders, lines, or metadata unless there are active hearts */}
            {activeType === 'text' ? (
              <div className="w-full flex justify-between items-center select-none pt-1">
                <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest">
                  {authorName.trim() ? `By ${authorName}` : ''}
                </span>
                
                <div className="flex gap-1 items-center">
                  {selectedHearts.length > 0 && (
                    <div className="flex gap-1 bg-gray-50/70 p-1.5 rounded-full">
                      {selectedHearts.map(id => (
                        <span key={id} className="text-sm scale-110 active:scale-125 transition-transform" title={SEMANTIC_HEARTS.find(h => h.id === id)?.label}>
                          {SEMANTIC_HEARTS.find(h => h.id === id)?.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </div>





        {/* Core Send Trigger outside drawer when card text has contents */}
        {content.trim() && (
          <div className="flex flex-col items-center">
            <button
              onClick={handlePublish}
              disabled={isModerating}
              className="mt-2 bg-[#FE6349] text-white px-8 py-3.5 rounded-full text-xs font-bold leading-none tracking-wider uppercase hover:opacity-95 shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Publish & Blast Love</span>
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        )}

        {/* Send Heart Accordion Component - Styled precisely according to reference image */}
        <div 
          style={{ backgroundColor: selectedFrame.bgHex }}
          className="w-full max-w-[461px] mt-2 rounded-[24px] p-4 sm:p-5 transition-all duration-300 select-none border-0 shadow-none"
        >
          {/* Accordion Toggle Header */}
          <button
            type="button"
            onClick={() => setIsSendHeartOpen(!isSendHeartOpen)}
            className="w-full flex items-center justify-between px-2 py-1 transition-colors cursor-pointer group text-left"
            aria-expanded={isSendHeartOpen}
          >
            <span className="text-[17px] font-medium text-[#565E70] tracking-tight">
              Send heart
            </span>
            <div className="text-[#A4ABB8] group-hover:text-[#666D80] transition-transform duration-300">
              {isSendHeartOpen ? (
                <Minus className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Plus className="w-5 h-5 stroke-[1.75]" />
              )}
            </div>
          </button>

          {/* Expanded Heart Spectrum Selector */}
          {isSendHeartOpen && (
            <div className="mt-4 pt-4 border-t border-[#EAE3DC] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
                  1. Select Heart Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SEMANTIC_HEARTS.map((heart) => {
                    const isSelected = selectedSendHeart === heart.id;
                    return (
                      <button
                        key={heart.id}
                        type="button"
                        onClick={() => {
                          setSelectedSendHeart(isSelected ? null : heart.id);
                        }}
                        className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 relative overflow-hidden bg-white border-0 shadow-none outline-none ${
                          isSelected 
                            ? 'ring-2 ring-[#FE6349] bg-rose-50/40' 
                            : 'hover:bg-white/90'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-2xl">{heart.emoji}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#FE6349] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1A1B25]">{heart.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Input & Registered User Selection */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                  2. Recipient Details
                </label>
                
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-0 shadow-none space-y-3">
                  {/* Search bar input with search icon */}
                  <div className="relative flex items-center bg-[#F8F9FB] rounded-2xl px-3.5 py-3 border border-gray-100 focus-within:border-[#FE6349] transition-all">
                    <Search className="w-4.5 h-4.5 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={sendHeartSearchQuery}
                      onChange={(e) => setSendHeartSearchQuery(e.target.value)}
                      placeholder="Search registered user..."
                      className="w-full bg-transparent text-sm font-semibold text-[#1A1B25] placeholder:text-gray-400 focus:outline-none border-none p-0"
                    />
                    {sendHeartSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSendHeartSearchQuery('')}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Selected Recipients Chips */}
                  {selectedSendHeartRecipients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSendHeartRecipients.map((user) => (
                        <span
                          key={user.id}
                          className="inline-flex items-center gap-1.5 bg-rose-50 text-[#FE6349] border border-rose-100 font-bold text-xs px-2.5 py-1 rounded-full animate-in fade-in"
                        >
                          <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{user.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSendHeartRecipients(prev => prev.filter(u => u.id !== user.id));
                            }}
                            className="hover:bg-rose-100 rounded-full p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Profile List Header & Results matching attached design */}
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-gray-500 mb-2 px-1">Profile</p>

                    {filteredSendHeartUsers.length > 0 ? (
                      <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                        {filteredSendHeartUsers.map((user) => {
                          const isSelected = selectedSendHeartRecipients.some(u => u.id === user.id);
                          return (
                            <div
                              key={user.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSendHeartRecipients(prev => prev.filter(u => u.id !== user.id));
                                } else {
                                  setSelectedSendHeartRecipients(prev => [...prev, user]);
                                }
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer select-none ${
                                isSelected ? 'bg-rose-50/60 hover:bg-rose-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Avatar with optional verified checkmark badge */}
                                <div className="relative w-10 h-10 shrink-0">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  {user.isVerified && (
                                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#38BDF8] text-white rounded-full p-0.5 flex items-center justify-center border-2 border-white shadow-2xs">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </div>
                                  )}
                                </div>

                                {/* Name */}
                                <div>
                                  <p className="text-base font-bold text-[#1A1B25] leading-tight">
                                    {user.name}
                                  </p>
                                </div>
                              </div>

                              {/* Right Green Checkmark when selected */}
                              {isSelected && (
                                <Check className="w-5 h-5 text-[#22C55E] stroke-[2.5]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Empty State */
                      <div className="text-center py-6 px-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                          <UserX className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-[#1A1B25]">No users found</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Only registered users can receive a Send Heart.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Blow Heart CTA Button */}
              <button
                type="button"
                disabled={!selectedSendHeart || selectedSendHeartRecipients.length === 0 || isBlowingHeart}
                onClick={() => {
                  if (!selectedSendHeart || selectedSendHeartRecipients.length === 0) return;
                  setIsBlowingHeart(true);
                  const chosenHeartObj = SEMANTIC_HEARTS.find(h => h.id === selectedSendHeart) || SEMANTIC_HEARTS[0];
                  
                  setTimeout(() => {
                    setIsBlowingHeart(false);
                    setSendHeartConfirmation({
                      heart: chosenHeartObj,
                      recipient: selectedSendHeartRecipients.map(u => u.name).join(', ')
                    });
                  }, 700);
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer ${
                  !selectedSendHeart || selectedSendHeartRecipients.length === 0 || isBlowingHeart
                    ? 'bg-[#F1E4DF] text-[#A49893] cursor-not-allowed'
                    : 'bg-[#FE6349] hover:bg-[#e05234] text-white active:scale-[0.98]'
                }`}
              >
                {isBlowingHeart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Blowing Heart...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedSendHeartRecipients.length > 1
                        ? `Blow Heart Token (${selectedSendHeartRecipients.length})`
                        : 'Blow Heart Token'
                      }
                    </span>
                    <Sparkles className="w-4 h-4 fill-white" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Full Page Confirmation Modal for Send Heart */}
        {sendHeartConfirmation && (
          <div className="fixed inset-0 z-[3000] bg-[#F7F0ED] sm:bg-[#1A1B25]/60 sm:backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <ConfettiOverlay active={true} type="heart" />
            <div className="w-full h-full sm:h-auto sm:max-w-md bg-white sm:rounded-[32px] p-8 sm:p-10 flex flex-col items-center justify-between sm:justify-center text-center shadow-2xl relative overflow-hidden">
              
              {/* Background ambient gradient glow */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ backgroundColor: sendHeartConfirmation.heart.bubbleColor }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSendHeartConfirmation(null);
                  setSelectedSendHeartRecipients([]);
                  setSendHeartSearchQuery('');
                  setSelectedSendHeart(null);
                  setIsSendHeartOpen(false);
                }}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center py-8 z-10">
                {/* Animated Heart Badge */}
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-6 relative shadow-md animate-bounce"
                  style={{ backgroundColor: `${sendHeartConfirmation.heart.bubbleColor}25` }}
                >
                  <span className="text-6xl">{sendHeartConfirmation.heart.emoji}</span>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                    <Sparkles className="w-5 h-5 fill-[#FE6349] text-[#FE6349]" />
                  </div>
                </div>

                {/* Status Heading */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1B25] tracking-tight mb-2">
                  Heart Token Blown! 💖
                </h2>
                <p className="text-sm font-medium text-gray-500 max-w-xs mb-6">
                  Your heartfelt <strong className="text-[#1A1B25] font-bold">{sendHeartConfirmation.heart.label}</strong> token has been successfully blown to <strong className="text-[#1A1B25] font-bold">{sendHeartConfirmation.recipient}</strong>'s Trophy Case!
                </p>

                {/* Details Badge */}
                <div className="w-full bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-3xl">{sendHeartConfirmation.heart.emoji}</span>
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Semantic Heart</p>
                      <p className="text-sm font-extrabold text-[#1A1B25]">{sendHeartConfirmation.heart.label} Heart</p>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: sendHeartConfirmation.heart.bubbleColor }}
                  >
                    Delivered
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-full space-y-3 pt-4 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setSendHeartConfirmation(null);
                    setSelectedSendHeartRecipients([]);
                    setSendHeartSearchQuery('');
                    setSelectedSendHeart(null);
                    setIsSendHeartOpen(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-[#FE6349] hover:bg-[#e05234] text-white font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSendHeartConfirmation(null);
                    setSelectedSendHeartRecipients([]);
                    setSendHeartSearchQuery('');
                    setSelectedSendHeart(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1A1B25] font-bold text-sm transition-all cursor-pointer"
                >
                  Send Another Heart
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 4. Luxury Customization Form Slide-Up Bottom Sheet Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-[#1A1B25]/40 backdrop-blur-sm z-[2500] flex items-end justify-center transition-all animate-fade-in-slow">
          <div className="bg-white w-full max-w-[500px] rounded-t-[3rem] shadow-2xl p-7 space-y-6 flex flex-col max-h-[90vh] overflow-y-auto transform transition-transform translate-y-0 duration-300">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h4 className="text-base font-extrabold text-[#1A1B25]">Configure Tribute Card</h4>
                <p className="text-[10px] text-[#808897] font-semibold uppercase mt-0.5">Customize recipient, style & details</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#A4ABB8] hover:text-[#353849] p-1.5 bg-[#FAF1EE] rounded-full transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* A. TEXT INPUT OR MEDIA CAPTURE */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">
                Tribute Message Text
              </label>
              {activeType === 'text' ? (
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 180))}
                    placeholder="Write beautiful heartfelt things..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-0 outline-none font-medium h-24 resize-none transition-all duration-200"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-[#A4ABB8] font-bold">
                    {content.length}/180 limits
                  </div>
                </div>
              ) : activeType === 'audio' ? (
                <div className="bg-gray-50 p-4 rounded-2xl border-none flex flex-col items-center gap-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-600">Audio coming soon</p>
                  <p className="text-[10px] text-[#A4ABB8] font-medium">
                    Send beautiful message with your voice
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-2xl border-none flex flex-col items-center gap-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-600">Video coming soon</p>
                  <p className="text-[10px] text-[#A4ABB8] font-medium">
                    Send beautiful message with your video
                  </p>
                </div>
              )}
            </div>

            {/* B. RECIPIENT CAPTURE */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-0.5">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  Who receives this?
                </span>
                {isHashtagRecipient && (
                  <span className="text-[9px] font-extrabold text-[#FE6349] bg-rose-50 px-2 rounded-full uppercase">Global Tag</span>
                )}
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Full Name (or #hashtag tag)"
                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-0 outline-none font-semibold"
              />
              {!recipient.trim() && (
                <p className="text-[9px] text-[#C1C7CF] font-bold pl-0.5">
                  💡 Falls back to curating securely on your public trophy board
                </p>
              )}
            </div>

            {/* C. SENDER SIGNATURE */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">
                Sender Signature Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Defaults to 'Curator'"
                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-0 outline-none font-semibold"
              />
            </div>

            {/* D. THE GRAPHIC TEMPLATES & STICKERS */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Frame Frame</span>
                <div className="flex gap-2 items-center flex-wrap">
                  {FRAME_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedFrame(tmpl)}
                      style={{ backgroundColor: tmpl.bgHex }}
                      className={`w-7 h-7 rounded-full border ${selectedFrame.id === tmpl.id ? 'scale-110 ring-2 ring-[#FE6349] border-transparent' : 'border-gray-200 hover:scale-105'}`}
                      title={tmpl.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Sticker Decor</span>
                <button
                  onClick={() => setIsStickerPickerOpen(!isStickerPickerOpen)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all text-[#1A1B25] flex justify-between px-3 items-center"
                >
                  <span>{selectedSticker.emoji} {selectedSticker.label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {isStickerPickerOpen && (
                  <div className="absolute bg-white border border-gray-100 p-2 rounded-2xl shadow-xl grid grid-cols-3 gap-2.5 z-50">
                    {STICKER_LIST.map(st => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setSelectedSticker(st);
                          setIsStickerPickerOpen(false);
                        }}
                        className="p-1 px-2.5 hover:bg-gray-50 rounded text-lg flex flex-col items-center"
                      >
                        <span>{st.emoji}</span>
                        <span className="text-[7.5px] font-bold text-gray-400 capitalize">{st.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Confetti Effect Trigger */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Confetti Animation</span>
              <button
                type="button"
                onClick={() => setIsConfettiPickerOpen(true)}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all text-[#1A1B25] flex justify-between px-3.5 items-center cursor-pointer border border-transparent hover:border-gray-200"
              >
                <span className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-[#FE6349]" />
                  <span>Add Confetti Animation</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* E. FONT */}
            <div>
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Typography</span>
                <button
                  onClick={() => setIsCursive(!isCursive)}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-left flex justify-between items-center"
                >
                  <span className={isCursive ? 'handwriting text-sm font-extrabold' : 'font-semibold'}>
                    {isCursive ? 'Handwritten Font' : 'Clean Sans Font'}
                  </span>
                </button>
              </div>
            </div>

            {/* F. SEMANTIC SPECTRUM SELECTION */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">
                The Semantic Heart Spectrum
              </span>
              <div className="flex flex-wrap gap-2">
                {SEMANTIC_HEARTS.map((heart) => {
                  const isSelected = selectedHearts.includes(heart.id);
                  return (
                    <button
                      key={heart.id}
                      onClick={() => handleHeartToggle(heart.id)}
                      className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${isSelected ? 'bg-orange-50 border-[#FE6349] text-[#FE6349] scale-105' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'}`}
                    >
                      <span>{heart.emoji}</span>
                      <span>{heart.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* G. PRIVACY LAYERS */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">
                Privacy Settings
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { if (!isHashtagRecipient) setPrivacyLayer(PostVisibility.PUBLIC); }}
                  disabled={isHashtagRecipient}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${privacyLayer === PostVisibility.PUBLIC ? 'bg-orange-50/50 border-[#FE6349] text-[#FE6349]' : 'bg-gray-50 border-transparent text-gray-400'} disabled:opacity-50`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </button>

                <button
                  onClick={() => { if (!isHashtagRecipient) setPrivacyLayer(PostVisibility.PRIVATE); }}
                  disabled={isHashtagRecipient}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${privacyLayer === PostVisibility.PRIVATE ? 'bg-orange-50/50 border-[#FE6349] text-[#FE6349]' : 'bg-gray-50 border-transparent text-gray-400'} disabled:opacity-50`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </button>

                <button
                  onClick={() => { if (!isHashtagRecipient) setPrivacyLayer(PostVisibility.ANONYMOUS); }}
                  disabled={isHashtagRecipient}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${privacyLayer === PostVisibility.ANONYMOUS ? 'bg-orange-50/50 border-[#FE6349] text-[#FE6349]' : 'bg-gray-50 border-transparent text-gray-400'} disabled:opacity-40`}
                >
                  <Smile className="w-4 h-4" />
                  <span>Anonymous</span>
                </button>
              </div>
            </div>

            {/* H. COAUTHOR & PLATFORM CAPPING */}
            <div className="p-4 bg-gray-50/50 rounded-2xl space-y-2.5 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Coauthored mode</span>
                <span className="text-[10px] text-gray-400 font-bold">20/Card Slot Free limit</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="drawer-collab"
                    checked={isCollaborative}
                    onChange={(e) => setIsCollaborative(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FE6349] focus:ring-[#FE6349] border-gray-300"
                  />
                  <label htmlFor="drawer-collab" className="text-xs font-semibold text-gray-600 cursor-pointer">
                    Enable Community contributions
                  </label>
                </div>
                {isCollaborative && (
                  <button
                    onClick={() => setIsPremiumUnlocked(!isPremiumUnlocked)}
                    className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-full transition-all ${isPremiumUnlocked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {isPremiumUnlocked ? '✨ Infinite slots' : 'Upgrade Slot ($4.99)'}
                  </button>
                )}
              </div>
            </div>

            {/* ERROR REPORTING */}
            {moderationError && (
              <p className="text-center text-xs font-extrabold text-red-500 animate-pulse bg-red-50 p-2.5 rounded-xl border border-red-100">
                {moderationError}
              </p>
            )}

            {/* CORE ACTIONS */}
            <div className="pt-2 flex gap-3 select-none">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                Apply Styles
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isModerating}
                className="flex-grow py-3.5 bg-[#FE6349] hover:opacity-95 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isModerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish & Send card</span>
                    <Sparkles className="w-4 h-4 fill-white" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. EXPANDED FULL-PAGE WORKSPACE EDITOR (Matches attached design image input_file_0.png) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[3000] bg-[#FCF9F8] flex flex-col font-sans select-none overflow-hidden animate-fade-in-slow">
          
          {/* A. TOP HEADER */}
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between relative shrink-0">
            {/* Top row: Close X button on left, Title in center */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-[#1A1B25] hover:bg-black/5 p-2 rounded-full transition-all active:scale-95 cursor-pointer"
              aria-label="Close expanded editor"
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>

            <h2 className="text-xl font-bold text-[#1A1B25] tracking-tight">
              Drop a message
            </h2>

            <div className="w-10" />
          </div>

          {/* B. SUB-HEADER / ACTION CONTROL BAR */}
          <div className="px-6 py-3 flex items-center justify-between shrink-0">
            <button 
              onClick={() => setIsExpanded(false)}
              className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full text-gray-800 transition-all cursor-pointer"
              aria-label="Back to default view"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2.5">
              {/* Save button */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="h-9 inline-flex items-center justify-center bg-white hover:bg-gray-50 text-[#1A1B25] text-xs font-bold px-4 rounded-full transition-all cursor-pointer active:scale-95"
              >
                Save
              </button>
            </div>
          </div>

          {/* C. DISTRACTION-FREE CANVAS WORKSPACE */}
          <div className="flex-grow w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
            
            {/* Outer frame matching design specs */}
            <div 
              style={{ 
                backgroundColor: (activeType === 'audio' || activeType === 'video') ? '#ffffff' : selectedFrame.bgHex,
                height: 'min(500px, 60vh)'
              }}
              className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-300 flex items-center justify-center p-4 sm:p-6 select-none shadow-sm max-w-[380px]"
            >
              {/* Inner white card canvas */}
              <div 
                onClick={() => setSelectedElementId(null)}
                className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white flex flex-col justify-between relative p-4 sm:p-6 transition-all duration-300 shadow-xs max-w-full max-h-full w-[254px] h-[360px] overflow-hidden cursor-default"
              >
                {/* Confetti Animation Overlay */}
                <ConfettiOverlay type={selectedConfetti} />
                {/* Full Canvas Layer: Treats entire component as canvas area with zero internal clipping bounds */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-10">
                  {activeType === 'text' && (
                    <>
                      {(() => {
                        const visibleElements = canvasElements.filter(hasElementContent);
                        if (visibleElements.length === 0) {
                          return null;
                        }
                        return visibleElements.map((el) => (
                          <RenderCanvasElement
                            key={el.id}
                            el={el}
                            isSelected={selectedElementId === el.id}
                            onSelect={(id) => setSelectedElementId(id)}
                            onEdit={(id) => setEditingElementId(id)}
                            onUpdate={updateCanvasElement}
                          />
                        ));
                      })()}
                    </>
                  )}
                </div>

                {/* Recipient tag */}
                <div className="w-full flex justify-end items-center pr-1 relative z-20 pointer-events-none select-none">
                  {activeType === 'text' && recipient.trim() ? (
                    <span className="text-[10px] font-extrabold text-[#A4ABB8] uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 max-w-[130px] truncate pointer-events-auto">
                      {recipient}
                    </span>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>

                {/* Central placeholder for audio/video if active */}
                <div className="flex-grow flex flex-col items-center justify-center text-center py-2 relative z-0 w-full gap-2 pointer-events-none">
                  {activeType === 'audio' && (
                    <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
                      <Mic className="w-12 h-12 stroke-[1.5]" style={{ color: '#EED8CE' }} />
                      <h3 className="text-base font-semibold text-[#272835]">Audio coming soon</h3>
                    </div>
                  )}

                  {activeType === 'video' && (
                    <div className="w-full flex flex-col items-center justify-center gap-2 select-none">
                      <Video className="w-12 h-12 stroke-[1.5]" style={{ color: '#EED8CE' }} />
                      <h3 className="text-base font-semibold text-[#272835]">Video coming soon</h3>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                {activeType === 'text' ? (
                  <div className="w-full flex justify-between items-center select-none pt-1 relative z-20 pointer-events-none">
                    <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest">
                      {authorName.trim() ? `By ${authorName}` : ''}
                    </span>
                    {selectedHearts.length > 0 && (
                      <div className="flex gap-1 bg-gray-50/70 p-1.5 rounded-full">
                        {selectedHearts.map(id => (
                          <span key={id} className="text-xs">
                            {SEMANTIC_HEARTS.find(h => h.id === id)?.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            </div>

          </div>

          {/* D. BOTTOM EDITING CONTROLS BAR (Exclusive to Text tab) */}
          {activeType === 'text' && (
            <div className="w-full pb-8 pt-2 px-6 flex flex-col items-center gap-3 shrink-0">
              
              {/* Row of 4 tool buttons: Image | Text | Vector | BG */}
              <div className="flex items-center justify-center gap-3 md:gap-4 max-w-full overflow-x-auto py-1 px-2">
                {/* 1. Image */}
                <button
                  type="button"
                  onClick={handleAddImageElement}
                  className="bg-white border border-dashed border-gray-200/80 hover:bg-gray-50 rounded-2xl w-[64px] h-[58px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Add new Image element"
                >
                  <ImageIcon className="w-4 h-4 text-[#1A1B25]" />
                  <span className="text-[11px] font-medium text-gray-700">Image</span>
                </button>

                {/* 2. Text */}
                <button
                  type="button"
                  onClick={handleAddTextElement}
                  className="bg-white border border-dashed border-gray-200/80 hover:bg-gray-50 rounded-2xl w-[64px] h-[58px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Add new Text element"
                >
                  <Type className="w-4 h-4 text-[#1A1B25]" />
                  <span className="text-[11px] font-medium text-gray-700">Text</span>
                </button>

                {/* 3. Vector */}
                <button
                  type="button"
                  onClick={handleAddVectorElement}
                  className="bg-white border border-dashed border-gray-200/80 hover:bg-gray-50 rounded-2xl w-[64px] h-[58px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Add new Vector element"
                >
                  <Sparkles className="w-4 h-4 text-[#1A1B25]" />
                  <span className="text-[11px] font-medium text-gray-700">Vector</span>
                </button>

                {/* 4. BG */}
                <button
                  type="button"
                  onClick={handleAddBgElement}
                  className="bg-white border border-dashed border-gray-200/80 hover:bg-gray-50 rounded-2xl w-[64px] h-[58px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Add new BG element"
                >
                  <Palette className="w-4 h-4 text-[#1A1B25]" />
                  <span className="text-[11px] font-medium text-gray-700">BG</span>
                </button>

                {/* 5. Confetti */}
                <button
                  type="button"
                  onClick={() => setIsConfettiPickerOpen(true)}
                  className="bg-white border border-dashed border-gray-200/80 hover:bg-gray-50 rounded-2xl w-[64px] h-[58px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 text-[#1A1B25]"
                  title="Choose Confetti Animation"
                >
                  <PartyPopper className="w-4 h-4 text-[#1A1B25]" />
                  <span className="text-[11px] font-medium text-gray-700">
                    Confetti
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* EDIT ELEMENT POP-UP MODAL */}
          {editingElement && (
            <div 
              className="fixed inset-0 z-[4000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
              onClick={(e) => {
                if (e.target === e.currentTarget) setEditingElementId(null);
              }}
            >
              {editingElement.type === 'vector' ? (
                <VectorPicker
                  selectedIconId={editingElement.vectorId || 'heart'}
                  vectorColor={editingElement.vectorColor || '#272835'}
                  onSelectVector={(item) => {
                    updateEditingElement({
                      vectorId: item.id,
                      vectorName: item.name,
                    });
                  }}
                  onColorChange={(color) => {
                    updateEditingElement({
                      vectorColor: color,
                    });
                  }}
                  onDelete={() => handleDeleteElement(editingElement.id)}
                  onClose={() => setEditingElementId(null)}
                  onContinue={() => setEditingElementId(null)}
                />
              ) : (
                <div className="bg-white rounded-[1.8rem] sm:rounded-[2.5rem] max-w-md w-full max-h-[90dvh] sm:max-h-[85vh] p-4 sm:p-6 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200 font-sans overflow-hidden my-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 flex-shrink-0">
                  <h3 className="text-xl font-bold text-[#1A1B25]">
                    {editingElement.type === 'text' ? 'Text' : editingElement.type === 'bg' ? 'Background' : editingElement.type.charAt(0).toUpperCase() + editingElement.type.slice(1)}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDeleteElement(editingElement.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete element"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingElementId(null)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:text-[#1A1B25] hover:bg-gray-100 transition-all cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100/80 -mt-1 mb-3 flex-shrink-0" />

                {/* Content based on element type - scrollable body */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
                  {editingElement.type === 'text' && (
                    <div className="flex flex-col gap-3.5">
                      {/* Main Text Input Box with internal Template & Refine toolbar */}
                      <div className="bg-[#F6F8FA] rounded-2xl p-4 flex flex-col justify-between min-h-[210px] relative border border-transparent focus-within:border-gray-200/80 transition-all">
                        <textarea
                          value={editingElement.text || ''}
                          onChange={(e) => {
                            const txt = e.target.value.slice(0, 250);
                            updateEditingElement({ text: txt });
                            setContent(txt);
                          }}
                          placeholder="Type here......"
                          style={{
                            fontFamily: editingElement.fontFamily || (editingElement.isCursive ? 'Playfair Display, cursive' : 'Nunito, sans-serif'),
                            color: editingElement.color || '#1A1B25',
                            textAlign: editingElement.align || 'left',
                          }}
                          className="w-full h-28 bg-transparent text-[#1A1B25] text-base font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none resize-none border-none p-0"
                        />

                        {/* Templates Popup Drawer */}
                        {activeAccordion === 'template' && (
                          <div className="absolute inset-x-2 top-2 bottom-12 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg z-20 flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
                              <span className="text-xs font-bold text-gray-800">Choose Text Template</span>
                              <button
                                type="button"
                                onClick={() => setActiveAccordion(null)}
                                className="text-gray-400 hover:text-gray-700 p-0.5 rounded-full"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex-grow overflow-y-auto space-y-1.5 pr-1">
                              {TEXT_TEMPLATES.map((tmpl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    updateEditingElement({ text: tmpl });
                                    setContent(tmpl);
                                    setActiveAccordion(null);
                                  }}
                                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-gray-800 hover:bg-orange-50 hover:text-[#FF6B4A] transition-colors cursor-pointer border border-transparent hover:border-orange-100"
                                >
                                  "{tmpl}"
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom Toolbar inside Text Area */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                          <button
                            type="button"
                            onClick={() => toggleAccordion('template')}
                            className={`bg-white hover:bg-gray-50 text-[#1A1B25] font-semibold text-xs px-4 py-1.5 rounded-full shadow-2xs border transition-all cursor-pointer ${
                              activeAccordion === 'template' ? 'border-[#FF6B4A] text-[#FF6B4A]' : 'border-gray-200/80'
                            }`}
                          >
                            Template
                          </button>

                          <button
                            type="button"
                            disabled={isRefining || !editingElement.text?.trim()}
                            onClick={async () => {
                              if (!editingElement.text?.trim()) return;
                              setIsRefining(true);
                              try {
                                const refined = await refineText(editingElement.text);
                                if (refined) {
                                  updateEditingElement({ text: refined });
                                  setContent(refined);
                                }
                              } catch (err) {
                                console.error("Refine error:", err);
                              } finally {
                                setIsRefining(false);
                              }
                            }}
                            className="bg-white hover:bg-rose-50 text-[#1A1B25] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-2xs border border-rose-200/80 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95 text-rose-600"
                          >
                            {isRefining ? (
                              <Loader2 className="w-3.5 h-3.5 text-[#FF6B4A] animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                            )}
                            <span>{isRefining ? 'Refining...' : 'Refine'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Select Font Accordion Card */}
                      <div className="bg-[#F6F8FA] rounded-2xl p-4 flex flex-col gap-2 transition-all">
                        <div 
                          onClick={() => toggleAccordion('font')}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <span className="text-sm font-bold text-[#1A1B25]">Select Font</span>
                          <div className="flex items-center gap-2">
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${activeAccordion === 'font' ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {activeAccordion === 'font' && (
                          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-200/60 animate-in fade-in duration-150">
                            {FONT_OPTIONS.map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  const isCurs = f.id === 'playfair' || f.id === 'caveat';
                                  updateEditingElement({ fontFamily: f.font, isCursive: isCurs });
                                  setIsCursive(isCurs);
                                }}
                                style={{ fontFamily: f.font }}
                                className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all border cursor-pointer ${
                                  editingElement.fontFamily === f.font || (!editingElement.fontFamily && f.id === 'nunito')
                                    ? 'bg-white border-[#FF6B4A] text-[#FF6B4A] shadow-2xs'
                                    : 'bg-white/60 border-transparent text-gray-700 hover:bg-white'
                                }`}
                              >
                                {f.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Alignment Option Card */}
                      <div className="bg-[#F6F8FA] rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1A1B25]">Alignment</span>
                        <div className="flex items-center gap-1.5 bg-gray-200/40 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => updateEditingElement({ align: 'left' })}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              (editingElement.align || 'left') === 'left' ? 'bg-white text-[#1A1B25] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                            }`}
                            title="Left Align"
                          >
                            <AlignLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateEditingElement({ align: 'center' })}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              editingElement.align === 'center' ? 'bg-white text-[#1A1B25] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                            }`}
                            title="Center Align"
                          >
                            <AlignCenter className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateEditingElement({ align: 'right' })}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              editingElement.align === 'right' ? 'bg-white text-[#1A1B25] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                            }`}
                            title="Right Align"
                          >
                            <AlignRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateEditingElement({ align: 'justify' })}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              editingElement.align === 'justify' ? 'bg-white text-[#1A1B25] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                            }`}
                            title="Justify Align"
                          >
                            <AlignJustify className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Choose Colour Accordion Card */}
                      <ChooseColor
                        label="Choose Colour"
                        selectedColor={editingElement.color || '#1A1B25'}
                        onChangeColor={(hex) => updateEditingElement({ color: hex })}
                        isOpen={activeAccordion === 'color'}
                        onToggleOpen={() => toggleAccordion('color')}
                      />
                    </div>
                  )}

                  {editingElement.type === 'image' && (
                  <div className="flex flex-col gap-3.5">
                    {/* Image Preview Box */}
                    <div className="bg-[#F8F9FB] rounded-2xl h-[180px] flex flex-col items-center justify-center p-3 text-center overflow-hidden relative">
                      {editingElement.imageUrl ? (
                        <img 
                          src={editingElement.imageUrl} 
                          alt="Uploaded" 
                          style={{
                            borderRadius: `${editingElement.cornerRadius || 0}px`,
                            border: editingElement.strokeEnabled ? `${editingElement.strokeWidth ?? 3}px solid ${editingElement.strokeColor || '#FF6B4A'}` : 'none',
                          }}
                          className="max-h-full max-w-full object-contain shadow-xs transition-all" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                          <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                          <span className="text-sm font-medium text-gray-400">No image uploaded yet</span>
                        </div>
                      )}
                    </div>

                    {/* Image Controls Section */}
                    <div className="flex flex-col gap-3 bg-[#F6F8FA] p-3.5 rounded-2xl">
                      
                      {/* 1. Corner Radius Control */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1A1B25]">Corner Radius</span>
                          <span className="text-xs font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                            {editingElement.cornerRadius || 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={editingElement.cornerRadius || 0}
                          onChange={(e) => updateEditingElement({ cornerRadius: Number(e.target.value) })}
                          className="w-full accent-[#FF6B4A] cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                        />
                      </div>

                      <div className="w-full h-px bg-gray-200/60" />

                      {/* 2. Stroke / Outline Control */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1A1B25]">Stroke / Outline</span>
                          <button
                            type="button"
                            onClick={() => updateEditingElement({ strokeEnabled: !editingElement.strokeEnabled })}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                              editingElement.strokeEnabled ? 'bg-[#FF6B4A]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                editingElement.strokeEnabled ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {editingElement.strokeEnabled && (
                          <div className="flex flex-col gap-2.5 pt-1 animate-in fade-in duration-150">
                            {/* Stroke Color Picker */}
                            <ChooseColor
                              label="Stroke Color"
                              selectedColor={editingElement.strokeColor || '#FF6B4A'}
                              onChangeColor={(hex) => updateEditingElement({ strokeColor: hex })}
                              isAccordion={false}
                            />

                            {/* Stroke Weight Slider */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-gray-500">Stroke Weight</span>
                                <span className="text-xs font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                                  {editingElement.strokeWidth ?? 3}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="16"
                                value={editingElement.strokeWidth ?? 3}
                                onChange={(e) => updateEditingElement({ strokeWidth: Number(e.target.value) })}
                                className="w-full accent-[#FF6B4A] cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Change / Upload Image */}
                    <label className="w-full py-3 bg-[#ffffff] border border-[#F6F8FA] outline outline-1 outline-[#F6F8FA] hover:bg-gray-50 text-[#1A1B25] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shadow-2xs">
                      <Upload className="w-4 h-4 text-[#1A1B25]" />
                      <span>{editingElement.imageUrl ? 'Change Image' : 'Upload Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const imgUrl = reader.result as string;
                              updateEditingElement({ imageUrl: imgUrl });
                              setUploadedImage(imgUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteElement(editingElement.id)}
                        className="w-1/3 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-2xl transition-all cursor-pointer text-center"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingElementId(null)}
                        className="flex-grow py-3 bg-[#FF6B4A] hover:bg-[#ff5833] active:bg-[#e05234] text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-sm active:scale-[0.99] text-center"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {editingElement.type === 'bg' && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Canvas Theme</span>
                    <div className="grid grid-cols-2 gap-3 p-1">
                      {FRAME_TEMPLATES.map((frame) => (
                        <button
                          key={frame.id}
                          type="button"
                          onClick={() => {
                            updateEditingElement({ bgHex: frame.bgHex, frameName: frame.name });
                            setSelectedFrame(frame);
                          }}
                          className={`h-16 rounded-2xl transition-all border-2 flex flex-col items-center justify-center p-2 cursor-pointer ${
                            (editingElement.bgHex || selectedFrame.bgHex) === frame.bgHex ? 'border-[#FF6B4A] scale-105 shadow-md' : 'border-transparent hover:scale-102'
                          }`}
                          style={{ backgroundColor: frame.bgHex }}
                        >
                          <span className={`text-xs font-bold ${frame.id === 'slate' ? 'text-white' : 'text-gray-800'}`}>{frame.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteElement(editingElement.id)}
                        className="w-1/3 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-2xl transition-all cursor-pointer text-center"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingElementId(null)}
                        className="flex-grow py-3 bg-[#FF6B4A] hover:bg-[#ff5833] active:bg-[#e05234] text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-sm active:scale-[0.99] text-center"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                </div>

                {/* Fixed Footer for Text */}
                {editingElement.type === 'text' && (
                  <div className="bg-[#F9F5F3] -mx-6 -mb-6 p-6 rounded-b-[2rem] sm:rounded-b-[2.5rem] mt-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingElementId(null)}
                      className="w-full py-3.5 bg-[#FF6B4A] hover:bg-[#ff5833] active:scale-[0.99] text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer text-center"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>
          )}

        </div>
      )}

      {/* Hidden file input for image tool button */}
      <input 
        ref={imageInputRef}
        type="file" 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const imgUrl = reader.result as string;
              updateEditingElement({ imageUrl: imgUrl });
              setUploadedImage(imgUrl);
            };
            reader.readAsDataURL(file);
          }
        }} 
        className="hidden" 
      />

      {/* CONFETTI PICKER POP-UP MODAL */}
      {isConfettiPickerOpen && (
        <ConfettiPickerModal
          selectedConfetti={selectedConfetti}
          onSelectConfetti={(type) => setSelectedConfetti(type)}
          onClose={() => setIsConfettiPickerOpen(false)}
        />
      )}

      {/* 6. MESSAGE PREVIEW PAGE (Matches attached design image) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[5000] bg-[#FCF9F8] flex flex-col font-sans select-none overflow-hidden animate-fade-in antialiased h-full">
          {/* Top Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-100/80 flex items-center justify-between shrink-0 sticky top-0 z-10">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="text-[#1A1B25] hover:bg-gray-100 p-2 rounded-full transition-all cursor-pointer active:scale-95"
              aria-label="Close preview"
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>

            <h2 className="text-xl font-bold text-[#1A1B25] tracking-tight">
              Message Preview
            </h2>

            <div className="w-10" />
          </div>

          {/* Body content wrapper */}
          <div className="flex-1 w-full flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden my-auto">
            <div className="max-w-[420px] w-full h-full max-h-[calc(100vh-80px)] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col font-sans relative overflow-hidden">
              
              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 scrollbar-none">
                {/* Message Visual Card Frame */}
                <div
                  style={{ backgroundColor: selectedFrame.bgHex }}
                  className="w-full aspect-[380/474] sm:h-[404px] sm:aspect-auto rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex items-center justify-center relative overflow-hidden shadow-2xs transition-all shrink-0"
                >
                  <CanvasReadOnlyCard
                    canvasElements={canvasElements}
                    selectedConfetti={selectedConfetti}
                    content={content}
                    uploadedImage={uploadedImage}
                    authorName={authorName}
                    recipient={recipient}
                    selectedHearts={selectedHearts}
                    activeType={activeType}
                  />
                </div>

                {/* 1. Caption Input */}
                <div className="bg-[#F6F8FA] rounded-2xl px-4 py-3 flex items-center border border-transparent focus-within:border-gray-200 transition-all">
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Caption"
                    className="w-full bg-transparent text-sm text-[#1A1B25] placeholder:text-gray-400 focus:outline-none border-none p-0 font-normal"
                  />
                </div>

                {/* 2. Select Event Dropdown Accordion */}
                <div className="bg-[#F6F8FA] rounded-2xl overflow-hidden transition-all duration-200 border border-transparent">
                  <button
                    type="button"
                    onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                    className="w-full px-4 py-3.5 flex items-center justify-between transition-colors cursor-pointer text-left hover:bg-gray-100/50"
                  >
                    <span className={`text-sm ${selectedEventType ? 'text-[#1A1B25] font-medium' : 'text-gray-400 font-normal'}`}>
                      {selectedEventType || 'Select event'}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isEventDropdownOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isEventDropdownOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-200/50 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {EVENT_TYPES.map((evt) => {
                        const isSelected = selectedEventType === evt;
                        return (
                          <button
                            key={evt}
                            type="button"
                            onClick={() => {
                              setSelectedEventType(isSelected ? '' : evt);
                              setIsEventDropdownOpen(false);
                            }}
                            className="bg-white rounded-2xl p-3 flex items-center gap-2.5 transition-all cursor-pointer border-0 text-left shadow-2xs hover:bg-gray-50/80 active:scale-[0.98]"
                          >
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                            )}
                            <span className={`text-xs font-medium ${isSelected ? 'text-[#1A1B25] font-semibold' : 'text-gray-700'}`}>
                              {evt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Recipients Input Tag Box */}
                <div className="bg-[#F6F8FA] rounded-2xl px-4 py-3 flex items-center justify-between gap-2 border border-transparent focus-within:border-gray-200 transition-all">
                  <input
                    type="text"
                    value={newRecipientInput}
                    onChange={(e) => setNewRecipientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newRecipientInput.trim()) {
                        e.preventDefault();
                        const val = newRecipientInput.trim();
                        const tag = val.startsWith('@') || val.startsWith('#') ? val : `@${val}`;
                        if (!recipients.includes(tag)) {
                          setRecipients([...recipients, tag]);
                        }
                        setNewRecipientInput('');
                      }
                    }}
                    placeholder="Add more recipient or #tag"
                    className="flex-1 bg-transparent text-sm text-[#1A1B25] placeholder:text-gray-400 focus:outline-none border-none p-0 font-normal min-w-[100px]"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {recipients.map((rec) => (
                      <span
                        key={rec}
                        className="bg-white text-xs font-medium text-[#1A1B25] px-2.5 py-1 rounded-full border border-gray-200/60 flex items-center gap-1 shadow-2xs"
                      >
                        {rec}
                        {rec !== '@you' && (
                          <button
                            type="button"
                            onClick={() => setRecipients(recipients.filter(r => r !== rec))}
                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Select Board Capacity Accordion */}
                <div className="bg-[#F6F8FA] rounded-2xl overflow-hidden transition-all duration-200 border border-transparent">
                  <button
                    type="button"
                    onClick={() => setIsCapacityModalOpen(!isCapacityModalOpen)}
                    className="w-full px-4 py-3.5 flex items-center justify-between transition-colors cursor-pointer text-left hover:bg-gray-100/50"
                  >
                    <span className="text-sm font-normal text-[#1A1B25]">Select board capacity</span>
                    <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                      {boardCapacity === 'collaborative' ? '20 Curation' : 'Only me'}
                      <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isCapacityModalOpen ? 'rotate-90' : ''}`} />
                    </span>
                  </button>

                  {isCapacityModalOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-200/50 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {/* Option 1: Only me */}
                      <button
                        type="button"
                        onClick={() => {
                          setBoardCapacity('solo');
                          setIsCapacityModalOpen(false);
                        }}
                        className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border-0 text-left hover:bg-gray-50/80 active:scale-[0.99] shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {boardCapacity === 'solo' ? (
                            <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-[#1A1B25]">Only me</span>
                        </div>
                      </button>

                      {/* Option 2: 20 contributors */}
                      <button
                        type="button"
                        onClick={() => {
                          setBoardCapacity('collaborative');
                          setIsCapacityModalOpen(false);
                        }}
                        className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border-0 text-left hover:bg-gray-50/80 active:scale-[0.99] shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {boardCapacity === 'collaborative' ? (
                            <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-[#1A1B25]">20 contributors</span>
                        </div>
                        <span className="text-xs font-semibold text-[#1A1B25]">Free</span>
                      </button>

                      {/* Option 3: 200 contributors (Coming soon) */}
                      <div className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between border-0 text-left shadow-2xs opacity-80">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          <span className="text-sm font-medium text-gray-400">200 contributors</span>
                        </div>
                        <span className="bg-[#ECEFF3] text-[#666D80] text-[11px] font-semibold px-2.5 py-1 rounded-full">Coming soon</span>
                      </div>

                      {/* Option 4: 1000 contributors (Coming soon) */}
                      <div className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between border-0 text-left shadow-2xs opacity-80">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          <span className="text-sm font-medium text-gray-400">1000 contributors</span>
                        </div>
                        <span className="bg-[#ECEFF3] text-[#666D80] text-[11px] font-semibold px-2.5 py-1 rounded-full">Coming soon</span>
                      </div>

                      {/* Option 5: 1000 curation (Coming soon) */}
                      <div className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between border-0 text-left shadow-2xs opacity-80">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          <span className="text-sm font-medium text-gray-400">1000 curation</span>
                        </div>
                        <span className="bg-[#ECEFF3] text-[#666D80] text-[11px] font-semibold px-2.5 py-1 rounded-full">Coming soon</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Privacy Settings Accordion */}
                <div className="bg-[#F6F8FA] rounded-2xl overflow-hidden transition-all duration-200 border border-transparent">
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(!isPrivacyModalOpen)}
                    className="w-full px-4 py-3.5 flex items-center justify-between transition-colors cursor-pointer text-left hover:bg-gray-100/50"
                  >
                    <span className="text-sm font-normal text-[#1A1B25]">Privacy</span>
                    <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                      {privacyLayer === PostVisibility.PUBLIC ? 'Public' :
                       privacyLayer === PostVisibility.PRIVATE ? 'Recipient Only' : 'Public (Anonymous)'}
                      <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isPrivacyModalOpen ? 'rotate-90' : ''}`} />
                    </span>
                  </button>

                  {isPrivacyModalOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-200/50 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {/* Public */}
                      <button
                        type="button"
                        onClick={() => {
                          setPrivacyLayer(PostVisibility.PUBLIC);
                          setIsPrivacyModalOpen(false);
                        }}
                        className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border-0 text-left hover:bg-gray-50/80 active:scale-[0.99] shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {privacyLayer === PostVisibility.PUBLIC ? (
                            <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1A1B25]">Public</p>
                            <p className="text-xs text-gray-400 mt-0.5">Visible to everyone.</p>
                          </div>
                        </div>
                      </button>

                      {/* Recipient Only */}
                      <button
                        type="button"
                        onClick={() => {
                          setPrivacyLayer(PostVisibility.PRIVATE);
                          setIsPrivacyModalOpen(false);
                        }}
                        className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border-0 text-left hover:bg-gray-50/80 active:scale-[0.99] shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {privacyLayer === PostVisibility.PRIVATE ? (
                            <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1A1B25]">Recipient Only</p>
                            <p className="text-xs text-gray-400 mt-0.5">Only tagged recipients can view it.</p>
                          </div>
                        </div>
                      </button>

                      {/* Public (Anonymous) */}
                      <button
                        type="button"
                        onClick={() => {
                          setPrivacyLayer(PostVisibility.ANONYMOUS);
                          setIsPrivacyModalOpen(false);
                        }}
                        className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border-0 text-left hover:bg-gray-50/80 active:scale-[0.99] shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {privacyLayer === PostVisibility.ANONYMOUS ? (
                            <div className="w-5 h-5 rounded-full bg-[#38A169] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1A1B25]">Public (Anonymous)</p>
                            <p className="text-xs text-gray-400 mt-0.5">Visible to everyone, but hide creator's surname.</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Error reporting */}
                {moderationError && (
                  <p className="text-center text-xs font-extrabold text-red-500 animate-pulse bg-red-50 p-2.5 rounded-xl border border-red-100">
                    {moderationError}
                  </p>
                )}
              </div>

              {/* Fixed CTA Footer Section */}
              <div className="p-4 sm:p-5 bg-white border-t border-gray-100/80 shrink-0 sticky bottom-0 z-20">
                <button
                  type="button"
                  onClick={handleFinalSubmitMessage}
                  disabled={isModerating || !selectedEventType}
                  className={`w-full font-medium text-base py-3.5 rounded-full transition-all shadow-2xs flex items-center justify-center gap-2 ${
                    !selectedEventType || isModerating
                      ? 'bg-[#F8CBBF] text-white opacity-60 cursor-not-allowed'
                      : 'bg-[#FE6349] hover:bg-[#e05234] text-white cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  {isModerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Full Page Confirmation Modal for Published Appreciation Card */}
      {createdPostConfirmation && (
        <div className="fixed inset-0 z-[3500] bg-[#FCF9F8] flex flex-col items-center justify-between p-6 sm:p-10 font-sans select-none animate-in fade-in duration-300 overflow-y-auto">
          <ConfettiOverlay active={true} type={createdPostConfirmation.confetti || "heart"} />
          
          {/* Top Header with Close */}
          <div className="w-full max-w-md flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FE6349] fill-[#FE6349]" />
              <span className="text-sm font-extrabold text-[#1A1B25] tracking-tight">Heartboard</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCreatedPostConfirmation(null);
                setIsPreviewOpen(false);
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-100 hover:bg-gray-50 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Body Content */}
          <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center text-center py-6 my-auto z-10">
            <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 relative shadow-xs animate-bounce">
              <span className="text-5xl">💌</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-xs border border-gray-100">
                <Sparkles className="w-4 h-4 fill-[#FE6349] text-[#FE6349]" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1B25] tracking-tight mb-2">
              Appreciation Sent! 💖
            </h2>
            <p className="text-sm font-medium text-gray-500 max-w-xs mb-6">
              Your heartfelt tribute has been published and delivered to <strong className="text-[#1A1B25] font-bold">{createdPostConfirmation.targetId || createdPostConfirmation.recipients?.[0] || 'the recipient'}</strong>!
            </p>

            {/* Tribute Card Summary Badge */}
            <div className="w-full bg-white rounded-3xl p-5 border border-gray-100/80 shadow-xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Recipient</span>
                  <p className="text-sm font-extrabold text-[#1A1B25]">{createdPostConfirmation.targetId || '@recipient'}</p>
                </div>
                {createdPostConfirmation.eventType && (
                  <span className="bg-rose-50 text-[#FE6349] text-xs font-bold px-3 py-1 rounded-full border border-rose-100">
                    {createdPostConfirmation.eventType}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 font-medium line-clamp-3 italic bg-[#F8F9FB] p-3 rounded-2xl">
                "{createdPostConfirmation.content}"
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-gray-400 font-semibold">Visibility</span>
                <span className="font-bold text-[#1A1B25] capitalize">{createdPostConfirmation.targetType || 'Board'} ({privacyLayer})</span>
              </div>
            </div>
          </div>

          {/* Bottom Fixed Action Buttons */}
          <div className="w-full max-w-md space-y-3 pt-4 shrink-0 z-10">
            <button
              type="button"
              onClick={() => {
                setCreatedPostConfirmation(null);
                setIsPreviewOpen(false);
                onClose();
              }}
              className="w-full py-4 rounded-full bg-[#FE6349] hover:bg-[#e05234] text-white font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              View on Heartboard
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatedPostConfirmation(null);
                setIsPreviewOpen(false);
                setContent('');
                setRecipient('');
                setCaption('');
              }}
              className="w-full py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1A1B25] font-bold text-sm transition-all cursor-pointer"
            >
              Create Another Card
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
