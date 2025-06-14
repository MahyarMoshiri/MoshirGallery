
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const environments = await prisma.galleryEnvironment.findMany({
      include: {
        lightingConfigs: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(environments);
  } catch (error) {
    console.error('Error fetching environments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const environment = await prisma.galleryEnvironment.create({
      data: {
        name: data.name,
        wallConfig: data.wallConfig,
        floorConfig: data.floorConfig,
        ceilingConfig: data.ceilingConfig,
        dimensions: data.dimensions,
        isActive: false
      },
      include: {
        lightingConfigs: true
      }
    });

    return NextResponse.json(environment);
  } catch (error) {
    console.error('Error creating environment:', error);
    return NextResponse.json(
      { error: 'Failed to create environment' },
      { status: 500 }
    );
  }
}
