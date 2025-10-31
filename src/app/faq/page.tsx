"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { FAQItem } from "@/components/faq/faq-item"
import { ContactAdmin } from "@/components/faq/contact-admin"
import { HelpCircle, BookOpen, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

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
            <div className="space-y-8 max-w-5xl mx-auto">
                {/* Hero Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan umum seputar sistem E-Arsip Digital
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-900">{faqs.length}</p>
                                <p className="text-sm text-blue-700">Total FAQ</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-900">24/7</p>
                                <p className="text-sm text-green-700">Akses FAQ</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-900">1x24</p>
                                <p className="text-sm text-purple-700">Jam Respons</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Pertanyaan Umum</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
                            <p className="text-gray-500 mt-4">Memuat FAQ...</p>
                        </div>
                    ) : faqs.length === 0 ? (
                        <Card className="p-12 text-center">
                            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Tidak ada FAQ tersedia</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className="animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <FAQItem question={faq.question} answer={faq.answer} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Admin Section */}
                <div className="space-y-6 pt-8">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Butuh Bantuan Lebih Lanjut?</h2>
                    </div>

                    <ContactAdmin />
                </div>
            </div>
        </MainLayout>
    )
}
