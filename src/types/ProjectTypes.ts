export interface Project {
  id: string;
  name: string;
  lastModified: number;
  settings: ChartSettings;
  data: ParsedData;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  lastModified: number;
}