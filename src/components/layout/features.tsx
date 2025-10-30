"use client"

import { useEffect, useRef } from "react"
import { Archive, FileSearch, Lock, BarChart3, Globe, Zap } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

const features = [
    {
        icon: Archive,
        title: "Arsip Digital Terpadu",
        description: "Kelola surat masuk dan keluar dalam satu platform digital yang aman dan terorganisir"
    },
    {
        icon: FileSearch,
        title: "Pencarian Cepat",
        description: "Temukan dokumen dalam hitungan detik dengan fitur pencarian pintar dan filter canggih"
    },
    {
        icon: Lock,
        title: "Keamanan Terjamin",
        description: "Enkripsi end-to-end dan manajemen hak akses untuk melindungi data penting"
    },
    {
        icon: BarChart3,
        title: "Analitik & Laporan",
        description: "Dashboard interaktif dan laporan terperinci untuk pengambilan keputusan"
    },
    {
        icon: Globe,
        title: "Akses Dimana Saja",
        description: "Akses arsip dari perangkat apapun, kapanpun dan dimanapun"
    },
    {
        icon: Zap,
        title: "Proses Otomatis",
        description: "Workflow otomatis untuk disposisi dan notifikasi dokumen penting"
    }
]

export default function Features() {
    const featuresRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descriptionRef = useRef<HTMLParagraphElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    const setFeatureRef = (index: number) => (el: HTMLDivElement | null) => {
        if (cardsRef.current.length <= index) {
            cardsRef.current = Array(features.length).fill(null)
        }
        cardsRef.current[index] = el
    }

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: featuresRef.current,
                start: "top center+=100",
            }
        })

        // Animate title and description
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
        .fromTo(descriptionRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        )

        // Animate feature cards with stagger
        cardsRef.current.forEach((card, index) => {
            if (card) {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom-=100",
                        },
                        delay: index * 0.15
                    }
                )
            }
        })

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <section ref={featuresRef} className="py-20 bg-background" id="features">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 ref={titleRef} className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
                    <p ref={descriptionRef} className="text-muted-foreground max-w-2xl mx-auto">
                        Solusi lengkap untuk digitalisasi dan manajemen arsip modern yang memudahkan pekerjaan Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={setFeatureRef(index)}
                            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                        >
                            <feature.icon className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
