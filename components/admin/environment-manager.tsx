'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

interface LightingConfig {
  id: string;
  environmentId: string;
  name: string;
  type: string;
  color: string;
  intensity: number;
  isEnabled: boolean;
}

interface GalleryEnvironment {
  id: string;
  name: string;
  isActive: boolean;
  wallConfig: any;
  floorConfig: any;
  ceilingConfig: any;
  dimensions: { width: number; height: number; depth: number };
  lightingConfigs: LightingConfig[];
  createdAt: string;
}

export default function EnvironmentManager() {
  const [environments, setEnvironments] = useState<GalleryEnvironment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnv, setEditingEnv] = useState<GalleryEnvironment | null>(null);
  const [lightConfigs, setLightConfigs] = useState<LightingConfig[]>([]);
  const [formData, setFormData] = useState({ name: '', width: 20, height: 4, depth: 15 });
  const { toast } = useToast();

  const defaultMaterial = {
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.8,
    emissive: '#000000',
    emissiveIntensity: 0,
    transparent: false,
    opacity: 1
  };

  const defaultSurface = { color: '#ffffff', material: defaultMaterial };

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    try {
      const res = await fetch('/api/environments');
      if (res.ok) {
        const data = await res.json();
        setEnvironments(data);
      }
    } catch (err) {
      console.error('Failed to load environments', err);
      toast({ title: 'Error', description: 'Failed to load environments', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const openNew = () => {
    setEditingEnv(null);
    setFormData({ name: '', width: 20, height: 4, depth: 15 });
    setLightConfigs([]);
    setIsDialogOpen(true);
  };

  const openEdit = (env: GalleryEnvironment) => {
    setEditingEnv(env);
    setFormData({ name: env.name, width: env.dimensions.width, height: env.dimensions.height, depth: env.dimensions.depth });
    setLightConfigs(env.lightingConfigs || []);
    setIsDialogOpen(true);
  };

  const handleEnvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      wallConfig: editingEnv?.wallConfig || defaultSurface,
      floorConfig: editingEnv?.floorConfig || defaultSurface,
      ceilingConfig: editingEnv?.ceilingConfig || defaultSurface,
      dimensions: { width: formData.width, height: formData.height, depth: formData.depth }
    };

    const url = editingEnv ? `/api/environments/${editingEnv.id}` : '/api/environments';
    const method = editingEnv ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        const env = await res.json();
        // Update lighting configs
        for (const light of lightConfigs) {
          if (light.id.startsWith('new-')) {
            await fetch('/api/lighting', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...light, environmentId: env.id })
            });
          } else {
            await fetch(`/api/lighting/${light.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(light)
            });
          }
        }
        toast({ title: 'Saved', description: 'Environment saved successfully' });
        setIsDialogOpen(false);
        loadEnvironments();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save environment', variant: 'destructive' });
    }
  };

  const deleteEnv = async (env: GalleryEnvironment) => {
    if (!confirm(`Delete environment "${env.name}"?`)) return;
    try {
      const res = await fetch(`/api/environments/${env.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Environment removed' });
        loadEnvironments();
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete environment', variant: 'destructive' });
    }
  };

  const activateEnv = async (env: GalleryEnvironment) => {
    try {
      const res = await fetch(`/api/environments/${env.id}/activate`, { method: 'POST' });
      if (res.ok) {
        toast({ title: 'Activated', description: `${env.name} is now active` });
        loadEnvironments();
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to activate', variant: 'destructive' });
    }
  };

  const updateLightField = (index: number, field: keyof LightingConfig, value: any) => {
    setLightConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addLight = () => {
    setLightConfigs((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        environmentId: editingEnv?.id || '',
        name: 'New Light',
        type: 'ambient',
        color: '#ffffff',
        intensity: 1,
        isEnabled: true
      }
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <CheckCircle className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Environments</h2>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />Add Environment
        </Button>
      </div>

      <div className="space-y-4">
        {environments.map((env) => (
          <Card key={env.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{env.name}</CardTitle>
                {env.isActive && <span className="text-sm text-green-600">Active</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => activateEnv(env)}>
                  <CheckCircle className="h-4 w-4 mr-1" />Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(env)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteEnv(env)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingEnv ? 'Edit Environment' : 'New Environment'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEnvSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input type="number" id="width" value={formData.width} onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })} required />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input type="number" id="height" value={formData.height} onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })} required />
              </div>
              <div>
                <Label htmlFor="depth">Depth</Label>
                <Input type="number" id="depth" value={formData.depth} onChange={(e) => setFormData({ ...formData, depth: Number(e.target.value) })} required />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lighting</h3>
                <Button type="button" size="sm" onClick={addLight}>
                  <Plus className="h-4 w-4 mr-1" />Add Light
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Intensity</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lightConfigs.map((light, idx) => (
                    <TableRow key={light.id}>
                      <TableCell>
                        <Input value={light.name} onChange={(e) => updateLightField(idx, 'name', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input value={light.type} onChange={(e) => updateLightField(idx, 'type', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={light.intensity} onChange={(e) => updateLightField(idx, 'intensity', Number(e.target.value))} />
                      </TableCell>
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4" checked={light.isEnabled} onChange={(e) => updateLightField(idx, 'isEnabled', e.target.checked)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

