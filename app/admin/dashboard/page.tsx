
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  LogOut, 
  Plus, 
  Eye, 
  Mail, 
  DollarSign,
  Users,
  TrendingUp,
  Settings
} from 'lucide-react';
import ArtworkManager from '@/components/admin/artwork-manager';
import OfferManager from '@/components/admin/offer-manager';
import ContactManager from '@/components/admin/contact-manager';
import EnvironmentManager from '@/components/admin/environment-manager';
import SculptureManager from '@/components/sculpture/sculpture-manager';

interface DashboardStats {
  totalArtworks: number;
  totalOffers: number;
  totalContacts: number;
  pendingOffers: number;
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ id: string; username: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalArtworks: 0,
    totalOffers: 0,
    totalContacts: 0,
    pendingOffers: 0,
    unreadContacts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify');
        if (!response.ok) {
          router.push('/admin');
          return;
        }
        const data = await response.json();
        setAdmin(data.admin);
        await loadStats();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    try {
      const [artworksRes, offersRes, contactsRes] = await Promise.all([
        fetch('/api/artworks'),
        fetch('/api/offers'),
        fetch('/api/contacts')
      ]);

      const [artworks, offers, contacts] = await Promise.all([
        artworksRes.json(),
        offersRes.json(),
        contactsRes.json()
      ]);

      setStats({
        totalArtworks: artworks.length,
        totalOffers: offers.length,
        totalContacts: contacts.length,
        pendingOffers: offers.filter((offer: any) => offer.status === 'pending').length,
        unreadContacts: contacts.filter((contact: any) => contact.status === 'unread').length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Palette className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Palette className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Moshir Gallery</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalArtworks}</p>
                </div>
                <Palette className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Offers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOffers}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Offers</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingOffers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-3xl font-bold text-red-600">{stats.unreadContacts}</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="artworks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="artworks" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Artworks
              </TabsTrigger>
              <TabsTrigger value="sculptures" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Sculptures
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Environment
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Offers ({stats.pendingOffers})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Messages ({stats.unreadContacts})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artworks">
              <ArtworkManager onStatsUpdate={loadStats} />
            </TabsContent>

            <TabsContent value="sculptures">
              <SculptureManager onStatsUpdate={loadStats} />
            </TabsContent>

            <TabsContent value="environment">
              <EnvironmentManager />
            </TabsContent>

            <TabsContent value="offers">
              <OfferManager onStatsUpdate={loadStats} />
            </TabsContent>

            <TabsContent value="contacts">
              <ContactManager onStatsUpdate={loadStats} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
