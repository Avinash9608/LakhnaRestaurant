'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/lib/types';
import { ShoppingBasket } from 'lucide-react';
import { Button } from './ui/button';
import { Menu3DScene } from './menu-3d-scene';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function MenuCard({ item }: { item: MenuItem }) {

  return (
    <Card className="group flex h-full transform flex-col overflow-hidden bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader className="p-4 sm:p-6">
        <div className="relative mb-3 sm:mb-4 aspect-square w-full overflow-hidden rounded-md">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-500">
                  Loading...
                </div>
              }
            >
              <Menu3DScene modelColor={item.modelColor} />
            </Suspense>
          )}
        </div>
        <CardTitle className="font-headline text-lg sm:text-xl lg:text-2xl">{item.name}</CardTitle>
        <CardDescription className="text-sm sm:text-base">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-6 pt-0">
        {/* Ingredients removed as requested */}
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between p-4 sm:p-6 pt-0">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">₹{item.price.toFixed(2)}</p>
        <Button
          asChild
          className="btn-gradient text-sm sm:text-base"
        >
          <Link href="/#order-section">
            <ShoppingBasket className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Order Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
