'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { Search, Eye, Check, X, Star, MessageSquare } from 'lucide-react';

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerImage: string;
  rating: number;
  review: string;
  date: string;
  isActive: boolean;
  isVerified: boolean;
  orderId?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { toast } = useToast();
  const api = useApi();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.fetchData('/api/reviews');
      setReviews(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (reviewId: string, currentStatus: boolean, field: 'isActive' | 'isVerified') => {
    try {
      const updatedReview = await api.putData(`/api/reviews/${reviewId}`, {
        [field]: !currentStatus
      });

      setReviews(prev => prev.map(review => 
        review._id === reviewId ? updatedReview : review
      ));

      const action = field === 'isActive' ? (currentStatus ? 'deactivated' : 'activated') : (currentStatus ? 'unverified' : 'verified');
      toast({
        title: 'Success',
        description: `Review ${action} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteData(`/api/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'service':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ambiance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'overall':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && review.isActive) ||
                         (statusFilter === 'inactive' && !review.isActive);
    const matchesVerification = verificationFilter === 'all' ||
                               (verificationFilter === 'verified' && review.isVerified) ||
                               (verificationFilter === 'unverified' && !review.isVerified);
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const stats = {
    total: reviews.length,
    active: reviews.filter(r => r.isActive).length,
    verified: reviews.filter(r => r.isVerified).length,
    pending: reviews.filter(r => !r.isVerified).length,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">Testimonials Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and approve customer reviews for display on the website
          </p>
        </div>
        <Button
          onClick={async () => {
            try {
              const response = await fetch('/api/seed-reviews', { method: 'POST' });
              if (response.ok) {
                toast({
                  title: 'Success',
                  description: 'Sample reviews created successfully',
                });
                fetchReviews();
              } else {
                toast({
                  title: 'Error',
                  description: 'Failed to create sample reviews',
                  variant: 'destructive',
                });
              }
            } catch (error) {
              toast({
                title: 'Error',
                description: 'Failed to create sample reviews',
                variant: 'destructive',
              });
            }
          }}
          variant="outline"
        >
          Seed Sample Reviews
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Reviews</div>
          </Card>
        </Card>
        <Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
        </Card>
        <Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </Card>
        </Card>
        <Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </Card>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                        <div>
                          <div className="font-medium">{review.customerName}</div>
                          <div className="text-sm text-muted-foreground">{review.customerEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{review.review}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm ml-1">{review.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(review.category)}>
                        {review.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={review.isActive}
                          onCheckedChange={() => handleStatusToggle(review._id, review.isActive, 'isActive')}
                        />
                        <span className="text-sm">{review.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={review.isVerified}
                          onCheckedChange={() => handleStatusToggle(review._id, review.isVerified, 'isVerified')}
                        />
                        <span className="text-sm">{review.isVerified ? 'Verified' : 'Unverified'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReview(review);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="grid gap-4 p-4">
              {filteredReviews.map((review) => (
                <Card key={review._id} className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.customerImage}
                      alt={review.customerName}
                      className="h-12 w-12 object-cover rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">{review.customerName}</h3>
                          <p className="text-xs text-muted-foreground">{review.customerEmail}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-muted-foreground ml-1">{review.rating}/5</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{review.review}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getCategoryColor(review.category)}`}>
                              {review.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReview(review);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={review.isActive}
                              onCheckedChange={() => handleStatusToggle(review._id, review.isActive, 'isActive')}
                            />
                            <span className="text-xs">{review.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={review.isVerified}
                              onCheckedChange={() => handleStatusToggle(review._id, review.isVerified, 'isVerified')}
                            />
                            <span className="text-xs">{review.isVerified ? 'Verified' : 'Unverified'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="grid gap-4 py-4 overflow-y-auto flex-1">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedReview.customerImage}
                  alt={selectedReview.customerName}
                  className="w-20 h-20 object-cover rounded-full flex-shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold">{selectedReview.customerName}</h3>
                  <p className="text-muted-foreground">{selectedReview.customerEmail}</p>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedReview.rating)}
                    <span className="text-lg font-semibold ml-2">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getCategoryColor(selectedReview.category)}>
                      {selectedReview.category}
                    </Badge>
                    <Badge variant={selectedReview.isActive ? 'default' : 'secondary'}>
                      {selectedReview.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={selectedReview.isVerified ? 'default' : 'outline'}>
                      {selectedReview.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Review</Label>
                <p className="text-muted-foreground mt-1">{selectedReview.review}</p>
              </div>

              {selectedReview.orderId && (
                <div>
                  <Label className="font-semibold">Order ID</Label>
                  <p className="text-muted-foreground mt-1">{selectedReview.orderId}</p>
                </div>
              )}

              <div>
                <Label className="font-semibold">Date</Label>
                <p className="text-muted-foreground mt-1">
                  {new Date(selectedReview.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedReview.isActive}
                      onCheckedChange={() => handleStatusToggle(selectedReview._id, selectedReview.isActive, 'isActive')}
                    />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedReview.isVerified}
                      onCheckedChange={() => handleStatusToggle(selectedReview._id, selectedReview.isVerified, 'isVerified')}
                    />
                    <span>Verified</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteReview(selectedReview._id);
                    setIsViewDialogOpen(false);
                  }}
                >
                  Delete Review
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 