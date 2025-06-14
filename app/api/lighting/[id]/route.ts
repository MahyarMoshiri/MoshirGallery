
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const lightingConfig = await prisma.lightingConfig.update({
      where: { id: params.id },
      data: {
        name: data.name,
        type: data.type,
        position: data.position,
        rotation: data.rotation,
        color: data.color,
        intensity: data.intensity,
        distance: data.distance,
        angle: data.angle,
        penumbra: data.penumbra,
        castShadow: data.castShadow,
        shadowMapSize: data.shadowMapSize,
        isEnabled: data.isEnabled !== undefined ? data.isEnabled : true
      }
    });

    return NextResponse.json(lightingConfig);
  } catch (error) {
    console.error('Error updating lighting config:', error);
    return NextResponse.json(
      { error: 'Failed to update lighting config' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lightingConfig.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lighting config:', error);
    return NextResponse.json(
      { error: 'Failed to delete lighting config' },
      { status: 500 }
    );
  }
}
