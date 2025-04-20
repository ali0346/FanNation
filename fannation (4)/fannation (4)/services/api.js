/**
 * api.js - Comprehensive API service for FanNation
 * Contains services: auth, category, thread, comment, poll
 * Uses Fetch API; tokens stored in localStorage (plain-text for prototype)
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Helper to retrieve JWT token
function getToken() {
  return localStorage.getItem("token");
}

// Helper to retrieve current user object
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Helper to retrieve current user ID
function getUserId() {
  const user = getCurrentUser();
  return user ? user.id : null;
}

// Unified request helper
async function request(endpoint, { method = "GET", body = null, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = (data && (data.error || data.message)) || res.statusText;
    throw new Error(err);
  }

  return data;
}

// -------------------------
// Authentication Services
// -------------------------
export const authService = {
  login: async (username, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: { username, password },
    });
    // Expect: { id, username, email, token }
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: data.id, username: data.username, email: data.email })
    );
    return data;
  },
  register: async (username, email, password) => {
    await request("/auth/register", {
      method: "POST",
      body: { username, email, password },
    });
    return true;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser,
  isAuthenticated: () => !!getToken(),
};

// -------------------------
// Category Services
// -------------------------
export const categoryService = {
  getAllCategories: async () => await request("/categories"),
  getCategoryById: async (id) => await request(`/categories/${id}`),
  getTrendingCategories: async () => await request("/categories/trending"),
  createCategory: async (categoryData) =>
    await request("/categories", {
      method: "POST",
      body: categoryData,
      auth: true,
    }),
  followCategory: async (categoryId) => {
    const userId = getUserId();
    return await request(
      `/categories/${categoryId}/follow?userId=${userId}`,
      { method: "POST", auth: true }
    );
  },
  unfollowCategory: async (categoryId) => {
    const userId = getUserId();
    return await request(
      `/categories/${categoryId}/unfollow?userId=${userId}`,
      { method: "POST", auth: true }
    );
  },
};

// -------------------------
// Thread Services
// -------------------------
export const threadService = {
  getAllThreads: async (page = 0, size = 10) =>
    await request(`/threads?page=${page}&size=${size}`),
  getThreadById: async (id) => await request(`/threads/${id}`),
  getThreadsByCategory: async (categoryId, page = 0, size = 10) =>
    await request(
      `/threads/category/${categoryId}?page=${page}&size=${size}`
    ),
    createThread: async (threadData) => {
      try {
        const token = localStorage.getItem("token");
  
        // Make sure a token exists before proceeding
        if (!token) {
          throw new Error("Unauthorized: No token found.");
        }
  
        const response = await fetch(`${API_URL}/threads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(threadData), // Ensure threadData contains necessary fields
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create thread");
        }
  
        return response.json(); // Returns the created thread data
      } catch (error) {
        console.error("Create thread error:", error);
        return { success: false, error: error.message };
      }
    },
  getPopularThreads: async (page = 0, size = 10) =>
    await request(`/threads/popular?page=${page}&size=${size}`),
};

// -------------------------
// Comment Services
// -------------------------
export const commentService = {
  getCommentsByThread: async (threadId) =>
    await request(`/comments/thread/${threadId}`),
  createComment: async (threadId, content, parentId = null) => {
    const userId = getUserId();
    let path = `/comments?threadId=${threadId}&userId=${userId}`;
    if (parentId) path += `&parentId=${parentId}`;
    return await request(path, {
      method: "POST",
      body: { content },
      auth: true,
    });
  },
};

// -------------------------
// Poll Services
// -------------------------
export const pollService = {
  getActivePolls: async () => await request("/polls/active"),
  votePoll: async (optionId, userId) =>
    await request(
      `/polls/vote?optionId=${optionId}&userId=${userId}`,
      { method: "POST", auth: true }
    ),
};
