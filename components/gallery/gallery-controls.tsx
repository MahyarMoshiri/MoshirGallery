
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Move3D, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Home,
  Info,
  Eye,
  Navigation
} from 'lucide-react';

interface GalleryControlsProps {
  onResetCamera?: () => void;
  onToggleInfo?: () => void;
  showInfo?: boolean;
}

export default function GalleryControls({ 
  onResetCamera, 
  onToggleInfo, 
  showInfo = false 
}: GalleryControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="gallery-ui fixed bottom-6 right-6 z-40"
    >
      <Card className="p-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg">
        <div className="flex flex-col gap-2">
          {/* Reset Camera */}
          {onResetCamera && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetCamera}
              className="w-10 h-10 p-0"
              title="Reset Camera"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}

          {/* Toggle Info */}
          {onToggleInfo && (
            <Button
              variant={showInfo ? "default" : "ghost"}
              size="sm"
              onClick={onToggleInfo}
              className="w-10 h-10 p-0"
              title="Toggle Controls Info"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      {/* Controls Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full right-0 mb-4 w-64"
        >
          <Card className="p-4 bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Gallery Controls
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Move3D className="h-3 w-3" />
                <span>Click & drag to rotate view</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomIn className="h-3 w-3" />
                <span>Scroll to zoom in/out</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                <span>Click artworks for details</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3 w-3" />
                <span>Right-click & drag to pan</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Mobile:</strong> Touch & drag to navigate, pinch to zoom
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
