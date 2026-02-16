import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import { Task } from "@/model/Task"
import "@/model/Staff"
import "@/model/Department"
import "@/model/Hod"

const ALLOWED_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE", "REJECTED"]

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id: taskId } = await params

    const body = await req.json().catch(() => ({}))
    const { status } = body

    if (!status || typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await dbConnect()

    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const userId = (session.user as any).id

    const allowed =
      task.assignedTo?.toString() === userId || task.assignedBy?.toString() === userId
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // update and save
    task.status = status as any
    await task.save()

    // Try to populate lightweight fields for response (safe if models registered)
    const populated = await Task.findById(taskId)
      .populate("assignedBy", "name")
      .populate("assignedTo", "name")
      .populate("department", "name")
      .lean()

    const t = populated as any

    const mapped = {
      id: t._id?.toString?.() ?? null,
      title: t.title,
      description: t.description,
      department:
        t.department && typeof t.department === "object"
          ? t.department.name ?? t.department._id?.toString?.()
          : t.department?.toString?.() ?? null,
      assignedBy: t.assignedBy && typeof t.assignedBy === "object" ? t.assignedBy.name : t.assignedBy?.toString?.() ?? null,
      assignedTo: t.assignedTo && typeof t.assignedTo === "object" ? t.assignedTo.name : t.assignedTo?.toString?.() ?? null,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }

    return NextResponse.json({ success: true, task: mapped })
  } catch (err) {
    console.error("API PATCH /api/tasks/[id] error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}