import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import { Task } from "@/model/Task"
import "@/model/Staff"
import "@/model/Department"
import "@/model/Hod"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const staffId = (session.user as any).id

    // Fetch tasks with populated assignedBy name
    const tasks = await Task.find({ assignedTo: staffId })
      .populate("assignedBy", "name")
      .sort({ dueDate: 1 })
      .limit(5)
      .lean()

    const total = await Task.countDocuments({ assignedTo: staffId })
    const pending = await Task.countDocuments({ assignedTo: staffId, status: "PENDING" })
    const inProgress = await Task.countDocuments({ assignedTo: staffId, status: "IN_PROGRESS" })
    const completed = await Task.countDocuments({ assignedTo: staffId, status: "COMPLETED" })

    // Map tasks to return assignedBy name
    const recentTasks = tasks.map((t: any) => ({
      _id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      assignedBy: t.assignedBy?.name || "Unknown",
    }))

    return NextResponse.json({
      stats: {
        total,
        pending,
        inProgress,
        completed
      },
      recentTasks
    })
  } catch (err) {
    console.error("DASHBOARD API ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}