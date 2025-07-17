import { useState, useEffect } from 'react';
import { Project } from '@/types/project';

const STORAGE_KEY = 'project-dashboard-data';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProjects(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          assignedDate: p.assignedDate ? new Date(p.assignedDate) : undefined,
        })));
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const newProjects = [...projects, newProject];
    saveProjects(newProjects);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const newProjects = projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    saveProjects(newProjects);
  };

  const deleteProject = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    saveProjects(newProjects);
  };

  const getProjectsByDate = () => {
    const projectsByDate: { [date: string]: Project[] } = {};
    
    projects
      .filter(p => p.assignedDate)
      .forEach(project => {
        const dateKey = project.assignedDate!.toISOString().split('T')[0];
        if (!projectsByDate[dateKey]) {
          projectsByDate[dateKey] = [];
        }
        projectsByDate[dateKey].push(project);
      });
    
    return projectsByDate;
  };

  const getProjectsWithoutDate = () => {
    return projects
      .filter(p => !p.assignedDate)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByDate,
    getProjectsWithoutDate,
    saveToStorage
  };
}