import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const stats = [
  { title: "Total Tasks", value: "24", icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
  { title: "Pending", value: "8", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  { title: "In Progress", value: "4", icon: Loader2, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Completed", value: "12", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
]

const recentTasks = [
  {
    title: "Prepare Mid-Term Result Analysis",
    assignedBy: "Dr. S. Patil (HOD)",
    dueDate: "Oct 15, 2026",
    priority: "High",
    status: "In Progress",
  },
  {
    title: "Academic Calendar Update",
    assignedBy: "Registrar",
    dueDate: "Oct 12, 2026",
    priority: "Medium",
    status: "Pending",
  },
  {
    title: "Lab Maintenance Report",
    assignedBy: "Dr. S. Patil (HOD)",
    dueDate: "Oct 10, 2026",
    priority: "Low",
    status: "Completed",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Good Morning, Rajesh</h2>
          <p className="text-sm text-muted-foreground">Here's your task summary for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
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
          {/* Progress Card */}
          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Productivity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-6 flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 * (1 - 0.75)}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold">75%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Complete</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks this week</span>
                  <span className="font-medium">18 / 24</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="lg:col-span-4 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Urgent Tasks</CardTitle>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                View All
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center justify-between rounded-xl border p-3 hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{task.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Due {task.dueDate}
                      </span>
                      <span>•</span>
                      <span>{task.assignedBy}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <Badge
                      variant={
                        task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"
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
                            : "text-muted-foreground",
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-red-200 bg-red-50/50 p-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-destructive">2 Overdue Tasks</p>
                  <p className="text-[10px] text-red-700/70 italic">Please complete these by EOD today.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
