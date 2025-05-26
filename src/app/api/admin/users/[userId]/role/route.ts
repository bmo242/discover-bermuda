import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const { userId } = params;
    const data = await req.json();
    const { role } = data;

    if (!role || !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Prevent changing your own role
    if (session.user.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (currentUser?.id === userId) {
        return NextResponse.json(
          { error: "Cannot change your own role" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
} 