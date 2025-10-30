"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, BarChart3, HelpCircle, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Mail },
    { href: "/surat-masuk", label: "Surat Masuk", icon: Mail },
    { href: "/surat-keluar", label: "Surat Keluar", icon: Mail },
    { href: "/laporan-masuk", label: "Laporan Surat Masuk", icon: BarChart3 },
    { href: "/laporan-keluar", label: "Laporan Surat Keluar", icon: BarChart3 },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
]

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <div className="bg-green-600 text-white flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-green-700">
                <div className="flex items-center gap-3">
                    <Mail className="w-8 h-8" />
                    <div>
                        <h1 className="font-bold text-lg">Surat Masuk dan</h1>
                        <h1 className="font-bold text-lg">Surat Keluar</h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href} onClick={onItemClick}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 text-white hover:bg-green-700",
                                    isActive && "bg-green-700"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-left">{item.label}</span>
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-green-700">
                <Button onClick={logout} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                </Button>
            </div>
        </div>
    )
}

export function Sidebar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white hover:bg-green-700"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SidebarContent onItemClick={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-green-600 text-white flex-col h-screen fixed left-0 top-0 z-40">
                <SidebarContent />
            </aside>
        </>
    )
}
