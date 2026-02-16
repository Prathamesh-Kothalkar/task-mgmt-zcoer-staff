"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Building2, ShieldCheck, LogOut, ChevronRight, Settings, Phone, Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"

interface StaffData {
  name: string
  empId: string
  email: string
  phone?: string | null
  staffType: string[]
  departmentName: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = React.useState<StaffData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/staff/me")

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          setProfile(result.data)
        } else {
          throw new Error(result.error || "Failed to fetch profile")
        }
      } catch (error: any) {
        console.error("Failed to fetch profile:", error)
        setError(error?.message || "Failed to load profile details.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">{error || "Failed to load profile details."}</p>
        </div>
      </DashboardLayout>
    )
  }

  // Get initials for Avatar Fallback
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-white shadow-2xl">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-5 translate-y-5 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex flex-col items-center">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl mb-4">
              <AvatarImage src="/avatar-placeholder.png" alt={profile.name} />
              <AvatarFallback className="text-primary text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
            <p className="text-white/80 font-medium">
              {profile.staffType.join(" & ")} Profile
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Employee ID: {profile.empId}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Official Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 py-1 border-b border-muted last:border-0">
                <Mail className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-1 border-b border-muted last:border-0">
                <Building2 className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{profile.departmentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-1 border-b border-muted last:border-0">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{profile.phone || "Not Updated"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App & Settings */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                App & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <button className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors border-b">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">App Preferences</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </button>
                <button className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors border-b">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Privacy & Security</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </button>
                <div className="px-6 py-4 mt-2">
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-3 h-12 font-bold uppercase text-xs tracking-tight"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-1 opacity-40 select-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">ZES Staff Portal v2.0.4</p>
          <p className="text-[8px] uppercase tracking-widest">Designed for Zeal Education Society Pune</p>
        </div>
      </div>
    </DashboardLayout>
  )
}