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
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
    }
}
