import React, { useState } from 'react';
import { ShareProfileModal } from './ShareProfileModal';
import { SEMANTIC_HEARTS, HeartBubbleSvg } from './CreateAppreciationModal';
import { LiveHeartAnimation } from './LiveHeartAnimation';
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
  ChevronLeft,
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

// Re-use the exact HeartBubbleSvg component from Page 2 (Send/Blow Heart)
const HeartBubbleSVG: React.FC<{
  size?: number;
  bubbleColor?: string;
  className?: string;
}> = ({ size = 56, bubbleColor = '#FE6349', className = '' }) => {
  return <HeartBubbleSvg color={bubbleColor || '#FE6349'} size={size} className={className} />;
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
    categoryName = 'Heart',
    count = 0,
    bubbleColor = '#FE6349',
    bgHalo = '#FDF4F2',
    dotColors = [],
    badgeExtra
  } = data || {};

  const effectiveLayout = count === 1 ? 'single1' : count === 2 ? 'pair2' : 'cluster3';

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

          {/* Heart Token Cluster Layout */}
          {effectiveLayout === 'cluster3' && (
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Top Token */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <HeartBubbleSVG size={58} bubbleColor={bubbleColor} />
              </div>
              {/* Bottom Left Token */}
              <div className="absolute bottom-0 left-0 z-10">
                <HeartBubbleSVG size={52} bubbleColor={bubbleColor} />
              </div>
              {/* Bottom Right Token */}
              <div className="absolute bottom-0 right-0 z-10">
                <HeartBubbleSVG size={52} bubbleColor={bubbleColor} />
              </div>

              {/* Optional Numeric Overlay Badge for > 3 hearts */}
              {(badgeExtra || count > 3) && (
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#353849]/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-white shadow-xs">
                  {badgeExtra || (count > 20 ? `+${count - 3}` : `${count}`)}
                </div>
              )}
            </div>
          )}

          {effectiveLayout === 'pair2' && (
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

          {effectiveLayout === 'single1' && (
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
          className="px-5 py-2 rounded-full border border-[#ECEFF3] text-[#A4ABB8] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-white"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[1.5] text-[#A4ABB8]" />
          <span className="text-[#A4ABB8]">Share</span>
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
  const [isHeartsAnimationActive, setIsHeartsAnimationActive] = useState(false);

  const triggerHeartsCelebration = () => {
    setIsHeartsAnimationActive(false);
    setTimeout(() => {
      setIsHeartsAnimationActive(true);
    }, 50);
  };

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
  const lastSelectedCategoryModalRef = React.useRef<HeartCategoryCardData | null>(null);
  if (selectedCategoryModal) {
    lastSelectedCategoryModalRef.current = selectedCategoryModal;
  }
  const activeCategoryModal = selectedCategoryModal || lastSelectedCategoryModalRef.current;

  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<string | null>(null);

  const sampleSenders = [
    { name: 'Ronike', date: 'Wed Dec 15 2016', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    { name: 'MickyMouse', date: 'Thu Jan 12 2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Mercy24', date: 'Fri Mar 04 2022', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { name: 'Alex_Dev', date: 'Mon Jun 19 2023', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    { name: 'Davido_Fan', date: 'Sat Oct 08 2022', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80' },
    { name: 'Amino', date: 'Tue Aug 22 2023', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sarah_K', date: 'Sun May 14 2023', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
    { name: 'David_B', date: 'Wed Nov 02 2022', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Jessica_M', date: 'Fri Feb 18 2022', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    { name: 'Michael_T', date: 'Thu Sep 29 2022', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
    { name: 'Elena_R', date: 'Mon Apr 03 2023', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80' },
    { name: 'Chris_P', date: 'Sat Dec 10 2022', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sophie_L', date: 'Tue Jul 25 2023', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    { name: 'Daniel_H', date: 'Sun Jan 29 2023', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80' },
    { name: 'Chloe_W', date: 'Wed Aug 16 2023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
  ];

  const categorySendersMap: Record<string, { name: string; date: string; avatar: string }[]> = {
    'cat-visionary': [
      { name: 'Ronike', date: 'Wed Dec 15 2016', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { name: 'Mercy24', date: 'Fri Mar 04 2022', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
      { name: 'Alex_Dev', date: 'Mon Jun 19 2023', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
      { name: 'MickyMouse', date: 'Thu Jan 12 2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
      { name: 'Sarah_K', date: 'Sun May 14 2023', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
      { name: 'David_B', date: 'Wed Nov 02 2022', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
      { name: 'Chloe_W', date: 'Wed Aug 16 2023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { name: 'Elena_R', date: 'Mon Apr 03 2023', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80' },
      { name: 'Chris_P', date: 'Sat Dec 10 2022', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80' },
      { name: 'Davido_Fan', date: 'Sat Oct 08 2022', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80' },
      { name: 'Amino', date: 'Tue Aug 22 2023', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
      { name: 'Jessica_M', date: 'Fri Feb 18 2022', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
      { name: 'Michael_T', date: 'Thu Sep 29 2022', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
      { name: 'Sophie_L', date: 'Tue Jul 25 2023', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
      { name: 'Daniel_H', date: 'Sun Jan 29 2023', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80' }
    ],
    'cat-leadership': [
      { name: 'Ronike', date: 'Tue Dec 20 2016', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { name: 'Davido_Fan', date: 'Sat Oct 08 2022', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80' },
      { name: 'Jessica_M', date: 'Fri Feb 18 2022', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' }
    ],
    'cat-hardworking': [
      { name: 'Amino', date: 'Tue Aug 22 2023', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
      { name: 'Alex_Dev', date: 'Mon Jul 03 2023', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' }
    ],
    'cat-loving': [
      { name: 'Ronike', date: 'Thu Dec 22 2016', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { name: 'Sophie_L', date: 'Tue Jul 25 2023', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' }
    ],
    'cat-reliable': [
      { name: 'Mercy24', date: 'Fri Mar 11 2022', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
      { name: 'CR7_Official', date: 'Mon Oct 24 2022', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
      { name: 'Ronike', date: 'Sun Jan 08 2017', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
    ],
    'cat-appreciation': [
      { name: 'MickyMouse', date: 'Wed Nov 15 2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
      { name: 'Community', date: 'Fri Nov 24 2023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
    ]
  };

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
      count: 3,
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
      count: 2,
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
      count: 1,
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
      count: 3,
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
      count: 1,
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
    const q = searchQuery.trim().toLowerCase();
    
    // 1. Heart type / category match (e.g. "Visionary", "Leadership", "Hard Work", "Loving", "Reliable")
    const catNameLower = cat.categoryName.toLowerCase();
    const catFullName = `${catNameLower} heart`;
    const matchesCatName = catNameLower.includes(q) || catFullName.includes(q) || q.includes(catNameLower);
    
    // 2. Sender name match (checks categorySendersMap[cat.id] and cat.items author names)
    const senders = categorySendersMap[cat.id] || sampleSenders;
    const matchesSender = senders.some(s => s.name.toLowerCase().includes(q)) ||
      (cat.items && cat.items.some(item => item.authorName.toLowerCase().includes(q)));
      
    return matchesCatName || matchesSender;
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

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.trim().toLowerCase();

    // Section-specific search logic for Boards and Tagged:
    // Search by Caption, Recipient Name, or Creator/Tagged User Name
    const matchesCaption = 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.quote && item.quote.toLowerCase().includes(q));

    const matchesRecipient = 
      (item.recipientName && item.recipientName.toLowerCase().includes(q)) ||
      (item.recipient && item.recipient.toLowerCase().includes(q)) ||
      (item.recipientHandle && item.recipientHandle.toLowerCase().includes(q));

    const matchesCreatorOrTagged = 
      (item.authorName && item.authorName.toLowerCase().includes(q)) ||
      (item.creatorName && item.creatorName.toLowerCase().includes(q)) ||
      (item.curatorName && item.curatorName.toLowerCase().includes(q)) ||
      (item.taggedUser && item.taggedUser.toLowerCase().includes(q)) ||
      (item.userHandle && item.userHandle.toLowerCase().includes(q)) ||
      (Array.isArray(item.taggedUsers) && item.taggedUsers.some((u: string) => u.toLowerCase().includes(q)));

    return matchesCaption || matchesRecipient || matchesCreatorOrTagged;
  });

  return (
    <div className="app-container px-6 md:px-12 py-8 pb-32">
      {/* Live & Fun Floating Hearts Celebration Experience */}
      <LiveHeartAnimation 
        categories={displayHeartCategories} 
        isActive={isHeartsAnimationActive} 
        onComplete={() => setIsHeartsAnimationActive(false)} 
        durationMs={6500} 
      />

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
                ? 'bg-white text-[#1A1B25] border-2 border-gray-50 shadow-2xs'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveSubTab('tagged')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tagged'
                ? 'bg-white text-[#1A1B25] border-2 border-gray-50 shadow-2xs'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            Tagged
          </button>
          <button
            onClick={() => {
              setActiveSubTab('hearts');
              triggerHeartsCelebration();
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'hearts'
                ? 'bg-white text-[#1A1B25] border-2 border-gray-50 shadow-2xs'
                : 'bg-gray-25 text-[#A4ABB8] hover:bg-gray-50 border-2 border-transparent'
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
            placeholder={
              activeSubTab === 'board'
                ? "Search boards by caption, recipient, or creator..."
                : activeSubTab === 'tagged'
                ? "Search tagged boards by caption, recipient, or creator..."
                : "Search hearts by type or sender's name (e.g. Mercy24)..."
            }
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
              <Search className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1B25]">
              {searchQuery.trim() ? 'No hearts found matching your search' : 'No heart categories found'}
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              {searchQuery.trim()
                ? `No received hearts match "${searchQuery}". Try searching for a sender like "Mercy24", "Ronike", or "Alex_Dev", or a heart type like "Loving".`
                : 'No heart categories found.'}
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
            {searchQuery.trim() ? <Search className="w-6 h-6 stroke-[2]" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-bold text-[#1A1B25]">
            {searchQuery.trim() 
              ? `No ${activeSubTab === 'board' ? 'boards' : 'tagged boards'} found matching "${searchQuery}"`
              : `No ${activeSubTab === 'board' ? 'boards' : 'tagged boards'} found`}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            {searchQuery.trim()
              ? `No ${activeSubTab === 'board' ? 'boards' : 'tagged boards'} matched "${searchQuery}". Try searching by caption, recipient name, or creator name.`
              : activeSubTab === 'board'
                ? "Messages and boards you create will appear here automatically."
                : "Boards where you are tagged as a recipient will appear here automatically."}
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

      {/* Heart Category Detail Side Drawer */}
      <AnimatePresence>
        {selectedCategoryModal && activeCategoryModal && (
          <React.Fragment key="heart-category-drawer">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSelectedCategoryModal(null);
                setDrawerSearchQuery('');
              }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white z-50 flex flex-col overflow-hidden font-sans shadow-2xl"
            >
              {/* Top Header Area */}
              <div className="p-6 sm:p-8 bg-white border-b border-gray-100/80 flex flex-col gap-6 relative">
                {/* Back Arrow Button */}
                <button
                  onClick={() => {
                    setSelectedCategoryModal(null);
                    setDrawerSearchQuery('');
                  }}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#1A1B25] transition-all cursor-pointer self-start -ml-2"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>

                {/* Main Hero Header: Circular Heart Avatar + Category Details */}
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Soft Colored Circular Avatar with Heart Bubble */}
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shrink-0 relative transition-transform duration-300 shadow-xs"
                    style={{ backgroundColor: activeCategoryModal.bgHalo || '#FDF2F8' }}
                  >
                    <HeartBubbleSVG
                      size={72}
                      bubbleColor={activeCategoryModal.bubbleColor || '#FE6349'}
                    />
                  </div>

                  {/* Title & Stats */}
                  <div className="flex flex-col items-start gap-1">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1A1B25] tracking-tight">
                      {activeCategoryModal.categoryName || 'Heart'} Heart
                    </h2>
                    <p className="text-xs sm:text-sm text-[#808897] font-medium leading-snug">
                      {(activeCategoryModal.count || 0) === 1
                        ? '1 person send you this heart'
                        : `${(activeCategoryModal.count || 0) > 20 ? '648' : (activeCategoryModal.count || 0)} people send you this heart`}
                    </p>

                    {/* Share Button Pill */}
                    <button
                      onClick={() => {
                        setIsShareModalOpen(true);
                      }}
                      className="mt-2.5 px-4 py-1.5 rounded-full border border-gray-200 text-[#353849] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-white shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5 stroke-[1.8] text-[#353849]" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Body Section (Filled with #ffffff background) */}
              <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
                {/* Search Bar Input */}
                <div className="p-5 pb-3">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by username"
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      className="w-full bg-[#F6F8FA] focus:bg-gray-50 border border-gray-100 rounded-full pl-10 pr-4 py-3 text-xs font-medium text-[#1A1B25] placeholder-gray-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Scrollable Floating Hearts Canvas */}
                <div className="flex-1 overflow-y-auto px-5 py-3">
                  {(() => {
                    const categorySenders = (activeCategoryModal.id && categorySendersMap[activeCategoryModal.id]) || sampleSenders;
                    const isSearching = drawerSearchQuery.trim().length > 0;
                    const filteredSenders = categorySenders.filter((s) =>
                      s.name.toLowerCase().includes(drawerSearchQuery.trim().toLowerCase())
                    );

                    if (isSearching && filteredSenders.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center my-auto h-full">
                          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#FE6349] mb-3 shrink-0">
                            <Search className="w-5 h-5 stroke-[2]" />
                          </div>
                          <h4 className="text-sm font-bold text-[#1A1B25]">No hearts found from this user</h4>
                          <p className="text-xs text-[#808897] mt-1 max-w-xs leading-relaxed">
                            No hearts matching "{drawerSearchQuery}" were found in the {activeCategoryModal.categoryName || 'Heart'} category.
                          </p>
                        </div>
                      );
                    }

                    if (isSearching && filteredSenders.length > 0) {
                      return (
                        <div className="flex flex-col gap-3 py-2">
                          <p className="text-[11px] font-bold text-[#808897] uppercase tracking-wider px-1">
                            {filteredSenders.length} {filteredSenders.length === 1 ? 'heart' : 'hearts'} from "{drawerSearchQuery}"
                          </p>
                          {filteredSenders.map((sender, idx) => (
                            <motion.div
                              key={`${sender.name}-${idx}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.15, delay: idx * 0.03 }}
                              className="p-3.5 rounded-2xl bg-[#F6F8FA] border border-gray-100/80 flex items-center gap-3.5 shadow-2xs hover:border-purple-200 transition-all cursor-pointer"
                            >
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                                style={{ backgroundColor: activeCategoryModal.bgHalo || '#FDF2F8' }}
                              >
                                <HeartBubbleSVG size={30} bubbleColor={activeCategoryModal.bubbleColor || '#FE6349'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={sender.avatar}
                                    alt={sender.name}
                                    className="w-5 h-5 rounded-full object-cover border border-gray-200 shrink-0"
                                  />
                                  <h5 className="text-xs font-bold text-[#1A1B25] truncate">{sender.name}</h5>
                                </div>
                                <p className="text-[11px] text-[#808897] mt-0.5 font-medium">
                                  Blew a {activeCategoryModal.categoryName || 'Heart'} Heart • {sender.date}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="relative pt-14 pb-6 flex flex-col items-center justify-center gap-3.5 w-full max-w-xs mx-auto">
                        {/* Background scattered dots */}
                        <div className="absolute top-2 left-6 w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute top-10 left-2 w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute top-8 right-8 w-2.5 h-2.5 rounded-full opacity-70" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute top-1/3 right-3 w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute bottom-1/3 left-4 w-3 h-3 rounded-full opacity-40" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute bottom-10 left-8 w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />
                        <div className="absolute bottom-6 right-6 w-2.5 h-2.5 rounded-full opacity-50" style={{ backgroundColor: activeCategoryModal.bubbleColor || '#FE6349' }} />

                        {/* Alternating row layout: [2, 3, 2, 3, 2, 3] */}
                        {[2, 3, 2, 3, 2, 3].map((count, rowIndex) => (
                          <div key={rowIndex} className="flex items-center justify-center gap-3.5 sm:gap-4 w-full">
                            {Array.from({ length: count }).map((_, itemIndex) => {
                              const flatIndex = rowIndex * 3 + itemIndex;
                              const itemKey = `${rowIndex}-${itemIndex}`;
                              const sender = categorySenders[flatIndex % categorySenders.length];
                              const isTooltipOpen = activeTooltipIndex === itemKey;

                              return (
                                <div key={itemKey} className="relative">
                                  {/* Tooltip Card */}
                                  <AnimatePresence>
                                    {isTooltipOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100/90 flex flex-col items-center min-w-[140px] relative">
                                          {/* Top: Avatar + Name */}
                                          <div className="flex items-center gap-2">
                                            <img
                                              src={sender.avatar}
                                              alt={sender.name}
                                              className="w-6 h-6 rounded-full object-cover border border-gray-100 shrink-0"
                                            />
                                            <span className="text-xs font-bold text-[#1A1B25] tracking-tight">
                                              {sender.name}
                                            </span>
                                          </div>

                                          {/* Dotted Line Divider */}
                                          <div className="w-full border-b border-dashed border-gray-200/90 my-2" />

                                          {/* Date */}
                                          <span className="text-[11px] text-[#A4ABB8] font-medium whitespace-nowrap">
                                            {sender.date}
                                          </span>

                                          {/* Bottom Pointer Tail Arrow */}
                                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100/90 rotate-45" />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* Heart Bubble Button */}
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: flatIndex * 0.03 }}
                                    onClick={() => setActiveTooltipIndex(isTooltipOpen ? null : itemKey)}
                                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center relative transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${isTooltipOpen ? 'scale-105 ring-2 ring-offset-2 ring-purple-300/80' : ''}`}
                                    style={{ backgroundColor: activeCategoryModal.bgHalo || '#FDF2F8' }}
                                  >
                                    <HeartBubbleSVG size={40} bubbleColor={activeCategoryModal.bubbleColor || '#FE6349'} />
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </React.Fragment>
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
