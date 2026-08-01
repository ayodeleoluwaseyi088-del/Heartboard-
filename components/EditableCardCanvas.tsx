import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Post } from '../types';

interface EditableCardCanvasProps {
  post?: Partial<Post> & {
    theme?: string;
    sticker?: string;
    mediaUrl?: string;
    content?: string;
  };
  children?: React.ReactNode;
  initialBgColor?: string;
  className?: string;
  onBgColorChange?: (newColor: string) => void;
  isEditable?: boolean;
}

// Preset Frame Background Palette Colors
export const FRAME_PALETTE_COLORS = [
  { id: 'peach', hex: '#FAF0EC', label: 'Cozy Peach' },
  { id: 'midnight', hex: '#1A1B25', label: 'Midnight Ink' },
  { id: 'amber', hex: '#F7B238', label: 'Sun Amber' },
  { id: 'teal', hex: '#149B88', label: 'Deep Teal' },
  { id: 'lime', hex: '#BEE27C', label: 'Fresh Lime' },
  { id: 'lavender', hex: '#EEF1FA', label: 'Soft Lavender' },
  { id: 'rose', hex: '#FDF4F2', label: 'Blush Rose' },
  { id: 'pure_white', hex: '#FFFFFF', label: 'Clean White' },
];

// Concentric Circular Vector Pattern matching Heartboard design language
export const ConcentricRingsBg: React.FC<{ isDark?: boolean }> = ({ isDark }) => (
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

/**
 * EditableCardCanvas
 * Standalone, editable background canvas container component that houses card elements.
 * Features customizable outer frame background colors and inner canvas rendering.
 */
export const EditableCardCanvas: React.FC<EditableCardCanvasProps> = ({
  post,
  children,
  initialBgColor,
  className = '',
  onBgColorChange,
  isEditable = true,
}) => {
  // Determine default initial color from post theme or fallback
  const defaultColor = initialBgColor || 
    (post?.theme && post.theme.startsWith('#') ? post.theme : '#FAF0EC');

  const [bgColor, setBgColor] = useState<string>(defaultColor);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const handleSelectColor = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBgColor(hex);
    if (onBgColorChange) {
      onBgColorChange(hex);
    }
  };

  const isDarkTheme = bgColor === '#1A1B25' || bgColor === '#272835';

  return (
    <div className={`relative group/canvas w-full h-full ${className}`}>
      {/* 
        OUTER FRAME: Standalone background container with frame fill
      */}
      <div 
        className="relative overflow-hidden rounded-[2.5rem] p-5 aspect-[380/474] flex flex-col justify-between transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Concentric vector background pattern */}
        <ConcentricRingsBg isDark={isDarkTheme} />

        {/* Floating Quick Background Color Edit Button (Visible on Hover/Interaction) */}
        {isEditable && (
          <div className="absolute top-3 right-3 z-30 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(prev => !prev);
              }}
              title="Edit Background Frame Color"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1A1B25] hover:bg-white transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Popover Background Color Swatches */}
            {showColorPicker && (
              <div 
                className="absolute top-10 right-0 z-40 bg-white p-2 rounded-2xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {FRAME_PALETTE_COLORS.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => handleSelectColor(item.hex, e)}
                    title={item.label}
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 relative"
                    style={{ backgroundColor: item.hex }}
                  >
                    {bgColor === item.hex && (
                      <Check className={`w-3 h-3 ${item.hex === '#FFFFFF' || item.hex === '#FAF0EC' || item.hex === '#EEF1FA' || item.hex === '#FDF4F2' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 
          INNER CANVAS CONTAINER: The actual message / content layout sitting on top of the background frame
        */}
        <div className="relative z-10 w-full h-full bg-white rounded-[2rem] p-5 flex flex-col justify-between overflow-hidden">
          {children ? (
            children
          ) : (
            <>
              {/* Default Content layout if children not passed */}
              {post?.sticker && (
                <div className="flex items-center justify-start w-full select-none">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-lg">
                    {post.sticker === 'heart_bubble' ? '❤️' :
                     post.sticker === 'star_glow' ? '⭐' :
                     post.sticker === 'medal_trophy' ? '🏆' :
                     post.sticker === 'party_celebrate' ? '🎉' : '😊'}
                  </div>
                </div>
              )}

              <div className="flex-grow flex flex-col justify-center my-2 relative overflow-hidden rounded-xl">
                {post?.mediaUrl ? (
                  <div className="relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden bg-gray-50">
                    <img 
                      src={post.mediaUrl} 
                      className="w-full h-full object-cover" 
                      alt={post.content || 'Curated tribute'} 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center px-1 text-right" style={{ direction: 'rtl' }}>
                    <p className="font-handwriting text-2xl text-gray-800 font-bold leading-snug">
                      "{post?.content}"
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableCardCanvas;
