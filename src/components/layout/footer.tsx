"use client"

import Link from "next/link"

const footerLinks = {
    product: [
        { name: "Fitur", href: "#features" },
        { name: "FAQ", href: "/faq" },
    ],
    company: [
        { name: "Tentang Kami", href: "#about" },
        { name: "Kontak", href: "#contact" },
    ],
    legal: [
        { name: "Kebijakan Privasi", href: "/privacy" },
        { name: "Syarat & Ketentuan", href: "/terms" },
    ]
}

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            NextArchive
                        </Link>
                        <p className="mt-4 text-muted-foreground max-w-xs">
                            Solusi arsip digital modern untuk institusi dan organisasi Indonesia
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Produk</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Perusahaan</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © Copyright 2025. All Rights Reserved.
                        </p>
                        <ul className="flex gap-6">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
