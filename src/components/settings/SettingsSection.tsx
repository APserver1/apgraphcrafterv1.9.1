import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="px-4 py-3 bg-gray-50">{children}</div>}
    </div>
  );
};