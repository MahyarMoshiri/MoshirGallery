'use client';

import { useTexture } from '@react-three/drei';
import { Artwork } from '@/lib/types';
import { DoubleSide } from 'three';

interface ArtworkFrameProps {
  artwork: Artwork;
  position: [number, number, number];
  onClick?: () => void;
}

export default function ArtworkFrame({ artwork, position, onClick }: ArtworkFrameProps) {
  const texture = artwork.imageUrl ? useTexture(artwork.imageUrl) : null;

  const width = 2;
  const height = 1.5;
  const depth = 0.1;
  const border = 0.05;

  return (
    <group position={position} onClick={onClick} name={`artwork-${artwork.id}`}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={'#555'} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Painting */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[width - border * 2, height - border * 2]} />
        {texture ? (
          <meshStandardMaterial map={texture} side={DoubleSide} />
        ) : (
          <meshStandardMaterial color={'white'} side={DoubleSide} />
        )}
      </mesh>
    </group>
  );
}

