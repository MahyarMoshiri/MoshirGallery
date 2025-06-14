
'use client';

import { useRef, useState, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { Artwork, Transform3D } from '@/lib/types';
import * as THREE from 'three';

interface SculptureTransformControlsProps {
  artwork: Artwork;
  onTransformChange: (artworkId: string, transform: Transform3D) => void;
  mode: 'translate' | 'rotate' | 'scale';
  enabled: boolean;
}

export default function SculptureTransformControls({ 
  artwork, 
  onTransformChange, 
  mode, 
  enabled 
}: SculptureTransformControlsProps) {
  const transformRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      
      const handleDragStart = () => setIsDragging(true);
      const handleDragEnd = () => {
        setIsDragging(false);
        
        if (controls.object) {
          const transform: Transform3D = {
            position: {
              x: controls.object.position.x,
              y: controls.object.position.y,
              z: controls.object.position.z
            },
            rotation: {
              x: controls.object.rotation.x,
              y: controls.object.rotation.y,
              z: controls.object.rotation.z
            },
            scale: {
              x: controls.object.scale.x,
              y: controls.object.scale.y,
              z: controls.object.scale.z
            }
          };
          
          onTransformChange(artwork.id, transform);
        }
      };

      controls.addEventListener('dragging-changed', (event: any) => {
        if (event.value) {
          handleDragStart();
        } else {
          handleDragEnd();
        }
      });

      return () => {
        controls.removeEventListener('dragging-changed', handleDragStart);
        controls.removeEventListener('dragging-changed', handleDragEnd);
      };
    }
  }, [artwork.id, onTransformChange]);

  if (!enabled || artwork.type !== 'sculpture') {
    return null;
  }

  return (
    <TransformControls
      ref={transformRef}
      mode={mode}
      size={0.8}
      showX
      showY
      showZ
      space="local"
      position={artwork.position ? [artwork.position.x, artwork.position.y, artwork.position.z] : [0, 0, 0]}
      rotation={artwork.rotation ? [artwork.rotation.x, artwork.rotation.y, artwork.rotation.z] : [0, 0, 0]}
      scale={artwork.scale ? [artwork.scale.x, artwork.scale.y, artwork.scale.z] : [1, 1, 1]}
    />
  );
}
