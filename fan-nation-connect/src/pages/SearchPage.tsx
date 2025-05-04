
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ThreadCard from "@/components/ThreadCard";
import UserCard from "@/components/UserCard";
import { sportsApi, threadsApi } from "@/utils/api";
import { Separator } from '@/components/ui/separator';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'threads';
  
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<'threads' | 'users' | 'polls'>(initialType as any);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [sports, setSports] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'relevant' | 'popular'>('relevant');
  
  // Fetch sports for filter
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await sportsApi.getAllSports();
        setSports(sportsData);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };
    
    fetchSports();
  }, []);

  // Handle search when parameters change
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery.trim() !== '') {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      let searchResults: any[] = [];
      
      if (type === 'threads') {
        // Search for threads
        const threadsData = await threadsApi.getThreads({ 
          search: searchQuery,
          sportId: selectedSport || undefined 
        });
        searchResults = threadsData;
      } else if (type === 'users') {
        // Mock user search - in a real app, this would call a user search API
        searchResults = [
          {
            id: "user1",
            username: "sports_king",
            profilePicture: "/placeholder.svg",
            role: "user",
            points: 2750,
            badges: ["Elite Fan", "MVP", "Knowledge Master"],
          },
          {
            id: "user2",
            username: "football_lover",
            profilePicture: "/placeholder.svg",
            role: "user",
            points: 1845,
            badges: ["Football Expert", "Commenter"],
          },
        ].filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (type === 'polls') {
        // Mock poll search - in a real app, this would call a poll search API
        searchResults = [
          {
            id: "poll-1",
            title: "Who will win the Premier League this season?",
            totalVotes: 1006,
            options: [
              { id: "opt-1", text: "Manchester City", votes: 352 },
              { id: "opt-2", text: "Liverpool", votes: 289 },
            ],
            sportName: "Football",
          },
          {
            id: "poll-2",
            title: "Greatest basketball player of all time?",
            totalVotes: 1532,
            options: [
              { id: "opt-1", text: "Michael Jordan", votes: 587 },
              { id: "opt-2", text: "LeBron James", votes: 493 },
            ],
            sportName: "Basketball",
          },
        ].filter(poll => 
          poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poll.sportName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Sort results
      if (sortBy === 'recent') {
        // Sort by date (most recent first)
        searchResults.sort((a, b) => {
          const dateA = new Date(a.dateCreated || a.createdAt || Date.now());
          const dateB = new Date(b.dateCreated || b.createdAt || Date.now());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (sortBy === 'popular') {
        // Sort by popularity (likes, votes, etc.)
        searchResults.sort((a, b) => {
          const popularityA = a.likes || a.totalVotes || 0;
          const popularityB = b.likes || b.totalVotes || 0;
          return popularityB - popularityA;
        });
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL parameters
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('type', type);
    setSearchParams(params);
    
    performSearch(query);
  };
  
  const handleTypeChange = (newType: string) => {
    setType(newType as 'threads' | 'users' | 'polls');
    setResults([]);
    
    if (query) {
      const params = new URLSearchParams();
      params.set('q', query);
      params.set('type', newType);
      setSearchParams(params);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for threads, users, polls..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 py-6"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs defaultValue={type} onValueChange={handleTypeChange} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="threads">Threads</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="polls">Polls</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Sort: {sortBy === 'relevant' ? 'Relevance' : sortBy === 'recent' ? 'Most Recent' : 'Most Popular'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start font-normal"
                      onClick={() => setSortBy('relevant')}
                    >
                      Relevance
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start font-normal"
                      onClick={() => setSortBy('recent')}
                    >
                      Most Recent
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start font-normal"
                      onClick={() => setSortBy('popular')}
                    >
                      Most Popular
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {query && (
            <p className="mb-4 text-muted-foreground">
              {loading ? "Searching..." : `${results.length} results for "${query}"`}
            </p>
          )}
          
          <div className="space-y-4">
            {results.length > 0 ? (
              <TabsContent value="threads" className="m-0">
                {type === 'threads' && results.map((thread) => (
                  <ThreadCard 
                    key={thread.id}
                    {...thread}
                  />
                ))}
              </TabsContent>
            ) : (
              query && !loading && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No results found</h3>
                    <p className="text-center text-muted-foreground mt-2">
                      We couldn't find anything matching your search.
                    </p>
                  </CardContent>
                </Card>
              )
            )}
            
            <TabsContent value="users" className="m-0">
              {type === 'users' && results.map((user) => (
                <UserCard 
                  key={user.id}
                  {...user}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="polls" className="m-0">
              {type === 'polls' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((poll) => (
                    <Card key={poll.id}>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Sport: {poll.sportName}</p>
                        <p className="text-sm">Total votes: {poll.totalVotes}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
        
        <div className="w-full lg:w-1/4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Sport Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all-sports" 
                        checked={selectedSport === null}
                        onCheckedChange={() => setSelectedSport(null)}
                      />
                      <Label htmlFor="all-sports">All Sports</Label>
                    </div>
                    
                    {sports.map((sport) => (
                      <div key={sport.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sport-${sport.id}`}
                          checked={selectedSport === sport.id}
                          onCheckedChange={() => setSelectedSport(sport.id)}
                        />
                        <Label htmlFor={`sport-${sport.id}`}>{sport.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {type === 'threads' && (
                  <div>
                    <h4 className="font-medium mb-2">Thread Type</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-discussion" />
                        <Label htmlFor="type-discussion">Discussion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-question" />
                        <Label htmlFor="type-question">Question</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-news" />
                        <Label htmlFor="type-news">News</Label>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button className="w-full" onClick={() => performSearch(query)}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
