import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageColumnSettings, ImageShape } from '../types/SettingsTypes';
import { ParsedData } from '../types/DataTypes';
import { calculateImageSize } from '../utils/imageCalculations';

interface ImageColumnProps {
  data: ParsedData;
  currentIndex: number;
  settings: ImageColumnSettings;
  maxBars?: number;
}

const getImageClassName = (shape: ImageShape): string => {
  switch (shape) {
    case 'circle':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rectangle':
      return 'rounded-none aspect-[16/9] object-cover';
    case 'original':
      return '';
    case 'custom':
      return 'rounded-none';
    default:
      return 'rounded-full';
  }
};

export const ImageColumn: React.FC<ImageColumnProps> = ({
  data,
  currentIndex,
  settings,
  maxBars = 10,
}) => {
  if (!settings?.enabled) return null;

  const { margins } = settings;
  
  // Filtrar y ordenar los datos
  const sortedData = React.useMemo(() => {
    return [...data.data]
      .filter(item => item.values[currentIndex] > 0)
      .sort((a, b) => b.values[currentIndex] - a.values[currentIndex])
      .slice(0, maxBars);
  }, [data, currentIndex, maxBars]);

  const getPosition = (index: number): number => {
    if (settings.useCustomSpacing) {
      let position = 0;
      for (let i = 0; i < index; i++) {
        position += settings.size + (settings.customSpacing[i] ?? settings.spacing);
      }
      return position;
    }
    return index * (settings.size + settings.spacing);
  };

  const containerWidth = settings.imageShape === 'custom' 
    ? Math.max(settings.customWidth, settings.size)
    : settings.size;

  const getImageDimensions = (baseWidth: number, baseHeight: number) => {
    const resolution = settings.resolution || 1;
    return {
      display: {
        width: `${baseWidth}px`,
        height: `${baseHeight}px`
      },
      actual: {
        width: Math.round(baseWidth * resolution),
        height: Math.round(baseHeight * resolution)
      }
    };
  };

  return (
    <div 
      className={`absolute ${settings.position === 'left' ? 'left-0' : 'right-0'}`}
      style={{ 
        top: margins.top,
        bottom: margins.bottom,
        width: containerWidth,
        marginLeft: settings.position === 'right' ? settings.spacing : margins.left,
        marginRight: settings.position === 'left' ? settings.spacing : margins.right,
      }}
    >
      <div className="relative h-full">
        <AnimatePresence mode="sync">
          {sortedData.map((item, index) => {
            const imageUrl = settings.images[item.label] || settings.defaultImage;
            let imageSize = calculateImageSize(
              index,
              settings.size,
              {
                descendingWidth: settings.descendingSize,
                widthRatio: settings.sizeRatio,
                descendingHeight: settings.descendingSize,
                heightRatio: settings.sizeRatio,
              },
              sortedData.length
            );

            if (settings.imageShape === 'custom') {
              const sizeReduction = settings.descendingSize && sortedData.length > 1
                ? 1 - ((1 - settings.sizeRatio) * (index / (sortedData.length - 1)))
                : 1;
              
              imageSize = {
                width: `${Math.floor(settings.customWidth * sizeReduction)}px`,
                height: `${Math.floor(settings.customHeight * sizeReduction)}px`
              };
            }

            const dimensions = getImageDimensions(
              parseInt(imageSize.width),
              parseInt(imageSize.height)
            );

            return (
              <motion.div
                key={item.label}
                className={`absolute ${settings.position === 'left' ? 'left-0' : 'right-0'}`}
                initial={{ opacity: 0, x: settings.position === 'left' ? -20 : 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  top: getPosition(index),
                  height: dimensions.display.height,
                  zIndex: settings.stackOrder === 'topOverBottom' 
                    ? sortedData.length - index  // Los elementos superiores tienen mayor z-index
                    : index + 1                  // Los elementos inferiores tienen mayor z-index
                }}
                exit={{ opacity: 0, x: settings.position === 'left' ? -20 : 20 }}
                transition={{ 
                  duration: settings.animationSpeed,
                  ease: "easeInOut"
                }}
                style={{
                  height: dimensions.display.height,
                  width: dimensions.display.width,
                }}
              >
                <div 
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    right: settings.position === 'right' ? 0 : 'auto',
                    left: settings.position === 'left' ? 0 : 'auto',
                    width: dimensions.display.width,
                    height: dimensions.display.height,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={item.label}
                    className={`absolute top-0 left-0 w-full h-full object-cover ${getImageClassName(settings.imageShape)}`}
                    style={{
                      width: dimensions.display.width,
                      height: dimensions.display.height,
                    }}
                    srcSet={`${imageUrl} ${dimensions.actual.width}w`}
                    sizes={`${dimensions.display.width}`}
                    onError={(e) => {
                      e.currentTarget.src = settings.defaultImage;
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};