export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  thumbnail: string | null;
  projectData: Project;
  userId: string;
  createdAt: string;
  averageRating: number;
  totalRatings: number;
}

export interface TemplateData {
  name: string;
  description: string;
  tags: string[];
  thumbnail: string | null;
  projectData: Project;
}

export interface TemplateRating {
  id: string;
  templateId: string;
  userId: string;
  rating: number;
  createdAt: string;
}