import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSport, Sport } from "@/contexts/SportContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { sports, followedSports, followSport, unfollowSport, isFollowing } = useSport();
  const [collapsed, setCollapsed] = useState(false);

  // Get followed sports data
  const followedSportsData = sports.filter((sport) => 
    followedSports.includes(sport.id)
  );
  
  // Get other sports data
  const otherSportsData = sports.filter((sport) => 
    !followedSports.includes(sport.id)
  );

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const SportItem = ({ sport }: { sport: Sport }) => {
    const following = isFollowing(sport.id);
    
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md p-2 mb-1 transition-colors",
          following 
            ? "hover:bg-primary/10" 
            : "hover:bg-secondary/80",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          to={`/sport/${sport.slug}`}
          className="flex items-center gap-3 grow"
        >
          <div className={cn(
            "flex items-center justify-center text-xl w-8 h-8 rounded-md",
            `bg-${sport.color}`
          )}>
            {sport.icon}
          </div>
          {!collapsed && (
            <span className="text-sm font-medium truncate">{sport.name}</span>
          )}
        </Link>
        
        {!collapsed && (
          <Button
            variant={following ? "outline" : "ghost"}
            size="sm"
            className={cn(
              "h-7 text-xs",
              following ? "border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600" : ""
            )}
            onClick={(e) => {
              e.preventDefault();
              following ? unfollowSport(sport.id) : followSport(sport.id);
            }}
          >
            {following ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-secondary/30 border-r border-border h-[calc(100vh-4rem)] relative transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-2 h-6 w-6 rounded-full border shadow-sm bg-background"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-3 py-2">
          <h2 className={cn(
            "text-lg font-semibold",
            collapsed ? "text-center" : ""
          )}>
            {collapsed ? "🏆" : "Sports Categories"}
          </h2>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          {/* Followed Sports */}
          {followedSportsData.length > 0 && (
            <div className="mb-4">
              {!collapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  My Sports
                </h3>
              )}
              {followedSportsData.map((sport) => (
                <SportItem key={sport.id} sport={sport} />
              ))}
            </div>
          )}
          
          {/* Other Sports */}
          <div>
            {!collapsed && otherSportsData.length > 0 && (
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Discover More
              </h3>
            )}
            {otherSportsData.map((sport) => (
              <SportItem key={sport.id} sport={sport} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
