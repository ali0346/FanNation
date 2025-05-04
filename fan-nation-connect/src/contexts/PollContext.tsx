// src/contexts/PollContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  endDate?: string;
  sportId: string;
  sportName: string;
  userVoted: boolean;
  userChoice?: string;
}

export interface CreatePollInput {
  title: string;
  description?: string;
  options: string[];
  sportId: string;
  endDate?: string;
}

interface PollContextType {
  polls: Poll[];
  createPoll: (input: CreatePollInput) => Promise<Poll>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  getOpenPolls: () => Poll[];
  getClosedPolls: () => Poll[];
  getPollById: (pollId: string) => Poll | undefined;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);

  // Fetch all polls on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/polls', {
          headers: {
            'Content-Type': 'application/json',
            // no auth needed for GET
          }
        });
        if (!res.ok) throw new Error('Failed to load polls');
        const data: Poll[] = await res.json();
        // initialize userVoted=false for each
        setPolls(data.map(p => ({ ...p, userVoted: false })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Helper to update a single poll in state
  const updatePollInState = (updated: Poll) => {
    setPolls(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    );
  };

  // Create a new poll
  const createPoll = async (input: CreatePollInput): Promise<Poll> => {
    if (!isAuthenticated || !user) {
      throw new Error('Must be logged in');
    }
    if (user.role !== 'admin' && user.role !== 'moderator') {
      throw new Error('Insufficient permissions');
    }
    const question   = input.title.trim();
    const options    = input.options.filter(o => o.trim().length > 0);
    const categoryId = parseInt(input.sportId, 10);        // ← make sure this is a real number
    const expiresAt  = input.endDate;

    console.log("Sending poll:", { question, options, categoryId, expiresAt });   
    const res = await fetch("http://localhost:5000/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question:    input.title.trim(),
        options:     input.options.filter(o => o.trim() !== ""),
        categoryId:  Number(input.sportId),              // now a valid number
        expiresAt:   input.endDate                       // or new Date(input.endDate).toISOString()
      }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Poll creation failed');
    }
    const p: Poll = await res.json();
    // newly created poll has zero votes
    setPolls(prev => [ { ...p, userVoted: false }, ...prev ]);
    return p;
  };

  // Vote on a poll
  const votePoll = async (pollId: string, optionId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Must be logged in to vote');
    }
    const res = await fetch('http://localhost:5000/api/polls/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ pollId, optionId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Vote failed');
    }
    // locally bump the count
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      const updatedOptions = poll.options.map(o =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o
      );
      const updated: Poll = {
        ...poll,
        options: updatedOptions,
        totalVotes: poll.totalVotes + 1,
        userVoted: true,
        userChoice: optionId
      };
      updatePollInState(updated);
    }
  };

  const getOpenPolls = () =>
    polls.filter(p => !p.endDate || new Date(p.endDate) > new Date());

  const getClosedPolls = () =>
    polls.filter(p => p.endDate != null && new Date(p.endDate) <= new Date());

  const getPollById = (pollId: string) =>
    polls.find(p => p.id === pollId);

  return (
    <PollContext.Provider
      value={{ polls, createPoll, votePoll, getOpenPolls, getClosedPolls, getPollById }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error('usePoll must be inside PollProvider');
  return ctx;
};
