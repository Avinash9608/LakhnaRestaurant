'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

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

export function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery?isActive=true');
        if (response.ok) {
          const data = await response.json();
          // Sort by order and take only active items
          const activeItems = data
            .filter((item: GalleryItem) => item.isActive)
            .sort((a: GalleryItem, b: GalleryItem) => a.order - b.order)
            .slice(0, 8); // Limit to 8 items for the grid
          setGalleryItems(activeItems);
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

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
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Our Food, Your Cravings 🍽️</h2>
          <p className="mt-2 text-lg text-muted-foreground">Take a bite through our lens – real clicks from our kitchen and happy customers.</p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-48 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl">Our Food, Your Cravings 🍽️</h2>
        <p className="mt-2 text-lg text-muted-foreground">Take a bite through our lens – real clicks from our kitchen and happy customers.</p>

        {galleryItems.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div key={item._id} className="group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Image
                  src={item.imageUrl}
                  alt={item.altText}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`${getCategoryColor(item.category)} text-xs`}>
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((img) => (
              <div key={img} className="overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:scale-105">
                <Image
                  src={`https://placehold.co/300x300.png`}
                  data-ai-hint={`food ${img}`}
                  alt="Food gallery image"
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 