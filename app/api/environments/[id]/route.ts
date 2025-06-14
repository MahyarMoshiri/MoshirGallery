
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const environment = await prisma.galleryEnvironment.findUnique({
      where: { id: params.id },
      include: {
        lightingConfigs: true
      }
    });

    if (!environment) {
      return NextResponse.json(
        { error: 'Environment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(environment);
  } catch (error) {
    console.error('Error fetching environment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const environment = await prisma.galleryEnvironment.update({
      where: { id: params.id },
      data: {
        name: data.name,
        wallConfig: data.wallConfig,
        floorConfig: data.floorConfig,
        ceilingConfig: data.ceilingConfig,
        dimensions: data.dimensions
      },
      include: {
        lightingConfigs: true
      }
    });

    return NextResponse.json(environment);
  } catch (error) {
    console.error('Error updating environment:', error);
    return NextResponse.json(
      { error: 'Failed to update environment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.galleryEnvironment.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting environment:', error);
    return NextResponse.json(
      { error: 'Failed to delete environment' },
      { status: 500 }
    );
  }
}
