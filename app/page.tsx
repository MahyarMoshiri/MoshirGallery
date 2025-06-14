
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import GalleryHeader from '@/components/gallery/gallery-header';
import GalleryControls from '@/components/gallery/gallery-controls';
import ArtworkModal from '@/components/gallery/artwork-modal';
import LoadingScreen from '@/components/gallery/loading-screen';
import ErrorBoundary from '@/components/error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Eye, Calendar, DollarSign } from 'lucide-react';
import Image from 'next/image';

// Dynamic import for 3D scene to avoid SSR issues
const GalleryScene = dynamic(
  () => import('@/components/gallery/gallery-scene'),
  { 
    ssr: false,
    loading: () => <LoadingScreen message="Loading 3D gallery..." />
  }
);

import { Artwork, GalleryEnvironment, Transform3D } from '@/lib/types';

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeEnvironment, setActiveEnvironment] = useState<GalleryEnvironment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is3DView, setIs3DView] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const initializeGallery = async () => {
      try {
        // Simulate loading progress
        setLoadingProgress(20);
        
        // Check if artworks exist
        let artworksResponse = await fetch('/api/artworks');
        let artworksData: Artwork[] = [];
        if (artworksResponse.ok) {
          artworksData = await artworksResponse.json();
        }

        // Seed database if empty (development only)
        if (artworksData.length === 0 && process.env.NODE_ENV === 'development') {
          await fetch('/api/seed', { method: 'POST' });
          artworksResponse = await fetch('/api/artworks');
          artworksData = await artworksResponse.json();
        }
        setLoadingProgress(40);

        // Fetch active environment
        const environmentsResponse = await fetch('/api/environments');
        if (environmentsResponse.ok) {
          const environments = await environmentsResponse.json();
          const active = environments.find((env: GalleryEnvironment) => env.isActive);
          setActiveEnvironment(active || null);
        }
        setLoadingProgress(60);

        setArtworks(artworksData);
        setLoadingProgress(80);

        setLoadingProgress(100);
        
        // Small delay for smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error initializing gallery:', error);
        setIsLoading(false);
      }
    };

    initializeGallery();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const toggleView = () => {
    setIs3DView(!is3DView);
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        progress={loadingProgress}
        message={
          loadingProgress < 30 ? "Initializing gallery..." :
          loadingProgress < 60 ? "Loading artworks..." :
          loadingProgress < 90 ? "Preparing 3D environment..." :
          "Almost ready..."
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryHeader onToggleView={toggleView} is3DView={is3DView} />
      
      <main className="pt-16">
        {is3DView ? (
          <>
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center min-h-[600px] bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">3D gallery failed to load</p>
                    <Button onClick={toggleView}>Switch to 2D View</Button>
                  </div>
                </div>
              }
            >
              <GalleryScene 
                artworks={artworks} 
                onArtworkClick={handleArtworkClick}
                environment={activeEnvironment || undefined}
              />
            </ErrorBoundary>
            <GalleryControls 
              onToggleInfo={() => setShowControls(!showControls)}
              showInfo={showControls}
            />
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Contemporary Art Collection
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover exceptional artworks from emerging and established artists in our curated collection
              </p>
              <Button 
                onClick={toggleView}
                className="mt-6"
                size="lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                Experience in 3D
              </Button>
            </motion.div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="hover-lift cursor-pointer group"
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    <div className="relative aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                      {artwork.imageUrl ? (
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                          <Palette className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{artwork.artist}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{artwork.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-primary">
                            ${artwork.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
}
