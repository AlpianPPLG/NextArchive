"use client"

import { useState, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, logout, refresh, updateUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    username: user?.username || "",
  })

  // Keep form in sync when user data changes (e.g., after refresh)
  useLayoutEffect(() => {
    // Only sync when not actively editing to avoid overwriting user's in-progress edits
    if (isEditing) return

    const newForm = {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => {
      if (
        prev.fullName === newForm.fullName &&
        prev.email === newForm.email &&
        prev.username === newForm.username
      ) {
        return prev
      }
      return newForm
    })
  }, [user, isEditing])

  const handleSave = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // Ensure browser sends httpOnly auth cookie
        credentials: "include",
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          username: formData.username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to update profile")
        return
      }

      toast.success("Profile updated successfully")
      setIsEditing(false)
      // Optimistically update global user state so header updates immediately
      try {
        updateUser({ fullName: formData.fullName, email: formData.email, username: formData.username })
      } catch (err) {
        console.error("Failed to update local user state:", err)
      }

      // Then refresh from server to ensure data is in sync with DB
      try {
        await refresh()
      } catch (err) {
        console.error("Failed to refresh user after profile update:", err)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update profile")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "DELETE",
        // Ensure browser sends httpOnly auth cookie
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to delete account")
        return
      }

      toast.success("Account deleted successfully")
      logout()
      router.push("/")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete account")
    }
  }

  const content = (
    <div className="container max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSave}>Save Changes</Button>
          )}
        </div>
      </Card>

      <Card className="p-6 mt-8 border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}
