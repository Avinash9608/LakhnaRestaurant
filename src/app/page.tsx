
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import './home.css';
import { HeroScene } from '@/components/hero-scene';

const popularItems = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    description: '100% beef patty, lettuce, tomato, onion, and our secret sauce.',
    price: 8.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'beef burger',
    tags: ['Best Seller', 'Hot 🔥'],
  },
  {
    id: '2',
    name: 'Crispy Chicken Sandwich',
    description: 'Golden-fried chicken breast with pickles and mayo on a brioche bun.',
    price: 7.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chicken sandwich',
    tags: ['New'],
  },
  {
    id: '3',
    name: 'Loaded Fries Supreme',
    description: 'Crispy fries topped with melted cheese, bacon, and sour cream.',
    price: 6.49,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'loaded fries',
    tags: [],
  },
];


export default function Home() {
  return (
    <div className="w-full">
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center text-center text-white">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-t" style={{ backgroundImage: 'linear-gradient(to top, hsl(var(--hero-background-start-hsl)), hsl(var(--hero-background-end-hsl)))' }}>
          <Suspense fallback={<div className="h-full w-full bg-zinc-900" />}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4 rounded-lg border border-border/50 bg-background/20 p-8 backdrop-blur-sm">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground hero-text-shadow md:text-6xl lg:text-7xl">
              Artistry in Every Bite.
            </h1>
            <p className="text-lg text-foreground/90 hero-text-shadow md:text-xl">
             “Fresh. Fast. Finger-lickin’ good.”
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="btn-gradient">
                <Link href="/menu">View Our Menu</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/reservations">Make a Reservation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center font-headline text-4xl font-bold">
            Our Most Popular Bites
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {popularItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
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
                         <Badge key={tag} variant={tag === 'New' ? 'secondary' : 'default'} className="font-bold text-sm py-1 px-3 rounded-full shadow-md">
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
                  <p className="text-3xl font-bold text-primary">${item.price.toFixed(2)}</p>
                  <Button variant="outline">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
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

      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container grid items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
              An Unforgettable Experience
            </h2>
            <p className="mb-6 text-muted-foreground">
              At Gastronomic Gateway, we believe dining is more than just food;
              it's a journey of the senses. Our chefs meticulously craft each
              dish to perfection, using only the freshest, locally-sourced
              ingredients.
            </p>
            <Button asChild className="btn-gradient">
              <Link href="/testimonials">Read Our Stories</Link>
            </Button>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Chef plating a dish"
              data-ai-hint="chef plating food"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
