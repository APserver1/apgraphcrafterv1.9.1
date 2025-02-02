import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateDisplaySettings } from '../types/SettingsTypes';

interface DateDisplayProps {
  currentLabel: string;
  settings: DateDisplaySettings;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ currentLabel, settings }) => {
  // Ensure we have default values for settings
  const safeSettings = {
    show: settings?.show ?? true,
    position: settings?.position ?? 'bottomRight',
    fontSize: settings?.fontSize ?? 16,
    color: settings?.color ?? '#ffffff',
    margins: settings?.margins ?? {
      top: 16,
      bottom: 16,
      left: 16,
      right: 16
    },
    backgroundColor: settings?.backgroundColor ?? 'rgba(0, 0, 0, 0.5)',
  };

  if (!safeSettings.show) return null;

  const positionStyles: Record<string, string> = {
    topLeft: 'top-0 left-0',
    topRight: 'top-0 right-0',
    bottomLeft: 'bottom-0 left-0',
    bottomRight: 'bottom-0 right-0',
  };

  return (
    <div 
      className={`absolute ${positionStyles[safeSettings.position]}`}
      style={{ 
        marginTop: safeSettings.margins.top,
        marginBottom: safeSettings.margins.bottom,
        marginLeft: safeSettings.margins.left,
        marginRight: safeSettings.margins.right,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLabel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="px-4 py-2 rounded"
          style={{
            fontSize: `${safeSettings.fontSize}px`,
            color: safeSettings.color,
            backgroundColor: safeSettings.backgroundColor || 'transparent',
          }}
        >
          {currentLabel}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};