
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Database, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Database name must be at least 3 characters.",
  }).max(64, {
    message: "Database name must not exceed 64 characters."
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Database name can only contain letters, numbers, and underscores."
  }),
  collation: z.string().default("utf8mb4_general_ci"),
  characterSet: z.string().default("utf8mb4"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateDatabaseForm({ onDatabaseCreated }: { onDatabaseCreated: (database: any) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      collation: "utf8mb4_general_ci",
      characterSet: "utf8mb4",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Here we would normally send this to an API endpoint
    // For now, we'll just simulate a successful creation
    
    const newDatabase = {
      name: data.name,
      tables: 0,
      size: "0 MB",
      created: new Date().toISOString().split('T')[0]
    };
    
    // Success notification
    toast({
      title: "Database Created",
      description: `Database ${data.name} has been created successfully.`,
    });
    
    // Call the callback with the new database
    onDatabaseCreated(newDatabase);
    
    // Close the dialog and reset the form
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Database
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Create New Database
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new MySQL database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myapp_database" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name for your new database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="characterSet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Set</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select character set" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="utf8mb4">utf8mb4</SelectItem>
                      <SelectItem value="utf8">utf8</SelectItem>
                      <SelectItem value="latin1">latin1</SelectItem>
                      <SelectItem value="ascii">ascii</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The character encoding for your database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="utf8mb4_general_ci">utf8mb4_general_ci</SelectItem>
                      <SelectItem value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</SelectItem>
                      <SelectItem value="utf8_general_ci">utf8_general_ci</SelectItem>
                      <SelectItem value="latin1_swedish_ci">latin1_swedish_ci</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The collation for your database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Check className="h-4 w-4" /> Create Database
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
