'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
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

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  order: number;
  altText: string;
  tags: string[];
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
  const { fetchData, postData, putData, deleteData, uploadImage } = useApi();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    altText: '',
    tags: '',
    isActive: true,
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await fetchData('/api/gallery');
      setGalleryItems(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: 'Error',
          description: 'File size too large. Maximum size is 10MB.',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

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
      
      let imageUrl = formData.imageUrl;
      let cloudinaryId = '';
      
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, 'gallery');
        imageUrl = uploadResult.url;
        cloudinaryId = uploadResult.publicId;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.altText) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields (Title, Description, Category, Alt Text)',
          variant: 'destructive',
        });
        return;
      }

      // Ensure we have an image (either uploaded or existing)
      if (!imageFile && !imageUrl) {
        toast({
          title: 'Error',
          description: 'Please select an image to upload',
          variant: 'destructive',
        });
        return;
      }

      const galleryData = {
        ...formData,
        imageUrl,
        cloudinaryId,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        order: galleryItems.length,
      };

      if (selectedItem) {
        await putData(`/api/gallery/${selectedItem._id}`, galleryData);
        toast({
          title: 'Success',
          description: 'Gallery item updated successfully',
        });
      } else {
        await postData('/api/gallery', galleryData);
        toast({
          title: 'Success',
          description: 'Gallery item created successfully',
        });
      }

      resetForm();
      fetchGalleryItems();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving gallery item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save gallery item';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      altText: item.altText,
      tags: item.tags.join(', '),
      isActive: item.isActive,
    });
    setImagePreview(item.imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleView = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await deleteData(`/api/gallery/${id}`);
        toast({
          title: 'Success',
          description: 'Gallery item deleted successfully',
        });
        fetchGalleryItems();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete gallery item',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      altText: '',
      tags: '',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedItem(null);
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || !statusFilter || 
                         (statusFilter === 'active' && item.isActive) ||
                         (statusFilter === 'inactive' && !item.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: 'bg-orange-100 text-orange-800',
      restaurant: 'bg-blue-100 text-blue-800',
      chef: 'bg-purple-100 text-purple-800',
      ambiance: 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading gallery items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Gallery Item</DialogTitle>
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
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="ambiance">Ambiance</SelectItem>
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

              <div>
                <Label htmlFor="altText">Alt Text (for accessibility)</Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="food, restaurant, delicious, fresh"
                />
              </div>

              <div>
                <Label htmlFor="image">Gallery Image</Label>
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
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {imageFile ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    'Save Gallery Item'
                  )}
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
              placeholder="Search gallery items..."
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
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="chef">Chef</SelectItem>
            <SelectItem value="ambiance">Ambiance</SelectItem>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                <Badge variant={item.isActive ? 'default' : 'secondary'}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3} more
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(item)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No gallery items found</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1">
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
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="ambiance">Ambiance</SelectItem>
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

            <div>
              <Label htmlFor="edit-altText">Alt Text (for accessibility)</Label>
              <Input
                id="edit-altText"
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="food, restaurant, delicious, fresh"
              />
            </div>

            <div>
              <Label htmlFor="edit-image">Gallery Image</Label>
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
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {imageFile ? 'Uploading...' : 'Updating...'}
                    </>
                  ) : (
                    'Update Gallery Item'
                  )}
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Gallery Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 overflow-y-auto flex-1">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.altText}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={getCategoryColor(selectedItem.category)}>
                    {selectedItem.category}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Title</Label>
                <p className="text-lg">{selectedItem.title}</p>
              </div>

              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-muted-foreground">{selectedItem.description}</p>
              </div>

              <div>
                <Label className="font-semibold">Alt Text</Label>
                <p className="text-muted-foreground">{selectedItem.altText}</p>
              </div>

              <div>
                <Label className="font-semibold">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge variant={selectedItem.isActive ? 'default' : 'secondary'}>
                    {selectedItem.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Order</Label>
                  <p>{selectedItem.order}</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Created: {new Date(selectedItem.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(selectedItem.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}