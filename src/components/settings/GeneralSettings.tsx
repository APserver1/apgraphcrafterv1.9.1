import React, { useState, useRef } from 'react';
import { Camera, Download, Save } from 'lucide-react';
import { AspectRatio, ASPECT_RATIOS } from '../../types/SettingsTypes';
import { Project } from '../../types/ProjectTypes';
import { saveProject } from '../../utils/projectStorage';

interface GeneralSettingsProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  currentProject: Project;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  aspectRatio,
  onAspectRatioChange,
  currentProject,
}) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const notificationTimeout = useRef<number | null>(null);

  const handleTakeScreenshot = async () => {
    const chartContent = document.querySelector('.chart-content') as HTMLElement;
    if (!chartContent || isCapturing) return;

    try {
      setIsCapturing(true);

      // Crear un contenedor temporal con las dimensiones exactas
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1920px';
      tempContainer.style.height = '1080px';
      tempContainer.style.overflow = 'hidden';
      document.body.appendChild(tempContainer);

      // Clonar el contenido de la gráfica
      const clone = chartContent.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      tempContainer.appendChild(clone);

      // Pre-cargar todas las imágenes antes de la captura
      const images = clone.querySelectorAll('img');
      await Promise.all(Array.from(images).map(async (img) => {
        if (img instanceof HTMLImageElement) {
          try {
            // Crear un canvas temporal para cada imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Cargar la imagen en un nuevo elemento Image
            const imgEl = new Image();
            imgEl.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              imgEl.onload = () => {
                // Establecer las dimensiones del canvas
                canvas.width = imgEl.naturalWidth;
                canvas.height = imgEl.naturalHeight;
                
                // Dibujar la imagen en el canvas
                ctx.drawImage(imgEl, 0, 0);
                
                try {
                  // Convertir el canvas a una URL de datos
                  const dataUrl = canvas.toDataURL('image/png');
                  img.src = dataUrl;
                  resolve(null);
                } catch (err) {
                  // Si falla la conversión, mantener la URL original
                  resolve(null);
                }
              };
              imgEl.onerror = () => resolve(null); // No rechazar para continuar con otras imágenes
              
              // Intentar cargar la imagen con la URL original
              imgEl.src = img.src;
            });
          } catch (err) {
            console.warn('Error processing image:', img.src);
          }
        }
      }));

      // Asegurarse de que todos los elementos mantengan sus posiciones y estilos
      const elements = clone.querySelectorAll('*');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          if (style.position === 'absolute') {
            el.style.transform = 'none';
          }
          // Preservar tamaños específicos para imágenes
          if (el instanceof HTMLImageElement) {
            const originalWidth = el.style.width;
            const originalHeight = el.style.height;
            if (originalWidth && originalHeight) {
              el.width = parseInt(originalWidth);
              el.height = parseInt(originalHeight);
              el.style.width = originalWidth;
              el.style.height = originalHeight;
            }
          }
        }
      });

      // Esperar un momento para asegurar que todos los cambios se apliquen
      await new Promise(resolve => setTimeout(resolve, 100));

      // Configurar html2canvas con opciones optimizadas
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tempContainer, {
        width: 1920,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        onclone: (doc) => {
          const clonedElement = doc.querySelector('.chart-content');
          if (clonedElement) {
            const elements = clonedElement.querySelectorAll('*');
            elements.forEach((el) => {
              if (el instanceof HTMLElement) {
                const style = window.getComputedStyle(el);
                if (style.position === 'absolute') {
                  el.style.transform = 'none';
                }
                // Preservar dimensiones de imágenes
                if (el instanceof HTMLImageElement) {
                  const originalWidth = el.style.width;
                  const originalHeight = el.style.height;
                  if (originalWidth && originalHeight) {
                    el.width = parseInt(originalWidth);
                    el.height = parseInt(originalHeight);
                    el.style.width = originalWidth;
                    el.style.height = originalHeight;
                  }
                }
              }
            });
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setScreenshot(dataUrl);
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Error al tomar la captura. Por favor, intente de nuevo.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadScreenshot = () => {
    if (!screenshot) return;

    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `${currentProject.name}-screenshot.png`;
    link.click();
  };

  const showNotification = (message: string) => {
    // Remove any existing notification
    const existingNotification = document.querySelector('.save-notification');
    if (existingNotification) {
      document.body.removeChild(existingNotification);
    }

    // Clear any existing timeout
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current);
    }

    const notification = document.createElement('div');
    notification.className = 'save-notification fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Set new timeout
    notificationTimeout.current = window.setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      notificationTimeout.current = null;
    }, 3000);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveProject(currentProject);
      showNotification('Proyecto guardado correctamente');
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveError('Error al guardar el proyecto. Por favor, intente de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (notificationTimeout.current) {
        window.clearTimeout(notificationTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relación de aspecto
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {Object.keys(ASPECT_RATIOS).map((ratio) => (
            <option key={ratio} value={ratio}>
              {ratio} {ratio === '16:9' ? '(predeterminado)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleTakeScreenshot}
            disabled={isCapturing}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Camera className="w-5 h-5 mr-2" />
            <span>{isCapturing ? 'Capturando...' : 'Tomar Captura'}</span>
          </button>

          {screenshot && (
            <button
              onClick={handleDownloadScreenshot}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>Descargar Captura</span>
            </button>
          )}
        </div>

        {screenshot && (
          <div className="border rounded-lg p-2">
            <img
              src={screenshot}
              alt="Vista previa de la captura"
              className="w-full rounded"
            />
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Proyecto'}</span>
        </button>
        {saveError && (
          <p className="mt-2 text-sm text-red-500">{saveError}</p>
        )}
      </div>
    </div>
  );
};