'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, CheckCircle, XCircle, Edit, Trash2, Search, Filter } from 'lucide-react';

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  people: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmationMessage?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  adminNotes?: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await fetch(`/api/bookings?${params}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          confirmationMessage: status === 'confirmed' ? confirmationMessage : undefined,
          adminNotes,
          confirmedBy: 'Admin'
        }),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });

      fetchBookings();
      setEditDialogOpen(false);
      setSelectedBooking(null);
      setConfirmationMessage('');
      setAdminNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete booking');

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setConfirmationMessage(booking.confirmationMessage || '');
    setAdminNotes(booking.adminNotes || '');
    setEditDialogOpen(true);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      confirmed: { color: 'bg-green-500', text: 'Confirmed' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' },
      completed: { color: 'bg-blue-500', text: 'Completed' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Table Bookings</h1>
          <p className="text-muted-foreground">Manage restaurant table reservations</p>
        </div>
        <Button onClick={fetchBookings} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchBookings()}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchBookings} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.name}
                      {getStatusBadge(booking.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        +91{booking.phone}
                      </span>
                      {booking.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {booking.email}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Update Booking</DialogTitle>
                          <DialogDescription>
                            Update booking status and send confirmation message
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => {
                                if (selectedBooking) {
                                  setSelectedBooking({ ...selectedBooking, status: value as any });
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedBooking?.status === 'confirmed' && (
                            <div>
                              <Label>Confirmation Message</Label>
                              <Textarea
                                placeholder="Custom confirmation message (optional)"
                                value={confirmationMessage}
                                onChange={(e) => setConfirmationMessage(e.target.value)}
                              />
                            </div>
                          )}
                          <div>
                            <Label>Admin Notes</Label>
                            <Textarea
                              placeholder="Add internal notes..."
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => updateBookingStatus(booking._id, selectedBooking?.status || booking.status)}
                            disabled={updating}
                          >
                            {updating ? 'Updating...' : 'Update Booking'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.people} people</span>
                  </div>
                </div>
                {booking.specialRequests && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </p>
                  </div>
                )}
                {booking.adminNotes && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Admin Notes:</strong> {booking.adminNotes}
                    </p>
                  </div>
                )}
                {booking.confirmedAt && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Confirmed on {formatDate(booking.confirmedAt)} by {booking.confirmedBy}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* WhatsApp Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Business Number:</strong> +91 96089 89499</p>
            <p><strong>Commands:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>✅ CONFIRM [booking_id]</code> - Confirm a booking</li>
              <li><code>❌ CANCEL [booking_id]</code> - Cancel a booking</li>
              <li><code>📝 NOTES [booking_id] [notes]</code> - Add admin notes</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Check the console for incoming booking notifications and outgoing confirmation messages.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 