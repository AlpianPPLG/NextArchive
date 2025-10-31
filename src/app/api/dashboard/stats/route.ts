import { NextResponse } from "next/server"
import { query } from "@/lib/db"

interface CountResult {
    count: number
}

export async function GET() {
    try {
        // Fetch incoming letters count (not archived)
        const incomingResult = await query(
            "SELECT COUNT(*) as count FROM incoming_letters WHERE is_archived = FALSE"
        ) as CountResult[]
        const incomingTotal = incomingResult[0]?.count || 0

        // Fetch outgoing letters count (not archived)
        const outgoingResult = await query(
            "SELECT COUNT(*) as count FROM outgoing_letters WHERE is_archived = FALSE"
        ) as CountResult[]
        const outgoingTotal = outgoingResult[0]?.count || 0

        // Fetch archived letters count (both incoming and outgoing)
        const archivedIncomingResult = await query(
            "SELECT COUNT(*) as count FROM incoming_letters WHERE is_archived = TRUE"
        ) as CountResult[]
        const archivedOutgoingResult = await query(
            "SELECT COUNT(*) as count FROM outgoing_letters WHERE is_archived = TRUE"
        ) as CountResult[]
        const archivedTotal = (archivedIncomingResult[0]?.count || 0) + (archivedOutgoingResult[0]?.count || 0)

        // Calculate pending (assuming pending = not archived letters)
        const pendingTotal = incomingTotal + outgoingTotal

        const stats = {
            incomingTotal,
            outgoingTotal,
            archivedTotal,
            pendingTotal
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
