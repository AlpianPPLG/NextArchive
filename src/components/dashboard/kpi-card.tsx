import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
    title: string
    value: number
    icon: LucideIcon
    color: "blue" | "red" | "green" | "yellow"
}

const colorClasses = {
    blue: "border-l-blue-500 bg-blue-50",
    red: "border-l-red-500 bg-red-50",
    green: "border-l-green-500 bg-green-50",
    yellow: "border-l-yellow-500 bg-yellow-50",
}

const iconColorClasses = {
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
}

export function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
    return (
        <Card className={`border-l-4 ${colorClasses[color]}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
                </div>
            </CardContent>
        </Card>
    )
}
