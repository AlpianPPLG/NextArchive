"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navigation = [
    { name: "Beranda", href: "#" },
    { name: "Fitur", href: "#features" },
    { name: "FAQ", href: "#faq" },
    { name: "Tentang", href: "#about" },
    { name: "Kontak", href: "#contact" },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href)
        if (element) {
            const navHeight = 64 // Tinggi navbar
            const elementTop = element.getBoundingClientRect().top + window.scrollY
            const offsetPosition = elementTop - navHeight

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        setIsMobileMenuOpen(false)

        if (href === "#") {
            // Scroll to top untuk link Beranda
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        } else if (href.startsWith("#")) {
            scrollToSection(href)
        } else {
            // Untuk link ke halaman lain
            window.location.href = href
        }
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-200 ${
            isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, "#")}
                            className="text-xl font-bold text-primary"
                        >
                            NextArchive
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="text-foreground/80 hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Masuk
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:text-foreground focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Buka menu utama</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-background/80 backdrop-blur-md border-b">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground"
                        >
                            {item.name}
                        </a>
                    ))}
                    <Link
                        href="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground"
                    >
                        Masuk
                    </Link>
                </div>
            </div>
        </nav>
    )
}
