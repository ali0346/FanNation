
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash, Edit, User, Users, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sports");
  const [isAddSportDialogOpen, setIsAddSportDialogOpen] = useState(false);
  

  const [sports, setSports] = useState<{ id: string; name: string; icon: string; description: string; color: string }[]>([]);
  const [newSport, setNewSport] = useState<{ name: string; icon: string; description: string; color: string }>({ name: "", icon: "", description: "", color: "#4CAF50" });  
  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("You don't have permission to access the admin dashboard");
      navigate("/");
      return;
    }
  
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("fannation_token")}`,
          },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSports(data);
      } catch {
        toast.error("Failed to load categories");
      }
    })();
  }, [isAuthenticated, user, navigate]);
  

  const handleAddSport = async () => {
    if (!newSport.name.trim()) {
      toast.error("Please enter a sport name");
      return;
    }
  
    try {
      // derive slug automatically
      const slug = newSport.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
  
      const payload = {
        name:        newSport.name,
        slug,
        icon_name:   newSport.icon,
        description: newSport.description,
        color:       newSport.color,
      };
  
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("fannation_token")}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add category");
      }
  
      const created = await res.json();
      setSports((prev) => [...prev, created]);
      setNewSport({ name: "", icon: "", description: "", color: "#4CAF50" });
      setIsAddSportDialogOpen(false);
      toast.success("Sport category added");
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  

  const handleDeleteSport = (id: string) => {
    setSports(sports.filter(sport => sport.id !== id));
    toast.success("Sport category deleted successfully");
  };
  
  // Summary statistics
  const summaryStats = [
    { title: "Total Users", value: 8750, icon: <Users className="h-6 w-6" /> },
    { title: "Sports Categories", value: sports.length, icon: <BarChart2 className="h-6 w-6" /> },
    { title: "Total Threads", value: 12458, icon: <BarChart2 className="h-6 w-6" /> },
    { title: "Active Polls", value: 24, icon: <BarChart2 className="h-6 w-6" /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your sports community platform</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-primary/10 mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="sports">Sports Categories</TabsTrigger>
          <TabsTrigger value="users">Users Management</TabsTrigger>
          <TabsTrigger value="reports">Content Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sports Categories</h2>
            <Dialog open={isAddSportDialogOpen} onOpenChange={setIsAddSportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sport
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sport</DialogTitle>
                  <DialogDescription>
                    Create a new sport category for discussions and polls
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sportName">Sport Name</Label>
                    <Input 
                      id="sportName" 
                      value={newSport.name} 
                      onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                      placeholder="e.g. Football"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportIcon">Icon (Emoji)</Label>
                    <Input 
                      id="sportIcon" 
                      value={newSport.icon} 
                      onChange={(e) => setNewSport({...newSport, icon: e.target.value})}
                      placeholder="e.g. ⚽"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportDescription">Description</Label>
                    <Textarea 
                      id="sportDescription" 
                      value={newSport.description} 
                      onChange={(e) => setNewSport({...newSport, description: e.target.value})}
                      placeholder="Brief description of the sport"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportColor">Theme Color</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        id="sportColor" 
                        type="color" 
                        value={newSport.color} 
                        onChange={(e) => setNewSport({...newSport, color: e.target.value})}
                        className="w-16 h-10 p-1"
                      />
                      <div className="text-sm text-muted-foreground">
                        Choose a theme color for this sport
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSportDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSport}>Add Sport</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sports.map((sport) => (
              <Card key={sport.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sport.icon}</span>
                      <CardTitle>{sport.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSport(sport.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{sport.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div 
                    className="h-2 w-full rounded-full mt-2" 
                    style={{backgroundColor: sport.color}} 
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">Users Management</h2>
          <p className="text-muted-foreground mb-4">
            Here you can manage user accounts, assign roles, and moderate content.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage site users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">sports_fan123</p>
                      <p className="text-sm text-muted-foreground">fan@example.com</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Make Moderator</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">basketball_lover</p>
                      <p className="text-sm text-muted-foreground">bball@example.com</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Make Moderator</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">cricket_fan</p>
                      <p className="text-sm text-muted-foreground">cricket@example.com</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Make Moderator</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Content Reports</h2>
          <p className="text-muted-foreground mb-4">
            Review and moderate reported content from users.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Reports Queue</CardTitle>
              <CardDescription>Pending reports requiring moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No pending reports to review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Platform Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure global settings for the platform.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="FanNation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea id="siteDescription" defaultValue="The ultimate community for sports fans" />
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
