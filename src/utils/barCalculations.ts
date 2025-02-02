export function calculateBarWidth(
  value: number,
  maxValue: number,
  index: number,
  isDescending: boolean,
  ratio: number,
  totalItems: number
): string {
  // Calcular el porcentaje base
  const basePercentage = (value / maxValue) * 100;
  
  // Si no hay elementos o solo hay uno, o no está habilitado el descenso, devolver el porcentaje base
  if (!isDescending || totalItems <= 1) {
    return `${basePercentage}%`;
  }

  // Calcular la posición relativa y el factor de reducción
  const position = index / (totalItems - 1);
  const reductionFactor = 1 - ((1 - ratio) * position);
  
  return `${basePercentage * reductionFactor}%`;
}

export function calculateBarHeight(
  baseHeight: number,
  index: number,
  isDescending: boolean,
  ratio: number,
  totalItems: number
): number {
  // Si no hay elementos o solo hay uno, o no está habilitado el descenso, devolver la altura base
  if (!isDescending || totalItems <= 1) {
    return baseHeight;
  }

  // Calcular la posición relativa y el factor de reducción
  const position = index / (totalItems - 1);
  const reductionFactor = 1 - ((1 - ratio) * position);
  
  return Math.floor(baseHeight * reductionFactor);
}

export function getBarSpacing(
  index: number,
  settings: {
    useCustomSpacing: boolean;
    customSpacing: number[];
    spacing: number;
  }
): number {
  if (settings.useCustomSpacing && Array.isArray(settings.customSpacing)) {
    return settings.customSpacing[index] ?? settings.spacing;
  }
  return settings.spacing;
}