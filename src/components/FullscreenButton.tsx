import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenButtonProps {
  onToggle: () => void;
  isExpanded: boolean;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  onToggle,
  isExpanded,
}) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-50"
      title={isExpanded ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
    </button>
  );
};