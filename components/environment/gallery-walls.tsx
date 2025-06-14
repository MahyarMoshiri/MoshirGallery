'use client';

import { SurfaceConfig } from '@/lib/types';
import { DoubleSide } from 'three';

interface GalleryWallsProps {
  wallConfig: SurfaceConfig;
  dimensions: { width: number; height: number; depth: number };
}

export default function GalleryWalls({ wallConfig, dimensions }: GalleryWallsProps) {
  const material = wallConfig.material;

  const matProps = {
    color: material.color || wallConfig.color,
    metalness: material.metalness ?? 0,
    roughness: material.roughness ?? 1,
    emissive: material.emissive ?? '#000000',
    emissiveIntensity: material.emissiveIntensity ?? 0,
    transparent: material.transparent ?? false,
    opacity: material.opacity ?? 1
  };

  const { width, height, depth } = dimensions;

  return (
    <group>
      {/* Back Wall */}
      <mesh
        position={[0, height / 2, -depth / 2]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...matProps} side={DoubleSide} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial {...matProps} side={DoubleSide} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial {...matProps} side={DoubleSide} />
      </mesh>
    </group>
  );
}

