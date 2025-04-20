"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
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
  Filter,
  ArrowUpDown,
} from "lucide-react"
import { ThreadCard } from "@/components/thread-card"
import { useState, useEffect } from "react"
import { categoryService, threadService } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"

const categoryIcons = {
  football: Football,
  basketball: Basketball,
  cricket: Cricket,
  baseball: Baseball,
  tennis: Tennis,
  golf: GolfClub,
  cycling: Bike,
  fitness: Dumbbell,
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryId = params.category
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")
  const [isFollowing, setIsFollowing] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchCategoryAndThreads() {
      try {
        setLoading(true)
        // Fetch category details
        const categoryData = await categoryService.getCategoryById(categoryId)
        setCategory(categoryData)

        // Fetch threads for this category
        const threadsData = await threadService.getThreadsByCategory(categoryId, 0, 10)
        setThreads(threadsData.content || [])

        setError(null)
      } catch (err) {
        console.error("Error fetching category data:", err)
        setError(err.message || "Failed to fetch category data")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndThreads()
  }, [categoryId])

  const handleFollow = async () => {
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
      setIsFollowing(true)
      toast({
        title: "Success",
        description: "You are now following this category",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow category",
        variant: "destructive",
      })
      console.error("Follow error:", error)
    }
  }

  const handleUnfollow = async () => {
    try {
      await categoryService.unfollowCategory(categoryId, user.id)
      setIsFollowing(false)
      toast({
        title: "Success",
        description: "You have unfollowed this category",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow category",
        variant: "destructive",
      })
      console.error("Unfollow error:", error)
    }
  }

  // Filter threads based on search term
  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort threads based on selected option
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "popular":
        return b.likeCount - a.likeCount
      case "comments":
        return b.commentCount - a.commentCount
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <div className="h-6 w-6 bg-muted animate-pulse rounded-full"></div>
              </div>
              <div>
                <CardTitle className="h-8 bg-muted w-40 animate-pulse rounded"></CardTitle>
                <CardDescription className="h-4 bg-muted w-64 animate-pulse rounded mt-2"></CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <p className="h-6 bg-muted w-16 animate-pulse rounded"></p>
                  <p className="h-4 bg-muted w-20 animate-pulse rounded"></p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-9 w-32 bg-muted animate-pulse rounded"></div>
          </CardFooter>
        </Card>

        <div className="space-y-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Error Loading Category</h2>
          <p className="text-destructive mb-6">{error || "Category not found"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const CategoryIcon = categoryIcons[category.iconName?.toLowerCase()] || Football

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <CategoryIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-bold">{category.threadCount}</p>
              <p className="text-sm text-muted-foreground">Threads</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{category.followerCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">New today</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          {isAuthenticated && (
            <Button onClick={isFollowing ? handleUnfollow : handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</Button>
          )}
          <Button variant="outline">Create Thread</Button>
        </CardFooter>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full md:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Threads</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search threads..."
              className="w-full sm:w-[200px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedThreads.length > 0 ? (
          sortedThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              id={thread.id}
              title={thread.title}
              author={thread.authorName}
              date={formatRelativeTime(thread.createdAt)}
              content={thread.content}
              likes={thread.likeCount}
              comments={thread.commentCount}
              category={category.name}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No threads found in this category.</p>
            <Button className="mt-4" variant="outline">
              Create the first thread
            </Button>
          </div>
        )}
      </div>

      {sortedThreads.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  )
}

// Function to format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return "recently"

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}
