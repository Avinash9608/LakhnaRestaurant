"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, Clock, Tag } from "lucide-react";
import Image from "next/image";

interface Offer {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
  category: string;
  terms: string;
  maxUses?: number;
  currentUses: number;
  order: number;
}

export function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  // Function to scroll to order section
  const scrollToOrderSection = () => {
    const orderSection = document.getElementById('order-section');
    if (orderSection) {
      orderSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/offers?isActive=true");
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await response.json();
        setOffers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch offers");
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Calculate time left for each offer
  useEffect(() => {
    if (!offers) return;
    const calculateTimeLeft = () => {
      const now = new Date();
      const timeLeftMap: { [key: string]: string } = {};
      offers.forEach((offer) => {
        const endDate = new Date(offer.endDate);
        const diff = endDate.getTime() - now.getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          if (days > 0) {
            timeLeftMap[offer._id] = `${days}d ${hours}h left`;
          } else if (hours > 0) {
            timeLeftMap[offer._id] = `${hours}h ${minutes}m left`;
          } else {
            timeLeftMap[offer._id] = `${minutes}m left`;
          }
        } else {
          timeLeftMap[offer._id] = "Expired";
        }
      });
      setTimeLeft(timeLeftMap);
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [offers]);

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[60vh] py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 overflow-hidden"
      id="offers-section"
    >
      <div className="absolute inset-0 pointer-events-none select-none opacity-30 blur-2xl z-0" aria-hidden>
        {/* Decorative blurred background shapes */}
        <div className="absolute left-1/4 top-0 w-96 h-96 bg-gradient-to-br from-yellow-300 via-orange-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-gradient-to-tr from-rose-300 via-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-rose-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-2 flex items-center justify-center gap-2 animate-fade-in">
          <span>Today’s Special Offers</span>
          <PartyPopper className="inline-block text-rose-500 animate-bounce" size={36} />
        </h2>
        <p className="mt-2 text-lg md:text-xl text-zinc-700 dark:text-zinc-200/80 mb-10 animate-fade-in-slow">
          Grab our hottest deals before they’re gone!
        </p>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-xl text-muted-foreground animate-pulse">Loading offers...</span>
          </div>
        ) : error || !offers || offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Card className="mt-8 max-w-md mx-auto bg-white/80 dark:bg-zinc-900/80 border-accent/50 shadow-2xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-accent text-2xl">Combo Meal (Burger + Fries + Drink)</CardTitle>
                <CardDescription className="text-lg">Only ₹149 – Save ₹50!</CardDescription>
              </CardHeader>
                              <CardFooter>
                  <Button 
                    size="lg" 
                    className="w-full btn-gradient animate-pulse rounded-xl"
                    onClick={scrollToOrderSection}
                  >
                    Order Now & Get 10% Off!
                  </Button>
                </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center animate-fade-in-slow">
            {offers.map((offer) => (
              <Card
                key={offer._id}
                className="relative group bg-white/90 dark:bg-zinc-900/90 border-0 shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-rose-200 dark:hover:shadow-rose-900 animate-fade-in"
                style={{ minWidth: 320, maxWidth: 370 }}
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
                  {offer.image && (
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover object-center rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 370px"
                    />
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow">
                      <Tag className="w-3 h-3 mr-1 inline-block" />
                      {offer.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs px-2 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow">
                      <Clock className="w-3 h-3 mr-1 inline-block" />
                      {timeLeft[offer._id]}
                    </Badge>
                  </div>
                  {offer.isActive && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-base font-bold px-5 py-2 rounded-full shadow-2xl border-4 border-white dark:border-zinc-900 z-20 animate-bounce">
                      Active Offer
                    </span>
                  )}
                </div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xl font-bold text-accent group-hover:text-rose-500 transition-colors duration-200">
                    {offer.title}
                  </CardTitle>
                  <CardDescription className="text-base text-zinc-600 dark:text-zinc-300">
                    {offer.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-extrabold text-primary">₹{offer.discountedPrice}</span>
                    <span className="text-base text-muted-foreground line-through">₹{offer.originalPrice}</span>
                    <Badge variant="destructive" className="text-xs px-2 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                      {offer.discountPercentage}% OFF
                    </Badge>
                  </div>
                  {offer.maxUses && (
                    <p className="text-xs text-muted-foreground">
                      {offer.currentUses}/{offer.maxUses} used
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    className="w-full btn-gradient rounded-xl shadow-lg text-lg font-semibold tracking-wide animate-pulse"
                    onClick={scrollToOrderSection}
                  >
                    Order Now & Save ₹{offer.originalPrice - offer.discountedPrice}!
                  </Button>
                  <span className="text-xs text-muted-foreground mt-1">{offer.terms}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 