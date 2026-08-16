import React, { useEffect, useState, useRef } from 'react';
import { Post, EntityType, PostVisibility } from '../types';
import { X, ChevronLeft, ChevronRight, Sparkles, Plus, MessageSquare, ShieldAlert, Lock } from 'lucide-react';
import { ConfettiOverlay } from './ConfettiOverlay';
import { CanvasReadOnlyCard } from './CreateAppreciationModal';

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
  };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onAddContribution?: (postId: string, text: string, authorName?: string) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ post, onClose, onPrev, onNext, onAddContribution }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'contributions'>('board');
  const [newContributionText, setNewContributionText] = useState('');
  const [authorInput, setAuthorInput] = useState('You');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Reset reveal state on post change
    setIsRevealed(false);
    setIsAdding(false);
    setNewContributionText('');
  }, [post]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!post) return null;

  // Render background style helper
  const getContainerBgStyle = () => {
    if (post.theme && post.theme.startsWith('#')) {
      return { backgroundColor: post.theme };
    }
    return {};
  };

  const getContainerBgClass = () => {
    if (post.theme && !post.theme.startsWith('#')) {
      return post.theme;
    }
    return 'bg-[#FAF5E8]'; // Sweet natural cream fallback
  };

  const isBlurred = post.isBlurred && !isRevealed;

  // Capacity calculations
  const maxCapacity = post.maxCapacity || (post.boardCapacity === 'solo' ? 1 : 20);
  const existingContribs = post.contributions || [];
  const totalMessages = 1 + existingContribs.length;
  const isSoloMode = post.boardCapacity === 'solo' || maxCapacity === 1;
  const isCapacityAvailable = totalMessages < maxCapacity;

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContributionText.trim()) return;
    if (onAddContribution) {
      onAddContribution(post.id, newContributionText.trim(), authorInput.trim() || 'You');
    }
    setNewContributionText('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-lg p-3 sm:p-6 select-none overflow-y-auto">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Screen Navigation Triggers */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }} 
        className="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 z-[1010] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer"
        aria-label="Previous board"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }} 
        className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-[1010] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer"
        aria-label="Next board"
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Top Modal Controls (Tabs for Mobile & Close) */}
      <div className="relative z-[1010] flex items-center justify-between w-full max-w-4xl mb-4 px-2">
        {/* Mobile View Selector Tabs */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs font-bold text-white">
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            Main Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contributions')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contributions' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            <span>Contributions / Curation</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'contributions' ? 'bg-[#FE6349] text-white' : 'bg-white/20 text-white'
            }`}>
              {totalMessages}/{maxCapacity}
            </span>
          </button>
        </div>

        {/* Close Modal Trigger */}
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:scale-105 transition-all cursor-pointer border border-white/10"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Container Wrapper - Side-by-side on desktop, tabbed/scrollable on mobile */}
      <div className="relative z-[1005] flex flex-col lg:flex-row items-center justify-center gap-6 max-w-4xl w-full">
        
        {/* 1. Main Board Container - Strictly 380px x 474px */}
        <div 
          onClick={() => { if (isBlurred) setIsRevealed(true); }}
          className={`relative ${getContainerBgClass()} rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer transform transition-all duration-300 hover:scale-[1.01] shrink-0 ${
            activeTab === 'board' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{ 
            width: '380px', 
            height: '474px', 
            ...getContainerBgStyle() 
          }}
        >
          {/* Confetti Animation Effect */}
          {post.confetti && <ConfettiOverlay type={post.confetti} />}

          {/* Slanted white 20% opacity background layers for collaborative boards (>1 contribution) */}
          {!isSoloMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-[280px] h-[360px] bg-white/20 rounded-3xl -rotate-[5deg] transform" />
              <div className="w-[280px] h-[360px] bg-white/20 rounded-3xl rotate-[5deg] transform absolute" />
            </div>
          )}

          {/* Lined paper texture background overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply rounded-[2.5rem]" 
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}
          ></div>

          {/* Floating Top Header Badges */}
          <div className="absolute top-5 left-5 right-5 z-[50] flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {isSoloMode ? 'Only Me Board' : `Capacity: ${totalMessages}/${maxCapacity}`}
              </span>
              {post.visibility === PostVisibility.PRIVATE && (
                <span className="bg-[#1A1B25] text-amber-300 border border-amber-300/30 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                  <Lock size={10} className="text-amber-300 stroke-[2.5]" /> RECIPIENT ONLY
                </span>
              )}
            </div>
            {post.statusBadge ? (
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider text-gray-800 uppercase">
                {post.statusBadge}
              </div>
            ) : (
              <div className="bg-[#FE6349] text-white px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase">
                ✨ HEARTH MEMORY
              </div>
            )}
          </div>

          {/* Expanded Content View */}
          <div className={`w-full h-full p-8 flex flex-col justify-between relative transition-all duration-500 ${isBlurred ? 'blur-[8px] scale-98 pointer-events-none' : ''}`}>
            
            {/* Top spacer */}
            <div className="h-8" />

            {/* Central Appreciation Body */}
            <div className="flex-grow flex flex-col justify-center text-right select-text">
              {post.canvasElements && post.canvasElements.length > 0 ? (
                <div className="relative w-full h-[280px] flex items-center justify-center">
                  <CanvasReadOnlyCard
                    canvasElements={post.canvasElements}
                    selectedConfetti={post.confetti}
                    content={post.content}
                    uploadedImage={post.imageUrl || post.mediaUrl}
                    authorName={post.authorName}
                    recipient={Array.isArray((post as any).recipients) ? (post as any).recipients[0] : (post.recipientName || post.targetId)}
                    selectedHearts={(post as any).selectedHearts || []}
                    activeType={post.mediaType || post.type || 'text'}
                    isCollaborative={!isSoloMode}
                    visibility={post.visibility}
                    showMetadata={true}
                  />
                </div>
              ) : post.imageUrl || post.mediaUrl ? (
                <div className="flex flex-col items-end gap-3">
                  <div className="w-full max-h-60 rounded-none overflow-hidden border border-black/5 bg-gray-50 flex items-center justify-center p-1">
                    <img src={post.imageUrl || post.mediaUrl} className="max-w-full max-h-full w-auto h-auto object-contain rounded-none" alt="Memory" referrerPolicy="no-referrer" />
                  </div>
                  {post.content && (
                    <p className="text-gray-800 handwriting text-xl leading-tight font-bold mt-2">
                      {post.content}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="handwriting text-[1.45rem] text-gray-800 font-extrabold leading-relaxed text-right">
                    "{post.content}"
                  </p>
                  {post.secondaryImage && (
                    <div className="flex justify-end mt-4">
                      <div className="w-24 h-32 bg-white p-1.5 rounded-xl border border-gray-100 rotate-3 ring-4 ring-black/5 overflow-hidden">
                        <img src={post.secondaryImage} className="w-full h-full object-cover rounded-lg" alt="Grandpa" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom reaction metrics signature */}
            <div className="flex flex-col items-end justify-end mt-6 text-right">
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-full text-xs font-bold text-gray-800">
                <span className="text-rose-500">💖</span> {post.reactions.toLocaleString()} blown
              </div>
              <div className="mt-3">
                <p className="text-gray-950 font-extrabold text-sm tracking-tight inline-flex items-center gap-1">
                  <span>By</span>
                  <span className="underline decoration-[#FE6349] decoration-2">
                    @{post.visibility === PostVisibility.ANONYMOUS || post.authorName === 'Anon' || post.authorName === 'Anonymous' ? 'Anon' : post.authorName}
                  </span>
                </p>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wide mt-0.5">
                  Target: {post.targetId} ({post.targetType.toLowerCase()})
                </p>
              </div>
            </div>
          </div>

          {/* Curiosity Lock Screen Overlay */}
          {isBlurred && (
            <div className="absolute inset-0 bg-[#FAF5E8]/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center z-50">
              <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center mb-4 animate-bounce">
                <Sparkles size={22} className="text-amber-400" />
              </div>
              <h3 className="text-gray-900 font-extrabold text-base tracking-tight uppercase">
                Tear-Jerker Locked 😭
              </h3>
              <p className="text-xs text-gray-600 font-bold mt-2 max-w-[240px] leading-relaxed">
                Tap inside this board to unlock and reveal the full heartwarming tribute page.
              </p>
            </div>
          )}
        </div>

        {/* 2. Contributions / Curation Side Panel - Strictly 380px x 474px */}
        <div 
          className={`relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden shrink-0 ${
            activeTab === 'contributions' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{ width: '380px', height: '474px' }}
        >
          {/* Panel Header */}
          <div className="border-b border-gray-100 pb-4 mb-3 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-base font-extrabold text-[#1A1B25] tracking-tight">
                Contributions / Curation
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Messages inside this board
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isCapacityAvailable 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {totalMessages} / {maxCapacity} Total
            </span>
          </div>

          {/* Scrollable Contributions Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
            {/* Main Original Message Card (1st message) */}
            <div className="bg-[#FAF5E8] rounded-2xl p-4 border border-amber-100/60 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-[#1A1B25]">@{post.authorName}</span>
                <span className="bg-[#FE6349] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Board Creator
                </span>
              </div>
              <p className="text-xs font-medium text-gray-800 leading-relaxed">
                "{post.content}"
              </p>
              <span className="text-[10px] text-gray-400 font-semibold block text-right mt-2">
                Original Message • 1 of {maxCapacity}
              </span>
            </div>

            {/* Additional Contributions List */}
            {existingContribs.map((contrib, idx) => (
              <div key={contrib.id || idx} className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#1A1B25]">
                    {contrib.authorHandle || `@${contrib.authorName}`}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">
                    Message {idx + 2} of {maxCapacity}
                  </span>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  "{contrib.content}"
                </p>
              </div>
            ))}

            {existingContribs.length === 0 && (
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-dashed border-gray-200 my-2">
                <MessageSquare className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-500">No additional contributions yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isSoloMode 
                    ? "This board is set to Only Me." 
                    : `Up to ${maxCapacity - 1} more messages can be added to this board.`}
                </p>
              </div>
            )}
          </div>

          {/* Panel Footer: Add Message Form / Action */}
          <div className="pt-3 border-t border-gray-100 mt-3 shrink-0">
            {isCapacityAvailable ? (
              isAdding ? (
                <form onSubmit={handleContributionSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder="Your handle or name"
                    className="w-full bg-[#F6F8FA] border border-gray-200 text-xs text-[#1A1B25] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FE6349]"
                  />
                  <textarea
                    rows={2}
                    value={newContributionText}
                    onChange={(e) => setNewContributionText(e.target.value)}
                    placeholder="Write your message contribution..."
                    className="w-full bg-[#F6F8FA] border border-gray-200 text-xs text-[#1A1B25] rounded-xl p-2.5 focus:outline-none focus:border-[#FE6349] resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newContributionText.trim()}
                      className="bg-[#FE6349] hover:bg-[#e05234] disabled:opacity-50 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-2xs cursor-pointer transition-all active:scale-95"
                    >
                      Add Message
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="w-full bg-[#FE6349] hover:bg-[#e05234] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Message to Board ({maxCapacity - totalMessages} slots left)</span>
                </button>
              )
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center flex items-center justify-center gap-2 text-amber-800">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span className="text-xs font-bold">
                  {isSoloMode ? "Only Me Board (1 message total)" : "Board Capacity Reached (20/20 messages)"}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

