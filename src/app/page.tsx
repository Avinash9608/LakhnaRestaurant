import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative flex h-[70vh] w-full items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Fine dining table setting"
          data-ai-hint="fine dining restaurant"
          fill
          className="object-cover -z-10 brightness-50"
        />
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
              Welcome to Gastronomic Gateway
            </h1>
            <p className="text-lg text-gray-200 md:text-xl">
              Where culinary artistry meets the finest ingredients.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/menu">View Our Menu</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/reservations">Make a Reservation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-12 md:py-24">
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
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
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
