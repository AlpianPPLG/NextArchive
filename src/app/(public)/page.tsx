"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, FileText, BarChart3, Shield, ArrowRight, CheckCircle } from "lucide-react"

export default function LandingPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">e-Arsip Digital</h1>
                            <p className="text-xs text-gray-600">Sistem Manajemen Surat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#features">
                            <Button variant="ghost">Fitur</Button>
                        </Link>
                        <Link href="#about">
                            <Button variant="ghost">Tentang</Button>
                        </Link>
                        <Link href="#contact">
                            <Button variant="ghost">Kontak</Button>
                        </Link>
                        <Link href="/login">
                            <Button className="bg-green-600 hover:bg-green-700">Login</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Sistem Manajemen Arsip Digital</h2>
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Kelola surat masuk dan keluar dengan efisien, profesional, dan terorganisir. Tingkatkan produktivitas
                        administrasi Anda dengan teknologi modern.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                                Mulai Sekarang
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 bg-transparent">
                                Pelajari Lebih Lanjut
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Fitur Utama</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <Mail className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Manajemen Surat Masuk</h4>
                            <p className="text-gray-600">
                                Catat, klasifikasi, dan arsipkan semua surat masuk dengan mudah. Sistem otomatis membantu Anda melacak
                                setiap dokumen.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <FileText className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Manajemen Surat Keluar</h4>
                            <p className="text-gray-600">
                                Kelola surat keluar dengan sistem yang terstruktur. Simpan tembusan dan dokumentasi lengkap untuk
                                referensi masa depan.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Laporan & Analitik</h4>
                            <p className="text-gray-600">
                                Buat laporan komprehensif dengan filter berdasarkan klasifikasi. Dapatkan insight tentang volume dan
                                jenis surat.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <Shield className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Keamanan Data</h4>
                            <p className="text-gray-600">
                                Sistem autentikasi yang aman dengan enkripsi password. Akses terbatas hanya untuk admin yang berwenang.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <FileText className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Klasifikasi Dokumen</h4>
                            <p className="text-gray-600">
                                Organisir dokumen dengan sistem klasifikasi yang fleksibel. Mudah menemukan dokumen berdasarkan
                                kategori.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                            <Mail className="w-12 h-12 text-green-600 mb-4" />
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Dashboard Intuitif</h4>
                            <p className="text-gray-600">
                                Antarmuka yang user-friendly dengan dashboard yang menampilkan ringkasan data real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Tentang Sistem</h3>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h4 className="text-2xl font-bold mb-4 text-gray-900">Solusi Manajemen Arsip Modern</h4>
                            <p className="text-gray-600 mb-4">
                                e-Arsip Digital adalah sistem informasi yang dirancang khusus untuk mengelola seluruh siklus hidup surat
                                masuk dan surat keluar dalam sebuah organisasi.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Dengan fokus pada efisiensi dan pencatatan yang detail, sistem ini memungkinkan administrator untuk
                                mengklasifikasi, mengarsipkan, dan membuat laporan yang akurat tentang semua dokumen resmi.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">Antarmuka yang modern dan profesional</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">Sistem keamanan berlapis dengan autentikasi JWT</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">Database yang terstruktur dan efisien</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">Laporan dan analitik yang komprehensif</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-green-50 p-12 rounded-lg">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-2">Teknologi</h5>
                                    <p className="text-sm text-gray-600">Next.js, React, TypeScript, MySQL, ShadCN UI</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-2">Keamanan</h5>
                                    <p className="text-sm text-gray-600">JWT Authentication, Bcrypt Password Hashing, HTTPS Ready</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-2">Skalabilitas</h5>
                                    <p className="text-sm text-gray-600">Dibangun untuk pertumbuhan dengan arsitektur yang modular</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-4xl font-bold mb-8 text-gray-900">Hubungi Kami</h3>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Memiliki pertanyaan atau membutuhkan bantuan? Tim kami siap membantu Anda.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
                            <h4 className="font-bold text-gray-900 mb-2">Email</h4>
                            <p className="text-gray-600">admin@arsip.local</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <FileText className="w-8 h-8 text-green-600 mx-auto mb-4" />
                            <h4 className="font-bold text-gray-900 mb-2">Telepon</h4>
                            <p className="text-gray-600">(021) 1234-5678</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <Shield className="w-8 h-8 text-green-600 mx-auto mb-4" />
                            <h4 className="font-bold text-gray-900 mb-2">Lokasi</h4>
                            <p className="text-gray-600">Jakarta, Indonesia</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400">© Copyright 2025. All Right Reserved</p>
                </div>
            </footer>
        </div>
    )
}
