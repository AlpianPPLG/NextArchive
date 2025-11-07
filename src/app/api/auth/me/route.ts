import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"
import type { User as DBUser } from "@/lib/types"

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Tidak ada token" }, { status: 401 })
        }

        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json({ error: "Token tidak valid" }, { status: 401 })
        }

        // Fetch latest user data from database using id from token payload
        const results = await query("SELECT id, username, email, full_name, role FROM users WHERE id = ?", [payload.userId])
        const users = results as DBUser[]
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
        }

        const dbUser = users[0]

        const user = {
            userId: dbUser.id,
            username: dbUser.username,
            email: dbUser.email,
            fullName: dbUser.full_name,
            role: dbUser.role,
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error("Auth check error:", error)
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
    }
}
