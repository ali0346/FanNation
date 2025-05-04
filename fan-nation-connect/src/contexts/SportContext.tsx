// src/contexts/SportContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type Sport = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  threads: number;
  followers: number; // you can update this later if you want real follower counts
};

type SportContextType = {
  sports: Sport[];
  followedSports: string[];      // array of category IDs
  followSport: (sportId: string) => Promise<void>;
  unfollowSport: (sportId: string) => Promise<void>;
  isFollowing: (sportId: string) => boolean;
};

const SportContext = createContext<SportContextType | undefined>(undefined);

export const useSport = () => {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error("useSport must be used within a SportProvider");
  return ctx;
};

export const SportProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [followedSports, setFollowedSports] = useState<string[]>([]);

  // 1) Fetch all sports (categories) once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load sports");
        const data: Sport[] = await res.json();
        setSports(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load sports");
      }
    })();
  }, []);

  // 2) Fetch the list of followed categories for this user (if logged in)
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setFollowedSports([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/categories/followed/list",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load followed sports");
        const data: { id: number; name: string }[] = await res.json();
        // server returns Category objects; we only need their IDs as strings
        setFollowedSports(data.map((c) => String(c.id)));
      } catch (err) {
        console.error(err);
        toast.error("Could not load your followed sports");
      }
    })();
  }, [isAuthenticated, token]);

  const followSport = async (sportId: string) => {
    if (!isAuthenticated || !token) {
      toast.error("You must be logged in to follow a sport");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/categories/${sportId}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Follow failed");
      }
      setFollowedSports((prev) => [...prev, sportId]);
      const s = sports.find((s) => s.id === sportId);
      toast.success(`You're now following ${s?.name}`);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message);
    }
  };

  const unfollowSport = async (sportId: string) => {
    if (!isAuthenticated || !token) {
      toast.error("You must be logged in to unfollow a sport");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/categories/${sportId}/follow`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Unfollow failed");
      }
      setFollowedSports((prev) =>
        prev.filter((id) => id !== sportId)
      );
      const s = sports.find((s) => s.id === sportId);
      toast.success(`You've unfollowed ${s?.name}`);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message);
    }
  };

  const isFollowing = (sportId: string) =>
    followedSports.includes(sportId);

  return (
    <SportContext.Provider
      value={{
        sports,
        followedSports,
        followSport,
        unfollowSport,
        isFollowing,
      }}
    >
      {children}
    </SportContext.Provider>
  );
};
