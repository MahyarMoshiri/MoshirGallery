
'use client';

import { Suspense, useRef, useState } from 'react';
import { useGLTF, useFBX, Text } from '@react-three/drei';
import { Artwork, MaterialProperties } from '@/lib/types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SculptureLoaderProps {
  artwork: Artwork;
  position: [number, number, number];
  onClick?: () => void;
  materialOverride?: MaterialProperties;
}

function GLTFModel({ url, artwork, materialOverride, onClick }: { 
  url: string; 
  artwork: Artwork; 
  materialOverride?: MaterialProperties;
  onClick?: () => void;
}) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (modelRef.current && hovered) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  // Apply material overrides
  if (materialOverride && scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: materialOverride.color || '#ffffff',
          metalness: materialOverride.metalness || 0.1,
          roughness: materialOverride.roughness || 0.8,
          transparent: materialOverride.transparent || false,
          opacity: materialOverride.opacity || 1,
        });
        child.material = material;
      }
    });
  }

  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      scale={artwork.scale ? [artwork.scale.x, artwork.scale.y, artwork.scale.z] : [1, 1, 1]}
      rotation={artwork.rotation ? [artwork.rotation.x, artwork.rotation.y, artwork.rotation.z] : [0, 0, 0]}
      onClick={onClick}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

function FBXModel({ url, artwork, materialOverride, onClick }: { 
  url: string; 
  artwork: Artwork; 
  materialOverride?: MaterialProperties;
  onClick?: () => void;
}) {
  const fbx = useFBX(url);
  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (modelRef.current && hovered) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  // Apply material overrides
  if (materialOverride && fbx) {
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: materialOverride.color || '#ffffff',
          metalness: materialOverride.metalness || 0.1,
          roughness: materialOverride.roughness || 0.8,
          transparent: materialOverride.transparent || false,
          opacity: materialOverride.opacity || 1,
        });
        child.material = material;
      }
    });
  }

  return (
    <primitive 
      ref={modelRef}
      object={fbx.clone()} 
      scale={artwork.scale ? [artwork.scale.x, artwork.scale.y, artwork.scale.z] : [1, 1, 1]}
      rotation={artwork.rotation ? [artwork.rotation.x, artwork.rotation.y, artwork.rotation.z] : [0, 0, 0]}
      onClick={onClick}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

function LoadingFallback({ artwork }: { artwork: Artwork }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        Loading {artwork.title}...
      </Text>
    </group>
  );
}

function ErrorFallback({ artwork }: { artwork: Artwork }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color="#cc0000"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        Failed to load {artwork.title}
      </Text>
    </group>
  );
}

export default function SculptureLoader({ artwork, position, onClick, materialOverride }: SculptureLoaderProps) {
  if (!artwork.modelUrl || artwork.type !== 'sculpture') {
    return null;
  }

  const modelFormat = artwork.modelFormat?.toLowerCase();
  const materialProps = materialOverride || artwork.materialProperties || undefined;

  return (
    <group position={position} name={`sculpture-${artwork.id}`}>
      <Suspense fallback={<LoadingFallback artwork={artwork} />}>
        {(modelFormat === 'gltf' || modelFormat === 'glb') && (
          <GLTFModel 
            url={artwork.modelUrl} 
            artwork={artwork}
            materialOverride={materialProps}
            onClick={onClick}
          />
        )}
        
        {modelFormat === 'fbx' && (
          <FBXModel 
            url={artwork.modelUrl} 
            artwork={artwork}
            materialOverride={materialProps}
            onClick={onClick}
          />
        )}

        {/* For OBJ and STL, we'll use a placeholder for now */}
        {(modelFormat === 'obj' || modelFormat === 'stl') && (
          <group onClick={onClick}>
            <mesh
              onPointerOver={(e: any) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e: any) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={materialProps?.color || '#ffffff'}
                metalness={materialProps?.metalness || 0.1}
                roughness={materialProps?.roughness || 0.8}
              />
            </mesh>
            <Text
              position={[0, -1, 0]}
              fontSize={0.15}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              {artwork.title}
            </Text>
          </group>
        )}
      </Suspense>
    </group>
  );
}

// Preload common model formats
// useGLTF.preload = (url: string) => useGLTF(url);
// useFBX.preload = (url: string) => useFBX(url);
