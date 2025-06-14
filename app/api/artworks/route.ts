
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { offers: true }
        }
      }
    });
    
    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      artist,
      year,
      medium,
      dimensions,
      description,
      price,
      imageUrl,
      modelUrl,
      modelFormat,
      type,
      position,
      rotation,
      scale,
      materialProperties,
      frameStyle,
      pedestalStyle
    } = body;

    const artwork = await prisma.artwork.create({
      data: {
        title,
        artist,
        year: parseInt(year),
        medium,
        dimensions,
        description,
        price: parseFloat(price),
        imageUrl,
        modelUrl,
        modelFormat,
        type: type || 'painting',
        position,
        rotation,
        scale,
        materialProperties,
        frameStyle,
        pedestalStyle
      }
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}
