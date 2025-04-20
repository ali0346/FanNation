"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClubIcon as Football,
  ShoppingBasketIcon as Basketball,
  BirdIcon as Cricket,
  BeerIcon as Baseball,
  TurtleIcon as Tennis,
  ClubIcon as GolfClub,
  Bike,
  Dumbbell,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCategories } from "@/hooks/use-categories"
import { useAuth } from "@/context/AuthContext"
import { categoryService } from "@/services/api"
import { toast } from "@/hooks/use-toast"

// Icon mapping
const iconMap = {
  football: Football,
  basketball: Basketball,
  cricket: Cricket,
  baseball: Baseball,
  tennis: Tennis,
  golf: GolfClub,
  cycling: Bike,
  fitness: Dumbbell,
}

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories()
  const [searchTerm, setSearchTerm] = useState("")
  const [followedCategories, setFollowedCategories] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const { user, isAuthenticated } = useAuth()

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get user's followed categories
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // In a real implementation, you would fetch the user's followed categories
      // For now, we'll use an empty array
      setFollowedCategories([])
    }
  }, [isAuthenticated, user])

  const handleFollow = async (categoryId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow categories",
        variant: "destructive",
      })
      return
    }

    try {
      await categoryService.followCategory(categoryId, user.id)
      toast({
        title: "Success",
        description: "You are now following this category",
      })
      // Update followed categories
      setFollowedCategories([...followedCategories, categoryId])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow category",
        variant: "destructive",
      })
      console.error("Follow error:", error)
    }
  }

  const handleUnfollow = async (categoryId) => {
    try {
      await categoryService.unfollowCategory(categoryId, user.id)
      toast({
        title: "Success",
        description: "You have unfollowed this category",
      })
      // Update followed categories
      setFollowedCategories(followedCategories.filter((id) => id !== categoryId))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow category",
        variant: "destructive",
      })
      console.error("Unfollow error:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive">Error loading categories: {error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sports Categories</h1>
          <p className="text-muted-foreground">Browse and follow your favorite sports categories</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="w-full md:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="following" disabled={!isAuthenticated}>
            Following
          </TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = iconMap[category.iconName?.toLowerCase()] || Football
              const isFollowing = followedCategories.includes(category.id)

              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 h-10">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{category.threadCount}</p>
                        <p className="text-muted-foreground">Threads</p>
                      </div>
                      <div>
                        <p className="font-medium">{category.followerCount}</p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button asChild className="w-full">
                      <Link href={`/categories/${category.id}`}>View</Link>
                    </Button>
                    {isAuthenticated && (
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        className="w-full"
                        onClick={() => (isFollowing ? handleUnfollow(category.id) : handleFollow(category.id))}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          {followedCategories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories
                .filter((category) => followedCategories.includes(category.id))
                .map((category) => {
                  const IconComponent = iconMap[category.iconName?.toLowerCase()] || Football

                  return (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5" />
                          <CardTitle>{category.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 h-10">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium">{category.threadCount}</p>
                            <p className="text-muted-foreground">Threads</p>
                          </div>
                          <div>
                            <p className="font-medium">{category.followerCount}</p>
                            <p className="text-muted-foreground">Followers</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button asChild className="w-full">
                          <Link href={`/categories/${category.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleUnfollow(category.id)}>
                          Unfollow
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You're not following any categories yet.</p>
              <p className="text-muted-foreground">Follow categories to see them here.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="trending" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.slice(0, 4).map((category) => {
              const IconComponent = iconMap[category.iconName?.toLowerCase()] || Football
              const isFollowing = followedCategories.includes(category.id)

              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 h-10">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{category.threadCount}</p>
                        <p className="text-muted-foreground">Threads</p>
                      </div>
                      <div>
                        <p className="font-medium">{category.followerCount}</p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button asChild className="w-full">
                      <Link href={`/categories/${category.id}`}>View</Link>
                    </Button>
                    {isAuthenticated && (
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        className="w-full"
                        onClick={() => (isFollowing ? handleUnfollow(category.id) : handleFollow(category.id))}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
