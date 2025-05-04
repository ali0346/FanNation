import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Trophy, User } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    favoriteTeams: user?.favoriteTeams?.join(", ") || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const teamsArray = formData.favoriteTeams
        .split(",")
        .map((team) => team.trim())
        .filter((team) => team.length > 0);

      await updateProfile({
        username: formData.username,
        bio: formData.bio,
        favoriteTeams: teamsArray,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary */}
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="text-lg font-medium">{user.points} points</span>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2 text-center">Badges</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {(user.badges || []).map((badge, index) => (
                    <Badge key={index} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2 text-center">Role</h3>
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className={
                      user.role === "admin"
                        ? "border-red-500 text-red-500"
                        : user.role === "moderator"
                        ? "border-blue-500 text-blue-500"
                        : ""
                    }
                  >
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favoriteTeams">Favorite Teams</Label>
                  <Input
                    id="favoriteTeams"
                    name="favoriteTeams"
                    placeholder="E.g. Manchester United, LA Lakers, NY Yankees"
                    value={formData.favoriteTeams}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate teams with commas
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      Upload New
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload feature will be available in the full version
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    "Saving Changes..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
