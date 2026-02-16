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

function TasksContent() {
  const [selectedTask, setSelectedTask] = React.useState<any | null>(null)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [tasks, setTasks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/tasks")
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Failed" }))
          throw new Error(err?.error || `HTTP ${res.status}`)
        }
        const data = await res.json()
        if (mounted) {
          setTasks(Array.isArray(data.tasks) ? data.tasks : [])
        }
      } catch (err: any) {
        console.error("Failed to load tasks:", err)
        if (mounted) setError(err?.message || "Failed to load tasks")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleStatusUpdate = async (status: string) => {
    if (!selectedTask) return
    setIsUpdating(true)
    setError(null)

    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err?.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      if (data?.success && data.task) {
        setSelectedTask(data.task)
        setTasks((prev) => prev.map((t) => (t.id === data.task.id ? data.task : t)))
      } else {
        throw new Error(data?.error || "Failed to update task")
      }
    } catch (err: any) {
      console.error("Failed to update task status:", err)
      setError(err?.message || "Failed to update task")
    } finally {
      setIsUpdating(false)
    }
  }

  // Filter tasks based on tab and search
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks

    // Filter by status
    if (activeTab === "pending") {
      filtered = filtered.filter((t) => t.status === "PENDING" || t.status === "Pending")
    } else if (activeTab === "active") {
      filtered = filtered.filter((t) => t.status === "IN_PROGRESS" || t.status === "In Progress")
    } else if (activeTab === "done") {
      filtered = filtered.filter((t) => t.status === "COMPLETED" || t.status === "Completed")
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [tasks, activeTab, searchQuery])

  if (loading) {
    return (
      <div className="h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[40vh] flex items-center justify-center text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-10 px-4 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border w-full justify-start overflow-x-auto h-auto p-1 mb-4">
          <TabsTrigger value="all" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            All Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            Pending ({tasks.filter((t) => t.status === "PENDING" || t.status === "Pending").length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            In Progress ({tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "In Progress").length})
          </TabsTrigger>
          <TabsTrigger value="done" className="text-xs uppercase font-bold tracking-tight px-6 py-2">
            Completed ({tasks.filter((t) => t.status === "COMPLETED" || t.status === "Completed").length})
          </TabsTrigger>
        </TabsList>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
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
                        task.status === "COMPLETED" || task.status === "Completed"
                          ? "bg-green-500"
                          : task.status === "IN_PROGRESS" || task.status === "In Progress"
                            ? "bg-blue-500"
                            : "bg-muted",
                      )}
                    />
                    <div className="flex flex-1 items-center justify-between p-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          {task.status === "COMPLETED" || task.status === "Completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : task.status === "IN_PROGRESS" || task.status === "In Progress" ? (
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
                            <Clock className="h-3 w-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                          <Badge
                            variant={
                              task.priority === "HIGH" || task.priority === "High"
                                ? "destructive"
                                : task.priority === "MEDIUM" || task.priority === "Medium"
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
            ))
          )}
        </div>
      </Tabs>

      {/* Task Detail Drawer */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-3">
          {selectedTask && (
            <div className="space-y-8 pb-8">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                    #{selectedTask.id}
                  </Badge>
                  <Badge variant={selectedTask.priority === "HIGH" || selectedTask.priority === "High" ? "destructive" : "secondary"} className="px-3 py-1">
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
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <p className="text-sm font-semibold">{selectedTask.assignedBy}</p>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Deadline</p>
                  <p className="text-sm font-semibold pt-1 flex items-center justify-end gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{selectedTask.status}</span>
                    <span className="text-muted-foreground">
                      {selectedTask.status === "COMPLETED" || selectedTask.status === "Completed"
                        ? "100%"
                        : selectedTask.status === "IN_PROGRESS" || selectedTask.status === "In Progress"
                          ? "50%"
                          : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={selectedTask.status === "COMPLETED" || selectedTask.status === "Completed" ? 100 : selectedTask.status === "IN_PROGRESS" || selectedTask.status === "In Progress" ? 50 : 0}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedTask.status === "IN_PROGRESS" || selectedTask.status === "In Progress" ? "default" : "outline"}
                  className="gap-2 h-12 font-bold uppercase text-xs tracking-tight"
                  onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  disabled={isUpdating || selectedTask.status === "IN_PROGRESS" || selectedTask.status === "In Progress" || selectedTask.status === "COMPLETED" || selectedTask.status === "Completed"}
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Loader2 className="h-4 w-4" />}
                  Start Task
                </Button>

                  <Button
                    className="bg-green-600 hover:bg-green-700 gap-2 h-12 font-bold uppercase text-xs tracking-tight"
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    disabled={isUpdating || selectedTask.status === "COMPLETED" || selectedTask.status === "Completed"}
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