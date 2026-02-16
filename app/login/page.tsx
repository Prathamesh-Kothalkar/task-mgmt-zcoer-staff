"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [empId, setEmpId] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        empId,
        password,
      })

      if (!res) {
        setError("Unexpected sign-in error")
        return
      }

      if (res.error) {
        setError(res.error || "Invalid Employee ID or password")
        return
      }

      // success
      router.push("/dashboard")
    } catch (err) {
      setError("Network error. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="mb-8 flex flex-col items-center text-center">
        <img src="/images/images.png" alt="Zeal Education Society" className="mb-4 h-24 w-24 object-contain" />
        <h1 className="text-2xl font-bold text-primary tracking-tight">Staff Portal</h1>
        <p className="text-sm text-muted-foreground">ZEAL EDUCATION SOCIETY, PUNE</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff-id">Staff ID / Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-3 text-muted-foreground" />
                <Input
                  id="staff-id"
                  name="empId"
                  placeholder="ZES-2024-001"
                  className="pl-10"
                  required
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="h-auto p-0 text-xs text-primary" type="button">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-3 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pl-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-3" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground">© 2026 Zeal Education Society. All rights reserved.</p>
    </div>
  )
}
