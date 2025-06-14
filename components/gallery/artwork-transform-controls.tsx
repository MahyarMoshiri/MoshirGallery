'use client';

import { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { Artwork, Transform3D } from '@/lib/types';
import * as THREE from 'three';

interface ArtworkTransformControlsProps {
  artwork: Artwork;
  object: THREE.Object3D | null;
  mode: 'translate' | 'rotate' | 'scale';
  enabled: boolean;
  onTransformChange: (artworkId: string, transform: Transform3D) => void;
}

export default function ArtworkTransformControls({
  artwork,
  object,
  mode,
  enabled,
  onTransformChange
}: ArtworkTransformControlsProps) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current || !object) return;

    const controls = controlsRef.current;
    controls.attach(object);

    const handleDrag = (event: any) => {
      if (event.value) return;
      const obj = controls.object as THREE.Object3D;
      if (!obj) return;
      const transform: Transform3D = {
        position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
        scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
      };
      onTransformChange(artwork.id, transform);
    };

    controls.addEventListener('dragging-changed', handleDrag);
    return () => {
      controls.removeEventListener('dragging-changed', handleDrag);
    };
  }, [object, artwork.id, onTransformChange]);

  if (!enabled || !object) return null;

  return <TransformControls ref={controlsRef} mode={mode} />;
}
