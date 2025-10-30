"use client"

import { useAuth } from "@/hooks/use-auth"

export function Header() {
    const { user } = useAuth()

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b z-30">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between">
                {/* Left side - Title */}
                <div className="flex items-center gap-4">
                    <div className="ml-12 lg:ml-0">
                        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                    </div>
                </div>

                {/* Right side - User info */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email || user?.username}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}
