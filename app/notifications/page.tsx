import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Info, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    type: "assignment",
    title: "New Task Assigned",
    message: 'HOD assigned "Departmental Audit Report" to you.',
    time: "2 mins ago",
    unread: true,
    icon: Bell,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 2,
    type: "deadline",
    title: "Deadline Approaching",
    message: "Upload Attendance task is due in 2 hours.",
    time: "1 hour ago",
    unread: true,
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    id: 3,
    type: "update",
    title: "Status Updated",
    message: "Your Mentee Meeting record has been approved.",
    time: "4 hours ago",
    unread: false,
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    id: 4,
    type: "info",
    title: "System Maintenance",
    message: "The portal will be down for maintenance at 11:00 PM.",
    time: "1 day ago",
    unread: false,
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
]

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Recent Updates</h2>
          <button className="text-[11px] font-bold uppercase text-primary tracking-widest hover:underline">
            Mark all as read
          </button>
        </div>

        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              "border-none shadow-sm cursor-pointer transition-all hover:translate-x-1",
              notif.unread ? "bg-white ring-1 ring-primary/10" : "bg-white/60 opacity-80",
            )}
          >
            <CardContent className="p-4 flex gap-4">
              <div className={cn("p-2 rounded-xl h-fit", notif.bg)}>
                <notif.icon className={cn("h-4 w-4", notif.color)} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-sm font-bold", notif.unread ? "text-foreground" : "text-muted-foreground")}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-medium">{notif.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pr-4">{notif.message}</p>
              </div>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="pt-10 flex flex-col items-center justify-center opacity-30 select-none">
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground mb-4 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest">End of Notifications</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
