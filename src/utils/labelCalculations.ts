export function calculateLabelSize(
  index: number,
  baseSize: number,
  settings: {
    descendingSize: boolean;
    sizeRatio: number;
  },
  totalItems?: number
): number {
  if (!settings.descendingSize || !totalItems || totalItems <= 1) {
    return baseSize;
  }

  const position = index / (totalItems - 1);
  const reductionFactor = 1 - ((1 - settings.sizeRatio) * position);
  
  return Math.floor(baseSize * reductionFactor);
}