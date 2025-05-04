
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Trophy } from "lucide-react";

type UserCardProps = {
  user: {
    id: string;
    username: string;
    profilePicture: string;
    role: "user" | "moderator" | "admin";
    points: number;
    badges: string[];
    rank: number;
  };
  showRank?: boolean;
};

const UserCard = ({ user, showRank = false }: UserCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center space-x-4">
          {showRank && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
              {user.rank}
            </div>
          )}
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profilePicture} alt={user.username} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center">
              <h3 className="font-medium">{user.username}</h3>
              {user.role !== "user" && (
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    user.role === "admin"
                      ? "border-red-500 text-red-500"
                      : "border-blue-500 text-blue-500"
                  }`}
                >
                  {user.role}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1 text-amber-500" />
              <span>{user.points} points</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {user.badges.map((badge, index) => (
            <Badge key={index} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
