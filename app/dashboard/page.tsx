"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const [staff, setStaff] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const {data: session} = useSession();

  if (!session) {
    return <>
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-600" />  
        <p className="ml-4 text-red-600 font-semibold">Unauthorized. Please log in.</p>
      </div>
    </DashboardLayout>
    </>
  } 

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [meRes, dashRes] = await Promise.all([
          fetch("/api/staff/me"),
          fetch("/api/staff/dashboard")
        ])

        const meData = await meRes.json()
        const dashData = await dashRes.json()

        if (meRes.ok) setStaff(meData.staff)
        if (dashRes.ok) {
          setStats(dashData.stats)
          setTasks(dashData.recentTasks)
        }
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
    <DashboardLayout user={{ name: staff?.name, role: staff?.role, email: staff?.email }}>
      <div className="space-y-6">
        {/* Header and rest of content */}
      </div>
    </DashboardLayout>
    )
  }

  const statsUI = [
    { title: "Total Tasks", value: stats?.total ?? 0, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
    { title: "Pending", value: stats?.pending ?? 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "In Progress", value: stats?.inProgress ?? 0, icon: Loader2, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Completed", value: stats?.completed ?? 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  ]

  const completionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Hello, {session.user?.name} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's your task summary for today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsUI.map((stat) => (
            <Card key={stat.title} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={stat.bg + " p-2.5 rounded-lg transition-colors group-hover:scale-110 duration-200"}>
                    <stat.icon className={stat.color + " h-5 w-5"} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-7">

          {/* Productivity */}
          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Productivity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-6 flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/30" />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 * (1 - completionRate / 100)}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold">{completionRate}%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Complete</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks completed</span>
                  <span className="font-medium">{stats?.completed} / {stats?.total}</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="lg:col-span-4 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Urgent Tasks</CardTitle>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                View All
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between rounded-xl border p-3 hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{task.assignedBy}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <Badge
                      variant={
                        task.priority === "High"
                          ? "destructive"
                          : task.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-[9px] h-4 px-1.5 uppercase font-bold"
                    >
                      {task.priority}
                    </Badge>

                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-tight",
                        task.status === "Completed"
                          ? "text-green-600"
                          : task.status === "In Progress"
                            ? "text-blue-600"
                            : "text-muted-foreground"
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">
                  No tasks assigned 🎉
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}