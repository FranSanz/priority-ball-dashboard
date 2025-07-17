import { Project } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineSectionProps {
  projectsByDate: { [date: string]: Project[] };
  onProjectClick: (project: Project) => void;
}

export function TimelineSection({ projectsByDate, onProjectClick }: TimelineSectionProps) {
  const sortedDates = Object.keys(projectsByDate).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-lg font-medium mb-2">No scheduled projects</div>
        <div className="text-sm">Assign dates to projects to see them in the timeline</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => {
        const dateObj = new Date(date);
        const projects = projectsByDate[date];
        
        return (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              {dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {projects.map(project => (
                <ProjectMiniCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick(project)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ProjectMiniCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectMiniCard({ project, onClick }: ProjectMiniCardProps) {
  const colorClass = `bg-project-${project.colorIndex}`;

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-medium group"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", colorClass)} />
          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {project.title}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            E: {project.effort}
          </Badge>
          <Badge variant="outline" className="text-xs">
            B: {project.benefit}
          </Badge>
          {project.attachments && project.attachments.length > 0 && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {project.attachments.length}
            </Badge>
          )}
        </div>
        {project.nextSteps && (
          <p className="text-xs text-muted-foreground truncate">
            {project.nextSteps}
          </p>
        )}
      </CardContent>
    </Card>
  );
}