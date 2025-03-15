
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  File, FileText, FileImage, Folder, FolderOpen, 
  Search, CheckCircle, XCircle, Download, Upload,
  Trash2, Edit, Copy, Plus, RefreshCw
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for the file system
const initialFileSystem = {
  files: [
    { id: "1", name: "index.php", type: "file", size: "2.5 KB", modified: "2023-04-15", permissions: "644" },
    { id: "2", name: "config.json", type: "file", size: "1.2 KB", modified: "2023-04-14", permissions: "644" },
    { id: "3", name: "logo.png", type: "image", size: "145 KB", modified: "2023-04-10", permissions: "644" },
    { id: "4", name: "script.js", type: "file", size: "4.7 KB", modified: "2023-04-09", permissions: "644" },
    { id: "5", name: "styles.css", type: "file", size: "8.3 KB", modified: "2023-04-08", permissions: "644" },
  ],
  folders: [
    { id: "f1", name: "uploads", type: "folder", items: 12, modified: "2023-04-15", permissions: "755" },
    { id: "f2", name: "public", type: "folder", items: 8, modified: "2023-04-12", permissions: "755" },
    { id: "f3", name: "config", type: "folder", items: 3, modified: "2023-04-11", permissions: "755" },
    { id: "f4", name: "assets", type: "folder", items: 24, modified: "2023-04-10", permissions: "755" },
  ]
};

