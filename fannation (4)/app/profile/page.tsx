"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThreadCard } from "@/components/thread-card"
import { useState } from "react"

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User123" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">User123</h1>
                  <p className="text-muted-foreground">Member since January 2023</p>
                </div>
                <div className="flex gap-3">
                  <Button variant={isFollowing ? "outline" : "default"} onClick={() => setIsFollowing(!isFollowing)}>
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline">Message</Button>
                </div>
              </div>

              <p className="mb-4">
                Passionate sports fan with a love for football, basketball, and tennis. Always up for a good debate
                about the GOAT in any sport!
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Football</Badge>
                <Badge variant="secondary">Basketball</Badge>
                <Badge variant="secondary">Tennis</Badge>
                <Badge variant="secondary">Sports Analytics</Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="font-bold">256</p>
                  <p className="text-muted-foreground">Threads</p>
                </div>
                <div>
                  <p className="font-bold">1.2K</p>
                  <p className="text-muted-foreground">Comments</p>
                </div>
                <div>
                  <p className="font-bold">543</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-bold">128</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="threads" className="mb-8">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="threads">Threads</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        <TabsContent value="threads" className="mt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ThreadCard
                key={i}
                id={`thread-${i}`}
                title={`Discussion Thread ${i} by User123`}
                author="User123"
                date={`${i} days ago`}
                content="This is a sample thread about sports. It contains some discussion about recent events, matches, or players."
                likes={10 + i * 5}
                comments={5 + i * 3}
                category="Football"
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Commented on <span className="font-medium text-foreground">Thread Title {i}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{i} days ago</p>
                  </div>
                  <p>
                    This is a comment on a thread. It contains some thoughts or opinions about the topic being
                    discussed.
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span>12</span>
                      <span className="text-muted-foreground">likes</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>
        <TabsContent value="badges" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Early Adopter",
              "Top Contributor",
              "Thread Master",
              "Poll Expert",
              "Football Fan",
              "1 Year Member",
              "Helpful Commenter",
              "Trending Creator",
            ].map((badge, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="font-medium">{badge}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Earned on Jan {i + 1}, 2023</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
