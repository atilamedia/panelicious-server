
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Save, X } from "lucide-react";

interface FileEditorProps {
  fileName: string;
  fileContent: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

export const FileEditor = ({
  fileName,
  fileContent,
  onSave,
  onClose,
}: FileEditorProps) => {
  const [content, setContent] = useState(fileContent);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // Reset content when file changes
  useEffect(() => {
    setContent(fileContent);
    setIsDirty(false);
  }, [fileContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(content);
    setIsDirty(false);
    toast({
      title: "File saved",
      description: `Successfully saved changes to ${fileName}`,
    });
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-muted p-2 sticky top-0 z-10">
        <div className="font-medium truncate">
          Editing: {fileName}
          {isDirty && <span className="ml-2 text-yellow-500">*</span>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSave} disabled={!isDirty}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={handleContentChange}
        className="flex-1 min-h-[300px] font-mono text-sm resize-none border-0 rounded-none"
        placeholder="File content..."
      />
    </div>
  );
};
