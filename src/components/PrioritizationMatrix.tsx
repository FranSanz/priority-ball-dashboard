import { Project } from '@/types/project';
import { cn } from '@/lib/utils';

interface PrioritizationMatrixProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export function PrioritizationMatrix({ projects, onProjectClick }: PrioritizationMatrixProps) {
  const getProjectBallSize = (effort: number, benefit: number) => {
    const total = effort + benefit;
    const minSize = 32; // Normal size
    const maxSize = 64; // Double size
    return minSize + ((total / 20) * (maxSize - minSize));
  };

  const getProjectPosition = (effort: number, benefit: number) => {
    // Matrix is 10x10, so we map 0-10 values to percentages
    const x = (effort / 10) * 85 + 7.5; // Keep within boundaries
    const y = ((10 - benefit) / 10) * 85 + 7.5; // Invert Y axis (high benefit at top)
    return { x, y };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-card rounded-lg border shadow-medium overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-muted" />
          ))}
        </div>
      </div>

      {/* Axis labels */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground font-medium">
        Effort →
      </div>
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-muted-foreground font-medium">
        Benefit →
      </div>

      {/* Corner labels */}
      <div className="absolute top-4 left-4 text-xs text-muted-foreground">High Impact</div>
      <div className="absolute top-4 right-4 text-xs text-muted-foreground">Quick Wins</div>
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">Fill-ins</div>
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">Major Projects</div>

      {/* Project balls */}
      {projects.map((project) => {
        const position = getProjectPosition(project.effort, project.benefit);
        const size = getProjectBallSize(project.effort, project.benefit);
        const colorClass = `bg-project-${project.colorIndex}`;

        return (
          <div
            key={project.id}
            className={cn(
              "absolute cursor-pointer rounded-full transition-all duration-300 hover:scale-110 hover:shadow-glow flex items-center justify-center text-white font-bold text-xs shadow-medium",
              colorClass
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => onProjectClick(project)}
            title={project.title}
          >
            <div className="text-center">
              <div className="text-[10px] leading-none">{project.effort}</div>
              <div className="text-[8px] leading-none opacity-80">/</div>
              <div className="text-[10px] leading-none">{project.benefit}</div>
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">No projects yet</div>
            <div className="text-sm">Create your first project to see it on the matrix</div>
          </div>
        </div>
      )}
    </div>
  );
}