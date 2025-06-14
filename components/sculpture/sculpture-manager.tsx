
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Move3D, 
  RotateCcw, 
  Maximize,
  Palette,
  Save,
  X
} from 'lucide-react';
import { Artwork, ModelFormat, MODEL_FORMATS, MaterialProperties, DEFAULT_MATERIAL } from '@/lib/types';

interface SculptureManagerProps {
  onStatsUpdate?: () => void;
}

export default function SculptureManager({ onStatsUpdate }: SculptureManagerProps) {
  const [sculptures, setSculptures] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSculpture, setEditingSculpture] = useState<Artwork | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    description: '',
    price: 0,
    modelUrl: '',
    modelFormat: 'gltf' as ModelFormat,
    materialProperties: DEFAULT_MATERIAL
  });

  useEffect(() => {
    loadSculptures();
  }, []);

  const loadSculptures = async () => {
    try {
      const response = await fetch('/api/artworks');
      if (response.ok) {
        const artworks = await response.json();
        setSculptures(artworks.filter((artwork: Artwork) => artwork.type === 'sculpture'));
      }
    } catch (error) {
      console.error('Failed to load sculptures:', error);
      toast({
        title: "Error",
        description: "Failed to load sculptures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const sculptureData = {
        ...formData,
        type: 'sculpture',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };

      const url = editingSculpture ? `/api/artworks/${editingSculpture.id}` : '/api/artworks';
      const method = editingSculpture ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sculptureData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingSculpture ? "Sculpture updated successfully" : "Sculpture uploaded successfully",
        });
        
        resetForm();
        loadSculptures();
        onStatsUpdate?.();
      } else {
        throw new Error('Failed to save sculpture');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sculpture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (sculpture: Artwork) => {
    setEditingSculpture(sculpture);
    setFormData({
      title: sculpture.title,
      artist: sculpture.artist,
      year: sculpture.year,
      medium: sculpture.medium,
      dimensions: sculpture.dimensions,
      description: sculpture.description,
      price: sculpture.price,
      modelUrl: sculpture.modelUrl || '',
      modelFormat: (sculpture.modelFormat as ModelFormat) || 'gltf',
      materialProperties: sculpture.materialProperties || DEFAULT_MATERIAL
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sculpture?')) return;

    try {
      const response = await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Sculpture deleted successfully",
        });
        loadSculptures();
        onStatsUpdate?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sculpture",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingSculpture(null);
    setFormData({
      title: '',
      artist: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      description: '',
      price: 0,
      modelUrl: '',
      modelFormat: 'gltf',
      materialProperties: DEFAULT_MATERIAL
    });
  };

  const updateMaterialProperty = (property: keyof MaterialProperties, value: any) => {
    setFormData(prev => ({
      ...prev,
      materialProperties: {
        ...prev.materialProperties,
        [property]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingSculpture ? 'Edit Sculpture' : 'Upload New Sculpture'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelUrl">3D Model URL</Label>
                <Input
                  id="modelUrl"
                  value={formData.modelUrl}
                  onChange={(e) => setFormData({ ...formData, modelUrl: e.target.value })}
                  placeholder="https://example.com/model.gltf"
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelFormat">Model Format</Label>
                <Select 
                  value={formData.modelFormat} 
                  onValueChange={(value: ModelFormat) => setFormData({ ...formData, modelFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_FORMATS.map(format => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Material Properties */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Material Properties
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.materialProperties.color}
                    onChange={(e) => updateMaterialProperty('color', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metalness">Metalness</Label>
                  <Input
                    id="metalness"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.materialProperties.metalness}
                    onChange={(e) => updateMaterialProperty('metalness', parseFloat(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">{formData.materialProperties.metalness}</span>
                </div>
                <div>
                  <Label htmlFor="roughness">Roughness</Label>
                  <Input
                    id="roughness"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.materialProperties.roughness}
                    onChange={(e) => updateMaterialProperty('roughness', parseFloat(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">{formData.materialProperties.roughness}</span>
                </div>
                <div>
                  <Label htmlFor="opacity">Opacity</Label>
                  <Input
                    id="opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.materialProperties.opacity}
                    onChange={(e) => updateMaterialProperty('opacity', parseFloat(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">{formData.materialProperties.opacity}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                <Save className="h-4 w-4 mr-2" />
                {isUploading ? 'Saving...' : editingSculpture ? 'Update' : 'Upload'}
              </Button>
              {editingSculpture && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sculptures List */}
      <Card>
        <CardHeader>
          <CardTitle>Sculptures ({sculptures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sculptures.map((sculpture) => (
              <motion.div
                key={sculpture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{sculpture.title}</h3>
                    <p className="text-sm text-gray-600">{sculpture.artist}</p>
                    <p className="text-sm text-gray-500">{sculpture.year}</p>
                  </div>
                  <Badge variant="secondary">
                    {sculpture.modelFormat?.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{sculpture.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">${sculpture.price.toLocaleString()}</span>
                  <span className="text-gray-500">{sculpture.medium}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(sculpture)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(sculpture.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {sculptures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sculptures uploaded yet. Upload your first 3D sculpture above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
