export interface BarData {
  label: string;
  image: string;
  color: string;
  values: number[];
  additionalImages?: {
    images: string[];
    flags: string[];
  };
}

export interface ParsedData {
  labels: string[];
  data: BarData[];
}