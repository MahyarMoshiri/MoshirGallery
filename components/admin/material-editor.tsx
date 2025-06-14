import { MaterialProperties } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MaterialEditorProps {
  material: MaterialProperties;
  onChange: (material: MaterialProperties) => void;
  className?: string;
}

export default function MaterialEditor({ material, onChange, className }: MaterialEditorProps) {
  const update = (prop: keyof MaterialProperties, value: any) => {
    onChange({
      ...material,
      [prop]: value,
    });
  };

  return (
    <div className={className ? className : 'grid grid-cols-2 md:grid-cols-4 gap-4'}>
      <div>
        <Label htmlFor="mat-color">Color</Label>
        <Input
          id="mat-color"
          type="color"
          value={material.color}
          onChange={(e) => update('color', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="mat-metalness">Metalness</Label>
        <Input
          id="mat-metalness"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={material.metalness}
          onChange={(e) => update('metalness', parseFloat(e.target.value))}
        />
        <span className="text-xs text-gray-500">{material.metalness}</span>
      </div>
      <div>
        <Label htmlFor="mat-roughness">Roughness</Label>
        <Input
          id="mat-roughness"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={material.roughness}
          onChange={(e) => update('roughness', parseFloat(e.target.value))}
        />
        <span className="text-xs text-gray-500">{material.roughness}</span>
      </div>
      <div>
        <Label htmlFor="mat-opacity">Opacity</Label>
        <Input
          id="mat-opacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={material.opacity}
          onChange={(e) => update('opacity', parseFloat(e.target.value))}
        />
        <span className="text-xs text-gray-500">{material.opacity}</span>
      </div>
    </div>
  );
}
