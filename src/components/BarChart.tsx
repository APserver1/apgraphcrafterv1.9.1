import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParsedData } from '../types/DataTypes';
import { ChartSettings } from '../types/SettingsTypes';
import { AnimatedCounter } from './AnimatedCounter';
import { calculateBarWidth, calculateBarHeight } from '../utils/barCalculations';
import { calculateImageSize } from '../utils/imageCalculations';
import { calculateLabelSize } from '../utils/labelCalculations';

interface BarChartProps {
  data: ParsedData;
  currentIndex: number;
  barSettings: ChartSettings['bars'];
  margins: ChartSettings['margins'];
  valueSettings: ChartSettings['values'];
  imageSettings: ChartSettings['images'];
  labelSettings: ChartSettings['labels'];
  animations: ChartSettings['animations'];
  updaters: ChartSettings['updaters'];
}

export const BarChart: React.FC<BarChartProps> = React.memo(({
  data,
  currentIndex,
  barSettings,
  margins,
  valueSettings,
  imageSettings,
  labelSettings,
  animations,
  updaters
}) => {
  const [flippingBars, setFlippingBars] = React.useState<Set<string>>(new Set());
  const [visibleBars, setVisibleBars] = React.useState<Set<string>>(new Set());
  const previousPositionsRef = React.useRef<Map<string, number>>(new Map());
  const timeoutRef = React.useRef<number | null>(null);

  if (!data) return null;

  // Memoize sorted data calculation
  const sortedData = useMemo(() => {
    let filteredData = [...data.data];
    
    if (barSettings.hideZeroBars) {
      filteredData = filteredData.filter(item => item.values[currentIndex] > 0);
    }
    
    return filteredData
      .sort((a, b) => b.values[currentIndex] - a.values[currentIndex])
      .slice(0, barSettings.maxCount);
  }, [data, currentIndex, barSettings.maxCount, barSettings.hideZeroBars]);

  // Memoize current positions calculation
  const currentPositions = useMemo(() => {
    return new Map(sortedData.map((item, index) => [item.label, index]));
  }, [sortedData]);

  // Memoize max value calculation
  const maxValue = useMemo(() => {
    return Math.max(...sortedData.map(item => item.values[currentIndex]));
  }, [sortedData, currentIndex]);

  // Optimize animation handling
  React.useEffect(() => {
    const previousPositions = previousPositionsRef.current;
    const newFlippingBars = new Set<string>();
    const newVisibleBars = new Set<string>();

    currentPositions.forEach((currentIndex, label) => {
      const previousIndex = previousPositions.get(label);
      
      if (previousIndex === undefined) {
        newVisibleBars.add(label);
      } else if (previousIndex !== currentIndex) {
        newFlippingBars.add(label);
      }
    });

    if (newFlippingBars.size > 0) {
      setFlippingBars(newFlippingBars);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setFlippingBars(new Set());
      }, animations.jumpDuration * 1000);
    }

    if (newVisibleBars.size > 0) {
      setVisibleBars(newVisibleBars);
      setTimeout(() => {
        setVisibleBars(new Set());
      }, animations.entryDuration * 1000);
    }

    previousPositionsRef.current = currentPositions;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentPositions, animations.jumpDuration, animations.entryDuration]);

  const totalBars = barSettings.keepSpacing ? barSettings.maxCount : sortedData.length;
  const baseBarSpacing = barSettings.spacing;
  const availableHeight = 600 - margins.top - margins.bottom;
  const barHeight = barSettings.baseHeight || Math.floor((availableHeight - (Math.max(0, baseBarSpacing) * (totalBars - 1))) / totalBars);

  const displayBars = barSettings.keepSpacing
    ? Array(totalBars).fill(null).map((_, i) => sortedData[i] || null)
    : sortedData;

  // Memoize position calculation
  const getPosition = useCallback((index: number): number => {
    if (barSettings.useCustomSpacing) {
      let position = 0;
      for (let i = 0; i < index; i++) {
        position += barHeight + (barSettings.customSpacing[i] ?? barSettings.spacing);
      }
      return position;
    }
    return index * (barHeight + barSettings.spacing);
  }, [barHeight, barSettings.spacing, barSettings.useCustomSpacing, barSettings.customSpacing]);

  // Memoize transition calculation
  const getTransition = useCallback((label: string, property: 'position' | 'width') => {
    if (animations.barJump === 'smooth') {
      const isFlipping = flippingBars.has(label);
      const isEntering = visibleBars.has(label);
      
      return {
        type: isFlipping ? "tween" : "spring",
        duration: property === 'position' 
          ? (isEntering ? animations.entryDuration : animations.jumpDuration)
          : animations.growthDuration,
        bounce: isFlipping ? 0 : 0.2,
        ease: isFlipping ? "linear" : undefined
      };
    }
    return {
      duration: 0
    };
  }, [animations, flippingBars, visibleBars]);

  // Memoize image rendering
  const renderImage = useCallback((item: ParsedData['data'][0], imageSize: { width: string; height: string }, index: number) => {
    if (!item || !item.image) return null;

    const shouldFlipImage = animations.flipStyle && animations.flipStyle.startsWith('image');
    const shouldFlipBorder = animations.flipStyle && animations.flipStyle.startsWith('border');
    const flipAnimation = animations.flipStyle && flippingBars.has(item.label) ? {
      [animations.flipStyle.includes('Vertical') ? 'rotateX' : 'rotateY']: [0, 720]
    } : null;

    const zIndex = imageSettings.stackOrder === 'topOverBottom' 
      ? sortedData.length - index
      : index + 1;

    if (!imageSettings.border.enabled) {
      return (
        <motion.img
          src={item.image}
          alt={item.label}
          className="rounded-full flex-shrink-0"
          style={{
            ...imageSize,
            zIndex
          }}
          animate={flipAnimation && shouldFlipImage ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
          loading="lazy"
        />
      );
    }

    const borderWidth = calculateBorderWidth(index);
    const borderSpacing = calculateBorderSpacing(index);
    const totalSize = {
      width: `${parseInt(imageSize.width) + (borderWidth + borderSpacing) * 2}px`,
      height: `${parseInt(imageSize.height) + (borderWidth + borderSpacing) * 2}px`
    };

    return (
      <div 
        className="relative flex-shrink-0" 
        style={{
          ...totalSize,
          zIndex
        }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{ 
            border: `${borderWidth}px solid ${item.color}`,
            opacity: 0.9
          }}
          animate={flipAnimation && shouldFlipBorder ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            padding: `${borderWidth + borderSpacing}px`
          }}
          animate={flipAnimation && shouldFlipImage ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
        >
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    );
  }, [animations, imageSettings, sortedData.length, getTransition]);

  const calculateBorderWidth = useCallback((index: number): number => {
    if (!imageSettings.border.descendingWidth || sortedData.length <= 1) {
      return imageSettings.border.width;
    }
    const position = index / (sortedData.length - 1);
    const reductionFactor = 1 - ((1 - imageSettings.border.widthRatio) * position);
    return Math.max(1, Math.floor(imageSettings.border.width * reductionFactor));
  }, [imageSettings.border, sortedData.length]);

  const calculateBorderSpacing = useCallback((index: number): number => {
    if (!imageSettings.border.descendingSpacing || sortedData.length <= 1) {
      return imageSettings.border.spacing;
    }
    const position = index / (sortedData.length - 1);
    const reductionFactor = 1 - ((1 - imageSettings.border.spacingRatio) * position);
    return Math.max(0, Math.floor(imageSettings.border.spacing * reductionFactor));
  }, [imageSettings.border, sortedData.length]);

  return (
    <div 
      className="w-full h-full overflow-hidden"
      style={{
        padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
      }}
    >
      <div className="relative h-full">
        <AnimatePresence>
          {displayBars.map((item, index) => {
            if (!item) {
              return (
                <motion.div
                  key={`empty-${index}`}
                  className="absolute left-0 right-0"
                  style={{
                    top: getPosition(index),
                    height: barHeight
                  }}
                />
              );
            }

            const updatedBar = updaters?.enabled ? getUpdatedBarData(item, index, currentIndex, updaters) : item;
            const percentage = (updatedBar.values[currentIndex] / maxValue) * 100;
            const barWidth = calculateBarWidth(
              updatedBar.values[currentIndex],
              maxValue,
              index,
              barSettings.descendingWidth,
              barSettings.descendingRatio,
              sortedData.length
            );
            const currentBarHeight = calculateBarHeight(
              barHeight,
              index,
              barSettings.descendingHeight,
              barSettings.heightRatio,
              sortedData.length
            );
            const topPosition = getPosition(index);
            const imageSize = calculateImageSize(
              index,
              imageSettings.size,
              imageSettings,
              sortedData.length
            );
            const fontSize = calculateLabelSize(
              index,
              labelSettings.size,
              labelSettings,
              sortedData.length
            );

            return (
              <motion.div
                key={updatedBar.label}
                className="absolute left-0 right-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  top: topPosition,
                  height: currentBarHeight,
                }}
                transition={getTransition(updatedBar.label, 'position')}
                style={{
                  top: topPosition,
                  height: currentBarHeight,
                }}
              >
                <div className="relative w-full h-full flex items-center">
                  {labelSettings.position === 'behind' && (
                    <div 
                      className="absolute right-full top-1/2 -translate-y-1/2 flex items-center whitespace-nowrap"
                      style={{ 
                        marginRight: `${labelSettings.spacing}px`,
                        color: labelSettings.invisible ? 'transparent' : labelSettings.color,
                        fontFamily: labelSettings.fontFamily,
                        fontSize: `${fontSize}px`,
                      }}
                    >
                      {imageSettings.position === 'behind' && renderImage(updatedBar, imageSize, index)}
                      {updatedBar.label}
                    </div>
                  )}

                  <div className="relative flex-1 h-full flex items-center">
                    <motion.div
                      className="relative bg-opacity-90"
                      style={{ 
                        backgroundColor: updatedBar.color,
                        width: barWidth,
                        height: currentBarHeight,
                        minWidth: '2%',
                        borderRadius: barSettings.roundedCorners?.enabled 
                          ? `0 ${barSettings.roundedCorners.radius}px ${barSettings.roundedCorners.radius}px 0`
                          : undefined
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: barWidth }}
                      transition={getTransition(updatedBar.label, 'width')}
                    >
                      {labelSettings.position === 'inside' && (
                        <div
                          className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
                          style={{
                            color: labelSettings.invisible ? 'transparent' : labelSettings.color,
                            fontFamily: labelSettings.fontFamily,
                            fontSize: `${fontSize}px`,
                          }}
                        >
                          {updatedBar.label}
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
                      style={{ 
                        left: `calc(${percentage}% + ${imageSettings.position === 'front' ? imageSettings.spacing : 0}px)`,
                      }}
                      initial={{ left: '0%' }}
                      animate={{ left: `calc(${percentage}% + ${imageSettings.position === 'front' ? imageSettings.spacing : 0}px)` }}
                      transition={getTransition(updatedBar.label, 'width')}
                    >
                      {imageSettings.position === 'front' && renderImage(updatedBar, imageSize, index)}

                      {valueSettings.showAtEnd && (
                        <div 
                          className="font-bold whitespace-nowrap"
                          style={{ 
                            color: valueSettings.color,
                            fontSize: `${valueSettings.fontSize}px`
                          }}
                        >
                          <AnimatedCounter 
                            value={updatedBar.values[currentIndex]} 
                            animationType={barSettings.animationType}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});

// Helper function for updaters
function getUpdatedBarData(
  bar: ParsedData['data'][0], 
  index: number, 
  currentIndex: number,
  updaters: ChartSettings['updaters']
) {
  if (!updaters?.enabled) return bar;

  const barUpdaters = updaters.updaters[bar.label] || [];
  let updatedBar = { ...bar };

  for (const updater of barUpdaters) {
    if (Math.floor(currentIndex) === updater.columnIndex) {
      if (updater.updateImage) {
        updatedBar.image = updater.updateImage;
      }
      if (updater.updateColor) {
        updatedBar.color = updater.updateColor;
      }
    }
  }

  return updatedBar;
}