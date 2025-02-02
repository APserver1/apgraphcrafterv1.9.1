import React from 'react';
import { EmbeddedImage, EmbeddedText } from '../types/SettingsTypes';

interface EmbeddedImagesProps {
  images: EmbeddedImage[];
  texts: EmbeddedText[];
}

export const EmbeddedImages: React.FC<EmbeddedImagesProps> = ({ 
  images = [], 
  texts = [] 
}) => {
  // Asegurarnos de que images y texts sean arrays
  const safeImages = Array.isArray(images) ? images : [];
  const safeTexts = Array.isArray(texts) ? texts : [];

  return (
    <>
      {/* Elementos detrás de la animación */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {safeImages.filter(img => img.position === 'behind').map((image, index) => (
          <div
            key={`behind-image-${index}`}
            className="absolute"
            style={{
              top: `${image.margins.top}px`,
              left: `${image.margins.left}px`,
              width: `${image.width}px`,
              height: `${image.height}px`,
            }}
          >
            <img
              src={image.url}
              alt={`Embedded image ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        {safeTexts.filter(text => text.position === 'behind').map((text, index) => (
          <div
            key={`behind-text-${index}`}
            className="absolute whitespace-pre-wrap"
            style={{
              top: `${text.margins.top}px`,
              left: `${text.margins.left}px`,
              color: text.color,
              fontSize: `${text.fontSize}px`,
              fontFamily: text.fontFamily,
            }}
          >
            {text.content}
          </div>
        ))}
      </div>

      {/* Elementos delante de la animación */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        {safeImages.filter(img => img.position === 'front').map((image, index) => (
          <div
            key={`front-image-${index}`}
            className="absolute"
            style={{
              top: `${image.margins.top}px`,
              left: `${image.margins.left}px`,
              width: `${image.width}px`,
              height: `${image.height}px`,
            }}
          >
            <img
              src={image.url}
              alt={`Embedded image ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        {safeTexts.filter(text => text.position === 'front').map((text, index) => (
          <div
            key={`front-text-${index}`}
            className="absolute whitespace-pre-wrap"
            style={{
              top: `${text.margins.top}px`,
              left: `${text.margins.left}px`,
              color: text.color,
              fontSize: `${text.fontSize}px`,
              fontFamily: text.fontFamily,
            }}
          >
            {text.content}
          </div>
        ))}
      </div>
    </>
  );
};