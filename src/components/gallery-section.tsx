'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

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

function AutoplayPlugin(slider: any) {
  let timeout: NodeJS.Timeout;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 2500);
  }
  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on('dragStarted', clearNextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('updated', nextTimeout);
}

export function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 16 } },
      '(min-width: 768px)': { slides: { perView: 3, spacing: 16 } },
      '(min-width: 1024px)': { slides: { perView: 4, spacing: 16 } },
    },
    drag: true,
  }, [AutoplayPlugin]);

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
            .slice(0, 12); // Limit to 8 items for the grid
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
          <div className="mt-12 flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse min-w-[260px] max-w-xs w-full h-72 bg-gray-300 rounded-xl"></div>
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
          <div ref={sliderRef} className="keen-slider mt-12">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="keen-slider__slide flex justify-center"
              >
                <div className="relative bg-background rounded-xl shadow-lg overflow-hidden max-w-xs w-full group transition-transform duration-300 hover:scale-105">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    width={350}
                    height={350}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className={`${getCategoryColor(item.category)} text-xs`}>{item.category}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                      <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                      <p className="text-xs line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((img) => (
              <div key={img} className="min-w-[260px] max-w-xs w-full h-72 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 