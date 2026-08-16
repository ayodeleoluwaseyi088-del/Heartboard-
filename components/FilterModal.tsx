import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Heart } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  emoji: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'moment', label: 'Moment', emoji: '🥰' },
  { id: 'graduation', label: 'Graduation', emoji: '🎓' },
  { id: 'wedding', label: 'Wedding', emoji: '💍' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💐' },
  { id: 'appreciation', label: 'Appreciation', emoji: '🙌' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🎉' },
  { id: 'condolence', label: 'Condolence', emoji: '🕯️' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter?: (selectedOptionId: string, selectedHeartFilter?: 'received' | 'sent') => void;
  selectedFilterId?: string;
  heartFilter?: 'received' | 'sent';
  mode?: 'events' | 'hearts' | 'all';
  totalReceivedCount?: number;
  totalSentCount?: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilter,
  selectedFilterId = 'moment',
  heartFilter = 'received',
  mode = 'events'
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedFilterId);
  const [selectedHeartFilter, setSelectedHeartFilter] = useState<'received' | 'sent'>(heartFilter);

  React.useEffect(() => {
    if (selectedFilterId) {
      setSelectedId(selectedFilterId);
    }
    if (heartFilter) {
      setSelectedHeartFilter(heartFilter);
    }
  }, [selectedFilterId, heartFilter, isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onApplyFilter) {
      onApplyFilter(selectedId, selectedHeartFilter);
    }
    onClose();
  };

  const showHearts = mode === 'hearts' || mode === 'all';
  const showEvents = mode === 'events' || mode === 'all';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
        {/* Backdrop click handler */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Filter</h2>
              <p className="text-xs text-[#808897] font-medium mt-0.5">
                {mode === 'hearts' 
                  ? 'Choose which hearts to display' 
                  : 'Customize your event & boards view'}
              </p>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close filter modal"
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 1. Hearts Filter Section (Received vs Sent) - Only shown in hearts mode */}
          {showHearts && (
            <div className={showEvents ? "mb-6" : "mb-8"}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#FE6349] fill-[#FE6349]/20" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#353849]">
                    Hearts View
                  </span>
                </div>
                <span className="text-[11px] text-[#808897] font-medium">
                  {selectedHeartFilter === 'received' ? 'Received selected' : 'Sent selected'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5" id="filter-modal-heart-controls">
                {/* Received Option */}
                <div
                  id="filter-modal-received-opt"
                  onClick={() => setSelectedHeartFilter('received')}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#F6F8FA] hover:bg-gray-100/80 cursor-pointer transition-all select-none"
                >
                  {/* Radio / Checkbox Indicator */}
                  <div
                    className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      selectedHeartFilter === 'received'
                        ? 'bg-[#4CB993] text-[#F8F9FB] shadow-xs'
                        : 'border-2 border-gray-300 bg-white'
                    }`}
                  >
                    {selectedHeartFilter === 'received' && <Check size={12} strokeWidth={3.5} />}
                  </div>

                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                      Received
                    </span>
                  </div>
                </div>

                {/* Sent Option */}
                <div
                  id="filter-modal-sent-opt"
                  onClick={() => setSelectedHeartFilter('sent')}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#F6F8FA] hover:bg-gray-100/80 cursor-pointer transition-all select-none"
                >
                  {/* Radio / Checkbox Indicator */}
                  <div
                    className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      selectedHeartFilter === 'sent'
                        ? 'bg-[#4CB993] text-[#F8F9FB] shadow-xs'
                        : 'border-2 border-gray-300 bg-white'
                    }`}
                  >
                    {selectedHeartFilter === 'sent' && <Check size={12} strokeWidth={3.5} />}
                  </div>

                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                      Sent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider between sections if both are shown */}
          {showHearts && showEvents && (
            <div className="h-px bg-gray-100 w-full mb-5" />
          )}

          {/* 2. Event Categories Section - Only shown in events mode */}
          {showEvents && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#353849]">
                  Event Occasions
                </span>
                <span className="text-[11px] text-[#808897] font-medium">
                  Filter boards
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {FILTER_OPTIONS.map((option) => {
                  const isSelected = selectedId === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedId(option.id)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#F6F8FA] hover:bg-gray-100/80 cursor-pointer transition-all select-none"
                    >
                      {/* Radio / Checkbox Indicator */}
                      <div
                        className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-[#4CB993] text-[#F8F9FB] shadow-xs' 
                            : 'border-2 border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3.5} />}
                      </div>

                      {/* Emoji & Label */}
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-base leading-none">{option.emoji}</span>
                        <span className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continue / Apply Button */}
          <button
            id="filter-modal-apply-btn"
            onClick={handleContinue}
            className="w-full bg-[#FE6349] hover:bg-[#ff5235] text-white font-extrabold text-base py-4 rounded-full transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

