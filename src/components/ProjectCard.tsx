import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, isOpen, onClose, onUpdate, onDelete }: ProjectCardProps) {
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  // Initialize editedProject when project changes
  if (project && (!editedProject || editedProject.id !== project.id)) {
    setEditedProject({ ...project });
  }

  if (!project || !editedProject) return null;

  const handleSave = () => {
    onUpdate(project.id, editedProject);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
      onClose();
    }
  };

  const updateField = (field: keyof Project, value: any) => {
    setEditedProject(prev => prev ? { ...prev, [field]: value } : null);
  };

  const colorClass = `bg-project-${project.colorIndex}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className={cn("w-4 h-4 rounded-full", colorClass)}
            />
            <Input
              value={editedProject.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="text-2xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
              placeholder="Project Title"
            />
          </DialogTitle>
        </DialogHeader>

        <CardContent className="space-y-6 p-0">
          {/* Effort and Benefit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort (0-10)</Label>
              <Input
                id="effort"
                type="number"
                min="0"
                max="10"
                value={editedProject.effort}
                onChange={(e) => updateField('effort', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefit">Benefit (0-10)</Label>
              <Input
                id="benefit"
                type="number"
                min="0"
                max="10"
                value={editedProject.benefit}
                onChange={(e) => updateField('benefit', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Assigned Date */}
          <div className="space-y-2">
            <Label htmlFor="assignedDate">Assigned Date</Label>
            <Input
              id="assignedDate"
              type="date"
              value={editedProject.assignedDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => updateField('assignedDate', e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discovery and Scope */}
            <div className="space-y-2">
              <Label htmlFor="discovery">Discovery & Scope</Label>
              <Textarea
                id="discovery"
                value={editedProject.discovery}
                onChange={(e) => updateField('discovery', e.target.value)}
                placeholder="What needs to be discovered and what's the scope?"
                rows={4}
              />
            </div>

            {/* Complexity Factors */}
            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity Factors</Label>
              <Textarea
                id="complexity"
                value={editedProject.complexityFactors}
                onChange={(e) => updateField('complexityFactors', e.target.value)}
                placeholder="What makes this project complex?"
                rows={4}
              />
            </div>

            {/* Blockers */}
            <div className="space-y-2">
              <Label htmlFor="blockers">Blockers</Label>
              <Textarea
                id="blockers"
                value={editedProject.blockers}
                onChange={(e) => updateField('blockers', e.target.value)}
                placeholder="What's blocking progress?"
                rows={4}
              />
            </div>

            {/* Needs and Dependencies */}
            <div className="space-y-2">
              <Label htmlFor="needs">Needs & Dependencies</Label>
              <Textarea
                id="needs"
                value={editedProject.needs}
                onChange={(e) => updateField('needs', e.target.value)}
                placeholder="What resources or dependencies are needed?"
                rows={4}
              />
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Textarea
                id="nextSteps"
                value={editedProject.nextSteps}
                onChange={(e) => updateField('nextSteps', e.target.value)}
                placeholder="What are the immediate next steps?"
                rows={4}
              />
            </div>

            {/* Research Focus */}
            <div className="space-y-2">
              <Label htmlFor="research">Research Focus</Label>
              <Textarea
                id="research"
                value={editedProject.researchFocus}
                onChange={(e) => updateField('researchFocus', e.target.value)}
                placeholder="What research is needed?"
                rows={4}
              />
            </div>
          </div>

          {/* Project Stats */}
          <div className="flex gap-2">
            <Badge variant="outline">
              Effort: {editedProject.effort}/10
            </Badge>
            <Badge variant="outline">
              Benefit: {editedProject.benefit}/10
            </Badge>
            <Badge variant="outline">
              Total Score: {editedProject.effort + editedProject.benefit}/20
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-0 pt-6">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}