"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { TrendingThreads } from "@/components/trending-threads"
import { SportCategories } from "@/components/sport-categories"
import { QuickPoll } from "@/components/quick-poll"
import { RecentActivity } from "@/components/recent-activity"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { userService } from "@/services/api"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [topContributors, setTopContributors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopContributors() {
      try {
        const data = await userService.getTopContributors()
        setTopContributors(data)
      } catch (error) {
        console.error("Error fetching top contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopContributors()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to FanNation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A place where passionate sports fans unite. Join discussions, share insights, and connect with fellow fans
            across all sports.
          </p>
          <div className="flex gap-4 mt-4">
            {!isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/register">Join the Community</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/create-thread">Create Thread</Link>
              </Button>
            )}
            <Button variant="outline" asChild size="lg">
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      <Tabs defaultValue="trending" className="mb-12">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mx-auto mb-8">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          <TrendingThreads />
        </TabsContent>
        <TabsContent value="categories">
          <SportCategories />
        </TabsContent>
        <TabsContent value="polls">
          <div className="grid md:grid-cols-2 gap-8">
            <QuickPoll />
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Recent Poll Results</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Who will win the NBA Finals this year?</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Boston Celtics</span>
                        <span className="text-sm">42%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Los Angeles Lakers</span>
                        <span className="text-sm">38%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Other Teams</span>
                        <span className="text-sm">20%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Top Contributors</h2>
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-center py-4 text-muted-foreground">Loading top contributors...</p>
              ) : (
                <ul className="space-y-4">
                  {topContributors.length > 0 ? (
                    topContributors.slice(0, 5).map((contributor, i) => (
                      <li key={contributor.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">#{i + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{contributor.username}</p>
                          <p className="text-sm text-muted-foreground">{contributor.points || 0} points</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No contributors found</p>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
