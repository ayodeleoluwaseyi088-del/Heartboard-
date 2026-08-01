
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EntityType, Post, PostVisibility } from './types';
import { PostCard } from './components/PostCard';
import { MediaModal } from './components/MediaModal';
import { CreateAppreciationModal } from './components/CreateAppreciationModal';
import { FilterModal } from './components/FilterModal';
import { HeartboardView } from './components/HeartboardView';
import { 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  Flame, 
  EyeOff, 
  Award, 
  Check, 
  Lock, 
  Heart,
  Home,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_MOCK_POSTS: (Post & { 
  theme?: string; 
  mediaType?: 'audio' | 'video' | 'image' | 'text' | 'note'; 
  sponsor?: string; 
  sticker?: string; 
  secondaryImage?: string;
  category?: 'tears' | 'vouch' | 'hype';
  statusBadge?: string;
  isBlurred?: boolean;
})[] = [
  {
    id: 'b1',
    authorName: 'Beyoncé Fan',
    content: 'The Queen herself live on world tour!',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?auto=format&fit=crop&q=80&w=400',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-20T10:00:00Z',
    targetId: 'bey',
    targetType: EntityType.WALL,
    reactions: 12400,
    theme: '#FAF0EC', // cozy peach
    mediaType: 'video',
    category: 'hype',
    statusBadge: '🔥 PURE HYPE STATUS'
  },
  {
    id: 'cr7-note',
    authorName: 'Amino',
    content: 'I love you ronaldo!. Happy retirement, Your cousin Amino',
    type: 'text',
    mediaUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cristiano',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-19T14:30:00Z',
    targetId: 'cr7',
    targetType: EntityType.WALL,
    reactions: 562,
    theme: '#ECEFE6', // clean mint
    mediaType: 'note',
    sticker: 'star',
    category: 'vouch',
    statusBadge: '⭐ HIGH-AUTHORITY VOUCH'
  },
  {
    id: 'm1',
    authorName: 'Argentina Fans',
    content: 'Live at 2022 world cup LFG Argentina - the goat has claimed his ultimate crown!',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-18T09:15:00Z',
    targetId: 'messi',
    targetType: EntityType.WALL,
    reactions: 89000,
    theme: '#EEF1FA', // dreamy lavender
    category: 'hype',
    statusBadge: '🔥 GOLDEN REP'
  },
  {
    id: 'trump-card',
    authorName: 'Supporter',
    content: 'Unmatched leadership that shapes history. Proud vouch for the movement!',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1580128660010-fd027e1e587a?auto=format&fit=crop&q=80&w=400',
    secondaryImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supporter',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-18T11:00:00Z',
    targetId: 'politics',
    targetType: EntityType.BOARD,
    reactions: 89,
    theme: '#EEF1FA', // dreamy lavender
    mediaType: 'image',
    category: 'vouch',
    statusBadge: '🛡️ PLATINUM VOUCH'
  },
  {
    id: 'birthday-note',
    authorName: 'Tyler',
    content: 'Happy birthday grandpa James! Thank you for being there for me when everyone left. Your grandson, Tyler',
    type: 'text',
    mediaUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-18T09:15:00Z',
    targetId: 'family',
    targetType: EntityType.BOARD,
    reactions: 412,
    theme: '#FAF5E8', // soft sunlight
    mediaType: 'note',
    category: 'tears',
    isBlurred: true,
    statusBadge: '😭 BROUGHT THEM TO TEARS'
  },
  {
    id: 'audio-mic',
    authorName: 'Anonymous',
    content: 'A heartfelt voice recording of sheer appreciation for helping through university',
    type: 'audio',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-18T10:00:00Z',
    targetId: 'global',
    targetType: EntityType.EVENT,
    reactions: 45,
    theme: '#FAF0EC', // cozy peach
    mediaType: 'audio',
    category: 'tears',
    isBlurred: true,
    statusBadge: '😭 BROUGHT THEM TO TEARS'
  },
  {
    id: 'davido-feed',
    authorName: 'Davido Fans',
    content: '5ive Tour @ Canada. Unbelievable energy. Pure historic status!',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=500',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-18T12:00:00Z',
    targetId: 'davido',
    targetType: EntityType.WALL,
    reactions: 1200000,
    sponsor: 'Microsoft Inc',
    theme: '#272835', // cosmic slate
    category: 'hype',
    statusBadge: '🔥 INSTANT VIRAL'
  }
];

interface TopNavigationProps {
  onFilterClick: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onFilterClick }) => {
  return (
    <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-[50]">
      {/* Brand logo - left */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 shrink-0 aspect-square rounded-full bg-[#FE6349] flex items-center justify-center relative cursor-pointer transform hover:rotate-6 transition-all">
          <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-white inline-block"></span>
              <span className="w-1 h-1 rounded-full bg-white inline-block"></span>
            </div>
          </div>
        </div>
        <span className="font-extrabold text-lg text-gray-900 tracking-tight hidden sm:block">Heartboard</span>
      </div>

      {/* Search - center */}
      <div className="flex-grow w-full mx-4 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4ABB8]">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          placeholder="Search name, location event..."
          className="w-full bg-gray-25 border-0 rounded-full py-2.5 pl-12 pr-6 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white transition-all outline-none"
        />
      </div>

      {/* Sliders config - right */}
      <button 
        onClick={onFilterClick}
        aria-label="Open filters"
        className="w-10 h-10 shrink-0 aspect-square rounded-full bg-gray-25 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
      >
        <SlidersHorizontal size={18} strokeWidth={2.5} />
      </button>
    </header>
  );
};

const HeroPulseFeed: React.FC<{ onGiftVouchClick: () => void }> = ({ onGiftVouchClick }) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const mockLiveActivities = [
    { sender: "Mercy24", heartType: "Loving Heart 💖", receiver: "Matthew", color: "text-[#FE6349]", hexColor: "#FE6349" },
    { sender: "Amino", heartType: "Reliable Heart 🧡", receiver: "Cristiano", color: "text-amber-500", hexColor: "#F59E0B" },
    { sender: "Sarah", heartType: "Hard Work Heart 💚", receiver: "Alex", color: "text-emerald-500", hexColor: "#10B981" },
    { sender: "Seyi", heartType: "Workspace Legend 💜", receiver: "Ronike", color: "text-indigo-500", hexColor: "#6366F1" },
    { sender: "Tyler", heartType: "Inspiration Heart ✨", receiver: "James", color: "text-yellow-500", hexColor: "#EAB308" },
    { sender: "Sophia", heartType: "Loving Heart 💖", receiver: "Emma", color: "text-rose-500", hexColor: "#F43F5E" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % mockLiveActivities.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentActivity = mockLiveActivities[activeMessageIndex];

  return (
    <div className="relative w-full overflow-visible bg-white py-[72px] md:py-[104px] flex flex-col items-center justify-center">
      {/* Scattered Yellow Floating Hearts - Exactly like Mockup */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Yellow Heart 1 (Top Left) */}
        <motion.div 
          className="absolute z-20"
          style={{ top: '15%', left: '12%' }}
          animate={{ 
            y: [0, -12, 0], 
            scale: [1, 1.05, 1], 
            rotate: [0, 5, 0],
            color: currentActivity.hexColor
          }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            color: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>

        {/* Yellow Heart 2 (Mid Left) */}
        <motion.div 
          className="absolute z-20"
          style={{ top: '48%', left: '26%' }}
          animate={{ 
            y: [0, 10, 0], 
            scale: [1, 1.08, 1], 
            rotate: [0, -8, 0],
            color: currentActivity.hexColor
          }}
          transition={{ 
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            color: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>

        {/* Yellow Heart 3 (Mid Right) */}
        <motion.div 
          className="absolute z-20"
          style={{ top: '24%', left: '88%' }}
          animate={{ 
            y: [0, -8, 0], 
            scale: [1, 1.03, 1], 
            rotate: [0, 6, 0],
            color: currentActivity.hexColor
          }}
          transition={{ 
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            color: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>

        {/* Yellow Heart 4 (Bottom Right) */}
        <motion.div 
          className="absolute z-20"
          style={{ top: '51%', left: '72%' }}
          animate={{ 
            y: [0, 15, 0], 
            scale: [1, 1.1, 1], 
            rotate: [0, -10, 0],
            color: currentActivity.hexColor
          }}
          transition={{ 
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            color: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      </div>

      {/* Giant Central Yellow Speech Bubble + Smiley Heart */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Concentric Radial Rings Background (8% opacity stroke, centered around central heart icon) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              animate={{ borderColor: currentActivity.hexColor }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ opacity: 0.08 }}
              className="w-[640px] h-[640px] border rounded-full animate-ping absolute pointer-events-none"
            />
            {[
              "w-[640px] h-[640px]",
              "w-[760px] h-[760px]",
              "w-[880px] h-[880px]",
              "w-[1000px] h-[1000px]",
              "w-[1120px] h-[1120px]",
              "w-[1240px] h-[1240px]",
              "w-[1360px] h-[1360px]",
            ].map((sizeClass, idx) => (
              <motion.div
                key={idx}
                animate={{ borderColor: currentActivity.hexColor }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ opacity: 0.08 }}
                className={`${sizeClass} border rounded-full absolute bg-transparent pointer-events-none`}
              />
            ))}
          </div>

          <motion.div 
            animate={{ backgroundColor: currentActivity.hexColor + "1A" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center relative z-10"
          >
          {/* Yellow Speech Bubble */}
          <motion.div 
            animate={{ backgroundColor: currentActivity.hexColor }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full flex items-center justify-center relative"
          >
            <motion.div 
              animate={{ backgroundColor: currentActivity.hexColor }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute -bottom-1 -left-1 w-9 h-9 rounded-br-2xl transform rotate-12"
            />
            
            {/* Inner White Heart */}
            <div className="w-20 h-20 md:w-24 md:h-24 fill-white flex items-center justify-center relative z-20">
              <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {/* Smiling face inside the heart */}
              <motion.div 
                animate={{ color: currentActivity.hexColor }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-[32%] md:top-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              >
                <div className="flex gap-2">
                  <motion.span 
                    animate={{ backgroundColor: currentActivity.hexColor }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full inline-block"
                  />
                  <motion.span 
                    animate={{ backgroundColor: currentActivity.hexColor }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full inline-block"
                  />
                </div>
                <svg className="w-7 h-4 fill-none" viewBox="0 0 20 10">
                  <path d="M2,2 Q10,11 18,2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Highly Animated Real-Time Ticker */}
      <div className="mt-8 relative h-10 w-full max-w-md overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMessageIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-25/90 backdrop-blur-sm py-2 px-2 rounded-full flex items-center gap-1 text-[13px] text-gray-800"
          >
            <span className="font-bold text-gray-900">{currentActivity.sender}</span>
            <span>blew a</span>
            <span className={`font-bold select-none ${currentActivity.color}`}>{currentActivity.heartType}</span>
            <span>to</span>
            <span className="font-bold text-gray-900">@{currentActivity.receiver}</span>
          </motion.div>
        </AnimatePresence>
      </div>


    </div>
  );
};

interface BottomNavProps {
  activeTab: 'home' | 'hearts';
  setActiveTab: (tab: 'home' | 'hearts') => void;
  onPlusClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onPlusClick }) => {
  return (
    <nav 
      id="main-bottom-navbar" 
      className="fixed bottom-0 left-0 right-0 z-[100] w-full bg-white py-3.5 px-6"
    >
      <div className="max-w-xs mx-auto flex items-center justify-center gap-12 sm:gap-16">
        {/* Home Button */}
        <button 
          id="bottom-nav-home"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Home"
          className="p-1.5 text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-110 active:scale-90"
        >
          <Home className="w-6 h-6" strokeWidth={1.8} />
        </button>

        {/* Plus Button */}
        <button 
          id="bottom-nav-plus"
          onClick={onPlusClick}
          aria-label="Create Appreciation"
          className="p-1.5 text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-110 active:scale-90"
        >
          <Plus className="w-6 h-6" strokeWidth={1.8} />
        </button>

        {/* Heart Button */}
        <button 
          id="bottom-nav-heart"
          onClick={() => {
            setActiveTab('hearts');
          }}
          aria-label="My Heartboard"
          className="p-1.5 text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-110 active:scale-90"
        >
          <Heart className="w-6 h-6" strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
};

const MasonryFeed = ({ 
  posts, 
  onPostClick,
  activeFilter,
  setActiveFilter
}: { 
  posts: any[], 
  onPostClick: (index: number) => void,
  activeFilter: 'all' | 'tears' | 'vouch' | 'hype',
  setActiveFilter: (filter: 'all' | 'tears' | 'vouch' | 'hype') => void
}) => {
  return (
    <div className="app-container pb-40 px-6 md:px-12 mt-12">
      {/* Category Pills Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <span>❤️</span> Most Loved Today
          </h2>
          <p className="text-gray-500 font-bold text-xs mt-2">
            8.3k message, 245 curators, 7.6M reactions
          </p>
        </div>


      </div>

      {/* Grid rendering with smooth animations */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center">
          <p className="text-gray-400 font-bold text-lg">No heartfelt notes found in this category.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id} 
              className="break-inside-avoid relative"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card container */}
              <PostCard post={post} onClick={() => onPostClick(index)} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'tears' | 'vouch' | 'hype'>('all');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'hearts'>('home');

  const handleTabChange = (tab: 'home' | 'hearts') => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      setActiveFilter('all');
    } else if (tab === 'hearts') {
      setActiveFilter('tears');
    }
  };

  const handlePrev = () => {
    setSelectedPostIndex((prev) => 
      prev !== null ? (prev - 1 + posts.length) % posts.length : null
    );
  };

  const handleNext = () => {
    setSelectedPostIndex((prev) => 
      prev !== null ? (prev + 1) % posts.length : null
    );
  };

  const handleNewPost = (newPost: any) => {
    // Determine target category
    let inferredCategory: 'tears' | 'vouch' | 'hype' = 'hype';
    let label = '🔥 NEW VIBE';
    if (newPost.type === 'text') {
      inferredCategory = 'tears';
      label = '😭 BROUGHT THEM TO TEARS';
    } else if (newPost.type === 'audio') {
      inferredCategory = 'tears';
      label = '😭 HEART VOUCH';
    } else {
      inferredCategory = 'vouch';
      label = '⭐ VOUCH CERTIFIED';
    }

    const postWithTheme = {
      visibility: PostVisibility.PUBLIC,
      targetType: newPost.targetType || EntityType.WALL,
      ...newPost,
      reactions: Math.floor(Math.random() * 200) + 5,
      theme: newPost.theme || '#FAF5E8',
      mediaType: newPost.type === 'text' ? 'note' : newPost.type,
      category: inferredCategory,
      statusBadge: label
    };
    setPosts([postWithTheme, ...posts]);
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeFilter);

  // Return mapped index of selected post relative to parent posts collection
  const postsForModal = filteredPosts;

  const handleModalPrev = () => {
    if (selectedPostIndex === null) return;
    const currentPost = filteredPosts[selectedPostIndex];
    const totalPostsIndex = posts.findIndex(p => p.id === currentPost.id);
    const prevTotalIndex = (totalPostsIndex - 1 + posts.length) % posts.length;
    setSelectedPostIndex(filteredPosts.findIndex(p => p.id === posts[prevTotalIndex].id) === -1 ? 0 : filteredPosts.findIndex(p => p.id === posts[prevTotalIndex].id));
  };

  const handleModalNext = () => {
    if (selectedPostIndex === null) return;
    const currentPost = filteredPosts[selectedPostIndex];
    const totalPostsIndex = posts.findIndex(p => p.id === currentPost.id);
    const nextTotalIndex = (totalPostsIndex + 1) % posts.length;
    setSelectedPostIndex(filteredPosts.findIndex(p => p.id === posts[nextTotalIndex].id) === -1 ? 0 : filteredPosts.findIndex(p => p.id === posts[nextTotalIndex].id));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-orange-100">
        {activeNavTab === 'home' ? (
          <>
            <TopNavigation onFilterClick={() => setIsFilterModalOpen(true)} />
            
            {/* Concentric radar hero feed */}
            <HeroPulseFeed onGiftVouchClick={() => setIsCreateModalOpen(true)} />

            <main className="flex-grow bg-white">
              <Routes>
                <Route path="/" element={
                  <MasonryFeed 
                    posts={filteredPosts} 
                    onPostClick={setSelectedPostIndex} 
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                } />
                <Route path="*" element={
                  <MasonryFeed 
                    posts={filteredPosts} 
                    onPostClick={setSelectedPostIndex} 
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                } />
              </Routes>
            </main>
          </>
        ) : (
          <main className="flex-grow bg-white">
            <HeartboardView 
              onFilterClick={() => setIsFilterModalOpen(true)}
              onPostClick={(post) => {
                const foundIndex = posts.findIndex(p => p.id === post.id);
                if (foundIndex !== -1) {
                  setSelectedPostIndex(foundIndex);
                } else {
                  setSelectedPostIndex(0);
                }
              }}
            />
          </main>
        )}

        <BottomNav 
          activeTab={activeNavTab} 
          setActiveTab={handleTabChange} 
          onPlusClick={() => setIsCreateModalOpen(true)} 
        />

        {isCreateModalOpen && (
          <CreateAppreciationModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onPostCreated={handleNewPost}
          />
        )}

        <FilterModal 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilter={(selectedOptionId) => {
            console.log("Selected filter category:", selectedOptionId);
          }}
        />

        {selectedPostIndex !== null && filteredPosts[selectedPostIndex] && (
          <MediaModal 
            post={filteredPosts[selectedPostIndex]} 
            onClose={() => setSelectedPostIndex(null)}
            onPrev={() => setSelectedPostIndex((prev) => prev !== null ? (prev - 1 + filteredPosts.length) % filteredPosts.length : null)}
            onNext={() => setSelectedPostIndex((prev) => prev !== null ? (prev + 1) % filteredPosts.length : null)}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
