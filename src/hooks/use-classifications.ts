import { useEffect, useState } from "react"

export interface Classification {
    id: number
    code: string
    description: string
    shelf_location?: string
}

// Shared cache for classifications
let classificationsCache: Classification[] | null = null
let cachePromise: Promise<Classification[]> | null = null

/**
 * Custom hook to fetch and cache classifications
 * Implements a singleton pattern to avoid multiple API calls across components
 */
export function useClassifications() {
    const [classifications, setClassifications] = useState<Classification[]>(classificationsCache || [])
    const [loading, setLoading] = useState(!classificationsCache)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        // If we already have cached data, use it
        if (classificationsCache) {
            setClassifications(classificationsCache)
            setLoading(false)
            return
        }

        // If there's already a fetch in progress, wait for it
        if (cachePromise) {
            cachePromise
                .then((data) => {
                    setClassifications(data)
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err)
                    setLoading(false)
                })
            return
        }

        // Start a new fetch
        const fetchClassifications = async () => {
            try {
                const response = await fetch("/api/classifications")
                if (!response.ok) {
                    throw new Error("Failed to fetch classifications")
                }
                const data = await response.json()
                classificationsCache = data
                setClassifications(data)
                return data
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error")
                setError(error)
                throw error
            } finally {
                setLoading(false)
                cachePromise = null
            }
        }

        cachePromise = fetchClassifications()
    }, [])

    return { classifications, loading, error }
}

/**
 * Clear the classifications cache (useful for refresh scenarios)
 */
export function clearClassificationsCache() {
    classificationsCache = null
    cachePromise = null
}
