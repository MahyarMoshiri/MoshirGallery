
'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '@/components/error-boundary';
import GalleryWalls from '@/components/environment/gallery-walls';
import GalleryFloor from '@/components/environment/gallery-floor';
import GalleryCeiling from '@/components/environment/gallery-ceiling';
import GalleryLighting from '@/components/environment/gallery-lighting';
import ArtworkFrame from '@/components/environment/artwork-frame';
import SculpturePedestal from '@/components/environment/sculpture-pedestal';
import SculptureLoader from '@/components/sculpture/sculpture-loader';
import ArtworkTransformControls from '@/components/gallery/artwork-transform-controls';
import { Artwork, GalleryEnvironment, Transform3D, DEFAULT_MATERIAL } from '@/lib/types';

interface GallerySceneProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
  environment?: GalleryEnvironment;
  editMode?: boolean;
  transformMode?: 'translate' | 'rotate' | 'scale';
  onArtworkTransform?: (artworkId: string, transform: Transform3D) => void;
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 3, 10);
      camera.lookAt(0, 2, 0);
    }
  }, [camera]);

  return null;
}

function DefaultEnvironment() {
  const defaultEnv: GalleryEnvironment = {
    id: 'default',
    name: 'Default Gallery',
    isActive: true,
    wallConfig: {
      color: '#f8f8f8',
      material: { ...DEFAULT_MATERIAL, color: '#f8f8f8' }
    },
    floorConfig: {
      color: '#e8e8e8',
      material: { ...DEFAULT_MATERIAL, color: '#e8e8e8', roughness: 0.3 }
    },
    ceilingConfig: {
      color: '#ffffff',
      material: { ...DEFAULT_MATERIAL, color: '#ffffff' }
    },
    dimensions: { width: 20, height: 4, depth: 15 },
    createdAt: new Date(),
    updatedAt: new Date(),
    lightingConfigs: [
      {
        id: 'ambient',
        environmentId: 'default',
        name: 'Ambient Light',
        type: 'ambient',
        color: '#ffffff',
        intensity: 0.4,
        castShadow: false,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'main',
        environmentId: 'default',
        name: 'Main Light',
        type: 'directional',
        position: { x: 10, y: 15, z: 5 },
        color: '#ffffff',
        intensity: 1,
        castShadow: true,
        shadowMapSize: 1024,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'fill',
        environmentId: 'default',
        name: 'Fill Light',
        type: 'point',
        position: { x: 0, y: 8, z: 0 },
        color: '#ffffff',
        intensity: 0.5,
        distance: 20,
        castShadow: false,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };

  return (
    <>
      <GalleryWalls wallConfig={defaultEnv.wallConfig} dimensions={defaultEnv.dimensions} />
      <GalleryFloor floorConfig={defaultEnv.floorConfig} dimensions={defaultEnv.dimensions} />
      <GalleryCeiling ceilingConfig={defaultEnv.ceilingConfig} dimensions={defaultEnv.dimensions} />
      <GalleryLighting lightingConfigs={defaultEnv.lightingConfigs || []} />
    </>
  );
}

function ArtworkDisplay({
  artwork,
  position,
  onClick,
  editMode,
  transformMode,
  onTransform,
  isSelected
}: {
  artwork: Artwork;
  position: [number, number, number];
  onClick: () => void;
  editMode?: boolean;
  transformMode?: 'translate' | 'rotate' | 'scale';
  onTransform?: (artworkId: string, transform: Transform3D) => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  if (artwork.type === 'sculpture') {
    return (
      <group position={position} ref={groupRef}>
        {/* Pedestal for sculpture */}
        <SculpturePedestal 
          artwork={artwork} 
          position={[0, 0, 0]} 
        />
        
        {/* 3D Sculpture */}
        <SculptureLoader
          artwork={artwork}
          position={[0, 1.5, 0]} // Position on top of pedestal
          onClick={onClick}
        />

        {/* Transform controls for editing */}
        {editMode && isSelected && transformMode && onTransform && (
          <ArtworkTransformControls
            artwork={artwork}
            object={groupRef.current}
            onTransformChange={onTransform}
            mode={transformMode}
            enabled={true}
          />
        )}

        {/* Title */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {artwork.title}
        </Text>
      </group>
    );
  } else {
    // Traditional painting with frame
    return (
      <group position={position} ref={groupRef}>
        <ArtworkFrame
          artwork={artwork}
          position={[0, 0, 0]}
          onClick={onClick}
        />

        {/* Transform controls for editing */}
        {editMode && isSelected && transformMode && onTransform && (
          <ArtworkTransformControls
            artwork={artwork}
            object={groupRef.current}
            onTransformChange={onTransform}
            mode={transformMode}
            enabled={true}
          />
        )}
        
        {/* Title */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.15}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {artwork.title}
        </Text>
      </group>
    );
  }
}

function Scene({
  artworks,
  onArtworkClick,
  environment,
  editMode,
  transformMode,
  onArtworkTransform
}: GallerySceneProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    onArtworkClick(artwork);
  };
  const calculateArtworkPosition = (index: number, artwork: Artwork): [number, number, number] => {
    // Use custom position if available
    if (artwork.position) {
      return [artwork.position.x, artwork.position.y, artwork.position.z];
    }

    // Default positioning logic
    const wallSpacing = 4;
    const sculptureSpacing = 3;
    
    if (artwork.type === 'sculpture') {
      // Place sculptures in the center area
      const sculptureIndex = artworks.filter((a, i) => i <= index && a.type === 'sculpture').length - 1;
      return [sculptureIndex * sculptureSpacing - 3, 0, 2];
    } else {
      // Place paintings on walls
      const paintingIndex = artworks.filter((a, i) => i <= index && a.type === 'painting').length - 1;
      return [paintingIndex * wallSpacing - 8, 2, -7];
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 60 }}
      style={{ background: '#f0f0f0' }}
      shadows
    >
      <Suspense fallback={null}>
        <CameraController />
        
        {/* Environment */}
        {environment ? (
          <>
            <GalleryWalls wallConfig={environment.wallConfig} dimensions={environment.dimensions} />
            <GalleryFloor floorConfig={environment.floorConfig} dimensions={environment.dimensions} />
            <GalleryCeiling ceilingConfig={environment.ceilingConfig} dimensions={environment.dimensions} />
            <GalleryLighting lightingConfigs={environment.lightingConfigs || []} />
          </>
        ) : (
          <DefaultEnvironment />
        )}
        
        {/* Artworks */}
        {artworks.map((artwork, index) => (
          <ArtworkDisplay
            key={artwork.id}
            artwork={artwork}
            position={calculateArtworkPosition(index, artwork)}
            onClick={() => handleArtworkClick(artwork)}
            editMode={editMode}
            transformMode={transformMode}
            onTransform={onArtworkTransform}
            isSelected={selectedArtwork?.id === artwork.id}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
          target={[0, 2, 0]}
          maxPolarAngle={Math.PI / 2.1} // Prevent going below floor
        />
      </Suspense>
    </Canvas>
  );
}

export default function GalleryScene({ 
  artworks, 
  onArtworkClick, 
  environment, 
  editMode = false, 
  transformMode = 'translate',
  onArtworkTransform 
}: GallerySceneProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="gallery-canvas h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Enhanced 3D Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-canvas h-screen w-full">
      <ErrorBoundary>
        <Scene 
          artworks={artworks} 
          onArtworkClick={onArtworkClick}
          environment={environment}
          editMode={editMode}
          transformMode={transformMode}
          onArtworkTransform={onArtworkTransform}
        />
      </ErrorBoundary>
    </div>
  );
}
