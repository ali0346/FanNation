
import { useSport } from "@/contexts/SportContext";
import SportCard from "@/components/SportCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DiscoverPage = () => {
  const { sports } = useSport();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter sports based on search query
  const filteredSports = sports.filter(sport => 
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sport.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Sports</h1>
        <p className="text-muted-foreground mb-6">
          Find and follow your favorite sports to join the conversation
        </p>
        
        <div className="max-w-md mb-8">
          <Input
            placeholder="Search sports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
          
          {filteredSports.length === 0 && (
            <div className="col-span-full bg-muted/50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No sports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;