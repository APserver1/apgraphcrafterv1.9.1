// ... (código anterior sin cambios)

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16';

export const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '16:9': 16/9,
  '4:3': 4/3,
  '1:1': 1,
  '9:16': 9/16
};

// ... (resto del código sin cambios)