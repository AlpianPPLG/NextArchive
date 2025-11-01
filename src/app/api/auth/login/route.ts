import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 })
        }

        const result = await authenticateUser(username, password)

        if (!result) {
            return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
        }

        const response = NextResponse.json({ success: true, user: result.user }, { status: 200 })

        response.cookies.set("auth_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 86400, // 24 hours
        })

        return response
    } catch (error: any) {
        console.error("Login error:", error)

        // Provide more specific error messages
        if (error.code === 'ETIMEDOUT') {
            return NextResponse.json({
                error: "Tidak dapat terhubung ke database. Pastikan MySQL server berjalan dan konfigurasi database benar."
            }, { status: 500 })
        }

        if (error.code === 'ECONNREFUSED') {
            return NextResponse.json({
                error: "Koneksi database ditolak. Periksa apakah MySQL server aktif."
            }, { status: 500 })
        }

        return NextResponse.json({
            error: "Terjadi kesalahan pada server",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
    }
}
