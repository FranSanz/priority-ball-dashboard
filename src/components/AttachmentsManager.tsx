import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, File, FileText, Image, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface AttachmentsManagerProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export function AttachmentsManager({ attachments, onAttachmentsChange }: AttachmentsManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const newAttachments: Attachment[] = [];

      for (const file of Array.from(files)) {
        // Check file size (max 5MB for localStorage efficiency)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
            variant: "destructive",
          });
          continue;
        }

        // Read file as data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const attachment: Attachment = {
          id: crypto.randomUUID(),
          name: file.name,
          dataUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        };

        newAttachments.push(attachment);
      }

      if (newAttachments.length > 0) {
        onAttachmentsChange([...attachments, ...newAttachments]);
        toast({
          title: "Files uploaded",
          description: `${newAttachments.length} file(s) added successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (attachmentId: string) => {
    const updatedAttachments = attachments.filter(a => a.id !== attachmentId);
    onAttachmentsChange(updatedAttachments);
    toast({
      title: "File removed",
      description: "Attachment deleted successfully.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('text/')) return <FileText className="w-4 h-4" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Attachments ({attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Files</Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Maximum file size: 5MB per file. Multiple files allowed.
          </p>
        </div>

        {/* Attachments List */}
        {attachments.length > 0 ? (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(attachment.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment.size)}</span>
                        <span>•</span>
                        <span>{attachment.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attachment.id)}
                      title="Delete file"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No attachments yet</p>
            <p className="text-xs">Upload files to attach them to this project</p>
          </div>
        )}

        {/* Storage Info */}
        {attachments.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total storage used:</span>
              <Badge variant="outline">
                {formatFileSize(attachments.reduce((total, a) => total + a.size, 0))}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}