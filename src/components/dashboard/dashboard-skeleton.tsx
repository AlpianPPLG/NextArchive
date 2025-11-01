"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </Card>
                    <Card className="p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </Card>
                    <Card className="p-6 lg:col-span-2">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </Card>
                </div>
            </div>
        </div>
    )
}

