import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const pathname = request.nextUrl.pathname

    // Public routes
    const publicRoutes = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"]
    const isPublicRoute = publicRoutes.includes(pathname)

    // Protected routes
    const protectedRoutes = ["/dashboard", "/surat-masuk", "/surat-keluar", "/laporan-masuk", "/laporan-keluar", "/faq"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // If accessing protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // If accessing protected route with invalid token, redirect to login
    if (isProtectedRoute && token && !verifyToken(token)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // If accessing login with valid token, redirect to dashboard
    if (pathname === "/login" && token && verifyToken(token)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
