'use client';

import { SurfaceConfig } from '@/lib/types';
import { DoubleSide } from 'three';

interface GalleryFloorProps {
  floorConfig: SurfaceConfig;
  dimensions: { width: number; height: number; depth: number };
}

export default function GalleryFloor({ floorConfig, dimensions }: GalleryFloorProps) {
  const material = floorConfig.material;

  const matProps = {
    color: material.color || floorConfig.color,
    metalness: material.metalness ?? 0,
    roughness: material.roughness ?? 1,
    emissive: material.emissive ?? '#000000',
    emissiveIntensity: material.emissiveIntensity ?? 0,
    transparent: material.transparent ?? false,
    opacity: material.opacity ?? 1
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      castShadow
    >
      <planeGeometry args={[dimensions.width, dimensions.depth]} />
      <meshStandardMaterial {...matProps} side={DoubleSide} />
    </mesh>
  );
}

