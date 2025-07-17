import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface AddProjectDialogProps {
  onAdd: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  projectCount: number;
}

export function AddProjectDialog({ onAdd, projectCount }: AddProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [effort, setEffort] = useState(1);
  const [benefit, setBenefit] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newProject: Omit<Project, 'id' | 'createdAt'> = {
      title: title.trim(),
      effort,
      benefit,
      colorIndex: ((projectCount % 10) + 1) as any,
      discovery: '',
      scope: '',
      complexityFactors: '',
      blockers: '',
      needs: '',
      dependencies: '',
      nextSteps: '',
      researchFocus: '',
      images: [],
      attachments: [],
    };

    onAdd(newProject);
    
    // Reset form
    setTitle('');
    setEffort(1);
    setBenefit(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort (0-10)</Label>
              <Input
                id="effort"
                type="number"
                min="0"
                max="10"
                value={effort}
                onChange={(e) => setEffort(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefit">Benefit (0-10)</Label>
              <Input
                id="benefit"
                type="number"
                min="0"
                max="10"
                value={benefit}
                onChange={(e) => setBenefit(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}