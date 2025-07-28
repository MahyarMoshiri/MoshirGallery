
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createDefaultAdmin } from '@/lib/auth';
import { 
  sampleArtworks, 
  sampleEnvironments, 
  sampleLightingConfigs, 
  sampleFrameStyles, 
  samplePedestalStyles 
} from '@/lib/sample-data';

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Forbidden', { status: 403 });
  }
  try {
    // Create default admin
    await createDefaultAdmin();

    // Check if data already exists
    const existingArtworks = await prisma.artwork.count();
    const existingEnvironments = await prisma.galleryEnvironment.count();
    const existingFrames = await prisma.frameStyle.count();
    const existingPedestals = await prisma.pedestalStyle.count();
    
    if (existingArtworks === 0) {
      // Seed sample artworks
      await prisma.artwork.createMany({
        data: sampleArtworks
      });
    }

    if (existingEnvironments === 0) {
      // Seed sample environments
      for (const envData of sampleEnvironments) {
        const environment = await prisma.galleryEnvironment.create({
          data: envData
        });

        // Add lighting configs for the first environment
        if (envData.isActive) {
          for (const lightData of sampleLightingConfigs) {
            await prisma.lightingConfig.create({
              data: {
                ...lightData,
                environmentId: environment.id
              }
            });
          }
        }
      }
    }

    if (existingFrames === 0) {
      // Seed sample frame styles
      await prisma.frameStyle.createMany({
        data: sampleFrameStyles
      });
    }

    if (existingPedestals === 0) {
      // Seed sample pedestal styles
      await prisma.pedestalStyle.createMany({
        data: samplePedestalStyles
      });
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      admin: { username: 'admin', password: 'admin123' },
      seeded: {
        artworks: existingArtworks === 0,
        environments: existingEnvironments === 0,
        frames: existingFrames === 0,
        pedestals: existingPedestals === 0
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
