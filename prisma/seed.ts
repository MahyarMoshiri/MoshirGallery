import { prisma } from '../lib/db'
import { createDefaultAdmin } from '../lib/auth'
import {
  sampleArtworks,
  sampleEnvironments,
  sampleLightingConfigs,
  sampleFrameStyles,
  samplePedestalStyles,
} from '../lib/sample-data'

async function main() {
  await createDefaultAdmin()

  const existingArtworks = await prisma.artwork.count()
  const existingEnvironments = await prisma.galleryEnvironment.count()
  const existingFrames = await prisma.frameStyle.count()
  const existingPedestals = await prisma.pedestalStyle.count()

  if (existingArtworks === 0) {
    await prisma.artwork.createMany({ data: sampleArtworks })
  }

  if (existingEnvironments === 0) {
    for (const envData of sampleEnvironments) {
      const environment = await prisma.galleryEnvironment.create({ data: envData })

      if (envData.isActive) {
        for (const lightData of sampleLightingConfigs) {
          await prisma.lightingConfig.create({
            data: { ...lightData, environmentId: environment.id },
          })
        }
      }
    }
  }

  if (existingFrames === 0) {
    await prisma.frameStyle.createMany({ data: sampleFrameStyles })
  }

  if (existingPedestals === 0) {
    await prisma.pedestalStyle.createMany({ data: samplePedestalStyles })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
