import mysql from "mysql2/promise"

const pool = mysql.createPool({
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
})

// Test database connection on startup
pool.getConnection()
    .then(connection => {
        console.log("✅ Database connected successfully")
        connection.release()
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message)
        console.error("Please check your database configuration:")
        console.error(`- Host: ${process.env.DB_HOST || "localhost"}`)
        console.error(`- Port: ${process.env.DB_PORT || "3306"}`)
        console.error(`- Database: ${process.env.DB_NAME || "e_arsip_db"}`)
        console.error(`- User: ${process.env.DB_USER || "root"}`)
    })

export async function query(sql: string, values?: any[]) {
    const connection = await pool.getConnection()
    try {
        const [results] = await connection.execute(sql, values)
        return results
    } finally {
        connection.release()
    }
}

export async function getConnection() {
    return pool.getConnection()
}