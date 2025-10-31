import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { query } from "./db"
import type { User } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthPayload {
    userId: string
    username: string
    email: string
    fullName: string
    role: string
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): AuthPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthPayload
    } catch {
        return null
    }
}

export async function authenticateUser(username: string, password: string) {
    const results = await query("SELECT * FROM users WHERE username = ?", [username])
    const users = results as (User & { password_hash: string })[]

    if (users.length === 0) {
        return null
    }

    const user = users[0]
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
        return null
    }

    const payload: AuthPayload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
    }

    return {
        token: generateToken(payload),
        user: payload,
    }
}
