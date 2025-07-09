import { ReservationForm } from '@/components/reservation-form';
import Image from 'next/image';

export default function ReservationsPage() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Make a Reservation
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure your table for an unforgettable dining experience. We'll send a
            confirmation to your WhatsApp.
          </p>
          <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Interior of Gastronomic Gateway"
              data-ai-hint="restaurant interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-lg bg-card p-8 shadow-lg">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
