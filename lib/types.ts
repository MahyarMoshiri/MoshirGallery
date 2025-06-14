// Gallery Types
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  price: number;
  imageUrl: string | null;
  modelUrl: string | null;
  modelFormat: string | null;
  type: 'painting' | 'sculpture';
  position: { x: number; y: number; z: number } | null;
  rotation: { x: number; y: number; z: number } | null;
  scale: { x: number; y: number; z: number } | null;
  materialProperties: MaterialProperties | null;
  frameStyle: string | null;
  pedestalStyle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialProperties {
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  textureUrl?: string;
  normalMapUrl?: string;
  roughnessMapUrl?: string;
  metalnessMapUrl?: string;
}

export interface GalleryEnvironment {
  id: string;
  name: string;
  isActive: boolean;
  wallConfig: SurfaceConfig;
  floorConfig: SurfaceConfig;
  ceilingConfig: SurfaceConfig;
  dimensions: { width: number; height: number; depth: number };
  createdAt: Date;
  updatedAt: Date;
  lightingConfigs?: LightingConfig[];
}

export interface SurfaceConfig {
  color: string;
  texture?: string;
  material: MaterialProperties;
  reflectivity?: number;
}

export interface LightingConfig {
  id: string;
  environmentId: string;
  name: string;
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  color: string;
  intensity: number;
  distance?: number;
  angle?: number;
  penumbra?: number;
  castShadow: boolean;
  shadowMapSize?: number;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FrameStyle {
  id: string;
  name: string;
  description?: string;
  modelUrl?: string;
  dimensions: { width: number; height: number; depth: number; borderWidth: number };
  material: MaterialProperties;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PedestalStyle {
  id: string;
  name: string;
  description?: string;
  modelUrl?: string;
  dimensions: { width: number; height: number; depth: number };
  material: MaterialProperties;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  artworkId: string;
  userName: string;
  userEmail: string;
  offerAmount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  artwork?: Artwork;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  createdAt: Date;
}

// 3D Model Support
export type ModelFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'stl';

export interface Transform3D {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// Environment Editor Types
export interface EnvironmentEditorState {
  selectedEnvironment: GalleryEnvironment | null;
  editMode: 'view' | 'edit' | 'lighting' | 'materials';
  selectedLight: LightingConfig | null;
  previewMode: boolean;
}

// Form Types
export interface ArtworkFormData {
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  price: number;
  type: 'painting' | 'sculpture';
  imageUrl?: string;
  modelUrl?: string;
  modelFormat?: ModelFormat;
  frameStyle?: string;
  pedestalStyle?: string;
  materialProperties?: MaterialProperties;
}

export interface EnvironmentFormData {
  name: string;
  wallConfig: SurfaceConfig;
  floorConfig: SurfaceConfig;
  ceilingConfig: SurfaceConfig;
  dimensions: { width: number; height: number; depth: number };
}

export interface LightingFormData {
  name: string;
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  color: string;
  intensity: number;
  distance?: number;
  angle?: number;
  penumbra?: number;
  castShadow: boolean;
  shadowMapSize?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Constants
export const MODEL_FORMATS: ModelFormat[] = ['gltf', 'glb', 'obj', 'fbx', 'stl'];

export const LIGHT_TYPES = [
  { value: 'ambient', label: 'Ambient Light' },
  { value: 'directional', label: 'Directional Light' },
  { value: 'point', label: 'Point Light' },
  { value: 'spot', label: 'Spot Light' }
] as const;

export const DEFAULT_MATERIAL: MaterialProperties = {
  color: '#ffffff',
  metalness: 0.1,
  roughness: 0.8,
  emissive: '#000000',
  emissiveIntensity: 0,
  transparent: false,
  opacity: 1
};

export const DEFAULT_TRANSFORM: Transform3D = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 }
};