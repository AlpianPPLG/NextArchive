"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"

export function Header() {
    const { user, logout } = useAuth()

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between">
                {/* Left side - Title */}
                <div className="flex items-center gap-4">
                    <div className="ml-12 lg:ml-0">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                    </div>
                </div>

                {/* Right side - User info with dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-4 outline-none">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email || user?.username}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
