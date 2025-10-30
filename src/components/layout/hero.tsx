"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"

export default function Hero() {
    const heroRef = useRef(null)
    const headingRef = useRef(null)
    const descriptionRef = useRef(null)
    const buttonsRef = useRef(null)
    const imageRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo(headingRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
        .fromTo(descriptionRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        )
        .fromTo(buttonsRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        )
        .fromTo(imageRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
            "-=0.6"
        )
    }, [])

    return (
        <section ref={heroRef} className="bg-gradient-to-r from-background/80 via-primary/60 to-accent/40 text-foreground">
            <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 ref={headingRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                            NextArchive — Arsip Digital Modern
                        </h1>
                        <p ref={descriptionRef} className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-xl">
                            Menyederhanakan pengelolaan surat masuk dan keluar, pencarian cepat,
                            serta enkripsi dan hak akses terpusat bagi lembaga dan organisasi.
                        </p>

                        <div ref={buttonsRef} className="flex flex-wrap gap-3">
                            <Link href="/register" className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-md shadow hover:opacity-95 transition">
                                Mulai Sekarang
                            </Link>
                            <Link href="/login" className="inline-block border border-border text-foreground px-5 py-2 rounded-md hover:bg-muted transition">
                                Masuk
                            </Link>
                        </div>
                    </div>

                    <div ref={imageRef} className="order-first lg:order-last">
                        <div className="w-full rounded-xl overflow-hidden shadow-lg ring-1 ring-border relative aspect-video">
                            <Image
                                alt="preview aplikasi"
                                src="/assets/image/preview.png"
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
