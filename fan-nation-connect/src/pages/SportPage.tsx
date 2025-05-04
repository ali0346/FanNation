
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSport } from "@/contexts/SportContext";
import { useThread } from "@/contexts/ThreadContext";
import ThreadCard from "@/components/ThreadCard";
import { MessageSquare, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const SportPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { sports, followSport, unfollowSport, isFollowing } = useSport();
  const { getThreadsBySport } = useThread();
  const [activeTab, setActiveTab] = useState("threads");

  const sport = sports.find((s) => s.slug === slug);

  if (!sport) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sport not found</h1>
        <p className="mb-4">The sport you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const threads = getThreadsBySport(sport.id);
  const following = isFollowing(sport.id);

  const handleToggleFollow = () => {
    following ? unfollowSport(sport.id) : followSport(sport.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className={cn(
        "rounded-lg p-6 mb-6",
        `bg-${sport.color}/10`
      )}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className={cn(
            "flex items-center justify-center text-4xl w-20 h-20 rounded-lg",
            `bg-${sport.color}`
          )}>
            {sport.icon}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{sport.name}</h1>
            <p className="text-muted-foreground mb-4">{sport.description}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{sport.followers.toLocaleString()} followers</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{sport.threads.toLocaleString()} threads</span>
              </div>
              <Button
                className={cn(
                  following 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "bg-primary"
                )}
                variant={following ? "outline" : "default"}
                onClick={handleToggleFollow}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="threads" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="threads">Threads</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <Button asChild>
              <Link to="/create-thread" state={{ sportId: sport.id }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Thread
              </Link>
            </Button>
          </div>

          <TabsContent value="threads" className="mt-6">
            {threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No threads yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to start a discussion in this category!
                  </p>
                  <Button asChild>
                    <Link to="/create-thread" state={{ sportId: sport.id }}>
                      Create First Thread
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">About {sport.name}</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{sport.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Followers</h3>
                    <p className="text-lg font-medium">{sport.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Threads</h3>
                    <p className="text-lg font-medium">{sport.threads.toLocaleString()}</p>
                  </div>
                </div>
                {/* Additional info could be added here in the final version */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SportPage;
