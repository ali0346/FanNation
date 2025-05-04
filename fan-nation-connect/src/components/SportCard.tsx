
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sport, useSport } from "@/contexts/SportContext";
import { MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type SportCardProps = {
  sport: Sport;
};

const SportCard = ({ sport }: SportCardProps) => {
  const { isFollowing, followSport, unfollowSport } = useSport();
  const following = isFollowing(sport.id);
  
  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    following ? unfollowSport(sport.id) : followSport(sport.id);
  };
  
  return (
    <Card className={`overflow-hidden hover:border-${sport.color}/50 transition-all`}>
      <Link to={`/sport/${sport.slug}`} className="block">
        <CardHeader className="p-4 flex flex-row items-center space-x-4">
          <div className={`flex items-center justify-center text-2xl w-12 h-12 rounded-md bg-${sport.color}`}>
            {sport.icon}
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="text-xl font-bold">{sport.name}</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">{sport.description}</p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{Number(sport.followers || 0).toLocaleString()} followers</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{sport.threads ? sport.threads.toLocaleString() : "0"} threads</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            className={cn(
              "w-full",
              following 
                ? "bg-primary/10 text-primary hover:bg-primary/20" 
                : "bg-primary"
            )}
            variant={following ? "outline" : "default"}
            onClick={handleToggleFollow}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default SportCard;
