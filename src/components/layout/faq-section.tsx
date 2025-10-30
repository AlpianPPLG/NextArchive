"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
    {
        question: "Apa itu NextArchive?",
        answer: "NextArchive adalah sistem arsip digital modern yang memudahkan pengelolaan surat masuk dan keluar, dengan fitur pencarian cepat, enkripsi data, dan manajemen hak akses yang aman untuk institusi dan organisasi."
    },
    {
        question: "Bagaimana cara memulai menggunakan NextArchive?",
        answer: "Anda dapat memulai dengan mendaftar akun gratis, kemudian ikuti panduan setup singkat untuk mengatur sistem sesuai kebutuhan organisasi Anda."
    },
    {
        question: "Apakah data kami aman?",
        answer: "Ya, NextArchive menggunakan enkripsi end-to-end dan mematuhi standar keamanan industri untuk melindungi data Anda. Setiap pengguna memiliki hak akses yang dapat dikustomisasi."
    },
    {
        question: "Apakah bisa diakses dari perangkat mobile?",
        answer: "Ya, NextArchive dapat diakses dari berbagai perangkat termasuk desktop, tablet, dan smartphone melalui web browser modern."
    }
]

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const faqRefs = useRef<(HTMLDivElement | null)[]>([])

    const setFaqRef = (index: number) => (el: HTMLDivElement | null) => {
        if (faqRefs.current.length <= index) {
            faqRefs.current = Array(faqs.length).fill(null)
        }
        faqRefs.current[index] = el
    }

    useEffect(() => {
        // Animate section title and description
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top center+=100",
            }
        })

        tl.fromTo(titleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
        .fromTo(descRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        )

        // Animate FAQ items
        faqRefs.current.forEach((faq, index) => {
            if (faq) {
                gsap.fromTo(faq,
                    {
                        opacity: 0,
                        x: -30
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: faq,
                            start: "top bottom-=50",
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

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section ref={sectionRef} className="py-20 bg-muted/30" id="faq">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 ref={titleRef} className="text-3xl font-bold mb-4">Pertanyaan Umum</h2>
                    <p ref={descRef} className="text-muted-foreground max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan yang sering diajukan tentang NextArchive
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            ref={setFaqRef(index)}
                            className="bg-card rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 flex justify-between items-start gap-4 text-left"
                            >
                                <div>
                                    <h3 className="font-semibold">{faq.question}</h3>
                                    <div
                                        className={`mt-2 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out ${
                                            openIndex === index ? "max-h-48" : "max-h-0"
                                        }`}
                                    >
                                        {faq.answer}
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? "transform rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
