
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lightingConfigs = await prisma.lightingConfig.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(lightingConfigs);
  } catch (error) {
    console.error('Error fetching lighting configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lighting configs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const lightingConfig = await prisma.lightingConfig.create({
      data: {
        environmentId: data.environmentId,
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
        isEnabled: true
      }
    });

    return NextResponse.json(lightingConfig);
  } catch (error) {
    console.error('Error creating lighting config:', error);
    return NextResponse.json(
      { error: 'Failed to create lighting config' },
      { status: 500 }
    );
  }
}
