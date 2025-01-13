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
        
        // Map Italian headers to English ones
        const headerMapping: { [key: string]: string } = {
          'Automezzo': 'vehicle',
          'Targa': 'licensePlate',
          'Modello': 'model',
          'Quantità': 'quantity',
          'Prodotto': 'product',
          'Data scadenza medicinale': 'expiryDate'
        };

        // Validate required columns
        const requiredColumns = ['Automezzo', 'Targa'];
        const missingColumns = requiredColumns.filter(
          col => !headers.map(h => h.trim()).includes(col)
        );

        if (missingColumns.length > 0) {
          toast({
            title: "Error",
            description: `Colonne richieste mancanti: ${missingColumns.join(", ")}`,
            variant: "destructive",
          });
          return;
        }

        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj: any, header, index) => {
            const mappedHeader = headerMapping[header.trim()] || header.trim();
            obj[mappedHeader] = values[index]?.trim();
            return obj;
          }, {});
        });

        onFileUpload(data);
        toast({
          title: "Success",
          description: "File caricato con successo",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Errore durante l'analisi del file CSV",
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
        description: "Per favore carica un file CSV",
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
      <h3 className="mt-2 text-sm font-semibold">Carica file CSV</h3>
      <p className="mt-1 text-sm text-gray-500">
        Il CSV deve includere le colonne 'Automezzo' e 'Targa'
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
        Seleziona File
      </Button>
    </div>
  );
}