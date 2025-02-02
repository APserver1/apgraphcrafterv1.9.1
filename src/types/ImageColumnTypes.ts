import { ParsedData } from './DataTypes';

export interface ImageColumnSettings {
  enabled: boolean;
  position: 'left' | 'right';
  size: number;
  spacing: number;
  descendingSize: boolean;
  sizeRatio: number;
  defaultImage: string;
  images: Record<string, string>;
}

export interface ImageColumnState {
  settings: ImageColumnSettings;
  validationStatus: Record<string, boolean>;
}