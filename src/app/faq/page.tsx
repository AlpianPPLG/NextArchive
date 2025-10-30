"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { FAQItem } from "@/components/faq/faq-item"
import { HelpCircle } from "lucide-react"

interface FAQ {
    id: number
    question: string
    answer: string
    sort_order: number
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await fetch("/api/faqs")
                if (response.ok) {
                    const data = await response.json()
                    setFaqs(data)
                }
            } catch (error) {
                console.error("Failed to fetch FAQs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFAQs()
    }, [])

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-green-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
                </div>

                {/* FAQ List */}
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Memuat FAQ...</div>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Tidak ada FAQ tersedia</div>
                ) : (
                    <div className="space-y-4 max-w-3xl">
                        {faqs.map((faq) => (
                            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
