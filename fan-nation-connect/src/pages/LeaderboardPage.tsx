
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, User } from "lucide-react";
import { Link } from "react-router-dom";

// Mock top users data
const topUsers = [
  {
    id: "1",
    username: "sports_king",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 2750,
    badges: ["Elite Fan", "MVP", "Knowledge Master"],
    rank: 1,
  },
  {
    id: "2",
    username: "admin",
    profilePicture: "/placeholder.svg",
    role: "admin",
    points: 1845,
    badges: ["Admin", "Site Veteran", "Top Contributor"],
    rank: 2,
  },
  {
    id: "3",
    username: "moderator",
    profilePicture: "/placeholder.svg",
    role: "moderator",
    points: 1550,
    badges: ["Moderator", "Helpful", "Dedicated"],
    rank: 3,
  },
  {
    id: "4",
    username: "football_fan99",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 1347,
    badges: ["Football Expert", "Regular", "Commenter"],
    rank: 4,
  },
  {
    id: "5",
    username: "cricket_lover",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 1203,
    badges: ["Cricket Expert", "Analyst"],
    rank: 5,
  },
  {
    id: "6",
    username: "basket_master",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 1124,
    badges: ["Basketball Expert"],
    rank: 6,
  },
  {
    id: "7",
    username: "tennis_ace",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 987,
    badges: ["Tennis Fan"],
    rank: 7,
  },
  {
    id: "8",
    username: "baseball_pro",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 823,
    badges: ["Baseball Expert"],
    rank: 8,
  },
  {
    id: "9",
    username: "sports_enthusiast",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 756,
    badges: ["Active Member"],
    rank: 9,
  },
  {
    id: "10",
    username: "sports_fan123",
    profilePicture: "/placeholder.svg",
    role: "user",
    points: 532,
    badges: ["Newcomer", "Regular"],
    rank: 10,
  },
];

const LeaderboardPage = () => {
  const [view, setView] = useState<"all" | "monthly" | "weekly">("all");
  
  // In a real app, we would fetch different leaderboard data based on the selected view
  const leaderboardData = topUsers;
  
  const getPointsLabel = () => {
    switch (view) {
      case "weekly":
        return "Weekly Points";
      case "monthly":
        return "Monthly Points";
      default:
        return "Total Points";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top contributors in the FanNation community
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={view === "all" ? "default" : "outline"}
            onClick={() => setView("all")}
          >
            All Time
          </Button>
          <Button
            variant={view === "monthly" ? "default" : "outline"}
            onClick={() => setView("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={view === "weekly" ? "default" : "outline"}
            onClick={() => setView("weekly")}
          >
            Weekly
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Top 3 Users */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <Card key={user.id} className={index === 0 ? "border-amber-500" : ""}>
              <CardHeader className={`pb-2 ${index === 0 ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 
                        ? "bg-amber-500 text-white" 
                        : index === 1 
                        ? "bg-gray-300 text-gray-800" 
                        : "bg-amber-800/80 text-amber-100"
                    } font-bold`}>
                      {index + 1}
                    </div>
                    <CardTitle>{user.username}</CardTitle>
                  </div>
                  {index === 0 && <Trophy className="h-6 w-6 text-amber-500" />}
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 pb-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback className="text-lg">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center justify-center mb-4">
                  <Trophy className={`h-5 w-5 mr-2 ${
                    index === 0 
                      ? "text-amber-500" 
                      : index === 1 
                      ? "text-gray-400" 
                      : "text-amber-800"
                  }`} />
                  <span className="text-2xl font-bold">{user.points}</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-1">
                  {user.badges.slice(0, 2).map((badge, i) => (
                    <Badge key={i} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                  {user.badges.length > 2 && (
                    <Badge variant="outline">+{user.badges.length - 2}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Full Leaderboard Table */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Full Leaderboard</CardTitle>
              <CardDescription>
                All community members ranked by points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead className="text-right">{getPointsLabel()}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.rank <= 3 ? (
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            user.rank === 1 
                              ? "bg-amber-500 text-white" 
                              : user.rank === 2 
                              ? "bg-gray-300 text-gray-800" 
                              : "bg-amber-800/80 text-amber-100"
                          } font-bold`}>
                            {user.rank}
                          </div>
                        ) : (
                          user.rank
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture} alt={user.username} />
                            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            {user.role !== "user" && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  user.role === "admin"
                                    ? "border-red-500 text-red-500"
                                    : "border-blue-500 text-blue-500"
                                }`}
                              >
                                {user.role}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.badges.slice(0, 2).map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {user.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.badges.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {user.points.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
