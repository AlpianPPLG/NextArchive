"use client"

import { useEffect, useRef, RefObject } from "react"
import { Building2, Users, Shield, Mail, MapPin, Phone } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

const contactCards = [
    {
        icon: Mail,
        title: "Email",
        content: "Nova07pplg@gmail.com"
    },
    {
        icon: MapPin,
        title: "Alamat",
        content: "Jl. Pelita 2 No. 31\nSamarinda, Indonesia"
    },
    {
        icon: Phone,
        title: "Telepon",
        content: "+62 812-5844-194"
    }
]

export default function AboutContact() {
    const aboutRef = useRef<HTMLElement>(null)
    const aboutContentRef = useRef<HTMLDivElement>(null)
    const aboutImageRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLElement>(null)
    const contactTitleRef = useRef<HTMLDivElement>(null)
    const contactCardsRef = useRef<(HTMLDivElement | null)[]>([])

    const setContactCardRef = (index: number) => (el: HTMLDivElement | null) => {
        contactCardsRef.current[index] = el
    }

    useEffect(() => {
        // About section animations
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "top center+=100",
            }
        })

        aboutTl
            .fromTo(aboutContentRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
            )
            .fromTo(aboutImageRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                "-=0.8"
            )

        // Contact section animations
        gsap.fromTo(contactTitleRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contactRef.current,
                    start: "top center+=100",
                }
            }
        )

        // Contact cards stagger animation
        contactCardsRef.current.forEach((card, index) => {
            if (card) {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom-=50",
                        },
                        delay: index * 0.2
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
        <>
            {/* About Section */}
            <section ref={aboutRef} className="py-20 bg-background" id="about">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div ref={aboutContentRef}>
                            <h2 className="text-3xl font-bold mb-4">Tentang NextArchive</h2>
                            <p className="text-muted-foreground mb-6">
                                NextArchive adalah solusi arsip digital modern yang dikembangkan untuk memenuhi kebutuhan institusi dan organisasi di Indonesia dalam mengelola dokumen secara efisien dan aman.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Building2 className="w-6 h-6 text-primary shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Berpengalaman</h3>
                                        <p className="text-muted-foreground">Melayani berbagai institusi dan organisasi di Indonesia</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Users className="w-6 h-6 text-primary shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Tim Profesional</h3>
                                        <p className="text-muted-foreground">Didukung oleh tim yang berpengalaman dalam pengembangan sistem</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Shield className="w-6 h-6 text-primary shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Keamanan Terjamin</h3>
                                        <p className="text-muted-foreground">Mengutamakan keamanan dan privasi data pelanggan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={aboutImageRef} className="relative aspect-video rounded-xl overflow-hidden">
                            <img
                                src="/assets/image/preview.png"
                                alt="Tim NextArchive"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section ref={contactRef} className="py-20 bg-muted/30" id="contact">
                <div className="max-w-6xl mx-auto px-6">
                    <div ref={contactTitleRef} className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Punya pertanyaan? Tim kami siap membantu Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {contactCards.map((item, index) => (
                            <div
                                key={index}
                                ref={setContactCardRef(index)}
                                className="flex flex-col items-center text-center p-6 rounded-lg bg-card"
                            >
                                <item.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground whitespace-pre-line">{item.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="mailto:info@nextarchive.com"
                            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            Kirim Email
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
