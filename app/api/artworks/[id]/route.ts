
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        offers: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const artwork = await prisma.artwork.update({
      where: { id: params.id },
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
        type,
        position,
        rotation,
        scale,
        materialProperties,
        frameStyle,
        pedestalStyle
      }
    });

    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.artwork.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    );
  }
}
