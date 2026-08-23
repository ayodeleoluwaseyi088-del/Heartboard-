import React from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  Send, 
  Layers, 
  Trophy, 
  ArrowRight, 
  Compass 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegisteredUser } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RegisteredUser | null;
  onSendMessageNow: () => void;
  onCheckOutMoments: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  user,
  onSendMessageNow,
  onCheckOutMoments,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[320] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90dvh] sm:max-h-[85vh] bg-white rounded-[1.8rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col font-sans overflow-hidden my-auto text-left select-none">
        
        {/* Sticky Top Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 bg-white border-b border-[#ECEFF3] flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-[#FE6349] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h2 className="text-xl font-extrabold text-[#1A1B25] tracking-tight">
              Welcome to Heartboard
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Close welcome modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5 min-h-0 scrollbar-thin">
          {/* Header with Avatar / Badge */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center overflow-hidden border-2 border-[#FE6349]/30 shadow-xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Heart size={28} className="text-[#FE6349]" fill="currentColor" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FE6349] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={12} />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#FE6349] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>Onboarding Complete</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1A1B25] tracking-tight">
                Hello, {user?.name?.split(' ')[0] || 'Friend'}!
              </h3>
            </div>
          </div>

          {/* Subtitle / Description */}
          <p className="text-xs sm:text-sm text-[#666D80] font-medium leading-relaxed">
            You now have an active profile on the world's wall of love and reputation engine. Here is what you can do on Heartboard:
          </p>

          {/* Feature Explanations */}
          <div className="space-y-3">
            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-[#FE6349] flex items-center justify-center shrink-0 mt-0.5">
                <Send size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1B25]">Create & Send Heartfelt Messages</h4>
                <p className="text-[11px] text-[#666D80] mt-0.5 leading-normal">
                  Craft custom digital boards enhanced with rich imagery, warm notes, and audio tributes for friends, family, coworkers, or global hashtags.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Heart size={16} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1B25]">Blow Semantic Heart Tokens</h4>
                <p className="text-[11px] text-[#666D80] mt-0.5 leading-normal">
                  Gift structured hearts across the spectrum—Loving Partner, Reliability, Hard Work, Leadership, and Workspace Legend.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Trophy size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1B25]">Build Your Reputation Trophy Case</h4>
                <p className="text-[11px] text-[#666D80] mt-0.5 leading-normal">
                  Accumulate genuine testimonials, vouch tokens, and collaborative cards in your permanent personal digital trophy case.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA Section */}
        <div className="shrink-0 p-4 sm:p-5 bg-[#F6F8FA] border-t border-[#ECEFF3] sticky bottom-0 z-10 rounded-b-[1.8rem] sm:rounded-b-[2.5rem] flex flex-col sm:flex-row gap-3">
          {/* CTA 1: Send a Message to Someone Now */}
          <button
            type="button"
            onClick={onSendMessageNow}
            className="flex-1 py-3.5 px-4 rounded-full bg-[#FE6349] hover:bg-[#e05234] text-white font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Send a Message Now</span>
            <Send size={14} />
          </button>

          {/* CTA 2: Check Out the Moments */}
          <button
            type="button"
            onClick={onCheckOutMoments}
            className="flex-1 py-3.5 px-4 rounded-full bg-white hover:bg-gray-50 border border-gray-200/80 text-[#1A1B25] font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass size={14} />
            <span>Discover Moments</span>
          </button>
        </div>

      </div>
    </div>
  );
};
