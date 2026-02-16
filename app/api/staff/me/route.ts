import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import { Staff } from "@/model/Staff"
import "@/model/Department"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const staffId = (session.user as any).id
    const staff = await Staff.findById(staffId)
      .select("-passwordHash -__v")
      .populate("department", "name")

    if (!staff) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: staff._id.toString(),
        name: staff.name,
        empId: staff.empId,
        email: staff.email,
        role: staff.role,
        departmentName: staff.department
          ? typeof staff.department === "object"
            ? (staff.department as any).name
            : staff.department.toString()
          : "N/A",
        phone: staff.phone || null,
        staffType: [staff.role],
        isActive: staff.isActive,
        lastLogin: staff.lastLogin,
      },
    })
  } catch (err) {
    console.error("API /staff/me error:", err)
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 })
  }
}