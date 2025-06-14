
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const frameStyles = await prisma.frameStyle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(frameStyles);
  } catch (error) {
    console.error('Error fetching frame styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frame styles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const frameStyle = await prisma.frameStyle.create({
      data: {
        name: data.name,
        description: data.description,
        modelUrl: data.modelUrl,
        dimensions: data.dimensions,
        material: data.material,
        isDefault: data.isDefault || false
      }
    });

    return NextResponse.json(frameStyle);
  } catch (error) {
    console.error('Error creating frame style:', error);
    return NextResponse.json(
      { error: 'Failed to create frame style' },
      { status: 500 }
    );
  }
}
