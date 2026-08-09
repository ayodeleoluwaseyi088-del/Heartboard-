import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartBubbleSvg } from './CreateAppreciationModal';
import { HeartCategoryCardData } from './HeartboardView';

interface FloatingHeartItem {
  id: number;
  bubbleColor: string;
  categoryName: string;
  size: number;
  leftPercent: number;
  delay: number;
  duration: number;
  swayX: number;
  rotation: number;
  scale: number;
}

interface LiveHeartAnimationProps {
  categories: HeartCategoryCardData[];
  isActive: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

export const LiveHeartAnimation: React.FC<LiveHeartAnimationProps> = ({
  categories,
  isActive,
  onComplete,
  durationMs = 6000,
}) => {
  const [items, setItems] = useState<FloatingHeartItem[]>([]);

  useEffect(() => {
    if (!isActive) {
      setItems([]);
      return;
    }

    // Filter categories that have received counts > 0
    const activeCats = (categories || []).filter((c) => c && typeof c.count === 'number' && c.count > 0);
    const pool = activeCats.length > 0 ? activeCats : (categories || []).filter(c => Boolean(c));

    if (pool.length === 0) {
      setItems([]);
      return;
    }

    // Generate ~34 floating hearts
    const newItems: FloatingHeartItem[] = [];
    const countToGenerate = 34;

    for (let i = 0; i < countToGenerate; i++) {
      const cat = pool[i % pool.length];
      if (!cat) continue;

      const size = Math.floor(Math.random() * 28) + 38; // 38px to 66px
      const leftPercent = Math.floor(Math.random() * 88) + 6; // 6% to 94%
      const delay = Math.random() * 2.8; // staggered delays 0 to 2.8s
      const duration = Math.random() * 1.6 + 3.2; // 3.2s to 4.8s float duration
      const swayX = (Math.random() - 0.5) * 120; // -60px to +60px sway
      const rotation = (Math.random() - 0.5) * 50; // -25deg to +25deg
      const scale = Math.random() * 0.35 + 0.85; // 0.85 to 1.2 scale

      newItems.push({
        id: i,
        bubbleColor: cat.bubbleColor || '#FE6349',
        categoryName: cat.categoryName || 'Heart',
        size,
        leftPercent,
        delay,
        duration,
        swayX,
        rotation,
        scale,
      });
    }

    setItems(newItems);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isActive, categories, durationMs]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Floating Hearts */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              y: '105vh',
              x: 0,
              opacity: 0,
              scale: 0.4,
              rotate: 0,
            }}
            animate={{
              y: '-15vh',
              x: [0, item.swayX * 0.5, item.swayX, item.swayX * 0.2],
              opacity: [0, 0.95, 1, 0.9, 0],
              scale: [0.4, item.scale, item.scale, item.scale * 0.9, 0.5],
              rotate: [0, item.rotation, -item.rotation * 0.7, item.rotation * 0.5],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              position: 'absolute',
              left: `${item.leftPercent}%`,
              bottom: 0,
            }}
            className="pointer-events-none select-none drop-shadow-md"
          >
            <div className="relative">
              <HeartBubbleSvg
                color={item.bubbleColor}
                size={item.size}
              />
              <div
                className="absolute inset-0 rounded-full blur-md opacity-35 -z-10"
                style={{ backgroundColor: item.bubbleColor }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
