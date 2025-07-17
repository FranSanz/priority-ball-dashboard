import { useState } from 'react';
import { Project } from '@/types/project';
import { useProjects } from '@/hooks/useProjects';
import { PrioritizationMatrix } from './PrioritizationMatrix';
import { ProjectCard } from './ProjectCard';
import { AddProjectDialog } from './AddProjectDialog';
import { TimelineSection } from './TimelineSection';
import { BacklogSection } from './BacklogSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Download, Calendar, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByDate,
    getProjectsWithoutDate,
    saveToStorage
  } = useProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectCardOpen, setIsProjectCardOpen] = useState(false);
  const { toast } = useToast();

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectCardOpen(true);
  };

  const handleCloseProjectCard = () => {
    setSelectedProject(null);
    setIsProjectCardOpen(false);
  };

  const handleSave = () => {
    saveToStorage();
    toast({
      title: "Data Saved",
      description: "Your projects have been saved successfully.",
    });
  };

  const handleDownloadScreenshot = () => {
    // For now, just show a toast. In a real implementation, this would capture the screen
    toast({
      title: "Screenshot Feature",
      description: "Screenshot download will be implemented in a future version.",
    });
  };

  const projectsByDate = getProjectsByDate();
  const backlogProjects = getProjectsWithoutDate();

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Prioritize and manage your projects with visual insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AddProjectDialog onAdd={addProject} projectCount={projects.length} />
              <Button variant="outline" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleDownloadScreenshot}>
                <Download className="w-4 h-4 mr-2" />
                Screenshot
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Prioritization Matrix */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-primary rounded-full" />
              Prioritization Matrix
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Visualize your projects by effort vs benefit. Click on any project ball to edit details.
            </p>
          </CardHeader>
          <CardContent>
            <PrioritizationMatrix 
              projects={projects}
              onProjectClick={handleProjectClick}
            />
          </CardContent>
        </Card>

        {/* Timeline Section */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Projects organized by their assigned dates
            </p>
          </CardHeader>
          <CardContent>
            <TimelineSection 
              projectsByDate={projectsByDate}
              onProjectClick={handleProjectClick}
            />
          </CardContent>
        </Card>

        {/* Backlog Section */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-primary" />
              Backlog
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Projects without assigned dates, ordered by creation time
            </p>
          </CardHeader>
          <CardContent>
            <BacklogSection 
              projects={backlogProjects}
              onProjectClick={handleProjectClick}
            />
          </CardContent>
        </Card>

        {/* Project Statistics */}
        {projects.length > 0 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{projects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Object.keys(projectsByDate).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Scheduled Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{backlogProjects.length}</div>
                  <div className="text-sm text-muted-foreground">In Backlog</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(projects.reduce((sum, p) => sum + p.effort + p.benefit, 0) / projects.length || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Project Card Dialog */}
      <ProjectCard
        project={selectedProject}
        isOpen={isProjectCardOpen}
        onClose={handleCloseProjectCard}
        onUpdate={updateProject}
        onDelete={deleteProject}
      />
    </div>
  );
}