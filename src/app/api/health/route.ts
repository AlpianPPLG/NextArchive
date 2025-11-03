import { NextResponse } from 'next/server'
import { isDatabaseConnected } from '@/lib/db'

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        database: isDatabaseConnected() ? 'connected' : 'disconnected'
    })
}
