"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Bell, User, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
  { name: "Profile", href: "/profile", icon: User },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string
    role?: string
    email?: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const userName = user?.name || "Staff Member"
  const userRole = user?.role || "Employee"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-white lg:block">
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-10 flex items-center gap-3 px-2">
            <img src="/images/images.png" alt="Zeal Logo" className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-primary uppercase tracking-tight">
                Zeal Education
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Society Pune
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                {item.badge && pathname !== item.href && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-full flex-col px-4 py-6">
                  <div className="mb-8 flex items-center gap-3 px-2">
                    <img src="/images/images.png" alt="Zeal Logo" className="h-8 w-8 object-contain" />
                    <span className="font-bold text-primary">ZEAL</span>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-primary",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold lg:text-xl">
              {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right lg:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-[10px] text-muted-foreground">{userRole}</p>
            </div>
            <Avatar className="h-8 w-8 border-2 border-primary/10">
              <AvatarImage src="/user.png" alt={userName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t bg-white px-2 py-3 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className={cn("h-5 w-5", pathname === item.href && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.name}</span>
            {item.badge && pathname !== item.href && (
              <span className="absolute ml-4 mt-[-4px] flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}