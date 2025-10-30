"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
    const sectionRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        // Parallax effect on background
        gsap.to(sectionRef.current, {
            backgroundPosition: "50% 100%",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        })

        // Content animation
        gsap.fromTo(contentRef.current,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top bottom-=100",
                    end: "bottom center",
                }
            }
        )
    }, [])

    return (
        <section ref={sectionRef} className="bg-primary/5 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <div ref={contentRef} className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 lg:p-16 text-primary-foreground text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Siap Memulai Digitalisasi Arsip?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Bergabung sekarang dan rasakan kemudahan mengelola arsip digital dengan sistem modern dan aman
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/register"
                            className="bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition"
                        >
                            Daftar Gratis
                        </Link>
                        <Link
                            href="/faq"
                            className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition border border-primary-foreground/20"
                        >
                            Pelajari Lebih Lanjut
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
