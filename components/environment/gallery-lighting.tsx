'use client';

import { LightingConfig } from '@/lib/types';

interface GalleryLightingProps {
  lightingConfigs: LightingConfig[];
}

export default function GalleryLighting({ lightingConfigs }: GalleryLightingProps) {
  return (
    <>
      {lightingConfigs.map((light) => {
        if (!light.isEnabled) return null;

        const position = light.position
          ? [light.position.x, light.position.y, light.position.z]
          : undefined;
        const rotation = light.rotation
          ? [light.rotation.x, light.rotation.y, light.rotation.z]
          : undefined;

        switch (light.type) {
          case 'ambient':
            return (
              <ambientLight
                key={light.id}
                color={light.color}
                intensity={light.intensity}
              />
            );
          case 'directional':
            return (
              <directionalLight
                key={light.id}
                position={position}
                rotation={rotation}
                color={light.color}
                intensity={light.intensity}
                castShadow={light.castShadow}
                shadow-mapSize-width={light.shadowMapSize}
                shadow-mapSize-height={light.shadowMapSize}
              />
            );
          case 'point':
            return (
              <pointLight
                key={light.id}
                position={position}
                color={light.color}
                intensity={light.intensity}
                distance={light.distance}
                castShadow={light.castShadow}
              />
            );
          case 'spot':
            return (
              <spotLight
                key={light.id}
                position={position}
                rotation={rotation}
                color={light.color}
                intensity={light.intensity}
                distance={light.distance}
                angle={light.angle}
                penumbra={light.penumbra}
                castShadow={light.castShadow}
                shadow-mapSize-width={light.shadowMapSize}
                shadow-mapSize-height={light.shadowMapSize}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

