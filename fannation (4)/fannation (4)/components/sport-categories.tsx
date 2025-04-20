"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClubIcon as Football,
  ShoppingBasketIcon as Basketball,
  BirdIcon as Cricket,
  BeerIcon as Baseball,
  TurtleIcon as Tennis,
  ClubIcon as GolfClub,
  Bike,
  Dumbbell,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { categoryService } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
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

export function SportCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, isAuthenticated } = useAuth()
  const [followedCategories, setFollowedCategories] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const data = await categoryService.getAllCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err.message || "Failed to fetch categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded-full animate-pulse"></div>
                <CardTitle className="h-6 bg-muted w-24 animate-pulse rounded"></CardTitle>
              </div>
              <CardDescription className="h-10 bg-muted animate-pulse rounded mt-2"></CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between text-sm">
                <div className="space-y-1">
                  <p className="h-4 w-12 bg-muted animate-pulse rounded"></p>
                  <p className="h-4 w-16 bg-muted animate-pulse rounded"></p>
                </div>
                <div className="space-y-1">
                  <p className="h-4 w-12 bg-muted animate-pulse rounded"></p>
                  <p className="h-4 w-16 bg-muted animate-pulse rounded"></p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading categories: {error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.slice(0, 8).map((category) => {
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
  )
}
