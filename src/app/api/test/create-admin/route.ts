import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@test.com'
      }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: 'Admin user created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Could not create admin user' },
      { status: 500 }
    );
  }
} 