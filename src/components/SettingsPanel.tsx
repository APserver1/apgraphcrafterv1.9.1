import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { GeneralSettings } from './settings/GeneralSettings';
import { MarginSettings } from './settings/MarginSettings';
import { BarSettings } from './settings/BarSettings';
import { ValueSettings } from './settings/ValueSettings';
import { ImageSettings } from './settings/ImageSettings';
import { LabelSettings } from './settings/LabelSettings';
import { TimelineSettings } from './settings/TimelineSettings';
import { AnimationSettings } from './settings/AnimationSettings';
import { ImageColumnSettingsPanel } from './settings/ImageColumnSettings';
import { DateSettings } from './settings/DateSettings';
import { BackgroundSettings } from './settings/BackgroundSettings';
import { EmbeddingsSettings } from './settings/EmbeddingsSettings';
import { CarouselSettings } from './settings/CarouselSettings';
import { TextCarouselSettings } from './settings/TextCarouselSettings';
import { SettingsSection } from './settings/SettingsSection';
import { ChartSettings } from '../types/SettingsTypes';
import { ParsedData } from '../types/DataTypes';
import { Project } from '../types/ProjectTypes';
import { UpdatersSettings } from './settings/UpdatersSettings';

interface SettingsPanelProps {
  settings: ChartSettings;
  data: ParsedData;
  currentProject: Project;
  onAspectRatioChange: (ratio: ChartSettings['aspectRatio']) => void;
  onMarginsChange: (updates: Partial<ChartSettings['margins']>) => void;
  onBarSettingsChange: (updates: Partial<ChartSettings['bars']>) => void;
  onValueSettingsChange: (updates: Partial<ChartSettings['values']>) => void;
  onImageSettingsChange: (updates: Partial<ChartSettings['images']>) => void;
  onLabelSettingsChange: (updates: Partial<ChartSettings['labels']>) => void;
  onTimelineSettingsChange: (updates: Partial<ChartSettings['timeline']>) => void;
  onAnimationSettingsChange: (updates: Partial<ChartSettings['animations']>) => void;
  onDateSettingsChange: (updates: Partial<ChartSettings['dateDisplay']>) => void;
  onImageColumnSettingsChange: (updates: Partial<ChartSettings['imageColumn']>) => void;
  onBackgroundSettingsChange: (updates: Partial<ChartSettings['background']>) => void;
  onEmbeddingsSettingsChange: (updates: Partial<ChartSettings['embeddings']>) => void;
  onCarouselSettingsChange: (updates: Partial<ChartSettings['carousel']>) => void;
  onTextCarouselSettingsChange: (updates: Partial<ChartSettings['textCarousel']>) => void;
  onUpdatersSettingsChange: (updates: Partial<ChartSettings['updaters']>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  data,
  currentProject,
  onAspectRatioChange,
  onMarginsChange,
  onBarSettingsChange,
  onValueSettingsChange,
  onImageSettingsChange,
  onLabelSettingsChange,
  onTimelineSettingsChange,
  onAnimationSettingsChange,
  onDateSettingsChange,
  onImageColumnSettingsChange,
  onBackgroundSettingsChange,
  onEmbeddingsSettingsChange,
  onCarouselSettingsChange,
  onTextCarouselSettingsChange,
  onUpdatersSettingsChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-8 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      <div className="p-4 bg-gray-100 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold">Settings</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          title={isCollapsed ? "Expandir ajustes" : "Colapsar ajustes"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="overflow-y-auto flex-grow">
          <div className="divide-y divide-gray-200">
            <SettingsSection title="General">
              <GeneralSettings
                aspectRatio={settings.aspectRatio}
                onAspectRatioChange={onAspectRatioChange}
                currentProject={currentProject}
              />
            </SettingsSection>
            
            <SettingsSection title="Fondo">
              <BackgroundSettings
                settings={settings.background}
                onSettingsChange={onBackgroundSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Animaciones">
              <AnimationSettings
                settings={settings.animations}
                onSettingsChange={onAnimationSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Margenes">
              <MarginSettings
                margins={settings.margins}
                onMarginsChange={onMarginsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Barras">
              <BarSettings
                settings={settings.bars}
                onSettingsChange={onBarSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Columna de Imágenes">
              <ImageColumnSettingsPanel
                settings={settings.imageColumn}
                data={data}
                onSettingsChange={onImageColumnSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Imágenes">
              <ImageSettings
                settings={settings.images}
                onSettingsChange={onImageSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Valores">
              <ValueSettings
                settings={settings.values}
                onSettingsChange={onValueSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Etiquetas">
              <LabelSettings
                settings={settings.labels}
                onSettingsChange={onLabelSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Fecha">
              <DateSettings
                settings={settings.dateDisplay}
                onSettingsChange={onDateSettingsChange}
              />
            </SettingsSection>
            
            <SettingsSection title="Linea de Tiempo">
              <TimelineSettings
                settings={settings.timeline}
                onSettingsChange={onTimelineSettingsChange}
              />
            </SettingsSection>

            <SettingsSection title="Carrusel">
              <CarouselSettings
                settings={settings.carousel}
                data={data}
                onSettingsChange={onCarouselSettingsChange}
              />
            </SettingsSection>

            <SettingsSection title="Carrusel de Texto">
              <TextCarouselSettings
                settings={settings.textCarousel}
                data={data}
                onSettingsChange={onTextCarouselSettingsChange}
              />
            </SettingsSection>

            <SettingsSection title="Incrustaciones">
              <EmbeddingsSettings
                settings={settings.embeddings}
                onSettingsChange={onEmbeddingsSettingsChange}
              />
            </SettingsSection>

            <SettingsSection title="Actualizadores">
              <UpdatersSettings
                settings={settings.updaters}
                data={data}
                onSettingsChange={onUpdatersSettingsChange}
              />
            </SettingsSection>
          </div>
        </div>
      )}
    </div>
  );
};