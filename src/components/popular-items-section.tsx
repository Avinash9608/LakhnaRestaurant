"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { PopularItem } from '@/lib/types';

export function PopularItemsSection() {
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const res = await fetch('/api/popular-items?isActive=true');
        if (res.ok) {
          const data = await res.json();
          setPopularItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch popular items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularItems();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center font-headline text-4xl font-bold">
            Our Most Popular Bites
          </h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading popular items...</p>
          </div>
        </div>
      </section>
    );
  }

  if (popularItems.length === 0) {
    return null; // Don't show section if no items
  }

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center font-headline text-4xl font-bold">
          Our Most Popular Bites
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item) => (
            <Card key={item._id || item.id} className="group overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    data-ai-hint={item.dataAiHint}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {item.tags.map(tag => (
                       <Badge key={tag} variant="default" className="font-bold text-sm py-1 px-3 rounded-full shadow-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
                <CardDescription className="mt-2">{item.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-6 pt-0">
                <p className="text-3xl font-bold text-primary">₹{item.price.toFixed(2)}</p>
                <Button asChild className="btn-gradient">
                  <Link href="#order-section">Order Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="mt-12 text-center">
          <Button asChild size="lg" variant="ghost">
            <Link href="/menu">
              View Full Menu <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 