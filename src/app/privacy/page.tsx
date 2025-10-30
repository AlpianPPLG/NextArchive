"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Beranda
                </Link>

                <h1 className="text-4xl font-bold mb-8">Kebijakan Privasi</h1>

                <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground mb-6">
                        Terakhir diperbarui: 30 Oktober 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Informasi yang Kami Kumpulkan</h2>
                        <p className="text-muted-foreground mb-4">
                            Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Informasi akun (nama, email, password terenkripsi)</li>
                            <li>Data profil institusi atau organisasi</li>
                            <li>Informasi dokumen dan arsip yang Anda unggah</li>
                            <li>Log aktivitas penggunaan sistem</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Penggunaan Informasi</h2>
                        <p className="text-muted-foreground mb-4">
                            Kami menggunakan informasi yang dikumpulkan untuk:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Menyediakan dan memelihara layanan</li>
                            <li>Meningkatkan keamanan sistem</li>
                            <li>Menganalisis penggunaan layanan</li>
                            <li>Berkomunikasi dengan pengguna</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Keamanan Data</h2>
                        <p className="text-muted-foreground mb-4">
                            Kami menerapkan langkah-langkah keamanan berikut:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Enkripsi end-to-end untuk data sensitif</li>
                            <li>Pemantauan keamanan 24/7</li>
                            <li>Backup data reguler</li>
                            <li>Kontrol akses berbasis peran</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Berbagi Informasi</h2>
                        <p className="text-muted-foreground">
                            Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin Anda, kecuali jika diwajibkan oleh hukum.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Hak Pengguna</h2>
                        <p className="text-muted-foreground mb-4">
                            Anda memiliki hak untuk:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Mengakses data pribadi Anda</li>
                            <li>Memperbarui atau mengoreksi data</li>
                            <li>Meminta penghapusan data</li>
                            <li>Menolak pemrosesan data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Kontak</h2>
                        <p className="text-muted-foreground">
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:{" "}
                            <a href="mailto:privacy@nextarchive.com" className="text-primary hover:underline">
                                privacy@nextarchive.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
