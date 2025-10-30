import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Mock data for now - replace with actual database queries
        const stats = {
            incomingTotal: 125,
            outgoingTotal: 89,
            archivedTotal: 234,
            pendingTotal: 15
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        )
    }
}
