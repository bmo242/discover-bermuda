import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: "user@test.com"
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Test user already exists" });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("user123", 10);
    const user = await prisma.user.create({
      data: {
        email: "user@test.com",
        password: hashedPassword,
        name: "Test User",
        role: "USER"
      }
    });

    return NextResponse.json({
      message: "Test user created successfully",
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    );
  }
} 