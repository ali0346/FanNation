
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChartBar, Users, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  endDate?: string;
  userVoted: boolean;
  userChoice?: string;
  sportName?: string;
}

const PollCard = ({
  id,
  title,
  description,
  options,
  totalVotes,
  createdBy,
  createdAt,
  endDate,
  userVoted,
  userChoice,
  sportName,
}: PollProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userChoice);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(userVoted);
  const [localTotalVotes, setLocalTotalVotes] = useState(totalVotes);
  const [localOptions, setLocalOptions] = useState(options);
  
  const isPollActive = !endDate || new Date(endDate) > new Date();
  
  const handleVote = () => {
    if (!selectedOption || !isPollActive || isVoting) return;
    
    setIsVoting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update local state to reflect the vote
      const updatedOptions = localOptions.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });
      
      setLocalOptions(updatedOptions);
      setLocalTotalVotes(prev => prev + 1);
      setHasVoted(true);
      setIsVoting(false);
    }, 500);
  };
  
  const getPercentage = (votes: number) => {
    if (localTotalVotes === 0) return 0;
    return Math.round((votes / localTotalVotes) * 100);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {sportName && (
              <Badge variant="outline">{sportName}</Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-2">
        {!hasVoted ? (
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-3"
            disabled={isVoting || !isPollActive}
          >
            {localOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.id} 
                  id={`option-${option.id}`} 
                  disabled={isVoting || !isPollActive}
                />
                <Label htmlFor={`option-${option.id}`} className="flex-1">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-4">
            {localOptions.map((option) => {
              const percentage = getPercentage(option.votes);
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {option.text}
                    </span>
                    <span className="text-sm font-medium">
                      {percentage}% ({option.votes})
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2" 
                    style={{ 
                      backgroundColor: option.id === userChoice ? 'rgba(var(--primary), 0.2)' : undefined 
                    }}
                  />
                  {option.id === userChoice && (
                    <span className="text-xs text-muted-foreground">Your choice</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4">
        <div className="flex justify-between w-full text-xs text-muted-foreground mb-2">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{localTotalVotes} votes</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        
        {!hasVoted && isPollActive && (
          <Button 
            className="w-full mt-2" 
            disabled={!selectedOption || isVoting}
            onClick={handleVote}
          >
            {isVoting ? "Submitting..." : "Vote"}
          </Button>
        )}
        
        {!isPollActive && (
          <Badge variant="secondary" className="mt-2">
            Poll closed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;
