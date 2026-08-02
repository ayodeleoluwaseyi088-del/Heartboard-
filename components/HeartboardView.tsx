import React, { useState } from 'react';
import { ShareProfileModal } from './ShareProfileModal';
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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeartboardViewProps {
  onPostClick?: (post: any) => void;
  onFilterClick?: () => void;
}

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

export const HeartboardView: React.FC<HeartboardViewProps> = ({ onPostClick, onFilterClick }) => {
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

  const filteredItems = MOCK_HEARTBOARD_ITEMS.filter((item) => {
    const matchesTab = activeSubTab === 'board' || item.tab === activeSubTab;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Card 1: Beyoncé Live Concert (Tall Portrait on soft pink frame) */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[0])}
          className="rounded-[2.5rem] p-4 bg-[#FAF0EC] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-full h-[360px] rounded-[2rem] overflow-hidden bg-white relative">
            <img 
              src="https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?auto=format&fit=crop&q=80&w=500" 
              alt="Beyonce Live"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card 2: "Love Granpa So Much" (Black Frame + Paper photo) */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[1])}
          className="rounded-[2.5rem] p-3 bg-[#1A1B25] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-full h-[220px] rounded-[1.8rem] bg-[#F8F9FB] p-5 flex flex-row items-center gap-4 relative overflow-hidden">
            <div className="flex-1 space-y-1">
              <p className="font-extrabold text-red-500 text-lg leading-tight">
                Love Granpa<br />So Much
              </p>
            </div>
            <div className="w-32 h-36 rounded-xl overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" 
                alt="Granpa" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Davido Tribute Card (Yellow/Amber Frame + Lined Note Paper) */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[2])}
          className="rounded-[2.5rem] p-4 bg-[#F7B238] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-full bg-[#FFFDF9] rounded-[2rem] p-5 relative overflow-hidden flex flex-col items-center gap-4 min-h-[340px]">
            {/* Lined paper pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-[#808897]_1px,transparent_1px)] bg-[size:100%_24px]" />
            
            {/* Corner pushpins */}
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />
            <div className="absolute bottom-12 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />
            <div className="absolute bottom-20 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />

            {/* Photo */}
            <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 mt-2 relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=300" 
                alt="Davido" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Handwritten note */}
            <div className="w-full text-center relative z-10 mt-2 px-2">
              <p className="font-handwriting text-lg text-[#1A1B25] font-bold leading-relaxed">
                I love you ronaldo!. Happy retirement, Your cousin Amino
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Voice Note Card (Soft Peach Frame + Radial Rings) */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[3])}
          className="rounded-[2.5rem] p-4 bg-[#FAF0EC] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01] flex items-center justify-center min-h-[220px]"
        >
          {/* Radial rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="w-[180px] h-[180px] border border-[#FE6349] rounded-full absolute" />
            <div className="w-[240px] h-[240px] border border-[#FE6349] rounded-full absolute" />
            <div className="w-[300px] h-[300px] border border-[#FE6349] rounded-full absolute" />
          </div>

          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center relative z-10">
            <Mic className="w-7 h-7 text-[#FE6349]" />
          </div>
        </div>

        {/* Card 5: Teal Green Note Card (Teal Frame + Heart & Star Stickers) */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[4])}
          className="rounded-[2.5rem] p-4 bg-[#149B88] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-full bg-[#FFFDF9] rounded-[2rem] p-5 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            {/* Corner pushpins */}
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />

            {/* Stickers top area */}
            <div className="flex items-center justify-between relative z-10 mb-4">
              {/* Red heart sticker */}
              <div className="w-12 h-12 text-[#FE6349] fill-current">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>

              {/* Yellow star sticker */}
              <div className="w-14 h-14 text-[#F7B238] fill-current transform rotate-12">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            </div>

            {/* Handwritten text */}
            <p className="font-handwriting text-base text-[#1A1B25] font-bold leading-relaxed relative z-10">
              I love you ronaldo!. Happy retirement, Your cousin Amino
            </p>
          </div>
        </div>

        {/* Card 6: Light Green Frame with Giant Heart Sticker */}
        <div 
          onClick={() => onPostClick && onPostClick(filteredItems[5])}
          className="rounded-[2.5rem] p-4 bg-[#BEE27C] relative overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-full bg-[#FFFDF9] rounded-[2rem] p-5 relative overflow-hidden flex flex-col items-center gap-3 min-h-[260px]">
            {/* Corner pushpin */}
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#353849] opacity-80" />

            {/* Giant Red Heart sticker */}
            <div className="w-20 h-20 text-[#FE6349] fill-current my-2">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Photo below */}
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300" 
                alt="Tupac" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

      </div>

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
