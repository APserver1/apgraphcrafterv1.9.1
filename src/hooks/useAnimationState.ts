import { useState, useEffect, useCallback } from 'react';
import { ChartSettings } from '../types/SettingsTypes';

export const useAnimationState = (
  dataLength: number,
  timelineSettings: ChartSettings['timeline']
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingLoop, setIsWaitingLoop] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);

  const handleTimelineChange = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setIsWaitingLoop(false);
    setLastUpdateTime(null);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!lastUpdateTime) {
        setLastUpdateTime(timestamp);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastUpdateTime;
      const totalDuration = timelineSettings.duration * 1000; // Convert to milliseconds
      const totalSteps = dataLength - 1;
      const stepIncrement = (deltaTime / totalDuration) * totalSteps;

      const newIndex = currentIndex + stepIncrement;

      if (newIndex >= totalSteps) {
        if (timelineSettings.loop) {
          if (!isWaitingLoop) {
            setIsWaitingLoop(true);
            setTimeout(() => {
              setCurrentIndex(0);
              setIsWaitingLoop(false);
              setLastUpdateTime(null);
            }, timelineSettings.loopDelayAfter * 1000);
          }
        } else {
          setIsPlaying(false);
          setCurrentIndex(totalSteps);
          setLastUpdateTime(null);
          return;
        }
      } else if (currentIndex === 0 && isWaitingLoop) {
        setTimeout(() => {
          setIsWaitingLoop(false);
          setLastUpdateTime(null);
        }, timelineSettings.loopDelayBefore * 1000);
      } else if (!isWaitingLoop) {
        setCurrentIndex(newIndex);
      }

      setLastUpdateTime(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying && !isWaitingLoop) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, currentIndex, dataLength, timelineSettings, isWaitingLoop, lastUpdateTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setLastUpdateTime(null);
  };

  return {
    currentIndex,
    isPlaying,
    togglePlay,
    handleTimelineChange,
  };
};