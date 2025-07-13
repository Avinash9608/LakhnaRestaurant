
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
import { Input } from '@/components/ui/input';
import { ArrowRight, Star, PartyPopper } from 'lucide-react';
import './home.css';
import { HeroScene } from '@/components/hero-scene';
import { GallerySection } from '@/components/gallery-section';
import { PopularItemsSection } from '@/components/popular-items-section';
import { OffersSection } from '@/components/offers-section';
import { DiscountSection } from '@/components/discount-section';




export default function HomePage() {
  return (
    <div className="w-full">
      <section className="relative flex h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px] w-full items-center justify-center text-center text-white">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-t" style={{ backgroundImage: 'linear-gradient(to top, hsl(var(--hero-background-start-hsl)), hsl(var(--hero-background-end-hsl)))' }}>
          <Suspense fallback={<div className="h-full w-full bg-zinc-900" />}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:max-w-3xl space-y-3 sm:space-y-4 rounded-lg border border-border bg-background/20 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tighter text-zinc-700 hero-text-shadow dark:text-zinc-200">
              Artistry in Every Bite.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-700/90 hero-text-shadow dark:text-zinc-200/90">
             "Fresh. Fast. Finger-lickin' good."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="btn-gradient text-sm sm:text-base">
                <Link href="/menu">View Our Menu</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base">
                <Link href="/reservations">Make a Reservation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <GallerySection />

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Order Delicious Food
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of traditional flavors and modern culinary techniques.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-semibold">Quick Service</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Fast and efficient service to get your food to you as quickly as possible.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-semibold">Fresh Ingredients</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We use only the freshest and highest quality ingredients in all our dishes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-semibold">Unique Flavors</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover unique flavor combinations that will tantalize your taste buds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OffersSection />

      <DiscountSection />
    </div>
  );
}
