import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import * as auth from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    const user = await auth.getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, email, username } = body

    // Update user in database
    await query(
      "UPDATE users SET full_name = ?, email = ?, username = ? WHERE id = ?",
      [full_name, email, username, user.id]
    )

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const user = await auth.getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete user from database
    await query("DELETE FROM users WHERE id = ?", [user.id])

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
