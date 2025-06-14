
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Check, 
  X, 
  Clock, 
  Mail,
  Calendar,
  Palette
} from 'lucide-react';

interface Offer {
  id: string;
  userName: string;
  userEmail: string;
  offerAmount: number;
  message: string | null;
  status: string;
  createdAt: string;
  artwork: {
    title: string;
    artist: string;
    imageUrl: string | null;
  };
}

interface OfferManagerProps {
  onStatsUpdate: () => void;
}

export default function OfferManager({ onStatsUpdate }: OfferManagerProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast({
        title: "Error",
        description: "Failed to load offers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, status: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Offer Updated",
          description: `Offer has been ${status}.`,
        });
        loadOffers();
        onStatsUpdate();
      } else {
        throw new Error('Failed to update offer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredOffers = offers.filter(offer => 
    filter === 'all' || offer.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <DollarSign className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Offer Management</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status} ({offers.filter(o => status === 'all' || o.status === status).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Artwork Image */}
                    <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {offer.artwork.imageUrl ? (
                        <Image
                          src={offer.artwork.imageUrl}
                          alt={offer.artwork.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                          <Palette className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Offer Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {offer.artwork.title}
                          </h3>
                          <p className="text-gray-600">{offer.artwork.artist}</p>
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Mail className="h-4 w-4" />
                            <span>{offer.userName}</span>
                          </div>
                          <div className="text-sm text-gray-500">{offer.userEmail}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-lg text-primary">
                              ${offer.offerAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {offer.message && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            "{offer.message}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateOfferStatus(offer.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOfferStatus(offer.id, 'rejected')}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${offer.userEmail}?subject=Regarding your offer for ${offer.artwork.title}`)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      )}

                      {offer.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${offer.userEmail}?subject=Regarding your offer for ${offer.artwork.title}`)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No offers yet' : `No ${filter} offers`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Offers will appear here when visitors make them.'
              : `No offers with ${filter} status found.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
