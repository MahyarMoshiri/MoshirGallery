
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, deactivate all environments
    await prisma.galleryEnvironment.updateMany({
      data: { isActive: false }
    });

    // Then activate the selected environment
    const environment = await prisma.galleryEnvironment.update({
      where: { id: params.id },
      data: { isActive: true },
      include: {
        lightingConfigs: true
      }
    });

    return NextResponse.json(environment);
  } catch (error) {
    console.error('Error activating environment:', error);
    return NextResponse.json(
      { error: 'Failed to activate environment' },
      { status: 500 }
    );
  }
}
