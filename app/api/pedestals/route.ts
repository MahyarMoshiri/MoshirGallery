
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pedestalStyles = await prisma.pedestalStyle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(pedestalStyles);
  } catch (error) {
    console.error('Error fetching pedestal styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pedestal styles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const pedestalStyle = await prisma.pedestalStyle.create({
      data: {
        name: data.name,
        description: data.description,
        modelUrl: data.modelUrl,
        dimensions: data.dimensions,
        material: data.material,
        isDefault: data.isDefault || false
      }
    });

    return NextResponse.json(pedestalStyle);
  } catch (error) {
    console.error('Error creating pedestal style:', error);
    return NextResponse.json(
      { error: 'Failed to create pedestal style' },
      { status: 500 }
    );
  }
}
