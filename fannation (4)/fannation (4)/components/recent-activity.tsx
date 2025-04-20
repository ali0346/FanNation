"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { threadService } from "@/services/api"

export function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        setLoading(true)
        // Fetch recent threads
        const threadsResponse = await threadService.getAllThreads(0, 5)
        const threads = threadsResponse.content || []

        // Transform threads into activity format
        const threadActivities = threads.map((thread) => ({
          id: thread.id,
          type: "thread",
          user: {
            name: thread.authorName,
            avatar: "/placeholder.svg?height=32&width=32",
            initials: thread.authorName?.substring(0, 2) || "U",
          },
          content: "created a new thread",
          title: thread.title,
          category: thread.categoryName,
          time: formatRelativeTime(thread.createdAt),
          likes: thread.likeCount,
          comments: thread.commentCount,
        }))

        setActivities(threadActivities)
        setError(null)
      } catch (err) {
        console.error("Error fetching recent activity:", err)
        setError(err.message || "Failed to fetch recent activity")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  // Function to format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "recently"

    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading recent activity: {error}</p>
        <button className="mt-4 px-4 py-2 bg-primary text-white rounded" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <div>
                      <Link href={`/profile/${activity.user.name}`} className="font-medium hover:underline">
                        {activity.user.name}
                      </Link>{" "}
                      <span className="text-muted-foreground">{activity.content}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <Link href={`/thread/${activity.id}`} className="font-medium hover:underline">
                    {activity.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">{activity.category}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs">{activity.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="text-xs">{activity.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent activity found</p>
        </div>
      )}
    </div>
  )
}
