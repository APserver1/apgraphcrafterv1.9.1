import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartSettings } from '../types/SettingsTypes';

interface CarouselImagesProps {
  settings: ChartSettings['carousel'];
  currentLabel: string;
}

export const CarouselImages: React.FC<CarouselImagesProps> = ({
  settings,
  currentLabel,
}) => {
  // Asegurarnos de que settings y sus propiedades existan
  const safeSettings = {
    enabled: settings?.enabled ?? false,
    width: settings?.width ?? 200,
    height: settings?.height ?? 200,
    margins: {
      top: settings?.margins?.top ?? 50,
      bottom: settings?.margins?.bottom ?? 50,
      left: settings?.margins?.left ?? 50,
      right: settings?.margins?.right ?? 50
    },
    images: settings?.images ?? {}
  };

  if (!safeSettings.enabled) return null;

  const imageUrl = safeSettings.images[currentLabel];
  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute"
        style={{
          top: safeSettings.margins.top,
          left: safeSettings.margins.left,
          width: safeSettings.width,
          height: safeSettings.height
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLabel}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={imageUrl}
              alt={currentLabel}
              className="w-full h-full object-contain rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};