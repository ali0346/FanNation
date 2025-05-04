
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSport } from "@/contexts/SportContext";
import { useThread } from "@/contexts/ThreadContext";
import ThreadCard from "@/components/ThreadCard";
import SportCard from "@/components/SportCard";
import { ArrowRight, MessageSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();
  const { sports, followedSports } = useSport();
  const { threads } = useThread();

  // Get followed sports data
  const followedSportsData = sports.filter((sport) =>
    followedSports.includes(sport.id)
  );

  // Get threads from followed sports
  const followedThreads = threads.filter((thread) =>
    followedSports.includes(thread.sportId)
  ).slice(0, 10);

  // Get recommended sports (not followed)
  const recommendedSports = sports
    .filter((sport) => !followedSports.includes(sport.id))
    .slice(0, 3);

  return (
    <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {user ? `Welcome back, ${user.username}!` : "Welcome to FanNation!"}
        </h1>
        <p className="text-muted-foreground">
          {user
            ? "Check out the latest discussions from your favorite sports."
            : "Join the community of sports fans and discuss your favorite games, teams, and players."}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Followed Sports Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest Discussions</h2>
              <Button variant="outline" asChild>
                <Link to="/create-thread">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Thread
                </Link>
              </Button>
            </div>

            {followedThreads.length > 0 ? (
              <div className="space-y-4">
                {followedThreads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/threads">
                      View All Discussions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                <p className="text-muted-foreground mb-4">
                  {followedSportsData.length > 0
                    ? "There are no threads in your followed sports yet."
                    : "Follow some sports to see discussions here."}
                </p>
                <Button asChild>
                  <Link to="/create-thread">Create First Thread</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Followed Sports */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Sports</h2>
            {followedSportsData.length > 0 ? (
              <div className="grid gap-4">
                {followedSportsData.map((sport) => (
                  <Link 
                    key={sport.id} 
                    to={`/sport/${sport.slug}`}
                    className={`flex items-center p-3 rounded-md bg-${sport.color}/10 hover:bg-${sport.color}/20 transition-colors`}
                  >
                    <div className={`flex items-center justify-center text-xl w-10 h-10 rounded-md mr-3 bg-${sport.color}`}>
                      {sport.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{sport.name}</h3>
                      <p className="text-xs text-muted-foreground">{sport.threads} threads</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  You haven't followed any sports yet.
                </p>
                <Button size="sm" variant="link" asChild>
                  <Link to="/discover">Discover sports</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recommended Sports */}
          {recommendedSports.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Discover More</h2>
              <div className="grid gap-4">
                {recommendedSports.map((sport) => (
                  <SportCard key={sport.id} sport={sport} />
                ))}
              </div>
              {sports.length > recommendedSports.length && (
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/discover">View All Sports</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
