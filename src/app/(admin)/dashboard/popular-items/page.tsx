"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import type { PopularItem } from '@/lib/types';
import { Card } from '@/components/ui/card';

export default function PopularItemsPage() {
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PopularItem | null>(null);
  const [viewingItem, setViewingItem] = useState<PopularItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const { toast } = useToast();
  const api = useApi();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    dataAiHint: '',
    tags: '',
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchPopularItems();
  }, []);

  const fetchPopularItems = async () => {
    try {
      const data = await api.fetchData('/api/popular-items');
      console.log('Fetched popular items:', data);
      
      // Check for duplicates in the fetched data
      const ids = data.map((item: any) => item._id || item.id);
      const uniqueIds = [...new Set(ids)];
      
      if (ids.length !== uniqueIds.length) {
        console.warn('Duplicate IDs found in fetched data:', {
          total: ids.length,
          unique: uniqueIds.length,
          duplicates: ids.filter((id: any, index: number) => ids.indexOf(id) !== index)
        });
      }
      
      setPopularItems(data);
    } catch (error) {
      console.error('Error fetching popular items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch popular items",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    try {
      const response = await api.uploadImage(selectedFile, 'popular-items');
      console.log('Image upload response:', response);
      
      // Ensure we have the secure_url
      const imageUrl = response.secure_url || response.url;
      if (!imageUrl) {
        throw new Error('No image URL received from upload');
      }
      
      console.log('Setting image URL:', imageUrl);
      setFormData(prev => {
        const updated = { ...prev, image: imageUrl };
        console.log('Updated form data:', updated);
        return updated;
      });
      
      setSelectedFile(null);
      setImagePreview('');
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async () => {
    console.log('Current form data before validation:', formData);
    
    // Validate required fields
    const trimmedName = formData.name?.trim();
    const trimmedDescription = formData.description?.trim();
    const trimmedImage = formData.image?.trim();
    const trimmedDataAiHint = formData.dataAiHint?.trim();
    
    console.log('Trimmed values:', {
      name: trimmedName,
      description: trimmedDescription,
      price: formData.price,
      image: trimmedImage,
      dataAiHint: trimmedDataAiHint
    });
    
    if (!trimmedName || !trimmedDescription || !formData.price || !trimmedImage || !trimmedDataAiHint) {
      const missingFields = [];
      if (!trimmedName) missingFields.push('Name');
      if (!trimmedDescription) missingFields.push('Description');
      if (!formData.price) missingFields.push('Price');
      if (!trimmedImage) missingFields.push('Image');
      if (!trimmedDataAiHint) missingFields.push('AI Hint');
      
      console.log('Missing fields:', missingFields);
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const itemData = {
        name: trimmedName,
        description: trimmedDescription,
        price: parseFloat(formData.price),
        image: trimmedImage,
        dataAiHint: trimmedDataAiHint,
        order: parseInt(formData.order),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: formData.isActive,
      };
      
      console.log('Sending popular item data:', itemData);
      console.log('Form data before submission:', formData);
      
      const newItem = await api.postData('/api/popular-items', itemData);

      setPopularItems(prev => {
        // Check if item already exists to prevent duplicates
        const exists = prev.some(item => 
          (item._id && item._id === newItem._id) || 
          (item.id && item.id === newItem.id)
        );
        
        if (exists) {
          console.warn('Item already exists, not adding duplicate:', newItem);
          return prev;
        }
        
        return [...prev, newItem];
      });
      
      // Close dialog and show success message
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Popular item added successfully",
      });
    } catch (error) {
      console.error('Error adding popular item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add popular item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Don't close dialog on error - let user fix the issue
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    // Validate required fields
    const trimmedName = formData.name?.trim();
    const trimmedDescription = formData.description?.trim();
    const trimmedImage = formData.image?.trim();
    const trimmedDataAiHint = formData.dataAiHint?.trim();
    
    if (!trimmedName || !trimmedDescription || !formData.price || !trimmedImage || !trimmedDataAiHint) {
      const missingFields = [];
      if (!trimmedName) missingFields.push('Name');
      if (!trimmedDescription) missingFields.push('Description');
      if (!formData.price) missingFields.push('Price');
      if (!trimmedImage) missingFields.push('Image');
      if (!trimmedDataAiHint) missingFields.push('AI Hint');
      
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedItem = await api.putData(`/api/popular-items/${editingItem._id || editingItem.id}`, {
        name: trimmedName,
        description: trimmedDescription,
        price: parseFloat(formData.price),
        image: trimmedImage,
        dataAiHint: trimmedDataAiHint,
        order: parseInt(formData.order),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: formData.isActive,
      });

      setPopularItems(prev => prev.map(item => 
        (item._id === editingItem._id || item.id === editingItem.id) ? updatedItem : item
      ));
      
      // Close dialog and show success message
      setIsEditDialogOpen(false);
      resetForm();
      setEditingItem(null);
      
      toast({
        title: "Success",
        description: "Popular item updated successfully",
      });
    } catch (error) {
      console.error('Error updating popular item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update popular item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Don't close dialog on error - let user fix the issue
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteData(`/api/popular-items/${id}`);
      setPopularItems(prev => prev.filter(item => (item._id !== id && item.id !== id)));
      toast({
        title: "Success",
        description: "Popular item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete popular item",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (item: PopularItem) => {
    try {
      const updatedItem = await api.putData(`/api/popular-items/${item._id || item.id}`, {
        ...item,
        isActive: !item.isActive,
      });

      setPopularItems(prev => prev.map(prevItem => 
        (prevItem._id === item._id || prevItem.id === item.id) ? updatedItem : prevItem
      ));
      
      toast({
        title: "Success",
        description: `Item ${updatedItem.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: PopularItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      dataAiHint: item.dataAiHint,
      tags: item.tags.join(', '),
      order: item.order.toString(),
      isActive: item.isActive,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      dataAiHint: '',
      tags: '',
      order: '0',
      isActive: true,
    });
    setSelectedFile(null);
    setImagePreview('');
  };



  const filteredItems = popularItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">Popular Items Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="text-sm sm:text-base w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Popular Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Popular Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the new popular item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="199"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Item description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAiHint">AI Hint</Label>
                  <Input
                    id="dataAiHint"
                    value={formData.dataAiHint}
                    onChange={(e) => setFormData({...formData, dataAiHint: e.target.value})}
                    placeholder="beef burger"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Best Seller, Hot 🔥, New"
                />
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <Button onClick={handleUploadImage} disabled={api.loading} className="w-full sm:w-auto">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview('');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL (Manual)</Label>
                  <Input
                    id="image-url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <Label>Current Image</Label>
                    <img src={formData.image} alt="Current" className="h-20 w-20 object-cover rounded mt-1" />
                    <p className="text-xs text-muted-foreground mt-1 break-all">URL: {formData.image}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem} disabled={api.loading}>
                {api.loading ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search popular items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {api.loading && popularItems.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading popular items...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={`${item._id || item.id || 'item'}-${item.name}-${index}`}>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>₹{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => handleToggleActive(item)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setViewingItem(item);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            openEditDialog(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item._id || item.id || '')}
                        >
                          <Trash2 className="h-4 w-4" />
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
              {filteredItems.map((item, index) => (
                <Card key={`${item._id || item.id || 'item'}-${item.name}-${index}`} className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-medium">₹{item.price.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">Order: {item.order}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags?.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Switch
                              checked={item.isActive}
                              onCheckedChange={() => handleToggleActive(item)}
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setViewingItem(item);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              openEditDialog(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item._id || item.id || '')}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Popular Item</DialogTitle>
            <DialogDescription>
              Update the details for this popular item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="199"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Item description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dataAiHint">AI Hint</Label>
                <Input
                  id="edit-dataAiHint"
                  value={formData.dataAiHint}
                  onChange={(e) => setFormData({...formData, dataAiHint: e.target.value})}
                  placeholder="beef burger"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="Best Seller, Hot 🔥, New"
              />
            </div>
            
            {/* Image Upload Section for Edit */}
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button onClick={handleUploadImage} disabled={api.loading} className="w-full sm:w-auto">
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview('');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-image-url">Image URL (Manual)</Label>
                <Input
                  id="edit-image-url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <Label>Current Image</Label>
                  <img src={formData.image} alt="Current" className="h-20 w-20 object-cover rounded mt-1" />
                  <p className="text-xs text-muted-foreground mt-1 break-all">URL: {formData.image}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={api.loading}>
              {api.loading ? 'Updating...' : 'Update Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Popular Item Details</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="grid gap-4 py-4 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={viewingItem.image}
                  alt={viewingItem.name}
                  className="h-32 w-32 object-cover rounded flex-shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold">{viewingItem.name}</h3>
                  <p className="text-2xl font-bold text-primary">₹{viewingItem.price.toFixed(2)}</p>
                  <div className="flex flex-wrap gap-1">
                    {viewingItem.tags?.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={viewingItem.isActive} disabled />
                    <span className="text-sm text-muted-foreground">
                      {viewingItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Order: {viewingItem.order}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">{viewingItem.description}</p>
              </div>
              <div className="space-y-2">
                <Label>AI Hint</Label>
                <p className="text-sm text-muted-foreground">{viewingItem.dataAiHint}</p>
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