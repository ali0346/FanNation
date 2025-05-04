
import { useThread } from "@/contexts/ThreadContext";
import { useSport } from "@/contexts/SportContext";
import { useState } from "react";
import ThreadCard from "@/components/ThreadCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ThreadsPage = () => {
  const { threads } = useThread();
  const { sports } = useSport();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter threads based on search query and sport filter
  let filteredThreads = threads.filter((thread) => 
    (thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
     thread.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (sportFilter === "all" || thread.sportId === sportFilter)
  );
  
  // Sort the threads based on the selected sort order
  filteredThreads = filteredThreads.sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
    } else if (sortOrder === "most_liked") {
      return b.likes - a.likes;
    } else if (sortOrder === "most_replies") {
      return b.replies.length - a.replies.length;
    }
    return 0;
  });

  return (
    <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">All Discussions</h1>
          <p className="text-muted-foreground">
            Join the conversation on your favorite sports topics
          </p>
        </div>
        
        {isAuthenticated && (
          <Button asChild>
            <Link to="/create-thread">
              <Plus className="h-4 w-4 mr-2" />
              Create Thread
            </Link>
          </Button>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <Input
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_liked">Most Liked</SelectItem>
                <SelectItem value="most_replies">Most Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Thread list */}
      <div className="space-y-4">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No discussions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || sportFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to start a discussion!"}
            </p>
            {isAuthenticated && (
              <Button asChild>
                <Link to="/create-thread">Create Thread</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadsPage;