"use client"

import Hero from "@/components/layout/hero"
import Features from "@/components/layout/features"
import FaqSection from "@/components/layout/faq-section"
import AboutContact from "@/components/layout/about-contact"
import CTA from "@/components/layout/cta"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    if (loading || user) return null

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="pt-16"> {/* Added padding-top to account for fixed navbar */}
                <Hero />
                <Features />
                <FaqSection />
                <AboutContact />
                <CTA />
                <Footer />
            </div>
        </main>
    )
}
