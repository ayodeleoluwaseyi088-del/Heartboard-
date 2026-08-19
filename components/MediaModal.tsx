import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Post, Contribution, PostVisibility, ReactionCounts, RegisteredUser, MOCK_REGISTERED_USERS } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  UserCheck, 
  LayoutGrid, 
  Sparkles,
  Check
} from 'lucide-react';
import {
  HandsClapping,
  Heart as PhosphorHeart,
  Smiley as PhosphorSmiley,
  Fire as PhosphorFire,
  ShareFat,
  Flag as PhosphorFlag,
  Plus as PhosphorPlus
} from '@phosphor-icons/react';
import { ConfettiOverlay } from './ConfettiOverlay';
import { CanvasReadOnlyCard } from './CreateAppreciationModal';
import { ShareProfileModal } from './ShareProfileModal';
import { ActionMenuModal } from './ActionMenuModal';

interface MediaModalProps {
  post: Post & { 
    theme?: string; 
    mediaType?: 'audio' | 'video' | 'image' | 'text' | 'note';
    sponsor?: string;
    sticker?: string;
    confetti?: string;
    secondaryImage?: string;
    isBlurred?: boolean;
    statusBadge?: string;
    selectedHearts?: string[];
  };
  currentUser?: RegisteredUser | null;
  onRequireAuth?: (prompt?: string) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onAddContributionClick?: (post: Post) => void;
  onReactionBlown?: (postId: string) => void;
  onUpdateReactions?: (postId: string, counts: ReactionCounts, userReactions: ('clap' | 'heart' | 'smiley' | 'fire')[]) => void;
  onEditBoard?: (post: Post) => void;
  onDeleteBoard?: (postId: string) => void;
  onEditMessage?: (post: Post, contribution?: Contribution) => void;
  onDeleteMessage?: (post: Post, contribution?: Contribution) => void;
  onSelectUser?: (user: RegisteredUser) => void;
  onSelectHashtag?: (tag: string) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ 
  post, 
  currentUser,
  onRequireAuth,
  onClose, 
  onPrev, 
  onNext, 
  onAddContributionClick,
  onReactionBlown,
  onUpdateReactions,
  onEditBoard,
  onDeleteBoard,
  onEditMessage,
  onDeleteMessage,
  onSelectUser,
  onSelectHashtag
}) => {
  // Toggle between 'main' (Main Board) and 'contributions' (Contributions by other curators)
  const [activeTab, setActiveTab] = useState<'main' | 'contributions'>('main');
  // Index for navigating through multiple contribution messages
  const [activeContributionIndex, setActiveContributionIndex] = useState(0);
  
  // Helper to get real initial reaction breakdown
  const getInitialReactionCounts = (p: Post): { clap: number; heart: number; smiley: number; fire: number } => {
    if (p.reactionCounts) {
      return {
        clap: p.reactionCounts.clap ?? 0,
        heart: p.reactionCounts.heart ?? 0,
        smiley: p.reactionCounts.smiley ?? 0,
        fire: p.reactionCounts.fire ?? 0,
      };
    }
    const total = p.reactions || 0;
    if (total <= 0) return { clap: 0, heart: 0, smiley: 0, fire: 0 };
    if (total >= 10000) {
      return {
        clap: 34,
        heart: 11200,
        smiley: 1,
        fire: 64,
      };
    }
    if (total >= 1000) {
      return {
        clap: Math.max(1, Math.floor(total * 0.05)),
        heart: Math.floor(total * 0.88),
        smiley: Math.max(1, Math.floor(total * 0.005)),
        fire: Math.floor(total * 0.065),
      };
    }
    return {
      clap: Math.floor(total * 0.08),
      heart: Math.floor(total * 0.82),
      smiley: Math.max(0, Math.floor(total * 0.02)),
      fire: Math.floor(total * 0.08),
    };
  };

  // Interactive reaction states
  const [reactionCounts, setReactionCounts] = useState(() => getInitialReactionCounts(post));
  const [userReactions, setUserReactions] = useState<('clap' | 'heart' | 'smiley' | 'fire')[]>(() => post.userReactions || []);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [showContributorDetails, setShowContributorDetails] = useState(false);
  const [showFlagToast, setShowFlagToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Single Click vs Double Click Disambiguation Ref
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Contributions list
  const contributions: Contribution[] = post.contributions || [];
  const hasContributions = contributions.length > 0;

  // Identify all contributions made by the current user on this board (independent of the currently viewed contribution)
  const isCreator = Boolean(post.isCreatedByUser ?? true);
  const userContributions = useMemo(() => {
    return contributions.filter((c) => 
      c.isCreatedByUser === true || 
      c.authorName === 'Nancy98' || 
      c.authorName === 'Mercy24' || 
      c.authorHandle === '@nancy98' || 
      c.authorHandle === '@mercy24'
    );
  }, [contributions]);
  const maxCapacity = post.maxCapacity || (post.boardCapacity === 'solo' ? 1 : 20);
  const isSoloMode = post.boardCapacity === 'solo' || maxCapacity === 1;
  const isCapacityReached = contributions.length >= maxCapacity;
  const canToggleContributions = !isSoloMode && contributions.length > 0;
  const effectiveActiveTab = canToggleContributions ? activeTab : 'main';

  // Track previous post ID and contribution count to handle smooth contribution addition
  const prevPostIdRef = useRef(post.id);
  const prevContribCountRef = useRef((post.contributions || []).length);

  // Reset or update tab and reactions when post changes
  useEffect(() => {
    const currentContribCount = (post.contributions || []).length;
    if (prevPostIdRef.current !== post.id) {
      // Navigated to a different post
      prevPostIdRef.current = post.id;
      prevContribCountRef.current = currentContribCount;
      setActiveTab('main');
      setActiveContributionIndex(0);
      setShowContributorDetails(false);
      setIsActionMenuOpen(false);
      setIsReactionPickerOpen(false);
      setReactionCounts(getInitialReactionCounts(post));
      setUserReactions(post.userReactions || []);
    } else if (currentContribCount > prevContribCountRef.current) {
      // New contribution added to this same post -> immediately show contributions tab with the newest contribution
      prevContribCountRef.current = currentContribCount;
      setActiveTab('contributions');
      setActiveContributionIndex(currentContribCount - 1);
      setReactionCounts(getInitialReactionCounts(post));
      setUserReactions(post.userReactions || []);
    } else {
      prevContribCountRef.current = currentContribCount;
      setReactionCounts(getInitialReactionCounts(post));
      setUserReactions(post.userReactions || []);
    }
  }, [post]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Board click handler with distinct single-click and double-click behaviors
  const handleBoardCardClick = (e: React.MouseEvent) => {
    if (clickTimerRef.current) {
      // Double click detected! Cancel single click and open Action Page
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      setIsActionMenuOpen(true);
    } else {
      // First click: wait briefly to see if a second click arrives
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        setShowContributorDetails((prev) => !prev);
      }, 240);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevMessage();
      } else if (e.key === 'ArrowRight') {
        handleNextMessage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeContributionIndex, contributions.length, onPrev, onNext]);

  // Current active message depending on tab
  const activeMessage = effectiveActiveTab === 'main' 
    ? post 
    : (contributions[activeContributionIndex] || post);

  // Navigation handlers
  const handlePrevMessage = () => {
    if (effectiveActiveTab === 'contributions' && contributions.length > 1) {
      setActiveContributionIndex((prev) => 
        (prev - 1 + contributions.length) % contributions.length
      );
    } else {
      onPrev();
    }
  };

  const handleNextMessage = () => {
    if (effectiveActiveTab === 'contributions' && contributions.length > 1) {
      setActiveContributionIndex((prev) => 
        (prev + 1) % contributions.length
      );
    } else {
      onNext();
    }
  };

  // Frame Background resolution (reusing main curator's theme consistently)
  const getFrameBg = () => {
    const theme = post.theme || '';
    if (theme.startsWith('#')) return theme;
    if (theme.includes('bg-[')) {
      const match = theme.match(/bg-\[(#[0-9a-fA-F]+)\]/);
      if (match) return match[1];
    }
    if (theme.includes('slate') || theme.includes('272835')) return '#272835';
    if (theme.includes('mint') || theme.includes('ECEFE6')) return '#ECEFE6';
    if (theme.includes('sunset') || theme.includes('FAF5E8')) return '#FAF5E8';
    if (theme.includes('lavender') || theme.includes('EEF1FA')) return '#EEF1FA';
    if (theme.includes('peach') || theme.includes('F7F0ED') || theme.includes('FAF0EC')) return '#F7F0ED';
    return '#FEA735'; // Warm golden orange default matching mockup
  };

  const frameBgColor = getFrameBg();

  // Permanent Main Board Details (always retained regardless of active tab / contributions navigation)
  const mainBoardCaption = post.caption || post.content || 'Heartfelt Tribute Board';
  const mainCuratorName = post.authorName || 'Curator';
  const mainCuratorAvatar = post.authorAvatar;

  // Active message contributor details (for single-click contributor details overlay on the board)
  const activeContributorName = effectiveActiveTab === 'main'
    ? (post.authorName || 'Curator')
    : (activeMessage.authorName || 'Contributor');
  const activeContributorAvatar = effectiveActiveTab === 'main'
    ? post.authorAvatar
    : activeMessage.authorAvatar;

  // Helper to find or build registered user object
  const findRegisteredUser = (input: string): RegisteredUser => {
    const clean = input.trim().replace(/^@/, '').toLowerCase();
    // 1. Direct match on handle, id, or name
    const directMatch = MOCK_REGISTERED_USERS.find(u => 
      u.name.toLowerCase() === clean ||
      u.handle.toLowerCase() === `@${clean}` ||
      u.handle.toLowerCase() === clean ||
      u.id.toLowerCase() === clean ||
      u.id.toLowerCase() === `u-${clean}` ||
      u.name.toLowerCase().replace(/\s+/g, '') === clean.replace(/\s+/g, '')
    );
    if (directMatch) return directMatch;

    // 2. Partial match on name/handle
    const partialMatch = MOCK_REGISTERED_USERS.find(u => 
      u.name.toLowerCase().includes(clean) ||
      clean.includes(u.name.toLowerCase()) ||
      u.handle.toLowerCase().includes(clean)
    );
    if (partialMatch) return partialMatch;

    // 3. Fallback dynamically constructed RegisteredUser
    const rawDisplayName = input.trim().replace(/^@/, '');
    return {
      id: `u-${rawDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'user'}`,
      name: rawDisplayName.charAt(0).toUpperCase() + rawDisplayName.slice(1),
      handle: input.startsWith('@') ? input.trim() : `@${rawDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawDisplayName)}`,
      isVerified: false,
      heartsCount: 1,
      boardsCount: 1,
      bio: 'Heartboard member',
      role: 'Registered Member'
    };
  };

  const handleUserClick = (userNameOrHandle: string) => {
    const user = findRegisteredUser(userNameOrHandle);
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  const handleHashtagClick = (tag: string) => {
    const cleanTag = tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`;
    if (onSelectHashtag) {
      onSelectHashtag(cleanTag);
    }
  };

  // Extract structured recipient & hashtag tokens for display and interaction
  const displayTokens = useMemo(() => {
    interface RecipientToken {
      text: string;
      isHashtag: boolean;
      cleanTag?: string;
      userQuery?: string;
    }
    const tokens: RecipientToken[] = [];
    const added = new Set<string>();

    const addToken = (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || trimmed === '@you') return;
      if (added.has(trimmed.toLowerCase())) return;
      added.add(trimmed.toLowerCase());

      if (trimmed.startsWith('#')) {
        tokens.push({
          text: trimmed,
          isHashtag: true,
          cleanTag: trimmed,
        });
      } else {
        const formatted = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
        tokens.push({
          text: formatted,
          isHashtag: false,
          userQuery: trimmed,
        });
      }
    };

    if (Array.isArray(post.recipients) && post.recipients.length > 0) {
      post.recipients.forEach(r => addToken(r));
    } else if (post.recipientName) {
      post.recipientName.split(',').forEach(r => addToken(r));
    } else if (post.targetId) {
      addToken(post.targetId);
    }

    if (Array.isArray(post.hashtags)) {
      post.hashtags.forEach(h => addToken(h));
    }

    if (tokens.length === 0) {
      tokens.push({
        text: '@community',
        isHashtag: false,
        userQuery: 'community',
      });
    }

    return tokens;
  }, [post.recipients, post.recipientName, post.targetId, post.hashtags]);

  // Reaction formatting helper
  const formatReactionCount = (count?: number) => {
    if (!count || count <= 0) return null;
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };

  // Toggle specific reaction type
  const handleToggleReaction = (type: 'clap' | 'heart' | 'smiley' | 'fire') => {
    if (!currentUser && onRequireAuth) {
      setIsReactionPickerOpen(false);
      onRequireAuth('Please sign in or create an account to react and blow hearts.');
      return;
    }

    const isAlreadySelected = userReactions.includes(type);
    const newUserReactions = isAlreadySelected
      ? userReactions.filter((r) => r !== type)
      : [...userReactions, type];

    const currentCount = reactionCounts[type] || 0;
    const newCount = isAlreadySelected ? Math.max(0, currentCount - 1) : currentCount + 1;

    const newCounts = {
      ...reactionCounts,
      [type]: newCount,
    };

    setUserReactions(newUserReactions);
    setReactionCounts(newCounts);

    if (onUpdateReactions) {
      onUpdateReactions(post.id, newCounts, newUserReactions);
    }
    if (!isAlreadySelected && onReactionBlown) {
      onReactionBlown(post.id);
    }
  };

  // Handle flag click
  const handleFlagClick = () => {
    setShowFlagToast(true);
    setToastMessage('Board flagged for review. Thank you for keeping Heartboard safe.');
    setTimeout(() => {
      setShowFlagToast(false);
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-[#161722] text-white font-sans select-none overflow-y-auto antialiased"
      style={{ backgroundColor: '#161722' }}
    >
      {/* 1. TOP BAR */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between z-30 shrink-0">
        
        {/* Top-Left: Toggle / Switch Component (Main Board vs. Contributions) */}
        <div className="flex items-center bg-[#272835] border border-white/10 p-1 rounded-full shadow-md">
          {/* Main Board Button */}
          <button
            type="button"
            onClick={() => {
              if (canToggleContributions) {
                setActiveTab('main');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              canToggleContributions ? 'cursor-pointer' : 'cursor-default'
            } ${
              effectiveActiveTab === 'main'
                ? 'bg-white/20 text-white shadow-xs'
                : 'text-white/50 hover:text-white/80'
            }`}
            title="Main Board (Original by Curator)"
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Main Board</span>
          </button>

          {/* Contributions Button */}
          <button
            type="button"
            disabled={!canToggleContributions}
            onClick={() => {
              if (!canToggleContributions) return;
              setActiveTab('contributions');
              setActiveContributionIndex(0);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              canToggleContributions
                ? 'cursor-pointer hover:text-white/80'
                : 'cursor-not-allowed opacity-40 select-none'
            } ${
              effectiveActiveTab === 'contributions'
                ? 'bg-white/20 text-white shadow-xs'
                : canToggleContributions
                  ? 'text-white/50'
                  : 'text-white/30'
            }`}
            title={
              !canToggleContributions
                ? isSoloMode
                  ? 'Contributions disabled (Solo Board)'
                  : 'No contributions yet'
                : 'Contributions (Messages by other curators)'
            }
          >
            <LayoutGrid className="w-4 h-4 stroke-[2]" />
            <span className="hidden sm:inline">Contributions</span>
            {contributions.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                effectiveActiveTab === 'contributions' ? 'bg-[#FE6349] text-white' : 'bg-white/15 text-white/70'
              }`}>
                {contributions.length}
              </span>
            )}
          </button>
        </div>

        {/* Top-Right: Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          aria-label="Close message board"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </header>

      {/* Screen Left & Right Chevrons Navigation for Desktop */}
      <button 
        onClick={handlePrevMessage} 
        className="hidden md:flex fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 items-center justify-center text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
        aria-label="Previous message"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button 
        onClick={handleNextMessage} 
        className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 items-center justify-center text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
        aria-label="Next message"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 2. MIDDLE: ACTUAL MESSAGE BOARD / CONTENT */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-2 my-auto z-10">
        
        {effectiveActiveTab === 'contributions' && !hasContributions ? (
          /* Empty state when there are no contributions yet */
          <div 
            style={{ backgroundColor: frameBgColor }}
            className="w-full max-w-[340px] sm:max-w-[380px] h-[380px] sm:h-[430px] rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center shadow-2xl relative"
          >
            <div className="bg-white rounded-3xl w-full h-full p-6 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-[#FE6349] mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-[#1A1B25] mb-1">
                No Contributions Yet
              </h3>
              <p className="text-xs text-gray-500 font-medium max-w-[220px] mb-5 leading-relaxed">
                {isSoloMode 
                  ? "This board is set to Solo Mode (Only Me)."
                  : "Be the first to add a heartfelt message to this board!"}
              </p>
              
              {!isSoloMode && !isCapacityReached && onAddContributionClick && (
                <button
                  type="button"
                  onClick={() => onAddContributionClick(post)}
                  className="bg-[#FE6349] hover:bg-[#e05234] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add First Contribution</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* The Actual Message Board Frame (Fixed & Pristine) */
          <div 
            onClick={handleBoardCardClick}
            style={{ backgroundColor: frameBgColor }}
            className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] h-[400px] sm:h-[450px] md:h-[474px] rounded-[2.2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-7 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] relative overflow-hidden transition-all duration-300 cursor-pointer active:scale-[0.995]"
            title="Single-click for contributor details, double-click for action menu"
          >
            {/* Confetti Overlay inside frame if enabled */}
            {(activeMessage.confetti || post.confetti) && (
              <ConfettiOverlay type={(activeMessage.confetti || post.confetti) as any} />
            )}

            {/* Inner Canvas Container (Preserving exact visual appearance from Create Page) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <CanvasReadOnlyCard
                canvasElements={activeMessage.canvasElements || (effectiveActiveTab === 'main' ? post.canvasElements : undefined) || []}
                content={activeMessage.content || post.content}
                uploadedImage={activeMessage.imageUrl || activeMessage.mediaUrl || (effectiveActiveTab === 'main' ? (post.imageUrl || post.mediaUrl) : undefined)}
                selectedConfetti={(activeMessage.confetti || post.confetti) as any}
                authorName={activeMessage.authorName}
                recipient={Array.isArray(post.recipients) ? post.recipients.filter(r => r !== '@you').join(', ') || post.recipients[0] : (post.recipientName || post.targetId)}
                selectedHearts={activeMessage.selectedHearts || post.selectedHearts || []}
                activeType={activeMessage.mediaType === 'audio' ? 'audio' : activeMessage.mediaType === 'video' ? 'video' : 'text'}
                isCollaborative={!isSoloMode}
                visibility={post.visibility}
                showMetadata={false} // Strictly clean: No status pills, capacity info, or duplicate badges on the board!
              />

              {/* Single Click — Contributor Details Overlay */}
              {showContributorDetails && (
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-3.5 px-4 sm:px-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent rounded-b-[1.8rem] sm:rounded-b-[2rem] md:rounded-b-3xl flex items-center gap-2.5 z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0EC] border border-white/30 flex items-center justify-center text-xs font-extrabold text-[#FE6349] shrink-0 overflow-hidden shadow-xs">
                    {activeContributorAvatar ? (
                      <img 
                        src={activeContributorAvatar} 
                        alt={activeContributorName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-4 h-4 text-[#FE6349]" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                      {activeContributorName}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-white/75 leading-tight mt-0.5">
                      {effectiveActiveTab === 'main' ? 'Message Creator' : 'Contributor'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. BOARD NAVIGATION: Circular navigation indicator below the board */}
        {effectiveActiveTab === 'contributions' && contributions.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3.5 mb-1 z-20">
            {contributions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveContributionIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeContributionIndex === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Jump to message ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </main>

      {/* 4. BELOW THE BOARD (Strictly permanent main board metadata) */}
      <footer className="w-full max-w-[380px] mx-auto px-4 pb-6 pt-1 flex flex-col items-start text-left z-20 shrink-0">
        
        {/* A. Caption (Permanent Main Board Creator's Caption) */}
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug break-words">
          {mainBoardCaption}
        </h2>

        {/* B. Tagged recipient(s) (Permanent Main Board Recipients) */}
        <p className="text-xs sm:text-sm font-semibold text-[#808897] mt-1 break-words flex flex-wrap items-center gap-x-2 gap-y-1">
          {displayTokens.map((token, idx) => (
            <button
              key={`${token.text}-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (token.isHashtag) {
                  handleHashtagClick(token.cleanTag || token.text);
                } else {
                  handleUserClick(token.userQuery || token.text);
                }
              }}
              className={`transition-colors cursor-pointer hover:underline text-left inline-block ${
                token.isHashtag 
                  ? 'text-[#808897] hover:text-[#FE6349]' 
                  : 'text-[#808897] hover:text-white'
              }`}
              title={token.isHashtag ? `View all boards for ${token.text}` : `View ${token.text}'s Heartboard`}
            >
              {token.text}
            </button>
          ))}
        </p>

        {/* C. Curator information/bio (Permanent Main Board Owner/Curator) */}
        <button
          type="button"
          onClick={() => handleUserClick(mainCuratorName)}
          className="flex items-center gap-2 mt-2.5 group cursor-pointer text-left transition-opacity hover:opacity-95"
          title={`View ${mainCuratorName}'s Heartboard`}
        >
          <div className="w-6 h-6 rounded-full bg-[#353849] border border-white/20 flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 overflow-hidden group-hover:border-[#FE6349] transition-colors">
            {mainCuratorAvatar ? (
              <img src={mainCuratorAvatar} alt={mainCuratorName} className="w-full h-full object-cover" />
            ) : (
              mainCuratorName.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white group-hover:underline transition-colors">
            {mainCuratorName} (Curator)
          </span>
        </button>

        {/* D. Reaction Picker & Action Bar */}
        <div className="w-full mt-4 relative">
          
          {/* Dismiss backdrop when picker is open */}
          {isReactionPickerOpen && (
            <div 
              className="fixed inset-0 z-20 cursor-default" 
              onClick={() => setIsReactionPickerOpen(false)} 
            />
          )}

          {/* Top Floating Pill: Reaction Picker (Absolute overlay - zero layout shift) */}
          {isReactionPickerOpen && (
            <div 
              className="absolute bottom-[calc(100%+10px)] left-0 w-full flex items-center justify-between bg-[#272835] border border-white/10 rounded-full px-5 py-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. Clap */}
              <button
                type="button"
                onClick={() => handleToggleReaction('clap')}
                className="flex items-center gap-1.5 transition-transform active:scale-90 cursor-pointer py-1 px-1 rounded-full hover:bg-white/5"
                title="Clap"
              >
                <HandsClapping 
                  size={24} 
                  weight={userReactions.includes('clap') ? "fill" : "bold"} 
                  color={userReactions.includes('clap') ? "#00D09C" : "#FFFFFF"} 
                />
                {formatReactionCount(reactionCounts.clap) && (
                  <span className="text-xs font-bold text-white tracking-tight ml-0.5">
                    {formatReactionCount(reactionCounts.clap)}
                  </span>
                )}
              </button>

              {/* 2. Heart */}
              <button
                type="button"
                onClick={() => handleToggleReaction('heart')}
                className="flex items-center gap-1.5 transition-transform active:scale-90 cursor-pointer py-1 px-1 rounded-full hover:bg-white/5"
                title="Heart / Love"
              >
                <PhosphorHeart 
                  size={24} 
                  weight="fill" 
                  color={userReactions.includes('heart') ? "#FF3838" : "#FFFFFF"} 
                />
                {formatReactionCount(reactionCounts.heart) && (
                  <span className="text-xs font-bold text-white tracking-tight ml-0.5">
                    {formatReactionCount(reactionCounts.heart)}
                  </span>
                )}
              </button>

              {/* 3. Smiley */}
              <button
                type="button"
                onClick={() => handleToggleReaction('smiley')}
                className="flex items-center gap-1.5 transition-transform active:scale-90 cursor-pointer py-1 px-1 rounded-full hover:bg-white/5"
                title="Smiley"
              >
                <PhosphorSmiley 
                  size={24} 
                  weight={userReactions.includes('smiley') ? "fill" : "bold"} 
                  color={userReactions.includes('smiley') ? "#FFC72C" : "#FFFFFF"} 
                />
                {formatReactionCount(reactionCounts.smiley) && (
                  <span className="text-xs font-bold text-white tracking-tight ml-0.5">
                    {formatReactionCount(reactionCounts.smiley)}
                  </span>
                )}
              </button>

              {/* 4. Fire */}
              <button
                type="button"
                onClick={() => handleToggleReaction('fire')}
                className="flex items-center gap-1.5 transition-transform active:scale-90 cursor-pointer py-1 px-1 rounded-full hover:bg-white/5"
                title="Fire"
              >
                <PhosphorFire 
                  size={24} 
                  weight="fill" 
                  color={userReactions.includes('fire') ? "#FF7629" : "#FFFFFF"} 
                />
                {formatReactionCount(reactionCounts.fire) && (
                  <span className="text-xs font-bold text-white tracking-tight ml-0.5">
                    {formatReactionCount(reactionCounts.fire)}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Bottom Pill: Action Bar */}
          <div className="w-full flex items-center justify-between bg-[#272835] border border-white/10 rounded-full px-5 py-2.5 shadow-xl relative z-30">
            
            {/* 1. Reaction Button (Smiley) - Default State has no count, only icon */}
            <button
              type="button"
              onClick={() => setIsReactionPickerOpen((prev) => !prev)}
              className={`flex items-center justify-center p-1 rounded-full active:scale-95 transition-all cursor-pointer ${
                isReactionPickerOpen ? 'bg-white/15 text-white' : 'text-white/90 hover:text-white'
              }`}
              title="Reactions"
            >
              <PhosphorSmiley size={24} weight="bold" color="#FFFFFF" />
            </button>

            {/* 2. Share Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="text-white/90 hover:text-white active:scale-95 transition-all cursor-pointer p-1"
              title="Share board link & image"
            >
              <ShareFat size={24} weight="bold" color="#FFFFFF" />
            </button>

            {/* 3. Flag Button */}
            <button
              type="button"
              onClick={handleFlagClick}
              className="text-white/90 hover:text-white active:scale-95 transition-all cursor-pointer p-1"
              title="Flag / Report this board"
            >
              <PhosphorFlag size={24} weight="bold" color="#FFFFFF" />
            </button>

            {/* 4. + / Add Message Button (ONLY if collaborative and capacity not reached) */}
            {!isSoloMode && !isCapacityReached && onAddContributionClick && (
              <button
                type="button"
                onClick={() => onAddContributionClick(post)}
                className="text-white hover:text-[#FE6349] active:scale-95 transition-all cursor-pointer p-1 flex items-center justify-center"
                title="Add a message to this board"
              >
                <PhosphorPlus size={24} weight="bold" color="#FFFFFF" />
              </button>
            )}

          </div>

        </div>

      </footer>

      {/* Flag / Report Toast Feedback */}
      {showFlagToast && toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1100] bg-[#272835] text-white text-xs font-bold px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share Modal Integration */}
      {isShareModalOpen && (
        <ShareProfileModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          userHandle={post.authorName ? `@${post.authorName.toLowerCase().replace(/\s+/g, '')}` : '@curator'}
          userName={post.authorName}
          profileImage={post.authorAvatar || null}
          onShowToast={(msg) => {
            setToastMessage(msg);
            setShowFlagToast(true);
            setTimeout(() => {
              setShowFlagToast(false);
              setToastMessage(null);
            }, 3000);
          }}
        />
      )}

      {/* Action Menu Pop-up Modal (Double Click / Action Page) */}
      {isActionMenuOpen && (
        <ActionMenuModal
          isOpen={isActionMenuOpen}
          onClose={() => setIsActionMenuOpen(false)}
          post={post}
          isCreator={isCreator}
          userContributions={userContributions}
          onAddPost={() => {
            onAddContributionClick?.(post);
          }}
          onShare={() => {
            setIsShareModalOpen(true);
          }}
          onEditBoard={() => {
            onEditBoard?.(post);
          }}
          onDeleteBoard={() => {
            onDeleteBoard?.(post.id);
          }}
          onEditMainMessage={() => {
            onEditMessage?.(post);
          }}
          onDeleteMainMessage={() => {
            onDeleteMessage?.(post);
          }}
          onEditContribution={(contribution) => {
            onEditMessage?.(post, contribution);
          }}
          onDeleteContribution={(contribution) => {
            onDeleteMessage?.(post, contribution);
          }}
        />
      )}

    </div>
  );
};
