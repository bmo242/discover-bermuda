import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    locationId: string;
  };
};

export async function PUT(request: Request, props: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const { locationId } = props.params;
    const data = await request.json();
    const { name, description, address, latitude, longitude, images } = data;

    // Validate required fields
    if (!name || !description || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const location = await prisma.location.update({
      where: { id: locationId },
      data: {
        name,
        description,
        address,
        latitude,
        longitude,
        images: images || []
      }
    });

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, props: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const { locationId } = props.params;

    await prisma.location.delete({
      where: { id: locationId }
    });

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
} 