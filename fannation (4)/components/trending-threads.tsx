"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { threadService } from "@/services/api"

export function TrendingThreads() {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTrendingThreads() {
      try {
        setLoading(true)
        const response = await threadService.getPopularThreads(0, 4)
        setThreads(response.content || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching trending threads:", err)
        setError(err.message || "Failed to fetch trending threads")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingThreads()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="bg-muted animate-pulse w-20 h-5"></Badge>
                <span className="text-xs text-muted-foreground">...</span>
              </div>
              <CardTitle className="text-lg line-clamp-2 mt-2 animate-pulse bg-muted h-6"></CardTitle>
              <CardDescription className="animate-pulse bg-muted h-4 w-1/2"></CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 flex justify-between">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">-</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">-</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading trending threads: {error}</p>
      </div>
    )
  }

  // If no threads are available, show empty state
  if (threads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No trending threads available at the moment.</p>
      </div>
    )
  }

  // Function to format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return "recently"

    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {threads.map((thread) => (
        <Card key={thread.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Badge variant="outline">{thread.categoryName}</Badge>
              <span className="text-xs text-muted-foreground">{getRelativeTime(thread.createdAt)}</span>
            </div>
            <CardTitle className="text-lg line-clamp-2 mt-2">
              <Link href={`/thread/${thread.id}`} className="hover:underline">
                {thread.title}
              </Link>
            </CardTitle>
            <CardDescription>by {thread.authorName}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0 flex justify-between">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{thread.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{thread.commentCount}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
