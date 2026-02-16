import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import { Task } from "@/model/Task"

import "@/model/Department"
import "@/model/Hod"
import "@/model/Staff"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const staffId = (session.user as any).id

    let tasks: any[]
    try {
      tasks = await Task.find({ assignedTo: staffId })
        .sort({ dueDate: 1 })
        .limit(50)
        .populate("assignedBy", "name")
        .populate("assignedTo", "name")
        .populate("department", "name")
        .lean()
    } catch (populateErr) {
      console.warn("Task populate failed, returning raw tasks:", populateErr)
      tasks = await Task.find({ assignedTo: staffId }).sort({ dueDate: 1 }).limit(50).lean()
    }

    const mapped = tasks.map((t) => ({
      id: t._id?.toString?.() ?? null,
      title: t.title,
      description: t.description,
      department:
        t.department && typeof t.department === "object"
          ? (t.department as any).name ?? (t.department as any)._id?.toString?.()
          : t.department?.toString?.() ?? null,
      assignedBy:
        t.assignedBy && typeof t.assignedBy === "object"
          ? (t.assignedBy as any).name ?? (t.assignedBy as any)._id?.toString?.()
          : t.assignedBy?.toString?.() ?? null,
      assignedTo:
        t.assignedTo && typeof t.assignedTo === "object"
          ? (t.assignedTo as any).name ?? (t.assignedTo as any)._id?.toString?.()
          : t.assignedTo?.toString?.() ?? null,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))

    return NextResponse.json({ tasks: mapped })
  } catch (err) {
    console.error("API /tasks error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}