// File types and their icons
const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="h-5 w-5 text-blue-500" />;
    case "image":
      return <FileImage className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const FileManager = () => {
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { toast } = useToast();

  // Filter items based on search query
  const filteredItems = {
    folders: fileSystem.folders.filter(folder => 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    files: fileSystem.files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  // Handle item selection
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle folder creation
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const folderExists = fileSystem.folders.some(
      folder => folder.name.toLowerCase() === newFolderName.toLowerCase()
    );

    if (folderExists) {
      toast({
        title: "Error",
        description: `Folder '${newFolderName}' already exists`,
        variant: "destructive",
      });
      return;
    }

    const newFolder = {
      id: `f${Date.now()}`,
      name: newFolderName,
      type: "folder",
      items: 0,
      modified: new Date().toISOString().split('T')[0],
      permissions: "755"
    };

    setFileSystem(prev => ({
      ...prev,
      folders: [...prev.folders, newFolder]
    }));

    setNewFolderName("");
    setIsCreatingFolder(false);

    toast({
      title: "Success",
      description: `Folder '${newFolderName}' created successfully`,
    });
  };

  // Handle file deletion
  const handleDelete = (ids: string[]) => {
    const filesToDelete = fileSystem.files.filter(file => ids.includes(file.id));
    const foldersToDelete = fileSystem.folders.filter(folder => ids.includes(folder.id));
    
    const fileNames = filesToDelete.map(file => file.name);
    const folderNames = foldersToDelete.map(folder => folder.name);
    
    setFileSystem(prev => ({
      files: prev.files.filter(file => !ids.includes(file.id)),
      folders: prev.folders.filter(folder => !ids.includes(folder.id))
    }));
    
    setSelectedItems([]);
    
    const deletedItems = [...fileNames, ...folderNames].join(", ");
    toast({
      title: "Items Deleted",
      description: `Successfully deleted: ${deletedItems}`,
    });
  };

  // Simulate file upload
  const handleUpload = () => {
    setIsUploading(true);
    
    setTimeout(() => {
      const newFile = {
        id: `${Date.now()}`,
        name: `uploaded-file-${Math.floor(Math.random() * 1000)}.txt`,
        type: "file",
        size: `${Math.floor(Math.random() * 1000)} KB`,
        modified: new Date().toISOString().split('T')[0],
        permissions: "644"
      };
      
      setFileSystem(prev => ({
        ...prev,
        files: [...prev.files, newFile]
      }));
      
      setIsUploading(false);
      
      toast({
        title: "Upload Complete",
        description: `${newFile.name} has been uploaded successfully.`,
      });
    }, 1500);
  };

  // Navigate to folder (mock behavior for demonstration)
  const navigateToFolder = (folderName: string) => {
    setCurrentPath(prev => `${prev}/${folderName}`);
    
    // For demonstration purposes only - in a real app you would fetch the folder contents
    toast({
      title: "Folder Navigation",
      description: `Navigated to ${folderName}`,
    });
  };

  // Go up in folder hierarchy
  const navigateUp = () => {
    if (currentPath === "/home/user") return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/') || "/home/user";
    setCurrentPath(newPath);
  };

  // Path breadcrumb
  const PathBreadcrumb = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-2 overflow-x-auto">
        <span 
          className="hover:text-foreground cursor-pointer" 
          onClick={() => setCurrentPath("/home/user")}
        >
          /
        </span>
        {pathParts.map((part, idx) => (
          <div key={idx} className="flex items-center">
            <span className="mx-1">/</span>
            <span 
              className="hover:text-foreground cursor-pointer"
              onClick={() => {
                const newPath = '/' + pathParts.slice(0, idx + 1).join('/');
                setCurrentPath(newPath);
              }}
            >
              {part}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">File Manager</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? "Grid View" : "List View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems([])}
              disabled={selectedItems.length === 0}
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(selectedItems)}
              disabled={selectedItems.length === 0}
            >
              Delete Selected
            </Button>
          </div>
        </div>

        <Tabs defaultValue="browser" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="browser">File Browser</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={navigateUp}>
                  Parent Directory
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setIsCreatingFolder(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>
                        Enter a name for the new folder.
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="my-4"
                    />
                    <DialogFooter>
                      <Button onClick={handleCreateFolder}>
                        Create Folder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="bg-background border rounded-md">
              <div className="p-3 border-b">
                <PathBreadcrumb />
              </div>
              
              {/* List view */}
              {viewMode === "list" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size/Items</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.folders.map((folder) => (
                      <TableRow 
                        key={folder.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted",
                          selectedItems.includes(folder.id) && "bg-muted"
                        )}
                        onClick={() => toggleSelectItem(folder.id)}
                        onDoubleClick={() => navigateToFolder(folder.name)}
                      >
                        <TableCell>
                          {selectedItems.includes(folder.id) ? 
                            <CheckCircle className="h-4 w-4 text-primary" /> : 
                            <FolderOpen className="h-4 w-4 text-blue-500" />
                          }
                        </TableCell>
                        <TableCell className="font-medium">{folder.name}</TableCell>
                        <TableCell>Directory</TableCell>
                        <TableCell>{folder.items} items</TableCell>
                        <TableCell>{folder.modified}</TableCell>
                        <TableCell>{folder.permissions}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigateToFolder(folder.name)}>
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete([folder.id])}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.files.map((file) => (
                      <TableRow 
                        key={file.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted",
                          selectedItems.includes(file.id) && "bg-muted"
                        )}
                        onClick={() => toggleSelectItem(file.id)}
                      >
                        <TableCell>
                          {selectedItems.includes(file.id) ? 
                            <CheckCircle className="h-4 w-4 text-primary" /> : 
                            getFileIcon(file.type)
                          }
                        </TableCell>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.type === "image" ? "Image" : "File"}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.modified}</TableCell>
                        <TableCell>{file.permissions}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete([file.id])}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Grid view */}
              {viewMode === "grid" && (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredItems.folders.map((folder) => (
                    <div 
                      key={folder.id}
                      className={cn(
                        "p-3 border rounded-md hover:border-primary cursor-pointer flex flex-col items-center justify-center space-y-2",
                        selectedItems.includes(folder.id) && "border-primary bg-primary/5"
                      )}
                      onClick={() => toggleSelectItem(folder.id)}
                      onDoubleClick={() => navigateToFolder(folder.name)}
                    >
                      <div className="relative">
                        <FolderOpen className="h-12 w-12 text-blue-500" />
                        {selectedItems.includes(folder.id) && (
                          <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-primary bg-background rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate max-w-full text-center">
                        {folder.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {folder.items} items
                      </span>
                    </div>
                  ))}
                  {filteredItems.files.map((file) => (
                    <div 
                      key={file.id}
                      className={cn(
                        "p-3 border rounded-md hover:border-primary cursor-pointer flex flex-col items-center justify-center space-y-2",
                        selectedItems.includes(file.id) && "border-primary bg-primary/5"
                      )}
                      onClick={() => toggleSelectItem(file.id)}
                    >
                      <div className="relative">
                        {getFileIcon(file.type)}
                        <div className="absolute -top-1 -right-1">
                          {selectedItems.includes(file.id) && (
                            <CheckCircle className="h-5 w-5 text-primary bg-background rounded-full" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium truncate max-w-full text-center">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {file.size}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Empty state */}
              {filteredItems.folders.length === 0 && filteredItems.files.length === 0 && (
                <div className="py-8 text-center">
                  <File className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No files found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 
                      `No results found for "${searchQuery}"` : 
                      "This directory is empty"
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Drag and drop files here</h3>
              <p className="text-sm text-muted-foreground mt-2">
                or click to browse files from your device
              </p>
              <Button className="mt-4" disabled={isUploading} onClick={handleUpload}>
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2">Upload Guidelines</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Maximum file size: 50MB per file</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Allowed file types: Images, Documents, Archives</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <span>Not allowed: Executable files (.exe, .bat, etc.)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Status bar */}
        <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-2">
          <div>
            {selectedItems.length > 0 ? (
              <span>{selectedItems.length} items selected</span>
            ) : (
              <span>
                {filteredItems.folders.length} folders, {filteredItems.files.length} files
              </span>
            )}
          </div>
          <div>
            <Badge variant="outline" className="font-mono">
              {currentPath}
            </Badge>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileManager;
