'use client';

import Image from 'next/image';
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
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/types';
import { ShoppingBasket } from 'lucide-react';

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <Card className="group flex h-full transform flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader>
        <div
          className="relative mb-4 aspect-square w-full overflow-hidden rounded-md"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <Image
            src={item.image}
            alt={item.name}
            data-ai-hint={item.dataAiHint}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:[transform:rotateY(15deg)_scale(1.2)]"
          />
          <div
            className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0"
            aria-hidden="true"
          />
        </div>
        <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {item.ingredients.map(ingredient => (
            <Badge key={ingredient} variant="secondary">
              {ingredient}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
        <Button
          onClick={() => addItem(item)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <ShoppingBasket className="mr-2 h-4 w-4" />
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
}
