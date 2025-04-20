/**
 * API service for FanNation
 * Contains methods for interacting with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
console.log("Using API URL:", API_URL) // Add this for debugging

// Authentication Services
export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data = await response.json()
    // Store token in localStorage
    localStorage.setItem("token", data.token)
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
      }),
    )

    return data
  },

  register: async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        let errorMessage = "Registration failed"
        try {
          // Try to parse error as JSON, but handle case where it's not valid JSON
          const errorData = await response.text()
          if (errorData) {
            try {
              const parsedError = JSON.parse(errorData)
              errorMessage = parsedError.message || errorMessage
            } catch (e) {
              // If JSON parsing fails, use the raw text if available
              errorMessage = errorData || errorMessage
            }
          }
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
        throw new Error(errorMessage)
      }

      // Check if there's actually content before parsing JSON
      const text = await response.text()
      return text ? JSON.parse(text) : {}
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    return JSON.parse(userStr)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },
}

// Categories Services
export const categoryService = {
  getAllCategories: async () => {
    const response = await fetch(`${API_URL}/categories`)
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    return response.json()
  },

  getCategoryById: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch category")
    }
    return response.json()
  },

  getTrendingCategories: async () => {
    const response = await fetch(`${API_URL}/categories/trending`)
    if (!response.ok) {
      throw new Error("Failed to fetch trending categories")
    }
    return response.json()
  },

  followCategory: async (categoryId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/categories/${categoryId}/follow?userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to follow category")
    }

    return true
  },

  unfollowCategory: async (categoryId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/categories/${categoryId}/unfollow?userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to unfollow category")
    }

    return true
  },
}

// Thread Services
export const threadService = {
  getAllThreads: async (page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/threads?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch threads")
    }
    return response.json()
  },

  getThreadById: async (id) => {
    const response = await fetch(`${API_URL}/threads/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch thread")
    }
    return response.json()
  },

  getThreadsByCategory: async (categoryId, page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/threads/category/${categoryId}?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch threads by category")
    }
    return response.json()
  },

  getThreadsByUser: async (userId, page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/threads/user/${userId}?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch threads by user")
    }
    return response.json()
  },

  searchThreads: async (keyword, page = 0, size = 10) => {
    const response = await fetch(
      `${API_URL}/threads/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    )
    if (!response.ok) {
      throw new Error("Failed to search threads")
    }
    return response.json()
  },

  getPopularThreads: async (page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/threads/popular?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch popular threads")
    }
    return response.json()
  },

  createThread: async (threadData, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/threads?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(threadData),
    })

    if (!response.ok) {
      throw new Error("Failed to create thread")
    }

    return response.json()
  },

  updateThread: async (id, threadData) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/threads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(threadData),
    })

    if (!response.ok) {
      throw new Error("Failed to update thread")
    }

    return response.json()
  },

  deleteThread: async (id) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/threads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete thread")
    }

    return true
  },

  likeThread: async (threadId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/threads/${threadId}/like?userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to like thread")
    }

    return true
  },

  unlikeThread: async (threadId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/threads/${threadId}/unlike?userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to unlike thread")
    }

    return true
  },
}

// User Services
export const userService = {
  getUserProfile: async (username) => {
    const response = await fetch(`${API_URL}/users/profile/${username}`)
    if (!response.ok) {
      throw new Error("Failed to fetch user profile")
    }
    return response.json()
  },

  updateUser: async (id, userData) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Failed to update user")
    }

    return response.json()
  },

  uploadProfilePicture: async (id, file) => {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/users/${id}/profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload profile picture")
    }

    return response.json()
  },

  followUser: async (userId, targetId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/users/${userId}/follow/${targetId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to follow user")
    }

    return true
  },

  unfollowUser: async (userId, targetId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/users/${userId}/unfollow/${targetId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to unfollow user")
    }

    return true
  },

  getTopContributors: async () => {
    const response = await fetch(`${API_URL}/users/top-contributors`)
    if (!response.ok) {
      throw new Error("Failed to fetch top contributors")
    }
    return response.json()
  },
}

// Poll Services
export const pollService = {
  getPollsByCategory: async (categoryId, page = 0, size = 10) => {
    const response = await fetch(`${API_URL}/polls/category/${categoryId}?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch polls by category")
    }
    return response.json()
  },

  getPollById: async (id) => {
    const response = await fetch(`${API_URL}/polls/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch poll")
    }
    return response.json()
  },

  createPoll: async (pollData, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/polls?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pollData),
    })

    if (!response.ok) {
      throw new Error("Failed to create poll")
    }

    return response.json()
  },

  votePoll: async (optionId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/polls/vote?optionId=${optionId}&userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to vote on poll")
    }

    return response.json()
  },
}

// Comment Services
export const commentService = {
  getCommentsByThread: async (threadId, page = 0, size = 20) => {
    const response = await fetch(`${API_URL}/comments/thread/${threadId}?page=${page}&size=${size}`)
    if (!response.ok) {
      throw new Error("Failed to fetch comments")
    }
    return response.json()
  },

  createComment: async (commentData, threadId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/comments?threadId=${threadId}&userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    })

    if (!response.ok) {
      throw new Error("Failed to create comment")
    }

    return response.json()
  },

  replyToComment: async (commentData, parentId, threadId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(
      `${API_URL}/comments/reply?parentId=${parentId}&threadId=${threadId}&userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to reply to comment")
    }

    return response.json()
  },

  likeComment: async (commentId, userId) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/comments/${commentId}/like?userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to like comment")
    }

    return true
  },
}

// Helper method for making authenticated requests
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token")

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  }

  const mergedOptions = {
    ...options,
    ...defaultOptions,
    headers: {
      ...options.headers,
      ...defaultOptions.headers,
    },
  }

  const response = await fetch(url, mergedOptions)

  // If 401 Unauthorized, clear local storage and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
    throw new Error("Session expired. Please login again.")
  }

  return response
}
