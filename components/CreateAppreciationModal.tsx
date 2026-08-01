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
  Info,
  Sliders,
  Play,
  Square
} from 'lucide-react';
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

// Semantic Heart Spectrum matching the 6 screenshot items
interface SemanticHeart {
  id: string;
  label: string;
  details: string;
  emoji: string;
  bubbleColor: string;
}

const SEMANTIC_HEARTS: SemanticHeart[] = [
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

export const CreateAppreciationModal: React.FC<CreateAppreciationModalProps> = ({ onClose, onPostCreated }) => {
  const [activeType, setActiveType] = useState<'text' | 'audio' | 'video'>('text');
  
  // Customization & Core Information States
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [recipient, setRecipient] = useState('');
  
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate>(FRAME_TEMPLATES[0]);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem>(STICKER_LIST[0]);
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [isCursive, setIsCursive] = useState(true);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState<'portrait' | 'landscape'>('portrait');
  
  // Advanced variables
  const [privacyLayer, setPrivacyLayer] = useState<PostVisibility>(PostVisibility.PUBLIC);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  
  // Control States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHeartsOnlyPickerOpen, setIsHeartsOnlyPickerOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  
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
    const textToWrite = content.trim();
    if (!textToWrite && activeType === 'text') {
      setIsDrawerOpen(true); // Open settings to fill message
      return;
    }

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

      const finalRecipient = recipient.trim() || 'Curator Anchor (You)';
      
      const newPost: any = {
        id: 'post-' + Math.random().toString(36).substring(2, 11),
        authorName: authorName.trim() || 'Curator',
        content: safeTextCheck,
        type: activeType,
        mediaType: activeType === 'text' ? 'note' : activeType,
        targetId: finalRecipient.replace('#', ''),
        targetType: isHashtagRecipient ? EntityType.WALL : EntityType.BOARD,
        reactions: 0,
        createdAt: new Date().toISOString(),
        theme: selectedFrame.id === 'slate' ? 'bg-[#272835] text-white' : 
               selectedFrame.id === 'mint' ? 'bg-[#ECEFE6]' :
               selectedFrame.id === 'sunset' ? 'bg-[#FAF5E8]' :
               selectedFrame.id === 'lavender' ? 'bg-[#EEF1FA]' : 'bg-[#FAF0EC]',
        sticker: selectedSticker.id,
        sponsor: isCollaborative ? "Community Coauthored" : undefined,
      };

      // Enrich content with semantic hearts if set
      if (selectedHearts.length > 0) {
        const heartLabels = selectedHearts.map(id => SEMANTIC_HEARTS.find(h => h.id === id)?.label).filter(Boolean);
        newPost.content = `${newPost.content} (${heartLabels.join(', ')})`;
      }

      onPostCreated(newPost);
      onClose();
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
              onClick={() => { setActiveType('text'); setAudioUrl(null); }}
              className={`flex items-center gap-2 pb-3 px-1 transition-all text-[16px] font-semibold relative ${activeType === 'text' ? 'text-[#1A1B25]' : 'text-[#A4ABB8] hover:text-[#666D80]'}`}
            >
              <PenLine className="w-[20px] h-[20px]" />
              <span>Text</span>
              {activeType === 'text' && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#1A1B25] rounded-full" />
              )}
            </button>

            <button 
              onClick={() => { setActiveType('audio'); setContent(''); }}
              className={`flex items-center gap-2 pb-3 px-1 transition-all text-[16px] font-semibold relative ${activeType === 'audio' ? 'text-[#1A1B25]' : 'text-[#A4ABB8] hover:text-[#666D80]'}`}
            >
              <Mic className="w-[20px] h-[20px]" />
              <span>Audio</span>
              {activeType === 'audio' && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#1A1B25] rounded-full" />
              )}
            </button>

            <button 
              onClick={() => { setActiveType('video'); setAudioUrl(null); }}
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
      <div className="flex-grow w-full flex flex-col items-center justify-center pt-[48px] pb-12 px-6 bg-[#FCF9F8] gap-[12px]">
        
        {/* A. Outer Cozy Peach / Color Fill Preview Frame (Fixed Aspect Ratios) */}
        <div 
          onClick={() => activeType === 'text' && setIsDrawerOpen(true)}
          style={{ 
            backgroundColor: (activeType === 'audio' || activeType === 'video') ? '#ffffff' : selectedFrame.bgHex,
            // Desktop dimensions strictly enforced, dynamically scales with aspect design bounds
            width: '461px',
            height: '480px'
          }}
          className={`relative max-w-full rounded-[2.5rem] transition-all duration-300 flex items-center justify-center p-6 select-none border border-transparent ${
            activeType === 'text' 
              ? 'cursor-pointer group active:scale-[0.99] hover:border-gray-100' 
              : 'cursor-default'
          }`}
        >
          {/* Action indicator on hover */}
          {activeType === 'text' && (
            <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Sliders className="w-4 h-4 text-[#1A1B25]" />
            </div>
          )}

          {/* B. Center vertical white card */}
          <div 
            className="rounded-[2.2rem] bg-white flex flex-col justify-between relative p-6 w-[254px] h-[350px]"
          >
            {/* Recipient meta badge if recipient is filled, keeping it extremely subtle */}
            <div className="w-full flex justify-end items-center pr-1 select-none">
              {recipient.trim() ? (
                <span className="text-[10px] font-extrabold text-[#A4ABB8] uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 max-w-[130px] truncate">
                  {recipient}
                </span>
              ) : (
                <div className="h-6" /> // Empty space to protect layout alignment
              )}
            </div>

            {/* Central expression space */}
            <div className="flex-grow flex flex-col justify-center text-center py-4 relative">
              {activeType === 'text' && (
                <div>
                  {content.trim() ? (
                    <p className={`text-right font-bold text-gray-800 leading-snug break-words px-1 px-right text-right select-none ${isCursive ? 'handwriting text-3xl' : 'text-xl'}`} style={{ direction: 'rtl' }}>
                      "{content}"
                    </p>
                  ) : (
                    /* Content Placeholder Match exactly from Image */
                    <div className="text-center w-full space-y-1">
                      <h3 className="text-[15px] font-semibold text-gray-600 tracking-tight">
                        Tap to create message
                      </h3>
                      <p className="text-[11px] text-[#808897] font-semibold">
                        Create beautiful message with stunning visuals
                      </p>
                    </div>
                  )}
                </div>
              )}

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
          </div>
        </div>

        {/* C. Send Heart Custom Accordion (Only in Text section) */}
        {activeType === 'text' && (
          <div 
            className="w-[461px] max-w-full rounded-[1.8rem] transition-all duration-300 ease-out select-none overflow-hidden"
            style={{ backgroundColor: selectedFrame.bgHex }}
          >
            {/* Accordion header */}
            <div 
              onClick={() => setIsHeartsOnlyPickerOpen(!isHeartsOnlyPickerOpen)}
              className="w-full px-6 py-4 flex items-center justify-between cursor-pointer active:opacity-90 select-none"
            >
              <span className="text-sm font-semibold text-gray-500 select-none">
                Send a heart
              </span>
              <div className="text-xs font-bold text-[#666D80] select-none opacity-80">
                {isHeartsOnlyPickerOpen ? (
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Accordion content - custom Grid of 6 white cards with Speech bubbles style */}
            {isHeartsOnlyPickerOpen && (
              <div className="px-4 pb-4 animate-fade-in-slow">
                <div className="grid grid-cols-3 gap-3">
                  {SEMANTIC_HEARTS.map((heart) => {
                    const isSelected = selectedHearts.includes(heart.id);
                    return (
                      <div
                        key={heart.id}
                        onClick={() => handleHeartToggle(heart.id)}
                        className={`bg-white rounded-[1.25rem] p-3 flex flex-col items-center justify-between cursor-pointer select-none active:scale-95 transition-all duration-150 ${
                          isSelected 
                            ? 'ring-2 ring-orange-400 font-bold bg-orange-50/20 scale-[1.02]' 
                            : 'hover:scale-[1.01]'
                        }`}
                        title={heart.details}
                      >
                        {/* Custom smiley speech bubble of precise color */}
                        <div className="py-2.5 flex items-center justify-center">
                          <HeartBubbleSvg color={heart.bubbleColor} />
                        </div>
                        
                        {/* Name label text */}
                        <span className={`text-[10px] font-extrabold text-center tracking-tight leading-tight select-none mt-1 ${
                          isSelected ? 'text-[#FE6349]' : 'text-[#666D80]'
                        }`}>
                          {heart.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}



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
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-2 focus:ring-[#FE6349]/20 font-medium h-24 resize-none transition-all duration-200"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-[#A4ABB8] font-bold">
                    {content.length}/180 limits
                  </div>
                </div>
              ) : activeType === 'audio' ? (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-600">Audio coming soon</p>
                  <p className="text-[10px] text-[#A4ABB8] font-medium">
                    Send beautiful message with your voice
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5 text-center">
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
                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-2 focus:ring-[#FE6349]/20 font-semibold"
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
                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1B25] placeholder-[#C1C7CF] focus:outline-none focus:ring-2 focus:ring-[#FE6349]/20 font-semibold"
              />
            </div>

            {/* D. THE GRAPHIC TEMPLATES & STICKERS */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Frame Frame</span>
                <div className="flex gap-2.5 items-center">
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

            {/* E. FONT & ASPECT */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-0.5 block">Aspect Scale</span>
                <button
                  onClick={() => setCanvasAspectRatio(canvasAspectRatio === 'portrait' ? 'landscape' : 'portrait')}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-left flex justify-between items-center capitalize"
                >
                  <span>{canvasAspectRatio} Aspect</span>
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

    </div>
  );
};
