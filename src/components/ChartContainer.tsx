import React, { useState, useRef, useEffect } from 'react';
import { ASPECT_RATIOS } from '../types/SettingsTypes';
import { BarChart } from './BarChart';
import { ParsedData } from '../types/DataTypes';
import { ChartSettings } from '../types/SettingsTypes';
import { useInterpolatedData } from '../hooks/useInterpolatedData';
import { ImageColumn } from './ImageColumn';
import { DateDisplay } from './DateDisplay';
import { EmbeddedImages } from './EmbeddedImages';
import { Timeline } from './Timeline';
import { CarouselImages } from './CarouselImages';
import { TextCarousel } from './TextCarousel';
import html2canvas from 'html2canvas';

interface ChartContainerProps {
  data: ParsedData;
  currentIndex: number;
  isPlaying: boolean;
  aspectRatio: keyof typeof ASPECT_RATIOS;
  barSettings: ChartSettings['bars'];
  margins: ChartSettings['margins'];
  valueSettings: ChartSettings['values'];
  imageSettings: ChartSettings['images'];
  labelSettings: ChartSettings['labels'];
  animations: ChartSettings['animations'];
  dateDisplay: ChartSettings['dateDisplay'];
  imageColumn: ChartSettings['imageColumn'];
  background: ChartSettings['background'];
  embeddings: ChartSettings['embeddings'];
  carousel: ChartSettings['carousel'];
  textCarousel: ChartSettings['textCarousel'];
  updaters: ChartSettings['updaters'];
  onPlayPause: () => void;
  onTimelineChange: (index: number) => void;
  onThumbnailCapture?: (thumbnail: string) => void;
  hideTimeline?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  currentIndex,
  isPlaying,
  aspectRatio,
  barSettings,
  margins,
  valueSettings,
  imageSettings,
  labelSettings,
  animations,
  dateDisplay,
  imageColumn,
  background,
  embeddings,
  carousel,
  textCarousel,
  updaters,
  onPlayPause,
  onTimelineChange,
  onThumbnailCapture,
  hideTimeline = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { interpolatedData } = useInterpolatedData(data, currentIndex, isPlaying);

  const safeBarSettings = {
    ...barSettings,
    maxCount: barSettings?.maxCount ?? 10
  };

  const ratio = ASPECT_RATIOS[aspectRatio];

  useEffect(() => {
    if (onThumbnailCapture && chartRef.current) {
      const captureChart = async () => {
        try {
          const chartElement = chartRef.current!.querySelector('.chart-content');
          if (!chartElement) return;

          const canvas = await html2canvas(chartElement as HTMLElement, {
            backgroundColor: background.enabled ? background.color : '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });

          onThumbnailCapture(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          console.error('Error capturing thumbnail:', error);
        }
      };
      captureChart();
    }
  }, [onThumbnailCapture, ratio, background]);

  // Calcular el escalado manteniendo la resolución 1920x1080
  const calculateScale = () => {
    if (!containerRef.current) return 1;
    const containerWidth = containerRef.current.offsetWidth;
    return containerWidth / 1920;
  };

  const scale = calculateScale();

  // Estilos para mantener la resolución y el escalado correcto
  const wrapperStyle = {
    position: 'relative' as const,
    width: '100%',
    paddingTop: `${(1080 / 1920) * 100}%`,
    overflow: 'hidden'
  };

  const chartStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '1920px',
    height: '1080px',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center'
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-white"
    >
      <div 
        ref={chartRef}
        className="relative w-full border-2 border-black rounded-lg overflow-hidden"
        style={wrapperStyle}
      >
        <div style={chartStyle}>
          <div className="chart-content absolute inset-0">
            {background.enabled && (
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: background.color }}
              />
            )}
            {embeddings.enabled && (
              <EmbeddedImages 
                images={embeddings.images} 
                texts={embeddings.texts}
              />
            )}
            <CarouselImages
              settings={carousel}
              currentLabel={data.labels[Math.floor(currentIndex)]}
            />
            <TextCarousel
              settings={textCarousel}
              currentLabel={data.labels[Math.floor(currentIndex)]}
            />
            <ImageColumn
              data={interpolatedData}
              currentIndex={0}
              settings={imageColumn}
              maxBars={safeBarSettings.maxCount}
            />
            <BarChart
              data={interpolatedData}
              currentIndex={0}
              barSettings={safeBarSettings}
              margins={margins}
              valueSettings={valueSettings}
              imageSettings={imageSettings}
              labelSettings={labelSettings}
              animations={animations}
              updaters={updaters}
            />
            <DateDisplay
              currentLabel={data.labels[Math.floor(currentIndex)]}
              settings={dateDisplay}
            />
          </div>
        </div>
      </div>
      
      {!hideTimeline && (
        <div className="w-full max-w-[1200px] mt-6 mx-auto">
          <Timeline
            labels={data.labels}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onIndexChange={onTimelineChange}
            onPlayPause={onPlayPause}
          />
        </div>
      )}
    </div>
  );
};