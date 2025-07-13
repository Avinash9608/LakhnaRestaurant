'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
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

interface Offer {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
  category: string;
  terms: string;
  maxUses?: number;
  currentUses: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
  const api = useApi();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    image: '',
    category: '',
    terms: '',
    maxUses: '',
    isActive: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await api.fetchData('/api/offers');
      setOffers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch offers',
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
      
      let imageUrl = formData.image;
      let cloudinaryId = '';
      
      if (imageFile) {
        const uploadResult = await api.uploadImage(imageFile, 'offers');
        imageUrl = uploadResult.secure_url || uploadResult.url;
        cloudinaryId = uploadResult.public_id;
      }

      const offerData = {
        ...formData,
        image: imageUrl,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        discountPercentage: parseFloat(formData.discountPercentage),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        currentUses: 0,
        order: offers.length,
      };

      if (selectedOffer) {
        await api.putData(`/api/offers/${selectedOffer._id}`, offerData);
        toast({
          title: 'Success',
          description: 'Offer updated successfully',
        });
      } else {
        await api.postData('/api/offers', offerData);
        toast({
          title: 'Success',
          description: 'Offer created successfully',
        });
      }

      resetForm();
      fetchOffers();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save offer',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      originalPrice: offer.originalPrice.toString(),
      discountedPrice: offer.discountedPrice.toString(),
      discountPercentage: offer.discountPercentage.toString(),
      startDate: offer.startDate.split('T')[0],
      endDate: offer.endDate.split('T')[0],
      image: offer.image,
      category: offer.category,
      terms: offer.terms,
      maxUses: offer.maxUses?.toString() || '',
      isActive: offer.isActive,
    });
    setImagePreview(offer.image);
    setIsEditDialogOpen(true);
  };

  const handleView = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        await api.deleteData(`/api/offers/${id}`);
        toast({
          title: 'Success',
          description: 'Offer deleted successfully',
        });
        fetchOffers();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete offer',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      discountPercentage: '',
      startDate: '',
      endDate: '',
      image: '',
      category: '',
      terms: '',
      maxUses: '',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedOffer(null);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || offer.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || !statusFilter || 
                         (statusFilter === 'active' && offer.isActive) ||
                         (statusFilter === 'inactive' && !offer.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      combo: 'bg-blue-100 text-blue-800',
      discount: 'bg-green-100 text-green-800',
      'free-delivery': 'bg-purple-100 text-purple-800',
      'buy-one-get-one': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Offers Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combo">Combo</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="free-delivery">Free Delivery</SelectItem>
                      <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountedPrice">Discounted Price</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    step="0.01"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <Label htmlFor="image">Offer Image</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Saving...' : 'Save Offer'}
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
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="combo">Combo</SelectItem>
            <SelectItem value="discount">Discount</SelectItem>
            <SelectItem value="free-delivery">Free Delivery</SelectItem>
            <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
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
      </div>

      <div className="grid gap-4">
        {filteredOffers.map((offer) => (
          <Card key={offer._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{offer.title}</h3>
                      <Badge className={getCategoryColor(offer.category)}>
                        {offer.category}
                      </Badge>
                      <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{offer.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="line-through">₹{offer.originalPrice}</span>
                      <span className="font-semibold text-green-600">₹{offer.discountedPrice}</span>
                      <span className="text-orange-600">{offer.discountPercentage}% OFF</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(offer)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(offer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(offer._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No offers found</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1">
            {/* Same form fields as Add Dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combo">Combo</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="free-delivery">Free Delivery</SelectItem>
                    <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-originalPrice">Original Price</Label>
                <Input
                  id="edit-originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-discountedPrice">Discounted Price</Label>
                <Input
                  id="edit-discountedPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-discountPercentage">Discount %</Label>
                <Input
                  id="edit-discountPercentage"
                  type="number"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-terms">Terms & Conditions</Label>
              <Textarea
                id="edit-terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-maxUses">Max Uses (Optional)</Label>
              <Input
                id="edit-maxUses"
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div>
              <Label htmlFor="edit-image">Offer Image</Label>
              <div className="mt-2">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('edit-image')?.click()}
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

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-2 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Offer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedOffer.image}
                  alt={selectedOffer.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{selectedOffer.title}</h3>
                  <Badge className={getCategoryColor(selectedOffer.category)}>
                    {selectedOffer.category}
                  </Badge>
                  <Badge variant={selectedOffer.isActive ? 'default' : 'secondary'}>
                    {selectedOffer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-muted-foreground">{selectedOffer.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Original Price</Label>
                  <p className="text-lg line-through">₹{selectedOffer.originalPrice}</p>
                </div>
                <div>
                  <Label className="font-semibold">Discounted Price</Label>
                  <p className="text-lg font-semibold text-green-600">₹{selectedOffer.discountedPrice}</p>
                </div>
                <div>
                  <Label className="font-semibold">Discount</Label>
                  <p className="text-lg text-orange-600">{selectedOffer.discountPercentage}% OFF</p>
                </div>
                <div>
                  <Label className="font-semibold">Uses</Label>
                  <p className="text-lg">{selectedOffer.currentUses} / {selectedOffer.maxUses || '∞'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Start Date</Label>
                  <p>{new Date(selectedOffer.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-semibold">End Date</Label>
                  <p>{new Date(selectedOffer.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Terms & Conditions</Label>
                <p className="text-muted-foreground">{selectedOffer.terms}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                Created: {new Date(selectedOffer.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(selectedOffer.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 