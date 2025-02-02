import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Upload, Download, Share2, Edit2 } from 'lucide-react';
import { ChartContainer } from '../components/ChartContainer';
import { EditableTable } from '../components/EditableTable';
import { SettingsPanel } from '../components/SettingsPanel';
import { ProjectSelector } from '../components/ProjectSelector';
import { ProjectFileButtons } from '../components/ProjectFileButtons';
import { RenameProjectDialog } from '../components/RenameProjectDialog';
import { useAnimationState } from '../hooks/useAnimationState';
import { useDataManagement } from '../hooks/useDataManagement';
import { useChartSettings } from '../hooks/useChartSettings';
import { Project } from '../types/ProjectTypes';
import { saveProject, getProject } from '../utils/projectStorage';
import { v4 as uuidv4 } from 'uuid';
import { EmptyCellHandling } from '../types/SettingsTypes';
import { sampleData } from '../data/sampleData';
import { Link } from 'react-router-dom';

export const ChartEditor = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  const {
    data,
    handleFileUpload,
    handleDownload,
    handleDataChange,
    handleEmptyCellHandlingChange,
    setData,
  } = useDataManagement();

  const {
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
  } = useChartSettings();

  const {
    currentIndex,
    isPlaying,
    togglePlay,
    handleTimelineChange,
  } = useAnimationState(data?.labels?.length || 0, settings.timeline);

  useEffect(() => {
    if (currentProject) {
      const saveTimeout = setTimeout(async () => {
        try {
          setSaveError(null);
          await saveProject({
            ...currentProject,
            settings,
            data,
            lastModified: Date.now(),
          });
        } catch (error) {
          console.error('Error saving project:', error);
          setSaveError('Error al guardar el proyecto. Los cambios se mantienen localmente.');
        }
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [currentProject, settings, data]);

  const handleNewProject = async (name: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      lastModified: Date.now(),
      settings,
      data: sampleData,
    };
    setCurrentProject(newProject);
    setData(sampleData);
    try {
      await saveProject(newProject);
      setSaveError(null);
    } catch (error) {
      console.error('Error saving new project:', error);
      setSaveError('Error al guardar el proyecto. Los cambios se mantienen localmente.');
    }
  };

  const handleOpenProject = async (id: string) => {
    setIsLoading(true);
    try {
      const project = await getProject(id);
      if (project) {
        setCurrentProject(project);
        setSettings(project.settings);
        setData(project.data);
        setSaveError(null);
      }
    } catch (error) {
      console.error('Error opening project:', error);
      alert('Error al abrir el proyecto. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectImport = (project: Project) => {
    setCurrentProject(project);
    setSettings(project.settings);
    setData(project.data);
    setSaveError(null);
  };

  const handleValueSettingsChange = (updates: Partial<typeof settings.values>) => {
    if ('emptyCellHandling' in updates) {
      handleEmptyCellHandlingChange(updates.emptyCellHandling as EmptyCellHandling);
    }
    updateValueSettings(updates);
  };

  if (!currentProject) {
    return (
      <ProjectSelector
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <img
                  src="https://i.imgur.com/FKMp9fq.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </Link>
              <h1 className="text-3xl font-bold">
                {currentProject.name}
              </h1>
              {saveError && (
                <p className="text-red-500 text-sm mt-1">{saveError}</p>
              )}
            </div>
            <div className="flex gap-4">
              <ProjectFileButtons
                currentProject={currentProject}
                onProjectImport={handleProjectImport}
              />
              <button
                onClick={() => setShowRenameDialog(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                <span>Cambiar Nombre</span>
              </button>
              <button
                onClick={() => setCurrentProject(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cambiar Proyecto
              </button>
            </div>
          </div>
          
          <div className="mb-8 flex gap-4">
            <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Excel</span>
            </label>

            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>Download Excel</span>
            </button>
          </div>

          <Tabs>
            <TabList className="flex border-b mb-4">
              <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-500">
                Chart
              </Tab>
              <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-500">
                Data
              </Tab>
            </TabList>

            <TabPanel>
              <div className="flex gap-6">
                <div className="flex-1">
                  <ChartContainer
                    data={data}
                    currentIndex={currentIndex}
                    isPlaying={isPlaying}
                    aspectRatio={settings.aspectRatio}
                    barSettings={settings.bars}
                    margins={settings.margins}
                    valueSettings={settings.values}
                    imageSettings={settings.images}
                    labelSettings={settings.labels}
                    animations={settings.animations}
                    dateDisplay={settings.dateDisplay}
                    imageColumn={settings.imageColumn}
                    background={settings.background}
                    embeddings={settings.embeddings}
                    carousel={settings.carousel}
                    textCarousel={settings.textCarousel}
                    updaters={settings.updaters}
                    onPlayPause={togglePlay}
                    onTimelineChange={handleTimelineChange}
                  />
                </div>
                <SettingsPanel
                  settings={settings}
                  data={data}
                  currentProject={currentProject}
                  onAspectRatioChange={updateAspectRatio}
                  onMarginsChange={updateMargins}
                  onBarSettingsChange={updateBarSettings}
                  onValueSettingsChange={handleValueSettingsChange}
                  onImageSettingsChange={updateImageSettings}
                  onLabelSettingsChange={updateLabelSettings}
                  onTimelineSettingsChange={updateTimelineSettings}
                  onAnimationSettingsChange={updateAnimationSettings}
                  onDateSettingsChange={updateDateSettings}
                  onImageColumnSettingsChange={updateImageColumnSettings}
                  onBackgroundSettingsChange={updateBackgroundSettings}
                  onEmbeddingsSettingsChange={updateEmbeddingsSettings}
                  onCarouselSettingsChange={updateCarouselSettings}
                  onTextCarouselSettingsChange={updateTextCarouselSettings}
                  onUpdatersSettingsChange={updateUpdatersSettings}
                />
              </div>
            </TabPanel>

            <TabPanel>
              <EditableTable data={data} onDataChange={handleDataChange} />
            </TabPanel>
          </Tabs>
        </div>
      </div>

      {showRenameDialog && (
        <RenameProjectDialog
          project={currentProject}
          onClose={() => setShowRenameDialog(false)}
          onRename={async (newName) => {
            const updatedProject = {
              ...currentProject,
              name: newName,
              lastModified: Date.now()
            };
            setCurrentProject(updatedProject);
            try {
              await saveProject(updatedProject);
              setSaveError(null);
            } catch (error) {
              console.error('Error saving project:', error);
              setSaveError('Error al guardar el proyecto. Los cambios se mantienen localmente.');
            }
            setShowRenameDialog(false);
          }}
        />
      )}
    </div>
  );
};