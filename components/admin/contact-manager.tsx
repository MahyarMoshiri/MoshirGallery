'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Mail, Trash2, Check } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ContactManagerProps {
  onStatsUpdate?: () => void;
}

export default function ContactManager({ onStatsUpdate }: ContactManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to load contacts', err);
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast({ title: 'Updated', description: 'Contact status updated' });
        loadContacts();
        onStatsUpdate?.();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive'
      });
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Contact removed' });
        loadContacts();
        onStatsUpdate?.();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Mail className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No messages found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell className="capitalize">{c.status}</TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    {c.status === 'unread' && (
                      <Button size="sm" onClick={() => updateStatus(c.id, 'read')}>
                        <Check className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteContact(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

