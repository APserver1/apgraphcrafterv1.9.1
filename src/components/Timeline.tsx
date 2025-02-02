import React from 'react';
import { Play, Pause } from 'lucide-react';
import { MusicTrack } from '../types/SettingsTypes';

interface TimelineProps {
  labels: string[];
  currentIndex: number;
  isPlaying: boolean;
  onIndexChange: (index: number) => void;
  onPlayPause: () => void;
  musicTracks?: MusicTrack[];
}

export const Timeline: React.FC<TimelineProps> = ({
  labels,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayPause,
  musicTracks = []
}) => {
  const totalSteps = (labels.length - 1) * 150;
  const currentStep = Math.floor(currentIndex * 150);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = Number(e.target.value);
    const index = step / 150;
    onIndexChange(index);
  };

  const getCurrentLabel = () => {
    const baseIndex = Math.floor(currentIndex);
    const nextIndex = Math.min(baseIndex + 1, labels.length - 1);
    const progress = (currentIndex - baseIndex) * 100;
    
    if (progress === 0) {
      return labels[baseIndex];
    }
    
    return `${labels[baseIndex]} → ${labels[nextIndex]} (${Math.round(progress)}%)`;
  };

  const getDisplayLabels = () => {
    if (labels.length <= 10) {
      return labels.map((label, index) => ({
        id: `label-${index}`,
        index,
        label
      }));
    }

    const result = [];
    const step = (labels.length - 2) / 7;

    result.push({
      id: `label-0`,
      index: 0,
      label: labels[0]
    });

    for (let i = 1; i <= 8; i++) {
      const index = Math.round(step * i);
      if (index > 0 && index < labels.length - 1) {
        result.push({
          id: `label-${index}`,
          index,
          label: labels[index]
        });
      }
    }

    result.push({
      id: `label-${labels.length - 1}`,
      index: labels.length - 1,
      label: labels[labels.length - 1]
    });

    return result;
  };

  const displayLabels = getDisplayLabels();

  // Calculate total animation duration in seconds
  const totalDuration = (labels.length - 1) * 150 / 60; // Convert steps to seconds

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <span className="font-medium">{getCurrentLabel()}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={0}
          max={totalSteps}
          value={currentStep}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
              (currentStep / totalSteps) * 100
            }%, #D1D5DB ${
              (currentStep / totalSteps) * 100
            }%, #D1D5DB 100%)`
          }}
        />
        
        {musicTracks && musicTracks.length > 0 && (
          <div className="relative h-8 mt-2">
            {musicTracks.map((track) => {
              if (!track || !track.file) return null;
              
              const startPercent = (track.startTime / totalDuration) * 100;
              const trackDuration = track.trim.end - track.trim.start;
              const widthPercent = (trackDuration / totalDuration) * 100;
              
              return (
                <div
                  key={track.id}
                  className="absolute h-4 rounded"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: track.color,
                    opacity: 0.7
                  }}
                  title={`${track.file.name} (${Math.round(trackDuration)}s)`}
                />
              );
            })}
          </div>
        )}
        
        <div className="flex justify-between mt-2">
          {displayLabels.map(({ id, index, label }) => (
            <div
              key={id}
              className={`text-sm ${
                Math.floor(currentIndex) === index ? 'text-blue-500 font-medium' : 'text-gray-500'
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => onIndexChange(index)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};