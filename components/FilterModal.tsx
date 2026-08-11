import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

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
  onApplyFilter?: (selectedOptionId: string) => void;
  selectedFilterId?: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilter,
  selectedFilterId = 'moment'
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedFilterId);

  React.useEffect(() => {
    if (selectedFilterId) {
      setSelectedId(selectedFilterId);
    }
  }, [selectedFilterId, isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onApplyFilter) {
      onApplyFilter(selectedId);
    }
    onClose();
  };

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
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Filter</h2>
            <button 
              onClick={onClose}
              aria-label="Close filter modal"
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Grid Options */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {FILTER_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F6F8FA] hover:bg-gray-100/80 cursor-pointer transition-all select-none"
                >
                  {/* Radio / Checkbox Indicator */}
                  <div
                    className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#4CB993] text-[#F8F9FB] shadow-sm' 
                        : 'border-2 border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3.5} />}
                  </div>

                  {/* Emoji & Label */}
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg leading-none">{option.emoji}</span>
                    <span className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                      {option.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <button
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
