import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, image } = data;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const updateData: any = { name };
    if (image !== undefined) {
      updateData.image = image;
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true
      }
    });

    // Update the session to reflect the changes
    if (session.user) {
      session.user.name = updatedUser.name;
      session.user.image = updatedUser.image;
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 