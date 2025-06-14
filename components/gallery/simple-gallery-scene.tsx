
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  price: number;
  imageUrl: string | null;
  type: string;
  position: { x: number; y: number; z: number } | null;
  rotation: { x: number; y: number; z: number } | null;
  scale: { x: number; y: number; z: number } | null;
}

interface SimpleGallerySceneProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

function SimpleBox() {
  return (
    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

function SimpleScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SimpleBox />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default function SimpleGalleryScene({ artworks, onArtworkClick }: SimpleGallerySceneProps) {
  return (
    <div className="h-screen w-full">
      <SimpleScene />
    </div>
  );
}
