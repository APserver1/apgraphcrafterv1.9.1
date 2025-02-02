import { useState } from 'react';
import { ChartSettings, AspectRatio } from '../types/SettingsTypes';
import { defaultSettings } from '../config/defaultSettings';

export function useChartSettings() {
  const [settings, setSettingsState] = useState<ChartSettings>(defaultSettings);

  const setSettings = (newSettings: ChartSettings) => {
    setSettingsState({
      ...defaultSettings,
      ...newSettings,
    });
  };

  const updateAspectRatio = (ratio: AspectRatio) => {
    setSettingsState(prev => ({
      ...prev,
      aspectRatio: ratio,
    }));
  };

  const updateMargins = (updates: Partial<ChartSettings['margins']>) => {
    setSettingsState(prev => ({
      ...prev,
      margins: {
        ...prev.margins,
        ...updates,
      },
    }));
  };

  const updateBarSettings = (updates: Partial<ChartSettings['bars']>) => {
    setSettingsState(prev => ({
      ...prev,
      bars: {
        ...prev.bars,
        ...updates,
      },
    }));
  };

  const updateValueSettings = (updates: Partial<ChartSettings['values']>) => {
    setSettingsState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        ...updates,
      },
    }));
  };

  const updateImageSettings = (updates: Partial<ChartSettings['images']>) => {
    setSettingsState(prev => ({
      ...prev,
      images: {
        ...prev.images,
        ...updates,
      },
    }));
  };

  const updateLabelSettings = (updates: Partial<ChartSettings['labels']>) => {
    setSettingsState(prev => ({
      ...prev,
      labels: {
        ...prev.labels,
        ...updates,
      },
    }));
  };

  const updateTimelineSettings = (updates: Partial<ChartSettings['timeline']>) => {
    setSettingsState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        ...updates,
      },
    }));
  };

  const updateAnimationSettings = (updates: Partial<ChartSettings['animations']>) => {
    setSettingsState(prev => ({
      ...prev,
      animations: {
        ...prev.animations,
        ...updates,
      },
    }));
  };

  const updateDateSettings = (updates: Partial<ChartSettings['dateDisplay']>) => {
    setSettingsState(prev => ({
      ...prev,
      dateDisplay: {
        ...prev.dateDisplay,
        ...updates,
      },
    }));
  };

  const updateImageColumnSettings = (updates: Partial<ChartSettings['imageColumn']>) => {
    setSettingsState(prev => ({
      ...prev,
      imageColumn: {
        ...prev.imageColumn,
        ...updates,
      },
    }));
  };

  const updateBackgroundSettings = (updates: Partial<ChartSettings['background']>) => {
    setSettingsState(prev => ({
      ...prev,
      background: {
        ...prev.background,
        ...updates,
      },
    }));
  };

  const updateEmbeddingsSettings = (updates: Partial<ChartSettings['embeddings']>) => {
    setSettingsState(prev => ({
      ...prev,
      embeddings: {
        ...prev.embeddings,
        ...updates,
      },
    }));
  };

  const updateCarouselSettings = (updates: Partial<ChartSettings['carousel']>) => {
    setSettingsState(prev => ({
      ...prev,
      carousel: {
        ...prev.carousel,
        ...updates,
      },
    }));
  };

  const updateTextCarouselSettings = (updates: Partial<ChartSettings['textCarousel']>) => {
    setSettingsState(prev => ({
      ...prev,
      textCarousel: {
        ...prev.textCarousel,
        ...updates,
      },
    }));
  };

  const updateUpdatersSettings = (updates: Partial<ChartSettings['updaters']>) => {
    setSettingsState(prev => ({
      ...prev,
      updaters: {
        ...prev.updaters,
        ...updates,
      },
    }));
  };

  return {
    settings,
    setSettings,
    updateAspectRatio,
    updateMargins,
    updateBarSettings,
    updateValueSettings,
    updateImageSettings,
    updateLabelSettings,
    updateTimelineSettings,
    updateAnimationSettings,
    updateDateSettings,
    updateImageColumnSettings,
    updateBackgroundSettings,
    updateEmbeddingsSettings,
    updateCarouselSettings,
    updateTextCarouselSettings,
    updateUpdatersSettings,
  };
}