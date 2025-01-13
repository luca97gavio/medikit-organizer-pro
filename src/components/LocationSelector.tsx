import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  image: string;
}

const locations: Location[] = [
  { id: "carpi", name: "Carpi", image: "🏥" },
  { id: "mirandola", name: "Mirandola", image: "🏥" },
  { id: "castelfranco", name: "Castelfranco", image: "🏥" },
];

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

export function LocationSelector({ selectedLocation, onLocationSelect }: LocationSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {locations.map((location) => (
        <Card
          key={location.id}
          className={cn(
            "hover-scale glass-card p-6 cursor-pointer text-center",
            selectedLocation === location.id
              ? "ring-2 ring-primary shadow-lg"
              : "hover:shadow-md"
          )}
          onClick={() => onLocationSelect(location.id)}
        >
          <div className="text-4xl mb-2">{location.image}</div>
          <h3 className="text-lg font-semibold">{location.name}</h3>
        </Card>
      ))}
    </div>
  );
}