"use client"

import { useState, useEffect } from "react"
import { categoryService } from "@/services/api"

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [trendingCategories, setTrendingCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const data = await categoryService.getAllCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err.message || "Failed to fetch categories")
      } finally {
        setLoading(false)
      }
    }

    async function fetchTrendingCategories() {
      try {
        const data = await categoryService.getTrendingCategories()
        setTrendingCategories(data)
      } catch (err) {
        console.error("Error fetching trending categories:", err)
      }
    }

    fetchCategories()
    fetchTrendingCategories()
  }, [])

  return { categories, trendingCategories, loading, error }
}
