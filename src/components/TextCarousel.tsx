import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartSettings } from '../types/SettingsTypes';

interface TextCarouselProps {
  settings: ChartSettings['textCarousel'];
  currentLabel: string;
}

export const TextCarousel: React.FC<TextCarouselProps> = ({
  settings,
  currentLabel,
}) => {
  const safeSettings = {
    enabled: settings?.enabled ?? false,
    fontSize: settings?.fontSize ?? 32,
    fontFamily: settings?.fontFamily ?? 'sans-serif',
    color: settings?.color ?? '#000000',
    margins: {
      top: settings?.margins?.top ?? 50,
      bottom: settings?.margins?.bottom ?? 50,
      left: settings?.margins?.left ?? 50,
      right: settings?.margins?.right ?? 50
    },
    texts: settings?.texts ?? {}
  };

  if (!safeSettings.enabled) return null;

  const text = safeSettings.texts[currentLabel];
  if (!text) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute"
        style={{
          top: safeSettings.margins.top,
          left: safeSettings.margins.left,
          right: safeSettings.margins.right,
          bottom: safeSettings.margins.bottom
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: `${safeSettings.fontSize}px`,
              fontFamily: safeSettings.fontFamily,
              color: safeSettings.color
            }}
            className="text-center"
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};