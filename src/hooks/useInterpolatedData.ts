import { useMemo } from 'react';
import { ParsedData, BarData } from '../types/DataTypes';

function interpolateValue(start: number, end: number, t: number): number {
  // Smooth easing function
  const ease = t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
  return start + (end - start) * ease;
}

function interpolateBarData(
  startData: BarData[],
  endData: BarData[],
  progress: number
): BarData[] {
  return startData.map((startBar, index) => {
    const endBar = endData[index];
    return {
      ...startBar,
      values: [interpolateValue(startBar.values[0], endBar.values[0], progress)]
    };
  });
}

export function useInterpolatedData(
  data: ParsedData,
  currentIndex: number,
  isPlaying: boolean
): { interpolatedData: ParsedData } {
  return useMemo(() => {
    const baseIndex = Math.floor(currentIndex);
    const nextIndex = Math.min(baseIndex + 1, data.labels.length - 1);
    const progress = currentIndex - baseIndex;

    // If we're exactly on a keyframe, return that data directly
    if (progress === 0) {
      return {
        interpolatedData: {
          labels: [data.labels[baseIndex]],
          data: data.data.map(bar => ({
            ...bar,
            values: [bar.values[baseIndex]]
          }))
        }
      };
    }

    // Create interpolated data between keyframes
    const startData = data.data.map(bar => ({
      ...bar,
      values: [bar.values[baseIndex]]
    }));

    const endData = data.data.map(bar => ({
      ...bar,
      values: [bar.values[nextIndex]]
    }));

    const interpolatedBars = interpolateBarData(startData, endData, progress);

    return {
      interpolatedData: {
        labels: [data.labels[baseIndex]],
        data: interpolatedBars
      }
    };
  }, [data, currentIndex, isPlaying]);
}