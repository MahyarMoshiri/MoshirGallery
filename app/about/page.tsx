
'use client';

import { motion } from 'framer-motion';
import GalleryHeader from '@/components/gallery/gallery-header';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Users, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryHeader />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Moshir Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Founded with a vision to revolutionize the art viewing experience, Moshir Gallery combines 
              cutting-edge 3D technology with carefully curated contemporary artworks to create an 
              immersive journey through modern artistic expression.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Card className="p-8">
              <CardContent className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We believe art should be accessible, engaging, and transformative. Through our innovative 
                  3D gallery platform, we're breaking down barriers between artists and art lovers, 
                  creating new possibilities for discovery, appreciation, and acquisition of contemporary art.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Palette,
                title: "Curated Collection",
                description: "Carefully selected artworks from emerging and established contemporary artists worldwide."
              },
              {
                icon: Globe,
                title: "3D Experience",
                description: "Immersive virtual gallery environment accessible from anywhere in the world."
              },
              {
                icon: Users,
                title: "Artist Support",
                description: "Direct connection between artists and collectors, fostering meaningful relationships."
              },
              {
                icon: Award,
                title: "Quality Assurance",
                description: "Every artwork is authenticated and comes with detailed provenance documentation."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover-lift">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Moshir Gallery was born from a simple yet powerful idea: what if experiencing art 
                  could be as limitless as imagination itself? Founded in 2024, we set out to create 
                  a new paradigm for art galleries that transcends physical boundaries.
                </p>
                <p>
                  Our team of art curators, technology innovators, and design experts work together 
                  to create experiences that honor both the artistic vision and the viewer's journey. 
                  Every detail, from the virtual lighting to the spatial arrangement, is carefully 
                  crafted to enhance the emotional impact of each artwork.
                </p>
                <p>
                  Today, Moshir Gallery serves as a bridge between traditional art appreciation and 
                  the digital future, offering collectors, enthusiasts, and curious minds a new way 
                  to discover and connect with contemporary art.
                </p>
              </div>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Vision for the Future</h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We envision a world where art transcends physical limitations, where a collector 
                    in Tokyo can walk through the same gallery space as someone in New York, where 
                    artists can showcase their work to a global audience instantly.
                  </p>
                  <p>
                    Our roadmap includes augmented reality features, virtual reality experiences, 
                    and AI-powered personalized curation, all designed to deepen the connection 
                    between art and audience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Pushing the boundaries of how art is experienced and shared"
                },
                {
                  title: "Accessibility",
                  description: "Making exceptional art available to everyone, everywhere"
                },
                {
                  title: "Authenticity",
                  description: "Maintaining the integrity and emotional power of artistic expression"
                }
              ].map((value, index) => (
                <Card key={value.title} className="p-6">
                  <CardContent className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
