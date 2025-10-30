"use client"

import { Mail, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
    const { user } = useAuth()

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 lg:left-64 z-30">
            <div className="flex items-center gap-4">
                {/* Spacer for mobile menu button */}
                <div className="w-10 lg:hidden"></div>
                <Mail className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-sm font-medium text-gray-700 truncate max-w-[150px] md:max-w-none">
                    {user?.fullName || "Admin"}
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
            </div>
        </header>
    )
}
