"use client"

import Link from 'next/link'
import { ArrowLeft, Home, FileSearch, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce shadow-lg">
              <FileSearch className="w-5 h-5 text-yellow-800 mt-1.5 ml-1.5" />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text mb-2">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Apa yang bisa Anda lakukan:
            </h3>
            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Periksa kembali URL yang Anda masukkan</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Kembali ke halaman sebelumnya</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Pergi ke halaman utama</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Link href="/">
              <Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Home className="w-4 h-4" />
                Ke Beranda
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Jika Anda yakin halaman ini seharusnya ada, silakan{' '}
              <Link href="/faq" className="text-orange-500 hover:text-orange-600 font-medium underline decoration-orange-500/30 hover:decoration-orange-500">
                hubungi administrator
              </Link>{' '}
              untuk bantuan lebih lanjut.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
