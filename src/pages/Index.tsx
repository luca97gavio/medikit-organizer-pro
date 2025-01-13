import { useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (uploadedData: any[]) => {
    setData(uploadedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MediKit Manager</h1>
          <p className="text-gray-600">
            Manage medical kits across different locations
          </p>
        </div>

        <LocationSelector
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />

        {selectedLocation && (
          <div className="space-y-8">
            <FileUpload onFileUpload={handleFileUpload} />
            <DataTable data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;