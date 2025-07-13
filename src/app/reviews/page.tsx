'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star, Upload, X } from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export default function ReviewsPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    review: '',
    category: '',
    orderId: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.review.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image if selected
      let imageUrl = 'https://via.placeholder.com/150/cccccc/666666?text=User'; // Default image
      
      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadResult = await uploadImageToCloudinary(selectedFile, 'reviews');
          imageUrl = uploadResult.secure_url;
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: "Warning",
            description: "Image upload failed, using default image",
            variant: "destructive",
          });
          // Continue with default image
        } finally {
          setIsUploading(false);
        }
      }

      // Submit review
      const reviewData = {
        ...formData,
        customerImage: imageUrl,
        date: new Date().toISOString(),
        isActive: false, // Start as inactive until approved
        isVerified: false, // Start as unverified until approved
      };

      console.log('Submitting review data:', reviewData);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Thank you for your review! It will be reviewed and published soon.",
        });
        
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          rating: 5,
          review: '',
          category: '',
          orderId: '',
        });
        setSelectedFile(null);
        setImagePreview('');
      } else {
        throw new Error(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
        className="focus:outline-none"
      >
        <Star
          className={`h-6 w-6 transition-colors ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Share Your Experience
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            We'd love to hear about your dining experience at Lakhna Restaurant
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Review</CardTitle>
            <CardDescription>
              Your feedback helps us improve and helps other customers make informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex items-center space-x-1">
                  {renderStars(formData.rating)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Review Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food Quality</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="ambiance">Ambiance</SelectItem>
                    <SelectItem value="overall">Overall Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Your Review *</Label>
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID (Optional)</Label>
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="ORD-12345"
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Picture (Optional)</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                    disabled={isUploading}
                  />
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview('');
                      }}
                      className="w-full sm:w-auto"
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading Image...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All reviews are moderated before being published. We typically review and approve reviews within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
} 