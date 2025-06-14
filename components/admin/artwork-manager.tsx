
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FrameStyle, PedestalStyle } from '@/lib/types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  DollarSign,
  Palette,
  Ruler
} from 'lucide-react';

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
  frameStyle?: string | null;
  pedestalStyle?: string | null;
  createdAt: string;
  _count?: { offers: number };
}

interface ArtworkManagerProps {
  onStatsUpdate: () => void;
}

export default function ArtworkManager({ onStatsUpdate }: ArtworkManagerProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([]);
  const [pedestalStyles, setPedestalStyles] = useState<PedestalStyle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    description: '',
    price: 0,
    imageUrl: '',
    type: 'painting',
    position: { x: 0, y: 2, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    frameStyle: '',
    pedestalStyle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadArtworks();
    loadFrameStyles();
    loadPedestalStyles();
  }, []);

  const loadArtworks = async () => {
    try {
      const response = await fetch('/api/artworks');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Failed to load artworks:', error);
      toast({
        title: "Error",
        description: "Failed to load artworks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFrameStyles = async () => {
    try {
      const res = await fetch('/api/frames');
      if (res.ok) {
        const data = await res.json();
        setFrameStyles(data);
      }
    } catch (error) {
      console.error('Failed to load frame styles:', error);
    }
  };

  const loadPedestalStyles = async () => {
    try {
      const res = await fetch('/api/pedestals');
      if (res.ok) {
        const data = await res.json();
        setPedestalStyles(data);
      }
    } catch (error) {
      console.error('Failed to load pedestal styles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingArtwork ? `/api/artworks/${editingArtwork.id}` : '/api/artworks';
      const method = editingArtwork ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        frameStyle: formData.frameStyle || null,
        pedestalStyle: formData.pedestalStyle || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: editingArtwork ? "Artwork Updated" : "Artwork Created",
          description: `${formData.title} has been ${editingArtwork ? 'updated' : 'created'} successfully.`,
        });
        setIsDialogOpen(false);
        resetForm();
        loadArtworks();
        onStatsUpdate();
      } else {
        throw new Error('Failed to save artwork');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      artist: artwork.artist,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      description: artwork.description,
      price: artwork.price,
      imageUrl: artwork.imageUrl || '',
      type: artwork.type,
      position: artwork.position || { x: 0, y: 2, z: 0 },
      rotation: artwork.rotation || { x: 0, y: 0, z: 0 },
      scale: artwork.scale || { x: 1, y: 1, z: 1 },
      frameStyle: artwork.frameStyle || '',
      pedestalStyle: artwork.pedestalStyle || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (artwork: Artwork) => {
    if (!confirm(`Are you sure you want to delete "${artwork.title}"?`)) return;

    try {
      const response = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Artwork Deleted",
          description: `${artwork.title} has been deleted successfully.`,
        });
        loadArtworks();
        onStatsUpdate();
      } else {
        throw new Error('Failed to delete artwork');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingArtwork(null);
    setFormData({
      title: '',
      artist: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      description: '',
      price: 0,
      imageUrl: '',
      type: 'painting',
      position: { x: 0, y: 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      frameStyle: '',
      pedestalStyle: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Palette className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Artwork Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <div className="grid grid-cols-3 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                  </select>
                </div>
              </div>

              {formData.type === 'painting' && (
                <div>
                  <Label htmlFor="frameStyle">Frame Style</Label>
                  <select
                    id="frameStyle"
                    value={formData.frameStyle}
                    onChange={(e) => setFormData({ ...formData, frameStyle: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">None</option>
                    {frameStyles.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'sculpture' && (
                <div>
                  <Label htmlFor="pedestalStyle">Pedestal Style</Label>
                  <select
                    id="pedestalStyle"
                    value={formData.pedestalStyle}
                    onChange={(e) => setFormData({ ...formData, pedestalStyle: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">None</option>
                    {pedestalStyles.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://i.ytimg.com/vi/Sow1jiHYjWA/maxresdefault.jpg"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              {/* 3D Position Controls */}
              <div className="space-y-4">
                <h4 className="font-semibold">3D Positioning</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Position X</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.position.x}
                      onChange={(e) => setFormData({
                        ...formData,
                        position: { ...formData.position, x: parseFloat(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Position Y</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.position.y}
                      onChange={(e) => setFormData({
                        ...formData,
                        position: { ...formData.position, y: parseFloat(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Position Z</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.position.z}
                      onChange={(e) => setFormData({
                        ...formData,
                        position: { ...formData.position, z: parseFloat(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Saving...' : (editingArtwork ? 'Update' : 'Create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover-lift">
                <div className="relative aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                  {artwork.imageUrl ? (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <Palette className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{artwork.artist}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{artwork.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${artwork.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="h-3 w-3" />
                      <span>{artwork.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{artwork._count?.offers || 0} offers</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(artwork)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(artwork)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No artworks yet</h3>
          <p className="text-gray-600">Add your first artwork to get started.</p>
        </div>
      )}
    </div>
  );
}
