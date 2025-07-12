
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroScene } from '@/components/hero-scene';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center text-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900/30">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-white">
                Loading 3D model...
              </div>
            }
          >
            <HeroScene />
          </Suspense>
        </div>
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4 rounded-lg bg-black/50 p-8 text-white backdrop-blur-sm">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
              Artistry in Every Bite.
            </h1>
            <p className="text-lg text-gray-200 md:text-xl">
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

      <section className="py-12 md:py-24">
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
