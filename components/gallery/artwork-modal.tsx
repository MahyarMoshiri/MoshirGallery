
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { X, Heart, Share2, DollarSign, Calendar, Palette, Ruler } from 'lucide-react';

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
}

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    userName: '',
    userEmail: '',
    offerAmount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artwork) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artworkId: artwork.id,
          ...offerData
        }),
      });

      if (response.ok) {
        toast({
          title: "Offer Submitted",
          description: "Your offer has been submitted successfully. We'll be in touch soon!",
        });
        setOfferData({ userName: '', userEmail: '', offerAmount: '', message: '' });
        setShowOfferForm(false);
      } else {
        throw new Error('Failed to submit offer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!artwork) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {artwork.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {artwork.imageUrl ? (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <Palette className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowOfferForm(!showOfferForm)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {artwork.artist}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{artwork.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span>{artwork.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span>{artwork.dimensions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-primary">
                    ${artwork.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Offer Form */}
            <AnimatePresence>
              {showOfferForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Make an Offer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleOfferSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="userName">Name</Label>
                            <Input
                              id="userName"
                              value={offerData.userName}
                              onChange={(e) => setOfferData({ ...offerData, userName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="userEmail">Email</Label>
                            <Input
                              id="userEmail"
                              type="email"
                              value={offerData.userEmail}
                              onChange={(e) => setOfferData({ ...offerData, userEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="offerAmount">Offer Amount ($)</Label>
                          <Input
                            id="offerAmount"
                            type="number"
                            min="1"
                            value={offerData.offerAmount}
                            onChange={(e) => setOfferData({ ...offerData, offerAmount: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            value={offerData.message}
                            onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                            placeholder="Tell us about your interest in this piece..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? 'Submitting...' : 'Submit Offer'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowOfferForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
