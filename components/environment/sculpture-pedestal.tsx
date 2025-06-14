'use client';

import { Artwork } from '@/lib/types';

interface SculpturePedestalProps {
  artwork: Artwork;
  position: [number, number, number];
}

export default function SculpturePedestal({ artwork, position }: SculpturePedestalProps) {
  const width = 1;
  const depth = 1;
  const height = 0.8;

  return (
    <mesh
      position={[position[0], position[1] + height / 2, position[2]]}
      receiveShadow
      castShadow
      name={`pedestal-${artwork.id}`}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={'#f8f8f8'} metalness={0.1} roughness={0.3} />
    </mesh>
  );
}

