import mysql, { RowDataPacket, Pool, PoolConnection, PoolOptions } from "mysql2/promise"

const poolConfig: PoolOptions = {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "e_arsip_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
}

const pool: Pool = mysql.createPool(poolConfig)

// Test database connection
let isConnected = false

async function testConnection(pool: Pool): Promise<boolean> {
    if (isConnected) return true

    try {
        const connection: PoolConnection = await pool.getConnection()
        console.log("✅ Database connected successfully")
        connection.release()
        isConnected = true
        return true
    } catch (error) {
        console.error("❌ Error connecting to database:", error)
        isConnected = false
        return false
    }
}

// Initialize connection test without process.exit
void testConnection(pool)

export type QueryValues = string | number | Buffer | null

export async function query<T extends RowDataPacket>(sql: string, values?: QueryValues[]): Promise<T[]> {
    // Ensure database is connected before executing query
    if (!isConnected) {
        await testConnection(pool)
    }

    const connection: PoolConnection = await pool.getConnection()
    try {
        const [results] = await connection.execute<T[]>(sql, values)
        return results
    } catch (error) {
        console.error('Database query error:', error)
        throw error
    } finally {
        connection.release()
    }
}

export const db = pool

// Export connection status checker
export const isDatabaseConnected = () => isConnected
