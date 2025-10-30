import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { query } from "@/lib/db"
import { generateUUID } from "@/lib/utils/uuid"

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, fullName } = await request.json()

        // Validasi input
        if (!username || !password || !fullName) {
            return NextResponse.json(
                { error: "Username, password, dan nama lengkap harus diisi" },
                { status: 400 }
            )
        }

        // Validasi panjang password
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password minimal 6 karakter" },
                { status: 400 }
            )
        }

        // Cek apakah username sudah ada
        const existingUsers = await query("SELECT id FROM users WHERE username = ?", [username])
        if ((existingUsers as any[]).length > 0) {
            return NextResponse.json(
                { error: "Username sudah digunakan" },
                { status: 409 }
            )
        }

        // Cek apakah email sudah ada (jika email diberikan)
        if (email) {
            const existingEmails = await query("SELECT id FROM users WHERE email = ?", [email])
            if ((existingEmails as any[]).length > 0) {
                return NextResponse.json(
                    { error: "Email sudah digunakan" },
                    { status: 409 }
                )
            }
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Generate UUID untuk user ID
        const userId = generateUUID()

        // Insert user baru
        await query(
            `INSERT INTO users (id, username, email, password_hash, full_name, role) 
             VALUES (?, ?, ?, ?, ?, 'ADMIN')`,
            [userId, username, email || null, passwordHash, fullName]
        )

        return NextResponse.json(
            {
                success: true,
                message: "Registrasi berhasil. Silakan login dengan akun Anda.",
                userId
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Register error:", error)
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server" },
            { status: 500 }
        )
    }
}

