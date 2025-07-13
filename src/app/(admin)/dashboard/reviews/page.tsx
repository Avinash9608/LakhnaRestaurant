'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';

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
  cloudinaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
  const { fetchData, postData, putData, deleteData, uploadImage } = useApi();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerImage: '',
    rating: '',
    review: '',
    category: '',
    orderId: '',
    isActive: true,
    isVerified: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchData('/api/reviews');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let imageUrl = formData.customerImage;
      let cloudinaryId = '';
      
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, 'reviews');
        imageUrl = uploadResult.url;
        cloudinaryId = uploadResult.publicId;
      }

      const reviewData = {
        ...formData,
        customerImage: imageUrl,
        cloudinaryId,
        rating: parseInt(formData.rating),
        orderId: formData.orderId || undefined,
      };

      if (selectedReview) {
        await putData(`/api/reviews/${selectedReview._id}`, reviewData);
        toast({
          title: 'Success',
          description: 'Review updated successfully',
        });
      } else {
        await postData('/api/reviews', reviewData);
        toast({
          title: 'Success',
          description: 'Review created successfully',
        });
      }

      resetForm();
      fetchReviews();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      customerName: review.customerName,
      customerEmail: review.customerEmail,
      customerImage: review.customerImage,
      rating: review.rating.toString(),
      review: review.review,
      category: review.category,
      orderId: review.orderId || '',
      isActive: review.isActive,
      isVerified: review.isVerified,
    });
    setImagePreview(review.customerImage);
    setIsEditDialogOpen(true);
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteData(`/api/reviews/${id}`);
        toast({
          title: 'Success',
          description: 'Review deleted successfully',
        });
        fetchReviews();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete review',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerImage: '',
      rating: '',
      review: '',
      category: '',
      orderId: '',
      isActive: true,
      isVerified: false,
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || review.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || !statusFilter || 
                         (statusFilter === 'active' && review.isActive) ||
                         (statusFilter === 'inactive' && !review.isActive);
    const matchesVerification = verificationFilter === 'all' || !verificationFilter || 
                               (verificationFilter === 'verified' && review.isVerified) ||
                               (verificationFilter === 'unverified' && !review.isVerified);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesVerification;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: 'bg-orange-100 text-orange-800',
      service: 'bg-blue-100 text-blue-800',
      ambiance: 'bg-purple-100 text-purple-800',
      overall: 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="ambiance">Ambiance</SelectItem>
                      <SelectItem value="overall">Overall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="review">Review</Label>
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="orderId">Order ID (Optional)</Label>
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="ORD-12345"
                />
              </div>

              <div>
                <Label htmlFor="customerImage">Customer Image</Label>
                <div className="mt-2">
                  <Input
                    id="customerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('customerImage')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
                  />
                  <Label htmlFor="isVerified">Verified</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Saving...' : 'Save Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="ambiance">Ambiance</SelectItem>
            <SelectItem value="overall">Overall</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Reviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.customerImage}
                    alt={review.customerName}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{review.customerName}</h3>
                      <Badge className={getCategoryColor(review.category)}>
                        {review.category}
                      </Badge>
                      <Badge variant={review.isActive ? 'default' : 'secondary'}>
                        {review.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={review.isVerified ? 'default' : 'outline'}>
                        {review.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.customerEmail}</p>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground ml-2">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{review.review}</p>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                      {review.orderId && ` • Order: ${review.orderId}`}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(review)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(review)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews found</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-customerName">Customer Name</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-customerEmail">Customer Email</Label>
                <Input
                  id="edit-customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="ambiance">Ambiance</SelectItem>
                    <SelectItem value="overall">Overall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-review">Review</Label>
              <Textarea
                id="edit-review"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-orderId">Order ID (Optional)</Label>
              <Input
                id="edit-orderId"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                placeholder="ORD-12345"
              />
            </div>

            <div>
              <Label htmlFor="edit-customerImage">Customer Image</Label>
              <div className="mt-2">
                <Input
                  id="edit-customerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('edit-customerImage')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
                />
                <Label htmlFor="edit-isVerified">Verified</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedReview.customerImage}
                  alt={selectedReview.customerName}
                  className="w-24 h-24 object-cover rounded-full"
                />
                <div className="space-y-2">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Date</Label>
                  <p>{new Date(selectedReview.date).toLocaleDateString()}</p>
                </div>
                {selectedReview.orderId && (
                  <div>
                    <Label className="font-semibold">Order ID</Label>
                    <p>{selectedReview.orderId}</p>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Created: {new Date(selectedReview.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(selectedReview.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 