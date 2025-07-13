'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerImage: string;
  rating: number;
  review: string;
  date: string;
  category: string;
  isActive: boolean;
  isVerified: boolean;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?isActive=true&isVerified=true');
      if (response.ok) {
        const data = await response.json();
        // Get only the first 6 verified and active reviews
        setReviews(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our valued customers
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our valued customers
          </p>
        </div>
        
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review._id} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={review.customerImage}
                    alt={review.customerName}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {review.customerName}
                    </h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                    <Badge className={`text-xs mt-2 ${getCategoryColor(review.category)}`}>
                      {review.category}
                    </Badge>
                  </div>
                </div>
                
                <blockquote className="text-sm sm:text-base text-muted-foreground italic">
                  "{review.review}"
                </blockquote>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {reviews.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm text-muted-foreground">
              Showing {reviews.length} of our verified customer reviews
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 