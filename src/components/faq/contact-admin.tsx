"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Phone, Clock } from "lucide-react"

export function ContactAdmin() {
    const handleEmailClick = () => {
        window.location.href = "mailto:admin@arsip.local?subject=Pertanyaan Mengenai Sistem E-Arsip"
    }

    return (
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Masih Ada Pertanyaan?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Apakah Anda ada pertanyaan lanjutan? Silahkan hubungi admin kami
                    </p>
                </div>

                {/* Contact Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Email Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-green-100 dark:border-green-800 hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">admin@arsip.local</p>
                            </div>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-green-100 dark:border-green-800 hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Telepon</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">+62 XXX-XXXX-XXXX</p>
                            </div>
                        </div>
                    </div>

                    {/* Working Hours Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-green-100 dark:border-green-800 hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Jam Kerja</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Senin - Jumat<br />08:00 - 16:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Button
                        onClick={handleEmailClick}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        Kirim Email ke Admin
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Kami akan merespons pertanyaan Anda dalam 1x24 jam
                    </p>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📧 Format Email Pertanyaan:</h4>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Subjek yang jelas</li>
                                <li>Detail pertanyaan atau masalah</li>
                                <li>Screenshot (jika diperlukan)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ Tips Mendapat Respons Cepat:</h4>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Jelaskan masalah dengan detail</li>
                                <li>Sertakan informasi akun Anda</li>
                                <li>Kirim saat jam kerja</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
