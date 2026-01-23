"use client"

import { cn } from "@/lib/utils"
import { Suspense } from "react"
import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, UserIcon, ChevronRight, Loader2, CheckCircle2, Circle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const tasks = [
  {
    id: 1,
    title: "Finalize Departmental Budget",
    assignedBy: "Dr. S. Patil",
    dueDate: "Oct 20, 2026",
    priority: "High",
    status: "Pending",
    description: "Need to consolidate all lab requirements and guest lecture costs for the next semester.",
  },
  {
    id: 2,
    title: "Mentor Meeting - Batch B4",
    assignedBy: "Academic Coordinator",
    dueDate: "Oct 18, 2026",
    priority: "Medium",
    status: "In Progress",
    description: "Monthly progress review for the assigned mentee group. Focus on attendance and mid-term marks.",
  },
  {
    id: 3,
    title: "Upload Attendance on Portal",
    assignedBy: "Principal Office",
    dueDate: "Oct 15, 2026",
    priority: "High",
    status: "Completed",
    description: "Daily attendance upload for morning lectures (BE Computer Division A).",
  },
  {
    id: 4,
    title: "Research Paper Review",
    assignedBy: "R&D Cell",
    dueDate: "Oct 25, 2026",
    priority: "Low",
    status: "Pending",
    description: "Review the submitted draft for the internal conference.",
  },
  {
    id: 5,
    title: "Lab Equipment Audit",
    assignedBy: "Admin Dept",
    dueDate: "Oct 14, 2026",
    priority: "Medium",
    status: "In Progress",
    description: "Verify physical inventory against the department register.",
  },
]

function TasksContent() {
  const [selectedTask, setSelectedTask] = React.useState<(typeof tasks)[0] | null>(null)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleStatusUpdate = (status: string) => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
      if (selectedTask) {
        setSelectedTask({ ...selectedTask, status })
      }
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9 bg-white" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-10 px-4 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white border w-full justify-start overflow-x-auto h-auto p-1 mb-4">
          <TabsTrigger value="all" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            Pending
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="done" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            Completed
          </TabsTrigger>
        </TabsList>

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
              onClick={() => setSelectedTask(task)}
            >
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-1.5 self-stretch transition-colors",
                      task.status === "Completed"
                        ? "bg-green-500"
                        : task.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-muted",
                    )}
                  />
                  <div className="flex flex-1 items-center justify-between p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {task.status === "Completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : task.status === "In Progress" ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground ml-6">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" /> {task.assignedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden text-right sm:block">
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
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>

      {/* Task Detail Drawer */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedTask && (
            <div className="space-y-8 pb-8">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                    #{selectedTask.id}
                  </Badge>
                  <Badge variant={selectedTask.priority === "High" ? "destructive" : "secondary"} className="px-3 py-1">
                    {selectedTask.priority} Priority
                  </Badge>
                </div>
                <SheetTitle className="text-2xl font-bold leading-tight">{selectedTask.title}</SheetTitle>
                <SheetDescription className="text-sm leading-relaxed">{selectedTask.description}</SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-6 rounded-2xl bg-muted/50 p-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Assigned By</p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                      {selectedTask.assignedBy
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="text-sm font-semibold">{selectedTask.assignedBy}</p>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Deadline</p>
                  <p className="text-sm font-semibold pt-1 flex items-center justify-end gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {selectedTask.dueDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{selectedTask.status}</span>
                    <span className="text-muted-foreground">
                      {selectedTask.status === "Completed"
                        ? "100%"
                        : selectedTask.status === "In Progress"
                          ? "50%"
                          : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={selectedTask.status === "Completed" ? 100 : selectedTask.status === "In Progress" ? 50 : 0}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={selectedTask.status === "In Progress" ? "default" : "outline"}
                    className="gap-2 h-12 font-bold uppercase text-xs tracking-tight"
                    onClick={() => handleStatusUpdate("In Progress")}
                    disabled={isUpdating || selectedTask.status === "In Progress"}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Loader2 className="h-4 w-4" />}
                    Start Task
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 gap-2 h-12 font-bold uppercase text-xs tracking-tight"
                    onClick={() => handleStatusUpdate("Completed")}
                    disabled={isUpdating || selectedTask.status === "Completed"}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Complete
                  </Button>
                </div>
                <Button variant="secondary" className="w-full h-12 font-bold uppercase text-xs tracking-tight">
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function TasksPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={null}>
        <TasksContent />
      </Suspense>
    </DashboardLayout>
  )
}
