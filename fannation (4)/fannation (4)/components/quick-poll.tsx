"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { pollService } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"

export function QuickPoll() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchLatestPoll() {
      try {
        setLoading(true)
        // Fetch active polls
        const polls = await pollService.getActivePolls()
        if (polls && polls.length > 0) {
          setPoll(polls[0])
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching polls:", err)
        setError(err.message || "Failed to fetch polls")
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPoll()
  }, [])

  const handleVote = async () => {
    if (!selectedOption) return

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on polls",
        variant: "destructive",
      })
      return
    }

    try {
      await pollService.votePoll(Number.parseInt(selectedOption), user.id)
      setHasVoted(true)
      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully recorded",
      })

      // Refresh poll data to get updated vote counts
      const polls = await pollService.getActivePolls()
      if (polls && polls.length > 0) {
        setPoll(polls[0])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote",
        variant: "destructive",
      })
      console.error("Vote error:", error)
    }
  }

  // Fallback poll data if no polls are available from the backend
  const fallbackPoll = {
    id: 1,
    question: "Who will win the NBA Finals this year?",
    options: [
      { id: 1, text: "Boston Celtics", voteCount: 42 },
      { id: 2, text: "Los Angeles Lakers", voteCount: 38 },
      { id: 3, text: "Milwaukee Bucks", voteCount: 15 },
      { id: 4, text: "Other Team", voteCount: 5 },
    ],
    totalVotes: 100,
  }

  const displayPoll = poll || fallbackPoll

  // Calculate percentages for each option
  const calculatePercentage = (voteCount, totalVotes) => {
    if (!totalVotes) return 0
    return Math.round((voteCount / totalVotes) * 100)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="h-6 bg-muted w-1/2 animate-pulse rounded"></CardTitle>
          <CardDescription className="h-4 bg-muted w-3/4 animate-pulse rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-5 bg-muted w-3/4 animate-pulse rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
        </CardFooter>
      </Card>
    )
  }

  if (error && !displayPoll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Poll</CardTitle>
          <CardDescription>Error loading poll</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Poll</CardTitle>
        <CardDescription>Cast your vote on today's hot topic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-medium">{displayPoll.question}</h3>
          {!hasVoted ? (
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              {displayPoll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {displayPoll.options.map((option) => {
                const percentage = calculatePercentage(option.voteCount, displayPoll.totalVotes)
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className="text-sm">{percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!hasVoted ? (
          <Button onClick={handleVote} disabled={!selectedOption} className="w-full">
            Vote Now
          </Button>
        ) : (
          <p className="text-sm text-center w-full text-muted-foreground">
            Thanks for voting! Total votes: {displayPoll.totalVotes}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
