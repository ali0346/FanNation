
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Filter, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PollCard from "@/components/PollCard";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from 'react-router-dom';

// Mock data
const allPolls = [
  {
    id: "poll-1",
    title: "Who will win the Premier League this season?",
    options: [
      { id: "opt-1", text: "Manchester City", votes: 352 },
      { id: "opt-2", text: "Liverpool", votes: 289 },
      { id: "opt-3", text: "Arsenal", votes: 245 },
      { id: "opt-4", text: "Manchester United", votes: 120 },
    ],
    totalVotes: 1006,
    createdBy: "admin",
    createdAt: "2023-09-15T10:00:00Z",
    userVoted: true,
    userChoice: "opt-2",
    sportName: "Football"
  },
  {
    id: "poll-2",
    title: "Greatest basketball player of all time?",
    options: [
      { id: "opt-1", text: "Michael Jordan", votes: 587 },
      { id: "opt-2", text: "LeBron James", votes: 493 },
      { id: "opt-3", text: "Kobe Bryant", votes: 328 },
      { id: "opt-4", text: "Magic Johnson", votes: 124 },
    ],
    totalVotes: 1532,
    createdBy: "moderator",
    createdAt: "2023-09-10T14:30:00Z",
    userVoted: false,
    sportName: "Basketball"
  },
  {
    id: "poll-3",
    title: "Which team will win the Cricket World Cup?",
    options: [
      { id: "opt-1", text: "India", votes: 456 },
      { id: "opt-2", text: "Australia", votes: 389 },
      { id: "opt-3", text: "England", votes: 234 },
      { id: "opt-4", text: "New Zealand", votes: 187 },
    ],
    totalVotes: 1266,
    createdBy: "cricket_fan",
    createdAt: "2023-09-05T08:15:00Z",
    userVoted: true,
    userChoice: "opt-1",
    sportName: "Cricket"
  },
  {
    id: "poll-4",
    title: "Best tennis player of the current generation?",
    description: "Considering players who are still active",
    options: [
      { id: "opt-1", text: "Novak Djokovic", votes: 412 },
      { id: "opt-2", text: "Rafael Nadal", votes: 389 },
      { id: "opt-3", text: "Roger Federer", votes: 376 },
      { id: "opt-4", text: "Andy Murray", votes: 98 },
    ],
    totalVotes: 1275,
    createdBy: "tennis_lover",
    createdAt: "2023-09-01T16:45:00Z",
    endDate: "2023-10-01T23:59:59Z",
    userVoted: false,
    sportName: "Tennis"
  },
  {
    id: "poll-5",
    title: "Most exciting F1 race of this season?",
    options: [
      { id: "opt-1", text: "Monaco Grand Prix", votes: 178 },
      { id: "opt-2", text: "British Grand Prix", votes: 245 },
      { id: "opt-3", text: "Italian Grand Prix", votes: 312 },
      { id: "opt-4", text: "Singapore Grand Prix", votes: 156 },
    ],
    totalVotes: 891,
    createdBy: "f1_fan",
    createdAt: "2023-08-28T12:00:00Z",
    userVoted: true,
    userChoice: "opt-3",
    sportName: "Formula 1"
  }
];

const PollsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  
  const isModOrAdmin = user?.role === "moderator" || user?.role === "admin";
  
  const filterPolls = () => {
    let filteredPolls = allPolls;
    
    if (activeTab === "participated") {
      filteredPolls = filteredPolls.filter(poll => poll.userVoted);
    } else if (activeTab === "open") {
      filteredPolls = filteredPolls.filter(poll => !poll.endDate || new Date(poll.endDate) > new Date());
    } else if (activeTab === "closed") {
      filteredPolls = filteredPolls.filter(poll => poll.endDate && new Date(poll.endDate) <= new Date());
    }
    
    if (sportFilter) {
      filteredPolls = filteredPolls.filter(poll => poll.sportName === sportFilter);
    }
    
    return filteredPolls;
  };
  
  const sportList = Array.from(new Set(allPolls.map(poll => poll.sportName))).filter(Boolean) as string[];
  
  const filteredPolls = filterPolls();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Polls</h1>
          <p className="text-muted-foreground">
            Participate in community polls and make your opinion count!
          </p>
        </div>
        
        {isModOrAdmin && (
          <Button asChild>
            <Link to="/create-poll">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Link>
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4">
            <TabsTrigger value="all">All Polls</TabsTrigger>
            <TabsTrigger value="participated">Participated</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Sport
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${!sportFilter ? 'bg-muted' : ''}`}
                onClick={() => setSportFilter(null)}
              >
                All Sports
              </Button>
              {sportList.map(sport => (
                <Button 
                  key={sport} 
                  variant="ghost" 
                  className={`w-full justify-start ${sportFilter === sport ? 'bg-muted' : ''}`}
                  onClick={() => setSportFilter(sport)}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map(poll => (
            <PollCard key={poll.id} {...poll} />
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3">
              <ChevronDown className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No polls found</h3>
            <p className="mt-2 text-center text-muted-foreground">
              {activeTab === "participated" 
                ? "You haven't participated in any polls yet." 
                : activeTab === "open" 
                ? "There are no open polls currently." 
                : activeTab === "closed" 
                ? "There are no closed polls yet."
                : "No polls match your filter criteria."}
            </p>
            {activeTab === "participated" && isAuthenticated && (
              <Button className="mt-4" variant="outline" onClick={() => setActiveTab("all")}>
                View All Polls
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PollsPage;
