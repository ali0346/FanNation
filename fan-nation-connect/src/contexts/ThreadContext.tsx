// src/contexts/ThreadContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { useSport } from "./SportContext";

export type Reply = {
  id: string;
  threadId: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  content: string;
  likes: number;
  dateCreated: string;
  userLiked: boolean;
};

export type Thread = {
  id: string;
  title: string;
  content: string;
  sportId: string;
  sportName: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  dateCreated: string;
  likes: number;
  replies: Reply[];
  tags: string[];
  userLiked: boolean;
};

type ThreadContextType = {
  threads: Thread[];
  loading: boolean;
  getThreadsBySport: (sportId: string) => Thread[];
  getThreadById: (threadId: string) => Thread | undefined;
  createThread: (data: {
    title: string;
    content: string;
    sportId: string;
    tags: string[];
  }) => Promise<Thread>;
  createReply: (threadId: string, content: string) => Promise<Reply>;
  likeThread: (threadId: string) => void;
  likeReply: (threadId: string, replyId: string) => void;
};

const ThreadContext = createContext<ThreadContextType | undefined>(
  undefined
);

export const useThread = (): ThreadContextType => {
  const ctx = useContext(ThreadContext);
  if (!ctx) {
    throw new Error("useThread must be used within a ThreadProvider");
  }
  return ctx;
};

export const ThreadProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const { followedSports } = useSport();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // 1️⃣ Fetch threads when followedSports changes
  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const base = "http://localhost:5000/api/threads";
        const url =
          followedSports.length > 0
            ? `${base}?categoryIds=${followedSports.join(",")}`
            : base;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data: Thread[] = await res.json();
        setThreads(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load threads");
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [followedSports, token]);

  const getThreadsBySport = (sportId: string) =>
    threads.filter((t) => t.sportId === sportId);

  const getThreadById = (threadId: string) =>
    threads.find((t) => t.id === threadId);

  // 2️⃣ Create new thread
  const createThread = async (data: {
    title: string;
    content: string;
    sportId: string;
    tags: string[];
  }): Promise<Thread> => {
    if (!user || !token) {
      toast.error("Log in to post threads");
      throw new Error("Not authenticated");
    }
    try {
      const payload = {
        title: data.title,
        content: data.content,
        categoryId: Number(data.sportId),
        userId: Number(user.id),
      };
      const res = await fetch("http://localhost:5000/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Thread creation failed: ${res.status}`);
      const thread: Thread = await res.json();
      setThreads((prev) => [thread, ...prev]);
      toast.success("Thread created!");
      return thread;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create thread");
      throw err;
    }
  };

  // 3️⃣ Create a reply via API
  const createReply = async (
    threadId: string,
    content: string
  ): Promise<Reply> => {
    if (!user || !token) {
      toast.error("Log in to reply");
      throw new Error("Not authenticated");
    }
    try {
      console.log("Sending reply:", { threadId, content });
      const res = await fetch(
        `http://localhost:5000/api/threads/${threadId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Reply failed: ${res.status}`);
      }
      const reply: Reply = await res.json();
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, replies: [...t.replies, reply] }
            : t
        )
      );
      toast.success("Reply posted!");
      return reply;
    } catch (err) {
      console.error("createReply error:", err);
      toast.error((err as Error).message);
      throw err;
    }
  };

  // 4️⃣ Like thread locally
  const likeThread = (threadId: string) => {
    if (!user) {
      toast.error("Log in to like");
      return;
    }
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const toggled = !t.userLiked;
          return {
            ...t,
            likes: t.likes + (toggled ? 1 : -1),
            userLiked: toggled,
          };
        }
        return t;
      })
    );
  };

  // 5️⃣ Like reply locally
  const likeReply = (threadId: string, replyId: string) => {
    if (!user) {
      toast.error("Log in to like");
      return;
    }
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const updated = t.replies.map((r) => {
            if (r.id === replyId) {
              const toggled = !r.userLiked;
              return {
                ...r,
                likes: r.likes + (toggled ? 1 : -1),
                userLiked: toggled,
              };
            }
            return r;
          });
          return { ...t, replies: updated };
        }
        return t;
      })
    );
  };

  return (
    <ThreadContext.Provider
      value={{
        threads,
        loading,
        getThreadsBySport,
        getThreadById,
        createThread,
        createReply,
        likeThread,
        likeReply,
      }}
    >
      {loading ? (
        <p className="p-4 text-center">Loading threads…</p>
      ) : (
        children
      )}
    </ThreadContext.Provider>
  );
};
