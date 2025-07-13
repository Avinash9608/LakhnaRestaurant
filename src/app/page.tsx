
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
import { FAQSection } from '@/components/faq-section';
import { CustomerReviewSection } from '@/components/customer-review-section';




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
              src="https://plus.unsplash.com/premium_photo-1664189122502-c698839fc650?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlc3R1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Chef plating a dish"
              data-ai-hint="chef plating food"
              fill
              className="object-cover"
            />
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

 {/* Online Food */}
 <section id="order-section" className="py-16 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Card className="max-w-3xl mx-auto bg-card/80 p-8 shadow-lg">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              Order Delicious Food
            </h2>
             <p className="text-lg text-muted-foreground mt-2">
              Direct from Our Kitchen
            </p>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Serving fresh meals locally in <strong>Lakhna</strong>. Simply give us a call, make the payment, and your order will be confirmed. Our team will guide you with further instructions right after.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button asChild size="lg">
                <a href="tel:+919608989499">
                  📞 Call to Place Your Order
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                 <a
                    href="https://wa.me/919608989499?text=Hi%20I%20want%20to%20order%20food"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                   💬 Confirm on WhatsApp
                  </a>
              </Button>
            </div>
             <p className="text-sm text-muted-foreground mt-6">
              Payment can be made via UPI or cash on delivery.
            </p>
          </Card>
        </div>
      </section>

      <OffersSection />

      <DiscountSection />
       {/* Location and Contact */}
       <section className="py-16 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">📍 Visit Us in Lakhna</h2>

          <Card className="mt-12 overflow-hidden shadow-lg">
             <div className="w-full h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57519.23194124933!2d79.0880128!3d26.4951606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39790b8f5223a31d%3A0x83b257da49303a42!2sLakhna%2C%20Bihar%20804453%2C%20India!5e0!3m2!1sen!2sus!4v1683050013978!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
             <CardContent className="p-6 text-center">
               <p className="text-lg text-muted-foreground mb-2">📞 Phone: <a href="tel:+919608989499" className="text-primary hover:underline">+91 9608989499</a></p>
               <p className="text-lg text-muted-foreground mb-4">🕒 Open: 10 AM – 9 PM (Mon–Sun)</p>

               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="btn-gradient">
                     <a href="tel:+919608989499">
                      Call Now
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                     <a
                        href="https://maps.google.com/?q=Lakhna,Bihar,804453,India"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions
                      </a>
                  </Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </section>
      {/* <CustomerReviewSection /> */}
      <FAQSection />
      <section className="py-12 md:py-24 bg-muted/50">
  <div className="container px-4 md:px-6">
    <h2 className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">
      What Our Customers Say
    </h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[
        {
          name: 'Amit',
          review: 'The burgers are amazing! Crispy fries, spicy sauces – total heaven for fast food lovers.',
          rating: 5,
          image:
            'https://images.unsplash.com/photo-1554126807-6b10f6f6692a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym95fGVufDB8fDB8fHww',
        },
        {
          name: 'Rahul',
          review: 'Loved the paneer wrap and cold coffee! Affordable and tasty. Highly recommend!',
          rating: 4,
          image:
            'https://images.unsplash.com/photo-1507438222021-237ff73669b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGJveXxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
          name: 'Sonu',
          review: 'Clean place, friendly staff, and hot sizzling food! Best fast food in Lakhna.',
          rating: 5,
          image:
            'https://images.unsplash.com/photo-1591050898137-996dcd1184d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGJveXxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
          name: 'Divya',
          review: 'Tried the cheese burst sandwich and Oreo shake – totally worth it!',
          rating: 4,
          image:
            'https://images.unsplash.com/photo-1482555670981-4de159d8553b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGdpcmx8ZW58MHx8MHx8fDA%3D',
        },
        {
          name: 'Sony',
          review: 'Best chicken burger I’ve had in a while! Juicy and fresh. My go-to spot now.',
          rating: 5,
          image:
            'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGdpcmx8ZW58MHx8MHx8fDA%3D',
        },
      ].map((customer, index) => (
        <div
          key={index}
          className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={customer.image}
              alt={customer.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h4 className="text-lg font-semibold">{customer.name}</h4>
              <div className="text-yellow-500">
                {'★'.repeat(customer.rating)}
                {'☆'.repeat(5 - customer.rating)}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{customer.review}</p>
        </div>
      ))}
    </div>
  </div>
</section>

    </div>
  );
}
