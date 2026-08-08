import React, { useState } from 'react';
import { ShareProfileModal } from './ShareProfileModal';
import { SEMANTIC_HEARTS } from './CreateAppreciationModal';
import { 
  Settings, 
  Share2, 
  Camera, 
  Search, 
  SlidersHorizontal, 
  Mic,
  X,
  User,
  Lock,
  Bell,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Globe,
  Sparkles,
  Award,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeartboardViewProps {
  posts?: any[];
  onPostClick?: (post: any) => void;
  onFilterClick?: () => void;
}

// SVG Speech Bubble with White Heart and Cute Smiley Face
const HeartBubbleSVG: React.FC<{
  size?: number;
  bubbleColor: string;
  className?: string;
}> = ({ size = 56, bubbleColor, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 filter drop-shadow-2xs ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speech Bubble Shape */}
        <path
          d="M32 6C18.1929 6 7 16.2975 7 29C7 33.7225 8.5807 38.1065 11.2828 41.7208C10.0242 45.9621 7.27963 49.3879 7.02613 49.6973C6.61118 50.2033 6.97171 50.95 7.62562 50.95C12.872 50.95 17.3828 48.2435 20.0827 46.1623C23.7381 47.3392 27.756 48 32 48C45.8071 48 57 37.7025 57 25C57 12.2975 45.8071 6 32 6Z"
          fill={bubbleColor}
        />
        {/* Centered White Heart */}
        <path
          d="M32 37.5 C32 37.5, 20.5 29, 20.5 22 C20.5 17.8, 23.5 14.8, 27.5 14.8 C29.8 14.8, 31.2 16, 32 17.2 C32.8 16, 34.2 14.8, 36.5 14.8 C40.5 14.8, 43.5 17.8, 43.5 22 C43.5 29, 32 37.5, 32 37.5 Z"
          fill="white"
        />
        {/* Eyes inside White Heart */}
        <circle cx="28" cy="20.5" r="1.35" fill={bubbleColor} />
        <circle cx="36" cy="20.5" r="1.35" fill={bubbleColor} />
        {/* Curved Smile */}
        <path
          d="M28.5 24.5 C28.5 24.5, 30.2 27, 32 27 C33.8 27, 35.5 24.5, 35.5 24.5"
          stroke={bubbleColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export interface HeartCategoryCardData {
  id: string;
  categoryName: string;
  count: number;
  bubbleColor: string;
  bgHalo: string;
  dotColors: string[];
  layoutType: 'cluster3' | 'pair2' | 'single1';
  badgeExtra?: string;
  items?: any[];
}

export const HeartCategoryCard: React.FC<{
  data: HeartCategoryCardData;
  onShare?: (data: HeartCategoryCardData) => void;
  onClick?: (data: HeartCategoryCardData) => void;
}> = ({ data, onShare, onClick }) => {
  const {
    categoryName,
    count,
    bubbleColor,
    bgHalo,
    dotColors,
    layoutType,
    badgeExtra
  } = data;

  return (
    <div
      onClick={() => onClick && onClick(data)}
      className="bg-white rounded-[2rem] sm:rounded-[2.25rem] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between items-center h-[340px] sm:h-[350px] relative overflow-hidden group cursor-pointer shadow-[3px_0px_45px_0px_rgba(0,0,0,0.08)]"
      style={{ boxShadow: '3px 0px 45px 0px rgba(0, 0, 0, 0.08)' }}
    >
      {/* 1. Header Category Title */}
      <div className="w-full flex items-center justify-between z-10">
        <span className="text-[#808897] font-semibold text-sm sm:text-base tracking-wide pl-1">
          {categoryName}
        </span>
      </div>

      {/* 2. Center Graphic Area */}
      <div className="relative flex items-center justify-center my-auto">
        {/* Soft Circular Background Halo */}
        <div 
          className="w-40 h-40 sm:w-44 sm:h-44 rounded-full flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: bgHalo }}
        >
          {/* Decorative Scattered Dots */}
          <div 
            className="absolute -top-1 left-4 w-2.5 h-2.5 rounded-full opacity-75"
            style={{ backgroundColor: dotColors[0] || bubbleColor }}
          />
          <div 
            className="absolute top-8 -right-3 w-3 h-3 rounded-full opacity-80"
            style={{ backgroundColor: dotColors[1] || bubbleColor }}
          />
          <div 
            className="absolute bottom-6 -left-3 w-3.5 h-3.5 rounded-full opacity-60"
            style={{ backgroundColor: dotColors[2] || bubbleColor }}
          />
          <div 
            className="absolute -bottom-1 right-8 w-2.5 h-2.5 rounded-full opacity-75"
            style={{ backgroundColor: dotColors[3] || bubbleColor }}
          />
          <div 
            className="absolute top-2 right-12 w-1.5 h-1.5 rounded-full opacity-50"
            style={{ backgroundColor: dotColors[0] || bubbleColor }}
          />
          <div 
            className="absolute bottom-12 left-2 w-2 h-2 rounded-full opacity-65"
            style={{ backgroundColor: dotColors[1] || bubbleColor }}
          />

          {/* Speech Bubble Cluster Layout */}
          {layoutType === 'cluster3' && (
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Top Bubble */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <HeartBubbleSVG size={58} bubbleColor={bubbleColor} />
              </div>
              {/* Bottom Left Bubble */}
              <div className="absolute bottom-0 left-0 z-10">
                <HeartBubbleSVG size={52} bubbleColor={bubbleColor} />
              </div>
              {/* Bottom Right Bubble */}
              <div className="absolute bottom-0 right-0 z-10">
                <HeartBubbleSVG size={52} bubbleColor={bubbleColor} />
              </div>

              {/* Optional Numeric Overlay Badge */}
              {(badgeExtra || count > 3) && (
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#353849]/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-white shadow-xs">
                  {badgeExtra || `+${count}`}
                </div>
              )}
            </div>
          )}

          {layoutType === 'pair2' && (
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Top Right Bubble */}
              <div className="absolute top-2 right-2 z-10">
                <HeartBubbleSVG size={58} bubbleColor={bubbleColor} />
              </div>
              {/* Bottom Left Bubble */}
              <div className="absolute bottom-2 left-2 z-10">
                <HeartBubbleSVG size={58} bubbleColor={bubbleColor} />
              </div>
            </div>
          )}

          {layoutType === 'single1' && (
            <div className="relative w-32 h-32 flex items-center justify-center z-10">
              <HeartBubbleSVG size={72} bubbleColor={bubbleColor} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Share Pill Button */}
      <div className="w-full flex justify-center z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onShare) onShare(data);
          }}
          className="px-5 py-2 rounded-full border border-gray-200 text-[#353849] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-white"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.2] text-[#353849]" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

const HeartboardCard: React.FC<{ item: any; onClick: () => void }> = ({ item, onClick }) => {
  // If item is a Heart Token
  if (item.isHeartToken || item.section === 'hearts' || item.type === 'heart_token') {
    const rawLabel = item.heartDetails?.label || item.title || 'Heart Token';
    const matched = SEMANTIC_HEARTS.find(
      sh => sh.label.toLowerCase() === rawLabel.toLowerCase() || sh.id === item.heartDetails?.id
    );
    const heartLabel = matched?.label || rawLabel;
    const bubbleColor = item.heartDetails?.bubbleColor || matched?.bubbleColor || '#FF53C0';
    const bg = item.frameBg || item.theme || '#FAF0EC';

    return (
      <div 
        onClick={onClick}
        className="rounded-[2.25rem] p-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between min-h-[280px] shadow-[3px_0px_45px_0px_rgba(0,0,0,0.08)] border border-gray-100"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full bg-[#FFFDF9] rounded-[2rem] p-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[250px]">
          {/* Corner pushpins */}
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />

          {/* Heart Bubble Graphic */}
          <div className="my-2">
            <HeartBubbleSVG size={68} bubbleColor={bubbleColor} />
          </div>

          {/* Heart Label & Details */}
          <div className="text-center relative z-10 w-full space-y-1">
            <span 
              className="inline-block px-3 py-1 rounded-full font-extrabold text-[11px] uppercase tracking-wider mb-1 text-white shadow-2xs"
              style={{ backgroundColor: bubbleColor }}
            >
              {heartLabel}
            </span>
            <p className="font-bold text-[#1A1B25] text-sm leading-tight line-clamp-2">
              {item.title || item.content}
            </p>
            {item.recipientName && (
              <p className="text-xs font-semibold text-gray-500 mt-1">
                To: <span className="text-[#1A1B25] font-extrabold">{item.recipientName}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If item is a Voice Note / Audio
  if (item.type === 'audio' || item.mediaType === 'audio') {
    const bg = item.frameBg || item.theme || '#FAF0EC';
    return (
      <div 
        onClick={onClick}
        className="rounded-[2.5rem] p-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between min-h-[260px] shadow-2xs"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full bg-white/90 rounded-[2rem] p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[230px] gap-3">
          {/* Radial rings bg */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="w-[180px] h-[180px] border border-[#FE6349] rounded-full absolute" />
            <div className="w-[240px] h-[240px] border border-[#FE6349] rounded-full absolute" />
          </div>

          <div className="w-16 h-16 rounded-full bg-[#FE6349] text-white flex items-center justify-center relative z-10 shadow-md">
            <Mic className="w-7 h-7" />
          </div>

          <div className="text-center relative z-10 px-2">
            <p className="font-extrabold text-[#1A1B25] text-sm">
              {item.title || 'Voice Note Appreciation'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {item.content || 'Audio tribute capsule'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If item is a Note / Handwritten Note with Photo or Stickers
  if (item.type === 'note' || item.type === 'note_stickers' || item.type === 'image_note' || item.mediaType === 'note') {
    const bg = item.frameBg || (item.theme && item.theme.startsWith('#') ? item.theme : '#FAF0EC');
    return (
      <div 
        onClick={onClick}
        className="rounded-[2.5rem] p-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-2xs"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full bg-[#FFFDF9] rounded-[2rem] p-5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          {/* Lined paper pattern background */}
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(#808897_1px,transparent_1px)] bg-[size:100%_24px]" />
          
          {/* Corner pushpin */}
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />

          {/* Stickers row if present */}
          <div className="flex items-center justify-between relative z-10 mb-2">
            {item.stickers?.includes('red_heart') || item.sticker === 'heart_bubble' ? (
              <span className="text-2xl">❤️</span>
            ) : <span />}
            {item.stickers?.includes('yellow_star') || item.sticker === 'star_glow' ? (
              <span className="text-2xl">⭐</span>
            ) : <span />}
          </div>

          {/* Optional image thumbnail */}
          {(item.mediaUrl || item.imageUrl) && (
            <div className="w-full h-36 rounded-xl overflow-hidden shrink-0 relative z-10 mb-3 bg-gray-50">
              <img 
                src={item.mediaUrl || item.imageUrl} 
                alt={item.title || 'Note image'} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Handwritten text */}
          <div className="w-full text-center relative z-10 my-2 px-1">
            <p className="font-handwriting text-base text-[#1A1B25] font-bold leading-relaxed line-clamp-3">
              "{item.content}"
            </p>
          </div>

          {/* Footer author */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold relative z-10">
            <span>By {item.authorName}</span>
            {item.recipientName && <span>To {item.recipientName}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Standard Image / Video / Canvas Card
  const bg = item.frameBg || (item.theme && item.theme.startsWith('#') ? item.theme : '#FAF0EC');
  return (
    <div 
      onClick={onClick}
      className="rounded-[2.5rem] p-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-2xs"
      style={{ backgroundColor: bg }}
    >
      <div className="w-full h-[320px] rounded-[2rem] overflow-hidden bg-white relative flex flex-col justify-between p-3">
        {(item.mediaUrl || item.imageUrl) ? (
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-50 relative">
            <img 
              src={item.mediaUrl || item.imageUrl} 
              alt={item.title || item.content}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white">
              <p className="font-extrabold text-sm line-clamp-1">{item.title || item.content}</p>
              <p className="text-xs text-gray-200 font-medium">{item.authorName}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full rounded-[1.5rem] bg-rose-50/50 p-6 flex flex-col justify-between">
            <p className="font-extrabold text-[#1A1B25] text-lg leading-snug">
              {item.title || item.content}
            </p>
            <p className="text-xs font-bold text-gray-400">Curated by {item.authorName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MOCK_HEARTBOARD_ITEMS = [
  {
    id: 'hb-1',
    title: 'Beyoncé Live World Tour',
    authorName: 'Curated by @mickymouse',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?auto=format&fit=crop&q=80&w=500',
    frameBg: '#FAF0EC', // cozy soft peach frame
    aspectRatio: 'portrait',
    tab: 'board'
  },
  {
    id: 'hb-2',
    title: 'Love Granpa So Much',
    authorName: 'Tyler',
    type: 'image_note',
    content: 'Love Granpa So Much',
    mediaUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    frameBg: '#1A1B25', // dark charcoal border frame
    paperBg: '#F8F9FB',
    aspectRatio: 'landscape',
    tab: 'board'
  },
  {
    id: 'hb-3',
    title: 'Tribute to Davido',
    authorName: 'Amino',
    type: 'note',
    content: 'I love you ronaldo!. Happy retirement, Your cousin Amino',
    mediaUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=300',
    frameBg: '#F7B238', // warm yellow orange frame
    paperBg: '#FFFDF9',
    aspectRatio: 'tall_note',
    tab: 'board'
  },
  {
    id: 'hb-4',
    title: 'Voice Note Tribute',
    authorName: 'Anonymous',
    type: 'audio',
    content: 'Voice capsule appreciation',
    frameBg: '#FAF0EC', // soft pinkish peach
    aspectRatio: 'square_audio',
    tab: 'board'
  },
  {
    id: 'hb-5',
    title: 'Ronaldo Retirement Card',
    authorName: 'Amino',
    type: 'note_stickers',
    content: 'I love you ronaldo!. Happy retirement, Your cousin Amino',
    frameBg: '#149B88', // teal green frame
    paperBg: '#FFFDF9',
    stickers: ['red_heart', 'yellow_star'],
    aspectRatio: 'landscape_note',
    tab: 'tagged'
  },
  {
    id: 'hb-6',
    title: 'Tupac Loved Memorial',
    authorName: 'Fanbase',
    type: 'note_stickers',
    content: 'Legacy lives forever',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300',
    frameBg: '#BEE27C', // lime green frame
    paperBg: '#FFFDF9',
    stickers: ['giant_heart'],
    aspectRatio: 'tall_note',
    tab: 'hearts'
  }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
];

export const HeartboardView: React.FC<HeartboardViewProps> = ({ posts = [], onPostClick, onFilterClick }) => {
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'tagged' | 'hearts'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Profile State
  const [userName, setUserName] = useState('Micky Mouse');
  const [userHandle, setUserHandle] = useState('@mickymouse');
  const [userEmail, setUserEmail] = useState('Aminuolawale@gmail.com');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // File Input Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Temporary edit state
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(profileImage);

  // Settings State & Interactive Handlers
  const [boardVisibility, setBoardVisibility] = useState<'Public' | 'Only Recipient' | 'Anonymous'>('Public');
  const [contributionLimit, setContributionLimit] = useState<'Free' | 'Unlimited'>('Free');
  const [handshakeAutoConfirm, setHandshakeAutoConfirm] = useState(true);
  const [heartTokenAlerts, setHeartTokenAlerts] = useState(true);
  const [trophyCaseUpdates, setTrophyCaseUpdates] = useState(true);
  const [activeHeartTags, setActiveHeartTags] = useState<string[]>(['#loveRonaldo', '#messi', '#workspacelegend']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagManager, setShowTagManager] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleToggleVisibility = () => {
    const nextVis = boardVisibility === 'Public' ? 'Only Recipient' : boardVisibility === 'Only Recipient' ? 'Anonymous' : 'Public';
    setBoardVisibility(nextVis);
    showToast(`Visibility set to: ${nextVis}`);
  };

  const handleToggleLimit = () => {
    const nextLimit = contributionLimit === 'Free' ? 'Unlimited' : 'Free';
    setContributionLimit(nextLimit);
    showToast(`Contribution Mode: ${nextLimit === 'Free' ? 'Free (20 Curators)' : 'Unlimited (Pro Space)'}`);
  };

  const handleAddTag = () => {
    let tag = newTagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = `#${tag}`;
    if (activeHeartTags.includes(tag)) {
      showToast(`${tag} is already in your verified list`);
      return;
    }
    setActiveHeartTags([...activeHeartTags, tag]);
    setNewTagInput('');
    showToast(`Claimed new Heart Tag: ${tag}`);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setActiveHeartTags(activeHeartTags.filter((t) => t !== tagToRemove));
    showToast(`Removed tag: ${tagToRemove}`);
  };

  const [selectedCategoryModal, setSelectedCategoryModal] = useState<HeartCategoryCardData | null>(null);

  const handleStartEdit = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setTempProfileImage(profileImage);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    const rawVal = tempName.trim() || 'Micky Mouse';
    setUserName(rawVal);
    const derivedHandle = rawVal.startsWith('@')
      ? rawVal
      : `@${rawVal.toLowerCase().replace(/\s+/g, '')}`;
    setUserHandle(derivedHandle);
    setUserEmail(tempEmail.trim() || 'Aminuolawale@gmail.com');
    setProfileImage(tempProfileImage);
    setIsEditingProfile(false);
    showToast('Profile details saved');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTempProfileImage(result);
        setProfileImage(result);
        showToast('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const allAvailableItems = posts.length > 0 ? posts : MOCK_HEARTBOARD_ITEMS;

  // Build Heart Categories using exact SEMANTIC_HEARTS spectrum colors & definitions
  const defaultHeartCategories: HeartCategoryCardData[] = [
    {
      id: 'cat-visionary',
      categoryName: 'Visionary',
      count: 92,
      bubbleColor: '#FF53C0',
      bgHalo: '#FDF2F8',
      dotColors: ['#FBCFE8', '#FF53C0', '#F472B6', '#BE185D'],
      layoutType: 'cluster3',
      badgeExtra: '+89',
      items: [
        { authorName: 'Mercy24', content: 'Always thinking 10 steps ahead!', createdAt: '2 hours ago' },
        { authorName: 'Alex_Dev', content: 'Incredible product vision and leadership!', createdAt: '1 day ago' }
      ]
    },
    {
      id: 'cat-leadership',
      categoryName: 'Leadership',
      count: 18,
      bubbleColor: '#7B62FF',
      bgHalo: '#F3F0FF',
      dotColors: ['#C4B5FD', '#7B62FF', '#DDD6FE', '#5B21B6'],
      layoutType: 'cluster3',
      items: [
        { authorName: 'Davido_Fan', content: 'Guiding the whole team through challenges with clarity.', createdAt: '3 days ago' }
      ]
    },
    {
      id: 'cat-hardworking',
      categoryName: 'Hard working',
      count: 12,
      bubbleColor: '#4CD964',
      bgHalo: '#ECFDF5',
      dotColors: ['#A7F3D0', '#4CD964', '#6EE7B7', '#047857'],
      layoutType: 'pair2',
      items: [
        { authorName: 'Amino', content: 'Pure dedication and consistency every single day!', createdAt: '4 days ago' }
      ]
    },
    {
      id: 'cat-loving',
      categoryName: 'Loving',
      count: 7,
      bubbleColor: '#FFB800',
      bgHalo: '#FEF3C7',
      dotColors: ['#FDE047', '#FFB800', '#FEF08A', '#D97706'],
      layoutType: 'single1',
      items: [
        { authorName: 'Grandpa', content: 'Your heart overflows with love and kindness.', createdAt: '5 days ago' }
      ]
    },
    {
      id: 'cat-reliable',
      categoryName: 'Reliable',
      count: 15,
      bubbleColor: '#FF8A65',
      bgHalo: '#FFF0EB',
      dotColors: ['#FFD8CC', '#FF8A65', '#FFC1B0', '#E65100'],
      layoutType: 'pair2',
      items: [
        { authorName: 'CR7_Official', content: 'Rock solid reliability. You never let anyone down.', createdAt: '1 week ago' }
      ]
    },
    {
      id: 'cat-appreciation',
      categoryName: 'Best of all',
      count: 9,
      bubbleColor: '#007A78',
      bgHalo: '#E6F4F4',
      dotColors: ['#80CBD2', '#007A78', '#4DB6AC', '#004D40'],
      layoutType: 'single1',
      items: [
        { authorName: 'Community', content: 'Thank you for all the support and goodwill!', createdAt: '2 weeks ago' }
      ]
    }
  ];

  // Group user-created / post hearts into matching categories
  allAvailableItems.forEach((post) => {
    if (post.isHeartToken || post.section === 'hearts' || post.type === 'heart_token') {
      const label = (post.heartDetails?.label || post.title || '').toLowerCase();
      const matchCat = defaultHeartCategories.find(c => 
        c.categoryName.toLowerCase().includes(label) || label.includes(c.categoryName.toLowerCase())
      );
      if (matchCat) {
        matchCat.count += 1;
        matchCat.items?.push({ authorName: post.authorName || 'Anonymous', content: post.content || post.title, createdAt: post.createdAt });
      }
    }
  });

  const displayHeartCategories = defaultHeartCategories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    return cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredItems = allAvailableItems.filter((item) => {
    let matchesTab = false;

    if (activeSubTab === 'board') {
      // 1. Created Messages / Boards
      matchesTab = item.section === 'board' || item.isCreatedByUser === true || (!item.section && item.tab === 'board');
    } else if (activeSubTab === 'tagged') {
      // 2. Tagged / Recipient Messages
      matchesTab = item.section === 'tagged' || item.isTaggedForUser === true || item.tab === 'tagged';
    } else if (activeSubTab === 'hearts') {
      // 3. Hearts
      matchesTab = item.section === 'hearts' || item.isHeartToken === true || item.tab === 'hearts';
    }

    const matchesSearch = searchQuery.trim() === '' || 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.authorName && item.authorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.recipientName && item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="app-container px-6 md:px-12 py-8 pb-32">
      {/* 1. Top Header: Page Title & Settings */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1B25] tracking-tight">
          My Heartboard
        </h1>
        <button 
          aria-label="Settings"
          onClick={() => setIsSettingsOpen(true)}
          className="w-9 h-9 rounded-full bg-gray-25 flex items-center justify-center text-[#353849] hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* 2. User Profile Banner */}
      <div className="flex flex-row items-center gap-6 mb-12">
        {/* Hidden File Input for Profile Picture Upload */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        {/* Avatar */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-[144px] md:h-[144px] max-w-[144px] max-h-[144px] rounded-full bg-[#FDF4F2] flex items-center justify-center shrink-0 relative overflow-hidden group">
          {profileImage ? (
            <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#FFB5A9] fill-current transform translate-y-2" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Change Profile Picture"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity cursor-pointer"
          >
            <Camera className="w-6 h-6" />
            <span>Change Photo</span>
          </button>
        </div>

        {/* User Handle & Action Buttons */}
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#1A1B25] tracking-tight">
              {userHandle}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#A4ABB8] mt-0.5">
              {userEmail}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="bg-gray-50 hover:bg-gray-100 text-[#353849] px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="bg-gray-50 hover:bg-gray-100 text-[#353849] px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Snapshot</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Filter Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 mb-6">
        {/* Filter Sub-Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('board')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'board'
                ? 'bg-[#1A1B25] text-white'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveSubTab('tagged')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tagged'
                ? 'bg-[#1A1B25] text-white'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50'
            }`}
          >
            Tagged
          </button>
          <button
            onClick={() => setActiveSubTab('hearts')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'hearts'
                ? 'bg-[#1A1B25] text-white'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50'
            }`}
          >
            Hearts
          </button>
        </div>
      </div>

      {/* 4. Search Bar Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-grow relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4ABB8]">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, name...."
            className="w-full bg-gray-25 border-0 outline-none focus:outline-none focus:ring-0 rounded-full py-3 pl-10 pr-4 text-xs font-medium text-[#1A1B25] placeholder:text-[#A4ABB8]"
          />
        </div>
        <button 
          onClick={onFilterClick}
          aria-label="Filter"
          className="w-10 h-10 rounded-full bg-gray-25 flex items-center justify-center text-[#353849] hover:text-[#1A1B25] transition-all cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2] text-[#353849]" />
        </button>
      </div>

      {/* 5. Heartboard Grid / Trophy Case */}
      {activeSubTab === 'hearts' ? (
        displayHeartCategories.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 flex flex-col items-center justify-center my-6">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3 text-[#FE6349]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1B25]">No heart categories found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Try searching for another category like "Visionary", "Leadership", or "Loving".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayHeartCategories.map((cat) => (
              <HeartCategoryCard
                key={cat.id}
                data={cat}
                onShare={(catData) => {
                  setSelectedCategoryModal(catData);
                  setIsShareModalOpen(true);
                }}
                onClick={(catData) => {
                  setSelectedCategoryModal(catData);
                }}
              />
            ))}
          </div>
        )
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 flex flex-col items-center justify-center my-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3 text-[#FE6349]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1B25]">No items found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            {activeSubTab === 'board' && "Messages and boards you create will appear here automatically."}
            {activeSubTab === 'tagged' && "Boards where you are tagged as a recipient will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <HeartboardCard 
              key={item.id} 
              item={item} 
              onClick={() => onPostClick && onPostClick(item)} 
            />
          ))}
        </div>
      )}

      {/* Heart Category Detail Modal */}
      <AnimatePresence>
        {selectedCategoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategoryModal(null)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] p-6 sm:p-8 z-50 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#808897] font-bold text-sm uppercase tracking-wider">
                  {selectedCategoryModal.categoryName} Heart Category
                </span>
                <button
                  onClick={() => setSelectedCategoryModal(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#353849] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Big Heart Graphic Header */}
              <div 
                className="w-full rounded-[2rem] p-6 flex flex-col items-center justify-center relative overflow-hidden mb-6"
                style={{ backgroundColor: selectedCategoryModal.bgHalo }}
              >
                <div className="my-2">
                  <HeartBubbleSVG size={80} bubbleColor={selectedCategoryModal.bubbleColor} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1A1B25] mt-2">
                  {selectedCategoryModal.count} Hearts
                </h3>
                <p className="text-xs font-semibold text-[#808897] mt-0.5">
                  Total gifted in {selectedCategoryModal.categoryName} category
                </p>
              </div>

              {/* Tributes List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-[#1A1B25] uppercase tracking-wider mb-2">
                  Recent Tributes Received
                </h4>
                {selectedCategoryModal.items && selectedCategoryModal.items.length > 0 ? (
                  selectedCategoryModal.items.map((it, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gray-25 border border-gray-100 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1B25]">@{it.authorName}</span>
                        {it.createdAt && <span className="text-[10px] text-gray-400 font-medium">{it.createdAt}</span>}
                      </div>
                      <p className="text-xs text-[#353849] font-medium leading-relaxed">
                        "{it.content}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 font-medium italic text-center py-4">
                    No individual messages logged yet for this category.
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategoryModal(null);
                    setIsShareModalOpen(true);
                  }}
                  className="flex-1 bg-[#1A1B25] text-white py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Share Trophy Case</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Side Drawer Panel for Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white z-50 flex flex-col overflow-hidden font-sans"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1B25]">Settings</h2>
                  <p className="text-xs text-[#A4ABB8] font-medium mt-0.5">Preferences & Account Controls</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#353849] transition-all cursor-pointer"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Profile Quick Overview & Editing */}
                <div className="bg-gray-25 p-4 rounded-2xl transition-all">
                  {!isEditingProfile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <div className="w-12 h-12 rounded-full bg-[#FDF4F2] flex items-center justify-center overflow-hidden shrink-0">
                            {profileImage ? (
                              <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-8 h-8 text-[#FFB5A9] fill-current transform translate-y-1" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload profile picture"
                            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1A1B25]">{userName}</h3>
                          <p className="text-xs text-[#A4ABB8] font-medium">{userHandle}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleStartEdit}
                        className="px-3.5 py-1.5 rounded-full bg-white text-xs font-semibold text-[#1A1B25] hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-[#1A1B25]">Edit Profile Details</span>
                      </div>

                      {/* Profile Picture Option */}
                      <div className="flex items-center gap-3.5 py-1">
                        <div className="w-14 h-14 rounded-full bg-[#FDF4F2] flex items-center justify-center overflow-hidden shrink-0 relative">
                          {tempProfileImage ? (
                            <img src={tempProfileImage} alt="Profile preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-9 h-9 text-[#FFB5A9] fill-current transform translate-y-1" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1">
                          <span className="text-[11px] font-semibold text-[#666D80]">Profile Picture</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-[#1A1B25] hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#666D80]" />
                              <span>Upload Photo</span>
                            </button>
                            {tempProfileImage && (
                              <button
                                type="button"
                                onClick={() => setTempProfileImage(null)}
                                className="px-2.5 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-[#666D80] hover:bg-gray-200 transition-all cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preset Avatars */}
                      <div>
                        <span className="text-[10px] font-semibold text-[#808897] block mb-1.5">Or choose a preset avatar:</span>
                        <div className="flex items-center gap-2">
                          {PRESET_AVATARS.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setTempProfileImage(url)}
                              className={`w-8 h-8 rounded-full overflow-hidden transition-all cursor-pointer ${
                                tempProfileImage === url ? 'scale-105 opacity-100' : 'opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#666D80] mb-1 block">Name & Handle</label>
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="w-full bg-gray-25 border-none outline-none rounded-xl px-3 py-2 text-xs font-medium text-[#1A1B25]"
                          placeholder="Name / Handle (e.g. Micky Mouse)"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#666D80] mb-1 block">Email</label>
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full bg-gray-25 border-none outline-none rounded-xl px-3 py-2 text-xs font-medium text-[#1A1B25]"
                          placeholder="Email address"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="px-3 py-1.5 rounded-full bg-gray-25 text-xs font-medium text-[#666D80] hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-1.5 rounded-full bg-[#1A1B25] text-white text-xs font-semibold hover:bg-black cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Section: Notifications */}
                <div>
                  <h4 className="text-xs font-bold text-[#808897] uppercase tracking-wider mb-3">Notifications</h4>
                  <div className="bg-gray-25 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    <div 
                      onClick={() => {
                        const nextVal = !heartTokenAlerts;
                        setHeartTokenAlerts(nextVal);
                        showToast(`Heart Token Alerts ${nextVal ? 'enabled' : 'disabled'}`);
                      }}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-[#666D80]" />
                        <div>
                          <p className="text-xs font-bold text-[#1A1B25]">Heart Token Alerts</p>
                          <p className="text-[11px] text-[#A4ABB8] font-medium">Notify when someone blows a heart</p>
                        </div>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-all ${heartTokenAlerts ? 'bg-[#4CB993] justify-end' : 'bg-gray-300 justify-start'}`}>
                        <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        const nextVal = !trophyCaseUpdates;
                        setTrophyCaseUpdates(nextVal);
                        showToast(`Trophy Case Updates ${nextVal ? 'enabled' : 'disabled'}`);
                      }}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-[#666D80]" />
                        <div>
                          <p className="text-xs font-bold text-[#1A1B25]">Trophy Case Updates</p>
                          <p className="text-[11px] text-[#A4ABB8] font-medium">New badges and vouch tokens</p>
                        </div>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-all ${trophyCaseUpdates ? 'bg-[#4CB993] justify-end' : 'bg-gray-300 justify-start'}`}>
                        <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Digital Reputation & Claiming */}
                <div>
                  <h4 className="text-xs font-bold text-[#808897] uppercase tracking-wider mb-3">Reputation & Claims</h4>
                  <div className="bg-gray-25 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    <div 
                      onClick={() => setShowTagManager(!showTagManager)}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-[#666D80]" />
                        <div>
                          <p className="text-xs font-bold text-[#1A1B25]">Verified Heart Tags</p>
                          <p className="text-[11px] text-[#A4ABB8] font-medium">Claim public hashtag walls</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-[#1A1B25] rounded-full border border-gray-100">
                          {activeHeartTags.length} Active
                        </span>
                        <ChevronRight className={`w-4 h-4 text-[#A4ABB8] transition-transform ${showTagManager ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {showTagManager && (
                      <div className="p-4 bg-gray-25 space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="e.g. #loveRonaldo"
                            className="flex-1 bg-gray-25 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-[#1A1B25] outline-none focus:border-[#1A1B25]"
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-3 py-1.5 rounded-xl bg-[#1A1B25] text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
                          >
                            Claim
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeHeartTags.map((tag) => (
                            <span 
                              key={tag}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-25 text-[#1A1B25] rounded-full text-xs font-medium border border-gray-200/80"
                            >
                              <span>{tag}</span>
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-[#A4ABB8] hover:text-red-500 cursor-pointer"
                                aria-label={`Remove ${tag}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={() => {
                    showToast('Signed out of Heartboard session');
                    setIsSettingsOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gray-25 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2]" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Toast Notification Pill */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-6 left-6 right-6 bg-[#1A1B25] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg text-center z-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Share Profile Overlay Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userHandle={userHandle}
        userName={userName}
        profileImage={profileImage}
        onShowToast={showToast}
      />
    </div>
  );
};
