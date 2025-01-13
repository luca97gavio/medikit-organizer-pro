import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",");
        
        // Validate required columns
        const requiredColumns = ['vehicle', 'licensePlate'];
        const missingColumns = requiredColumns.filter(
          col => !headers.map(h => h.trim().toLowerCase()).includes(col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          toast({
            title: "Error",
            description: `Missing required columns: ${missingColumns.join(", ")}`,
            variant: "destructive",
          });
          return;
        }

        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });

        onFileUpload(data);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFileUpload(file);
    } else {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-gray-200",
        "hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold">Upload CSV file</h3>
      <p className="mt-1 text-sm text-gray-500">
        CSV must include 'vehicle' and 'licensePlate' columns
      </p>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        id="file-upload"
      />
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        Select File
      </Button>
    </div>
  );
}