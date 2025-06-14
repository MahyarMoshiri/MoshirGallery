
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        artwork: {
          select: {
            title: true,
            artist: true,
            imageUrl: true
          }
        }
      }
    });
    
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artworkId, userName, userEmail, offerAmount, message } = body;

    const offer = await prisma.offer.create({
      data: {
        artworkId,
        userName,
        userEmail,
        offerAmount: parseFloat(offerAmount),
        message
      },
      include: {
        artwork: {
          select: {
            title: true,
            artist: true
          }
        }
      }
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
