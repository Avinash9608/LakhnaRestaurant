
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

const popularItems = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    description: '100% beef patty, lettuce, tomato, onion, and our secret sauce.',
    price: 199,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'beef burger',
    tags: ['Best Seller', 'Hot 🔥'],
  },
  {
    id: '2',
    name: 'Crispy Chicken Sandwich',
    description: 'Golden-fried chicken breast with pickles and mayo on a brioche bun.',
    price: 179,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chicken sandwich',
    tags: ['New'],
  },
  {
    id: '3',
    name: 'Loaded Fries Supreme',
    description: 'Crispy fries topped with melted cheese, bacon, and sour cream.',
    price: 149,
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
          <div className="mx-auto max-w-3xl space-y-4 rounded-lg border border-border bg-background/20 p-8 backdrop-blur-sm">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-zinc-700 hero-text-shadow dark:text-zinc-200 md:text-6xl lg:text-7xl">
              Artistry in Every Bite.
            </h1>
            <p className="text-lg text-zinc-700/90 hero-text-shadow dark:text-zinc-200/90 md:text-xl">
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

      {/* Preview Menu Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Explore Our Popular Picks</h2>
          <p className="mt-2 text-lg text-muted-foreground">Deliciously crafted just for you – here’s a sneak peek!</p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary">🍔 Burgers</h3>
              <ul className="text-muted-foreground">
                <li>Cheese Blast Burger</li>
                <li>Aloo Tikki Burger</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary">🌯 Wraps</h3>
              <ul className="text-muted-foreground">
                <li>Veggie Roll</li>
                <li>Paneer Wrap</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary">🥤 Beverages</h3>
              <ul className="text-muted-foreground">
                <li>Masala Lemonade</li>
                <li>Cold Coffee</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary">🍟 Sides</h3>
              <ul className="text-muted-foreground">
                <li>Crispy Fries</li>
                <li>Cheesy Nachos</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Button asChild variant="link" size="lg">
              <Link href="/menu" className="text-lg">
                View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Daily Time order food */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6 text-center">
           <h2 className="font-headline text-3xl font-bold md:text-4xl text-primary">Today’s Special Offers <PartyPopper className="inline-block" /></h2>
          <p className="mt-2 text-lg text-muted-foreground">Grab our hottest deals before they’re gone!</p>

          <Card className="mt-8 max-w-md mx-auto bg-card/80 border-accent/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-accent">Combo Meal (Burger + Fries + Drink)</CardTitle>
              <CardDescription>Only ₹149 – Save ₹50!</CardDescription>
            </CardHeader>
            <CardFooter>
               <Button size="lg" className="w-full btn-gradient animate-pulse">
                Order Now & Get 10% Off!
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Our Food, Your Cravings 🍽️</h2>
          <p className="mt-2 text-lg text-muted-foreground">Take a bite through our lens – real clicks from our kitchen and happy customers.</p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((img) => (
              <div key={img} className="overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:scale-105">
                <Image
                  src={`https://placehold.co/300x300.png`}
                  data-ai-hint={`food ${img}`}
                  alt="Food gallery image"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
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

      {/* Customer review */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">What Our Customers Say ⭐</h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((review) => (
              <Card key={review} className="bg-card text-left transform transition-transform duration-300 hover:-translate-y-2">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Image
                    src={`https://i.pravatar.cc/150?img=${review + 10}`}
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">Customer {review}</CardTitle>
                     <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">“Loved the taste and fast service! Highly recommended for quick bites.”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Newsletter */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-card shadow-lg">
             <h2 className="font-headline text-3xl font-bold text-primary">🎁 Get 10% Off Your First Order!</h2>
            <p className="text-lg text-muted-foreground mt-2 mb-6">Subscribe to receive special deals, updates, and coupons straight to your inbox or WhatsApp.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter your phone or email"
                className="flex-1"
                aria-label="Email or Phone"
              />
              <Button type="submit" className="btn-gradient">
                Get Discount
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
