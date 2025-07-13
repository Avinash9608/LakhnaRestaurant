'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  people: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmationMessage?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await fetch(`/api/bookings?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
  const updateBookingStatus = async (bookingId: string, newStatus: string, notes?: string) => {
    try {
      setUpdatingStatus(bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
          confirmationMessage: notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      const updatedBooking = await response.json();
      
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}${newStatus === 'confirmed' ? ' - Customer will be notified via email and WhatsApp' : ''}`,
      });

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = (phone: string, message: string) => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Load bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [searchTerm, statusFilter, dateFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Reservations</h1>
        <div className="flex gap-2">
          <Button onClick={fetchBookings} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, phone, or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder="Filter by date"
          className="w-full sm:w-[180px]"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading reservations...</span>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{booking.name}</CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        +91 {booking.phone}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(booking.time)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{booking.people} {booking.people === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Special Requests:</p>
                    <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                  </div>
                )}

                {booking.adminNotes && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Admin Notes:</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{booking.adminNotes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {/* Status Update Buttons */}
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        disabled={updatingStatus === booking._id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updatingStatus === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        disabled={updatingStatus === booking._id}
                      >
                        {updatingStatus === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      disabled={updatingStatus === booking._id}
                    >
                      {updatingStatus === booking._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Mark Complete
                    </Button>
                  )}

                  {/* WhatsApp Message Button */}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => sendWhatsAppMessage(booking.phone, `Hi ${booking.name}, regarding your table reservation for ${formatDate(booking.date)} at ${formatTime(booking.time)} for ${booking.people} people.`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>

                  {/* Add Notes Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setAdminNotes(booking.adminNotes || '');
                        }}
                      >
                        Add Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Admin Notes</DialogTitle>
                        <DialogDescription>
                          Add notes for booking: {booking.name} - {formatDate(booking.date)} at {formatTime(booking.time)}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Enter admin notes..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => updateBookingStatus(booking._id, booking.status, adminNotes)}
                            disabled={updatingStatus === booking._id}
                          >
                            {updatingStatus === booking._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Save Notes'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  <span>Created: {new Date(booking.createdAt).toLocaleString('en-IN')}</span>
                  {booking.updatedAt !== booking.createdAt && (
                    <span className="ml-4">Updated: {new Date(booking.updatedAt).toLocaleString('en-IN')}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-8 py-12">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No reservations found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || dateFilter 
                ? 'Try adjusting your search or filters.' 
                : 'New reservations will appear here.'}
            </p>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {!loading && bookings.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 