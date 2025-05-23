
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSiteModal = ({ open, onOpenChange }: AddSiteModalProps) => {
  const [siteName, setSiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [phpVersion, setPhpVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate site creation
    setTimeout(() => {
      toast({
        title: "Site Created Successfully",
        description: `${siteName} has been created with domain ${domain}`,
      });
      
      // Reset form
      setSiteName("");
      setDomain("");
      setPhpVersion("");
      setDescription("");
      setIsLoading(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription>
            Create a new website configuration. This will set up the necessary files and configurations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siteName" className="text-right">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="col-span-3"
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="col-span-3"
                placeholder="example.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phpVersion" className="text-right">
                PHP Version
              </Label>
              <Select value={phpVersion} onValueChange={setPhpVersion} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select PHP version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8.3">PHP 8.3</SelectItem>
                  <SelectItem value="8.2">PHP 8.2</SelectItem>
                  <SelectItem value="8.1">PHP 8.1</SelectItem>
                  <SelectItem value="8.0">PHP 8.0</SelectItem>
                  <SelectItem value="7.4">PHP 7.4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description for this site"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
