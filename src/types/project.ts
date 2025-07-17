export interface Project {
  id: string;
  title: string;
  effort: number; // 0-10
  benefit: number; // 0-10
  colorIndex: number; // 1-10 for project colors
  createdAt: Date;
  assignedDate?: Date;
  
  // Editable fields
  discovery: string;
  scope: string;
  complexityFactors: string;
  blockers: string;
  needs: string;
  dependencies: string;
  nextSteps: string;
  researchFocus: string;
  
  // Media
  images: string[];
  attachments: { id: string; name: string; dataUrl: string; size: number; type: string; uploadedAt: Date }[];
}

export interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectsByDate: () => { [date: string]: Project[] };
  getProjectsWithoutDate: () => Project[];
}