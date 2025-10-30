import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
    title: string
    value: number
    icon: LucideIcon
    description: string
    iconColor?: string
    trend?: string
    trendDirection?: "up" | "down"
}

export function KpiCard({
    title,
    value,
    icon: Icon,
    description,
    iconColor = "text-gray-500",
    trend,
    trendDirection
}: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{(value ?? 0).toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <span>{description}</span>
                    {trend && trendDirection && (
                        <div className={`flex items-center ${
                            trendDirection === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                            {trendDirection === "up" ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
