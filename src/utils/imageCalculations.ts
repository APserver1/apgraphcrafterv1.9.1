export function calculateImageSize(
  index: number,
  baseSize: number,
  settings: {
    descendingWidth: boolean;
    widthRatio: number;
    descendingHeight: boolean;
    heightRatio: number;
  },
  totalItems: number
): { width: string; height: string } {
  // Si no hay elementos o solo hay uno, devolver el tamaño base
  if (totalItems <= 1) {
    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`
    };
  }

  // Calcular la posición relativa
  const position = index / (totalItems - 1);
  
  // Calcular el ancho con reducción si está habilitado
  const width = settings.descendingWidth
    ? Math.floor(baseSize * (1 - (1 - settings.widthRatio) * position))
    : baseSize;

  // Calcular el alto con reducción si está habilitado
  const height = settings.descendingHeight
    ? Math.floor(baseSize * (1 - (1 - settings.heightRatio) * position))
    : baseSize;

  return {
    width: `${width}px`,
    height: `${height}px`
  };
}