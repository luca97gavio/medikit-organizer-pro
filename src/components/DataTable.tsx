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

interface DataTableProps {
  data: Record<string, any>[];
}

export function DataTable({ data }: DataTableProps) {
  if (!data.length) return null;

  // Group data by vehicle and license plate
  const groupedData = data.reduce((acc: { [key: string]: any[] }, item) => {
    const key = `${item.vehicle || 'N/A'}-${item.licensePlate || 'N/A'}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([key, items], index) => {
        const [vehicle, licensePlate] = key.split('-');
        const headers = Object.keys(items[0] || {}).filter(
          header => header !== 'vehicle' && header !== 'licensePlate'
        );

        return (
          <Card key={index} className="bg-white/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {vehicle} - {licensePlate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead key={header} className="font-semibold">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headers.map((header) => (
                        <TableCell key={header}>{item[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}