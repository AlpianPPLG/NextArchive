"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Terms() {
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

                <h1 className="text-4xl font-bold mb-8">Syarat & Ketentuan</h1>

                <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground mb-6">
                        Terakhir diperbarui: 30 Oktober 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Penerimaan Syarat</h2>
                        <p className="text-muted-foreground">
                            Dengan mengakses dan menggunakan layanan NextArchive, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian apapun dari syarat ini, Anda tidak dapat menggunakan layanan kami.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Penggunaan Layanan</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Anda harus berusia minimal 18 tahun atau usia legal di wilayah Anda</li>
                            <li>Anda bertanggung jawab atas keamanan kredensial akun Anda</li>
                            <li>Anda setuju untuk tidak menyalahgunakan layanan untuk tujuan ilegal</li>
                            <li>Anda tidak akan mencoba mengakses layanan melalui cara yang tidak sah</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Hak Kekayaan Intelektual</h2>
                        <p className="text-muted-foreground mb-4">
                            NextArchive dan seluruh konten terkait dilindungi oleh hak cipta, merek dagang, dan hak kekayaan intelektual lainnya. Anda tidak diperkenankan untuk:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Menyalin atau memodifikasi platform</li>
                            <li>Menggunakan konten untuk tujuan komersial tanpa izin</li>
                            <li>Mendistribusikan ulang materi dari platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Batasan Tanggung Jawab</h2>
                        <p className="text-muted-foreground">
                            NextArchive menyediakan layanan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Pembayaran dan Berlangganan</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Harga dan paket dapat berubah dengan pemberitahuan</li>
                            <li>Pembayaran diproses melalui penyedia pembayaran resmi</li>
                            <li>Pengembalian dana sesuai dengan kebijakan yang berlaku</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Penghentian Layanan</h2>
                        <p className="text-muted-foreground">
                            Kami berhak untuk menghentikan atau menangguhkan akses ke layanan, dengan atau tanpa pemberitahuan, untuk pengguna yang melanggar syarat dan ketentuan ini.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Perubahan Ketentuan</h2>
                        <p className="text-muted-foreground">
                            Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan efektif setelah diposting di platform. Penggunaan berkelanjutan atas layanan merupakan persetujuan atas perubahan tersebut.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Kontak</h2>
                        <p className="text-muted-foreground">
                            Untuk pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi:{" "}
                            <a href="mailto:legal@nextarchive.com" className="text-primary hover:underline">
                                legal@nextarchive.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
