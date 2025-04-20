/**
 * Fetch client utility with authentication and error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Get auth token from localStorage
const getToken = () => {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem("token")
}

// HTTP GET request
export const get = async (endpoint, queryParams = {}) => {
  const url = new URL(`${API_URL}${endpoint}`)

  // Add query parameters
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, queryParams[key])
    }
  })

  const headers = {
    "Content-Type": "application/json",
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth data and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }

      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// HTTP POST request
export const post = async (endpoint, data = {}) => {
  const headers = {
    "Content-Type": "application/json",
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }

      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// HTTP PUT request
export const put = async (endpoint, data = {}) => {
  const headers = {
    "Content-Type": "application/json",
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }

      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// HTTP DELETE request
export const del = async (endpoint) => {
  const headers = {
    "Content-Type": "application/json",
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }

      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return true
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// HTTP POST request for file uploads
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const headers = {}

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const formData = new FormData()
  formData.append("file", file)

  // Add any additional data to the form
  Object.keys(additionalData).forEach((key) => {
    formData.append(key, additionalData[key])
  })

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }

      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

export default {
  get,
  post,
  put,
  delete: del,
  uploadFile,
}
