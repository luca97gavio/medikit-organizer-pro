import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DataItem {
  vehicle: string;
  licensePlate: string;
  product: string;
  expiryDate?: string;
  [key: string]: string | undefined;
}

interface DataTableProps {
  data: DataItem[];
  selectedLocation: string;
}

export function DataTable({ data, selectedLocation }: DataTableProps) {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Group data by vehicle and license plate
  const groupedData = data.reduce((acc: { [key: string]: DataItem[] }, item) => {
    if (!item?.vehicle || !item?.licensePlate) return acc;
    const key = `${item.vehicle}-${item.licensePlate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Check for expiring items
  useEffect(() => {
    const checkExpiryDates = () => {
      const today = new Date();
      const oneMonthFromNow = new Date(today.getTime());
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      
      const oneWeekFromNow = new Date(today.getTime());
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      data.forEach(item => {
        if (!item.expiryDate) return;
        
        const [month, year] = item.expiryDate.split('/');
        const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
        
        if (expiryDate <= oneMonthFromNow && expiryDate > oneWeekFromNow) {
          toast({
            title: "Avviso Scadenza",
            description: `${item.product} scadrà il ${item.expiryDate} (${item.vehicle} - ${item.licensePlate})`,
            variant: "default",
          });
        } else if (expiryDate <= oneWeekFromNow) {
          toast({
            title: "Avviso Scadenza Imminente",
            description: `${item.product} scadrà tra meno di una settimana, il ${item.expiryDate} (${item.vehicle} - ${item.licensePlate})`,
            variant: "destructive",
          });
        }
      });
    };

    checkExpiryDates();
    // Check every day
    const interval = setInterval(checkExpiryDates, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [data, toast]);

  const handleEdit = (key: string, field: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (key: string) => {
    // Here you would typically save to a backend
    toast({
      title: "Modifiche Salvate",
      description: "Le modifiche sono state salvate con successo",
    });
    setEditingItem(null);
    setEditedValues({});
  };

  const handleDelete = (key: string) => {
    // Here you would typically delete from a backend
    toast({
      title: "Elemento Eliminato",
      description: "L'elemento è stato eliminato con successo",
    });
  };

  const vehiclePlateOptions = Object.keys(groupedData);

  if (!data?.length) return null;

  return (
    <div className="space-y-6">
      <Select
        value={selectedVehicle || ""}
        onValueChange={setSelectedVehicle}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona Automezzo-Targa" />
        </SelectTrigger>
        <SelectContent>
          {vehiclePlateOptions.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedVehicle && groupedData[selectedVehicle]?.map((items, index) => (
        <Card key={index} className="bg-white/50 backdrop-blur-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {items.vehicle} - {items.licensePlate}
            </CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(`${items.vehicle}-${items.licensePlate}`)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(items || {})
                    .filter(header => header !== 'vehicle' && header !== 'licensePlate')
                    .map((header) => (
                      <TableHead key={header} className="font-semibold">
                        {header}
                      </TableHead>
                    ))}
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items && Object.entries(items)
                  .filter(([key]) => key !== 'vehicle' && key !== 'licensePlate')
                  .map(([key, value], rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell>
                        {editingItem === `${rowIndex}-${key}` ? (
                          <Input
                            value={editedValues[key] || value || ''}
                            onChange={(e) => handleEdit(`${rowIndex}`, key, e.target.value)}
                          />
                        ) : (
                          value || ''
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === `${rowIndex}` ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(`${rowIndex}`)}
                          >
                            Salva
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(`${rowIndex}`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}