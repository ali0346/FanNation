
// This is a mock API service that simulates backend API calls
// In a real application, this would interact with a real backend server

import { User } from "@/contexts/AuthContext";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API error
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Mock authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    await delay(1000); // Simulate network latency
    
    // Simple mock validation
    if (email === "fan@example.com" && password === "password123") {
      return {
        id: "1",
        username: "sports_fan123",
        email: "fan@example.com",
        profilePicture: "/placeholder.svg",
        role: "user",
        bio: "Die-hard sports enthusiast",
        favoriteTeams: ["Manchester United", "LA Lakers"],
        points: 125,
        badges: ["Newcomer", "Active Poster"]
      };
    } else if (email === "admin@example.com" && password === "admin123") {
      return {
        id: "2",
        username: "admin",
        email: "admin@example.com",
        profilePicture: "/placeholder.svg",
        role: "admin",
        bio: "Site administrator",
        favoriteTeams: ["Chelsea", "Chicago Bulls"],
        points: 845,
        badges: ["Admin", "Site Veteran", "Top Contributor"]
      };
    } else if (email === "mod@example.com" && password === "mod123") {
      return {
        id: "3",
        username: "moderator",
        email: "mod@example.com",
        profilePicture: "/placeholder.svg",
        role: "moderator", 
        bio: "Community moderator",
        favoriteTeams: ["Arsenal", "Boston Celtics"],
        points: 550,
        badges: ["Moderator", "Helpful", "Dedicated"]
      };
    }
    
    throw new ApiError("Invalid email or password", 401);
  },
  
  register: async (username: string, email: string, password: string) => {
    await delay(1000); // Simulate network latency
    
    // In a real app, check if email or username already exists
    if (email === "fan@example.com") {
      throw new ApiError("Email already in use", 409);
    }
    
    if (username === "sports_fan123") {
      throw new ApiError("Username already taken", 409);
    }
    
    // Return mock user data
    return {
      id: "new-user-" + Date.now(),
      username,
      email,
      profilePicture: "/placeholder.svg",
      role: "user",
      bio: "",
      favoriteTeams: [],
      points: 0,
      badges: ["Newcomer"]
    };
  },
  
  updateProfile: async (userId: string, profileData: Partial<User>) => {
    await delay(800); // Simulate network latency
    
    // In a real app, validate data and update the backend
    return {
      ...profileData,
      id: userId
    };
  }
};

// Mock sports API
export const sportsApi = {
  getAllSports: async () => {
    await delay(800); // Simulate network latency
    
    return [
      { 
        id: "sport1", 
        name: "Football", 
        slug: "football",
        icon: "⚽", 
        description: "The world's most popular sport", 
        color: "green", 
        followers: 12500, 
        threads: 458 
      },
      { 
        id: "sport2", 
        name: "Basketball", 
        slug: "basketball",
        icon: "🏀", 
        description: "Fast-paced action on the court", 
        color: "orange", 
        followers: 8700, 
        threads: 312 
      },
      { 
        id: "sport3", 
        name: "Cricket", 
        slug: "cricket",
        icon: "🏏", 
        description: "A gentleman's game with global appeal", 
        color: "blue", 
        followers: 9200, 
        threads: 287 
      },
      { 
        id: "sport4", 
        name: "Tennis", 
        slug: "tennis",
        icon: "🎾", 
        description: "Individual excellence and skill", 
        color: "yellow", 
        followers: 5600, 
        threads: 175 
      },
      { 
        id: "sport5", 
        name: "Formula 1", 
        slug: "formula-1",
        icon: "🏎️", 
        description: "The pinnacle of motorsport", 
        color: "red", 
        followers: 6800, 
        threads: 210 
      }
    ];
  },
  
  followSport: async (sportId: string, userId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  },
  
  unfollowSport: async (sportId: string, userId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  }
};

