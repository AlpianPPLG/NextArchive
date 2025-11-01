"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
    rows?: number
    columns?: number
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="bg-green-600 hover:bg-green-600">
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i} className="text-white">
                                    <Skeleton className="h-4 w-20 bg-green-500" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

