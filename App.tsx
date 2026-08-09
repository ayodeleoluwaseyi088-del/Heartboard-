
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EntityType, Post, PostVisibility, MOCK_REGISTERED_USERS, RegisteredUser } from './types';
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
  Plus,
  User,
  X,
  ArrowLeft,
  TrendingUp,
  Hash
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
  inactive?: boolean;
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
    statusBadge: '🔥 PURE HYPE STATUS',
    isCreatedByUser: true,
    section: 'board'
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
    statusBadge: '⭐ HIGH-AUTHORITY VOUCH',
    isTaggedForUser: true,
    section: 'tagged'
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
    statusBadge: '🔥 GOLDEN REP',
    isCreatedByUser: true,
    section: 'board'
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
    statusBadge: '🛡️ PLATINUM VOUCH',
    isCreatedByUser: true,
    section: 'board'
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
    statusBadge: '😭 BROUGHT THEM TO TEARS',
    isCreatedByUser: true,
    section: 'board'
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
    statusBadge: '😭 BROUGHT THEM TO TEARS',
    isCreatedByUser: true,
    section: 'board'
  },
  {
    id: 'heart-token-sample',
    authorName: 'Mercy24',
    recipientName: 'Micky Mouse',
    content: 'Loving Heart 💖 blown to Micky Mouse with deepest appreciation!',
    type: 'heart_token',
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-03-21T08:00:00Z',
    targetId: 'mickymouse',
    targetType: EntityType.WALL,
    reactions: 88,
    theme: '#FAF0EC',
    frameBg: '#FAF0EC',
    heartDetails: {
      label: 'Loving Partner',
      emoji: '💖',
      bubbleColor: '#FE6349'
    },
    category: 'vouch',
    statusBadge: '💖 HEART TOKEN',
    isHeartToken: true,
    section: 'hearts'
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  posts: any[];
  onSelectBoard: (post: any) => void;
  onSelectUser?: (user: RegisteredUser) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  onFilterClick, 
  searchQuery, 
  setSearchQuery, 
  posts, 
  onSelectBoard,
  onSelectUser
}) => {
  const [isFullPageOpen, setIsFullPageOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<'all' | 'users' | 'boards' | 'hashtags'>('all');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close full page search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullPageOpen) {
        setIsFullPageOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullPageOpen]);

  const query = searchQuery.trim().toLowerCase();

  // Filter registered user accounts
  const matchingUsers = MOCK_REGISTERED_USERS.filter((user) => {
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.handle.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query) ||
      (user.role && user.role.toLowerCase().includes(query))
    );
  });

  // Filter created boards
  const matchingBoards = posts.filter((post) => {
    if (!query) return true;
    const author = (post.authorName || '').toLowerCase();
    const recipient = (post.recipientName || post.targetId || '').toLowerCase();
    const content = (post.content || '').toLowerCase();
    const badge = (post.statusBadge || '').toLowerCase();
    const cat = (post.category || '').toLowerCase();
    return (
      author.includes(query) ||
      recipient.includes(query) ||
      content.includes(query) ||
      badge.includes(query) ||
      cat.includes(query)
    );
  });

  const popularHashtags = [
    { tag: '#loveRonaldo', count: '890k hearts', category: 'Global Icon' },
    { tag: '#messi', count: '2.1M hearts', category: 'Legend' },
    { tag: '#30BG', count: '1.2M hearts', category: 'Official Celebrity' },
    { tag: '#BeyHive', count: '12.4k hearts', category: 'Community' },
    { tag: '#WorkplaceHeroes', count: '1.8k hearts', category: 'Vouches' }
  ].filter(h => !query || h.tag.toLowerCase().includes(query) || h.category.toLowerCase().includes(query));

  const hasSearchInput = searchQuery.trim().length > 0;

  return (
    <>
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-[50]">
        {/* Brand logo - left */}
        <div 
          onClick={() => {
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 shrink-0 aspect-square rounded-full bg-[#FE6349] flex items-center justify-center relative transform hover:rotate-6 transition-all">
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

        {/* Search - center (Target selector: header > div:nth-of-type(2) > input:nth-of-type(1)) */}
        <div className="flex-grow w-full mx-4 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4ABB8] pointer-events-none z-10">
            <Search size={18} strokeWidth={2.5} />
          </div>
          
          <input 
            type="text" 
            value={searchQuery}
            onClick={() => setIsFullPageOpen(true)}
            onFocus={() => setIsFullPageOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsFullPageOpen(true);
            }}
            placeholder="Search user accounts (@mercy, @ronaldo), created boards..."
            className="w-full bg-gray-25 border border-transparent hover:border-rose-200 focus:border-rose-300 rounded-full py-2.5 pl-12 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white active:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 outline-none transition-all duration-200 shadow-2xs cursor-pointer"
          />

          {hasSearchInput && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-all cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Sliders config - right */}
        <button 
          onClick={onFilterClick}
          aria-label="Open filters"
          className="w-10 h-10 shrink-0 aspect-square rounded-full bg-gray-25 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all cursor-pointer hover:bg-gray-100"
        >
          <SlidersHorizontal size={18} strokeWidth={2.5} />
        </button>
      </header>

      {/* Full Page Expanded Search Overlay */}
      <AnimatePresence>
        {isFullPageOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[200] bg-white text-gray-900 flex flex-col h-screen w-screen overflow-hidden"
          >
            {/* Full-Page Search Header */}
            <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex flex-col gap-4 shadow-2xs">
              <div className="flex items-center justify-between gap-4">
                {/* Back / Exit Button */}
                <button
                  onClick={() => setIsFullPageOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition-all cursor-pointer shrink-0"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Back</span>
                </button>

                {/* Expanded Search Bar Container */}
                <div className="flex-grow max-w-3xl relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FE6349] pointer-events-none">
                    <Search size={20} strokeWidth={2.5} />
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search registered accounts (@handle), created boards, or #hashtags..."
                    className="w-full bg-gray-50 focus:bg-white border-2 border-rose-100 focus:border-[#FE6349] rounded-2xl py-3 pl-12 pr-12 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all shadow-xs"
                  />

                  {hasSearchInput && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-all cursor-pointer"
                      aria-label="Clear text"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                {/* Close Esc Button */}
                <button
                  onClick={() => setIsFullPageOpen(false)}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-[#FE6349] text-gray-500 transition-all cursor-pointer shrink-0"
                  title="Press ESC to exit"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Filter Tabs & Shortcuts */}
              <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSearchTab('all')}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      activeSearchTab === 'all'
                        ? 'bg-[#1A1B25] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Sparkles size={14} className={activeSearchTab === 'all' ? 'text-amber-300' : ''} />
                    <span>All Results</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                      {matchingUsers.length + matchingBoards.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSearchTab('users')}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      activeSearchTab === 'users'
                        ? 'bg-[#FE6349] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <User size={14} />
                    <span>User Accounts</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/10">
                      {matchingUsers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSearchTab('boards')}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      activeSearchTab === 'boards'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Award size={14} />
                    <span>Created Boards</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                      {matchingBoards.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSearchTab('hashtags')}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      activeSearchTab === 'hashtags'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Hash size={14} />
                    <span>Hashtags</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                      {popularHashtags.length}
                    </span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 font-medium shrink-0">
                  <span>Press <kbd className="px-2 py-1 bg-gray-100 border rounded font-mono text-[11px] font-bold text-gray-700">ESC</kbd> to exit</span>
                </div>
              </div>
            </div>

            {/* Scrollable Main Content Results Grid */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-8 py-6 bg-gray-25">
              <div className="max-w-7xl mx-auto space-y-10">

                {/* Quick Search Suggestions when query is empty */}
                {!hasSearchInput && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <TrendingUp size={14} className="text-[#FE6349]" /> Popular Searches & Accounts
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['@mercy24', '@cristiano', '@davido_30bg', '@messi', '#loveRonaldo', 'Birthday', 'World Cup', 'Appreciation'].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => setSearchQuery(chip)}
                          className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-[#FE6349] text-xs font-bold text-gray-700 transition-all cursor-pointer border border-transparent hover:border-rose-200"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1. Registered User Accounts Section */}
                {(activeSearchTab === 'all' || activeSearchTab === 'users') && matchingUsers.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase flex items-center gap-2">
                        <User size={16} className="text-[#FE6349]" />
                        <span>Registered Users</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#FE6349] text-xs font-extrabold">
                          {matchingUsers.length}
                        </span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {matchingUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setIsFullPageOpen(false);
                            if (onSelectUser) {
                              onSelectUser(user);
                            } else {
                              setSearchQuery(user.handle);
                            }
                          }}
                          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs hover:shadow-md hover:border-rose-200 transition-all cursor-pointer flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="relative">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                                />
                                {user.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-[#FE6349] text-white rounded-full p-1 shadow-xs">
                                    <Check size={10} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200/60">
                                ❤️ {user.heartsCount.toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#FE6349] transition-colors">
                                  {user.name}
                                </h3>
                                {user.role && (
                                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                                    {user.role}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-gray-400">
                                {user.handle}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                                {user.bio}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                            <span>{user.boardsCount} Boards Hosted</span>
                            <span className="text-[#FE6349] group-hover:translate-x-1 transition-transform">
                              View Profile →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Created Boards Section */}
                {(activeSearchTab === 'all' || activeSearchTab === 'boards') && matchingBoards.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase flex items-center gap-2">
                        <Award size={16} className="text-indigo-600" />
                        <span>Created Boards</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold">
                          {matchingBoards.length}
                        </span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {matchingBoards.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => {
                            onSelectBoard(post);
                            setIsFullPageOpen(false);
                          }}
                          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                        >
                          <div
                            className="absolute top-0 left-0 right-0 h-2"
                            style={{ backgroundColor: post.theme || '#FE6349' }}
                          />

                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-100">
                                🔥 {post.reactions?.toLocaleString() || 0} reactions
                              </span>
                              {post.statusBadge && (
                                <span className="text-[10px] font-bold text-gray-500">
                                  {post.statusBadge}
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-3 mb-4 leading-snug">
                              "{post.content}"
                            </p>
                          </div>

                          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold"
                                style={{ backgroundColor: post.theme || '#FE6349' }}
                              >
                                {post.authorName?.[0] || 'H'}
                              </div>
                              <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">
                                {post.authorName}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                              Open →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Popular Hashtags Section */}
                {(activeSearchTab === 'all' || activeSearchTab === 'hashtags') && popularHashtags.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase flex items-center gap-2">
                      <Hash size={16} className="text-emerald-600" />
                      <span>Popular Global Heart Tags</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {popularHashtags.map((h) => (
                        <div
                          key={h.tag}
                          onClick={() => {
                            setSearchQuery(h.tag);
                            setActiveSearchTab('all');
                          }}
                          className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-sm">
                              #
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                {h.tag}
                              </h4>
                              <p className="text-xs text-gray-400 font-medium">{h.category}</p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                            {h.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Empty State */}
                {matchingUsers.length === 0 && matchingBoards.length === 0 && (
                  <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl p-8 border border-gray-100 shadow-2xs">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-[#FE6349] flex items-center justify-center mb-4">
                      <Search size={32} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      No matching accounts or boards found
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                      {hasSearchInput 
                        ? `We couldn't find any registered accounts or boards for "${searchQuery}". Try searching for @mercy24, @cristiano, or #30BG.`
                        : "Start typing above to discover registered accounts, created boards, or global heart tags."
                      }
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-5 px-5 py-2.5 rounded-full bg-[#FE6349] text-white text-xs font-extrabold hover:bg-rose-600 transition-all shadow-2xs cursor-pointer"
                    >
                      Reset Search Term
                    </button>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

const formatStatNumber = (num: number): string => {
  if (num >= 1000000) {
    const val = (num / 1000000).toFixed(1);
    return (val.endsWith('.0') ? Math.floor(num / 1000000) : val) + 'M';
  }
  if (num >= 1000) {
    const val = (num / 1000).toFixed(1);
    return (val.endsWith('.0') ? Math.floor(num / 1000) : val) + 'k';
  }
  return num.toLocaleString();
};

const MasonryFeed = ({ 
  posts, 
  onPostClick,
  activeFilter,
  setActiveFilter,
  realtimeStats,
  searchQuery,
  setSearchQuery,
  matchingUsersCount
}: { 
  posts: any[], 
  onPostClick: (index: number) => void,
  activeFilter: 'all' | 'tears' | 'vouch' | 'hype',
  setActiveFilter: (filter: 'all' | 'tears' | 'vouch' | 'hype') => void,
  realtimeStats: { totalMessages: number; totalCurators: number; totalReactions: number },
  searchQuery: string,
  setSearchQuery: (query: string) => void,
  matchingUsersCount: number
}) => {
  return (
    <div className="app-container pb-40 px-6 md:px-12 mt-12">
      {/* Category Pills Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <span>❤️</span> Most Loved Today
          </h2>
          <p className="text-gray-500 font-bold text-xs mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-[10px] tracking-wider uppercase border border-emerald-100/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE DATA
            </span>
            <span>
              <strong className="text-gray-900 font-extrabold">{formatStatNumber(realtimeStats.totalMessages)}</strong> messages
            </span>
            <span className="text-gray-300">•</span>
            <span>
              <strong className="text-gray-900 font-extrabold">{formatStatNumber(realtimeStats.totalCurators)}</strong> curators
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <strong className="text-[#FE6349] font-extrabold transition-all duration-300">{formatStatNumber(realtimeStats.totalReactions)}</strong> reactions
              <span className="text-[11px] text-rose-500 font-semibold animate-bounce">💖</span>
            </span>
          </p>
        </div>
      </div>

      {/* Search active banner indicator */}
      {searchQuery.trim() && (
        <div className="bg-rose-50/90 border border-rose-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs text-gray-900">
            <Search className="w-4 h-4 text-[#FE6349] shrink-0" />
            <span>
              Showing results for <strong className="font-extrabold text-[#FE6349]">"{searchQuery}"</strong>
              {' '}(Found {posts.length} board{posts.length !== 1 ? 's' : ''} {matchingUsersCount > 0 ? `& ${matchingUsersCount} user account${matchingUsersCount !== 1 ? 's' : ''}` : ''})
            </span>
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-[#FE6349] hover:text-rose-700 bg-white border border-rose-200/80 px-3 py-1 rounded-full hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            Clear Search ✕
          </button>
        </div>
      )}

      {/* Grid rendering with smooth animations */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-2xs">
          <p className="text-gray-400 font-bold text-lg">No heartfelt notes or boards found.</p>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-2 rounded-full bg-[#FE6349] text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-2xs"
            >
              Reset Search Filter
            </button>
          )}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'hearts'>('home');
  const [liveReactionTicks, setLiveReactionTicks] = useState(0);

  // Profile view states
  const [viewingProfileUser, setViewingProfileUser] = useState<RegisteredUser | null>(null);
  const [createModalRecipient, setCreateModalRecipient] = useState<{ id?: string; name: string; handle: string; avatar?: string } | undefined>(undefined);
  const [createModalMode, setCreateModalMode] = useState<'create_message' | 'send_heart' | undefined>(undefined);

  const handleGiftHeartForUser = (user: RegisteredUser) => {
    setCreateModalRecipient({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar
    });
    setCreateModalMode('send_heart');
    setIsCreateModalOpen(true);
  };

  const handleSendMessageForUser = (user: RegisteredUser) => {
    setCreateModalRecipient({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar
    });
    setCreateModalMode('create_message');
    setIsCreateModalOpen(true);
  };

  const handleSelectUser = (user: RegisteredUser) => {
    setViewingProfileUser(user);
  };

  // Real-time ticker effect simulating global hearts blown continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveReactionTicks(prev => prev + Math.floor(Math.random() * 4) + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Calculate live real-time statistics dynamically
  const totalMessagesCount = 8300 + (posts.length - INITIAL_MOCK_POSTS.length);
  const uniqueAuthorsCount = 245 + new Set(posts.map(p => p.authorName)).size;
  const postsReactionsSum = posts.reduce((sum, p) => sum + (p.reactions || 0), 0);
  const totalReactionsCount = 7600000 + postsReactionsSum + liveReactionTicks;

  const realtimeStats = {
    totalMessages: totalMessagesCount,
    totalCurators: uniqueAuthorsCount,
    totalReactions: totalReactionsCount
  };

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

  const query = searchQuery.trim().toLowerCase();

  const matchingUsersCount = MOCK_REGISTERED_USERS.filter((user) => {
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.handle.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query) ||
      (user.role && user.role.toLowerCase().includes(query))
    );
  }).length;

  const filteredPosts = posts.filter(post => {
    // Filter category
    if (activeFilter !== 'all' && post.category !== activeFilter) {
      return false;
    }
    // Filter search query
    if (query) {
      const author = (post.authorName || '').toLowerCase();
      const recipient = (post.recipientName || post.targetId || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      const badge = (post.statusBadge || '').toLowerCase();
      const cat = (post.category || '').toLowerCase();

      return (
        author.includes(query) ||
        recipient.includes(query) ||
        content.includes(query) ||
        badge.includes(query) ||
        cat.includes(query)
      );
    }
    return true;
  });

  const handleSelectBoardFromSearch = (post: any) => {
    const idx = filteredPosts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      setSelectedPostIndex(idx);
    } else {
      const globalIdx = posts.findIndex(p => p.id === post.id);
      if (globalIdx !== -1) {
        setSelectedPostIndex(globalIdx);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-orange-100">
        {viewingProfileUser ? (
          <main className="flex-grow bg-white">
            <HeartboardView  
              profileUser={viewingProfileUser}
              onBack={() => setViewingProfileUser(null)}
              onGiftHeart={handleGiftHeartForUser}
              onSendMessage={handleSendMessageForUser}
              onSelectUser={handleSelectUser}
              posts={posts}
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
        ) : activeNavTab === 'home' ? (
          <>
            <TopNavigation 
              onFilterClick={() => setIsFilterModalOpen(true)} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              posts={posts}
              onSelectBoard={handleSelectBoardFromSearch}
              onSelectUser={handleSelectUser}
            />
            
            {/* Concentric radar hero feed */}
            <HeroPulseFeed onGiftVouchClick={() => {
              setCreateModalRecipient(undefined);
              setCreateModalMode(undefined);
              setIsCreateModalOpen(true);
            }} />

            <main className="flex-grow bg-white">
              <Routes>
                <Route path="/" element={
                  <MasonryFeed 
                    posts={filteredPosts} 
                    onPostClick={setSelectedPostIndex} 
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    realtimeStats={realtimeStats}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    matchingUsersCount={matchingUsersCount}
                  />
                } />
                <Route path="*" element={
                  <MasonryFeed 
                    posts={filteredPosts} 
                    onPostClick={setSelectedPostIndex} 
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    realtimeStats={realtimeStats}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    matchingUsersCount={matchingUsersCount}
                  />
                } />
              </Routes>
            </main>
          </>
        ) : (
          <main className="flex-grow bg-white">
            <HeartboardView  
              posts={posts}
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
          setActiveTab={(tab) => {
            handleTabChange(tab);
            setViewingProfileUser(null);
          }} 
          onPlusClick={() => {
            setCreateModalRecipient(undefined);
            setCreateModalMode(undefined);
            setIsCreateModalOpen(true);
          }} 
        />

        {isCreateModalOpen && (
          <CreateAppreciationModal 
            onClose={() => {
              setIsCreateModalOpen(false);
              setCreateModalRecipient(undefined);
              setCreateModalMode(undefined);
            }} 
            onPostCreated={handleNewPost}
            initialRecipient={createModalRecipient}
            initialMode={createModalMode}
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