// Mock threads API
export const threadsApi = {
  getThreads: async (filters?: { sportId?: string, userId?: string, search?: string }) => {
    await delay(1000); // Simulate network latency
    
    // Return mock thread data
    // In a real app, you would apply the filters on the backend
    // Here we'll just return all threads
    return [
      {
        id: "thread1",
        title: "Who will win the Premier League this season?",
        content: "With the season underway, who do you think has the best chance of winning the league?",
        dateCreated: "2023-09-15T10:00:00Z",
        userId: "user1",
        username: "football_fan99",
        userProfilePicture: "/placeholder.svg",
        sportId: "sport1",
        sportName: "Football",
        tags: ["premier-league", "prediction"],
        likes: 45,
        replies: 18,
        userLiked: false
      },
      {
        id: "thread2",
        title: "The GOAT debate: LeBron vs Jordan",
        content: "Who do you think is the greatest basketball player of all time and why?",
        dateCreated: "2023-09-14T15:30:00Z",
        userId: "user2",
        username: "basket_master",
        userProfilePicture: "/placeholder.svg",
        sportId: "sport2",
        sportName: "Basketball",
        tags: ["nba", "goat-debate"],
        likes: 78,
        replies: 42,
        userLiked: true
      },
      {
        id: "thread3",
        title: "Cricket World Cup predictions",
        content: "Which team do you think will win the upcoming Cricket World Cup?",
        dateCreated: "2023-09-12T09:45:00Z",
        userId: "user3",
        username: "cricket_lover",
        userProfilePicture: "/placeholder.svg",
        sportId: "sport3",
        sportName: "Cricket",
        tags: ["world-cup", "prediction"],
        likes: 34,
        replies: 25,
        userLiked: false
      }
    ];
  },
  
  getThreadById: async (threadId: string) => {
    await delay(800); // Simulate network latency
    
    // Mock thread data
    // In a real app, you would fetch the specific thread from the backend
    return {
      id: threadId,
      title: "Who will win the Premier League this season?",
      content: "With the season underway, who do you think has the best chance of winning the league?",
      dateCreated: "2023-09-15T10:00:00Z",
      userId: "user1",
      username: "football_fan99",
      userProfilePicture: "/placeholder.svg",
      sportId: "sport1",
      sportName: "Football",
      tags: ["premier-league", "prediction"],
      likes: 45,
      userLiked: false,
      replies: [
        {
          id: "reply1",
          content: "I think Manchester City will win again, they're just too strong.",
          dateCreated: "2023-09-15T10:30:00Z",
          userId: "user2",
          username: "basket_master",
          userProfilePicture: "/placeholder.svg",
          likes: 12,
          userLiked: true
        },
        {
          id: "reply2",
          content: "Liverpool has a great chance this season with their new signings.",
          dateCreated: "2023-09-15T11:15:00Z",
          userId: "user3",
          username: "cricket_lover",
          userProfilePicture: "/placeholder.svg",
          likes: 8,
          userLiked: false
        }
      ]
    };
  },
  
  createThread: async (threadData: { title: string, content: string, sportId: string, tags?: string[] }) => {
    await delay(1200); // Simulate network latency
    
    // Mock create thread response
    return {
      id: "new-thread-" + Date.now(),
      title: threadData.title,
      content: threadData.content,
      dateCreated: new Date().toISOString(),
      userId: "current-user", // In a real app, this would be the authenticated user's ID
      username: "current_user_name", // In a real app, this would be the authenticated user's username
      userProfilePicture: "/placeholder.svg",
      sportId: threadData.sportId,
      sportName: "Sport Name", // In a real app, this would be looked up from the sportId
      tags: threadData.tags || [],
      likes: 0,
      replies: 0,
      userLiked: false
    };
  },
  
  createReply: async (threadId: string, content: string) => {
    await delay(800); // Simulate network latency
    
    // Mock create reply response
    return {
      id: "new-reply-" + Date.now(),
      content,
      dateCreated: new Date().toISOString(),
      userId: "current-user", // In a real app, this would be the authenticated user's ID
      username: "current_user_name", // In a real app, this would be the authenticated user's username
      userProfilePicture: "/placeholder.svg",
      likes: 0,
      userLiked: false
    };
  },
  
  likeThread: async (threadId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  },
  
  unlikeThread: async (threadId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  },
  
  likeReply: async (replyId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  },
  
  unlikeReply: async (replyId: string) => {
    await delay(500); // Simulate network latency
    return { success: true };
  }
};

// Mock leaderboard API
export const leaderboardApi = {
  getLeaderboard: async (type: 'all' | 'monthly' | 'weekly' = 'all') => {
    await delay(1000); // Simulate network latency
    
    // Mock leaderboard data
    return [
      {
        id: "user1",
        username: "sports_king",
        profilePicture: "/placeholder.svg",
        role: "user",
        points: 2750,
        badges: ["Elite Fan", "MVP", "Knowledge Master"],
        rank: 1
      },
      {
        id: "user2",
        username: "admin",
        profilePicture: "/placeholder.svg",
        role: "admin",
        points: 1845,
        badges: ["Admin", "Site Veteran", "Top Contributor"],
        rank: 2
      },
      {
        id: "user3",
        username: "moderator",
        profilePicture: "/placeholder.svg",
        role: "moderator",
        points: 1550,
        badges: ["Moderator", "Helpful", "Dedicated"],
        rank: 3
      },
      {
        id: "user4",
        username: "football_fan99",
        profilePicture: "/placeholder.svg",
        role: "user",
        points: 1347,
        badges: ["Football Expert", "Regular", "Commenter"],
        rank: 4
      },
      {
        id: "user5",
        username: "cricket_lover",
        profilePicture: "/placeholder.svg",
        role: "user",
        points: 1203,
        badges: ["Cricket Expert", "Analyst"],
        rank: 5
      }
    ];
  }
};
