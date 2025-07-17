import { Project } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BacklogSectionProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export function BacklogSection({ projects, onProjectClick }: BacklogSectionProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-lg font-medium mb-2">No projects in backlog</div>
        <div className="text-sm">Projects without assigned dates will appear here</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map(project => (
        <ProjectBacklogCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
        />
      ))}
    </div>
  );
}

interface ProjectBacklogCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectBacklogCard({ project, onClick }: ProjectBacklogCardProps) {
  const colorClass = `bg-project-${project.colorIndex}`;

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-medium group"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", colorClass)} />
          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {project.title}
          </h4>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            Effort: {project.effort}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Benefit: {project.benefit}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Score: {project.effort + project.benefit}
          </Badge>
          {project.attachments && project.attachments.length > 0 && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {project.attachments.length}
            </Badge>
          )}
        </div>

        {project.discovery && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {project.discovery}
          </p>
        )}

        <div className="text-xs text-muted-foreground">
          Created: {project.createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}