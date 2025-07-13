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
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import type { MenuItem } from '@/lib/types';

const categories = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
  'Salads',
  'Soups',
  'Breads',
  'Sides'
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    category: '',
    modelColor: '#3B82F6',
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await api.fetchData('/api/menu-items');
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
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
      const response = await api.uploadImage(selectedFile, 'menu-items');
      setFormData(prev => ({ ...prev, image: response.secure_url }));
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
    // Validate required fields
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.price || !formData.image?.trim() || !formData.dataAiHint?.trim() || !formData.category?.trim()) {
      const missingFields = [];
      if (!formData.name?.trim()) missingFields.push('Name');
      if (!formData.description?.trim()) missingFields.push('Description');
      if (!formData.price) missingFields.push('Price');
      if (!formData.image?.trim()) missingFields.push('Image');
      if (!formData.dataAiHint?.trim()) missingFields.push('AI Hint');
      if (!formData.category?.trim()) missingFields.push('Category');
      
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const menuData = {
        ...formData,
        price: parseFloat(formData.price),
      };
      
      console.log('Sending menu data:', menuData);
      
      const newItem = await api.postData('/api/menu-items', menuData);

      setMenuItems(prev => [...prev, newItem]);
      resetForm();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add menu item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    // Validate required fields
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.price || !formData.image?.trim() || !formData.dataAiHint?.trim() || !formData.category?.trim()) {
      const missingFields = [];
      if (!formData.name?.trim()) missingFields.push('Name');
      if (!formData.description?.trim()) missingFields.push('Description');
      if (!formData.price) missingFields.push('Price');
      if (!formData.image?.trim()) missingFields.push('Image');
      if (!formData.dataAiHint?.trim()) missingFields.push('AI Hint');
      if (!formData.category?.trim()) missingFields.push('Category');
      
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedItem = await api.putData(`/api/menu-items/${editingItem.id}`, {
        ...formData,
        price: parseFloat(formData.price),
      });

      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      resetForm();
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update menu item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await api.deleteData(`/api/menu-items/${id}`);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      dataAiHint: item.dataAiHint,
      category: item.category,
      modelColor: item.modelColor,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      dataAiHint: '',
      category: '',
      modelColor: '#3B82F6',
    });
    setSelectedFile(null);
    setImagePreview('');
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">Menu Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="text-sm sm:text-base">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the new menu item.
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelColor">Model Color</Label>
                  <Input
                    id="modelColor"
                    type="color"
                    value={formData.modelColor}
                    onChange={(e) => setFormData({...formData, modelColor: e.target.value})}
                  />
                </div>
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
                {formData.image && (
                  <div className="mt-2">
                    <Label>Current Image</Label>
                    <img src={formData.image} alt="Current" className="h-20 w-20 object-cover rounded mt-1" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAiHint">AI Hint</Label>
                <Input
                  id="dataAiHint"
                  value={formData.dataAiHint}
                  onChange={(e) => setFormData({...formData, dataAiHint: e.target.value})}
                  placeholder="beef burger"
                />
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
            placeholder="Search menu items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {api.loading && menuItems.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading menu items...</p>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell>₹{item.price.toFixed(2)}</TableCell>
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
                          onClick={() => handleDeleteItem(item.id || item._id || '')}
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
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-4">
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
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            <span className="text-sm font-medium">₹{item.price.toFixed(2)}</span>
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
                            onClick={() => handleDeleteItem(item.id || item._id || '')}
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
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details for this menu item.
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
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-modelColor">Model Color</Label>
                <Input
                  id="edit-modelColor"
                  type="color"
                  value={formData.modelColor}
                  onChange={(e) => setFormData({...formData, modelColor: e.target.value})}
                />
              </div>
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
              {formData.image && (
                <div className="mt-2">
                  <Label>Current Image</Label>
                  <img src={formData.image} alt="Current" className="h-20 w-20 object-cover rounded mt-1" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dataAiHint">AI Hint</Label>
              <Input
                id="edit-dataAiHint"
                value={formData.dataAiHint}
                onChange={(e) => setFormData({...formData, dataAiHint: e.target.value})}
                placeholder="beef burger"
              />
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
            <DialogTitle>Menu Item Details</DialogTitle>
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
                  <Badge variant="secondary">{viewingItem.category}</Badge>
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