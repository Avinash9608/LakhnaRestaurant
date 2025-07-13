import { ReservationForm } from '@/components/reservation-form';
import Image from 'next/image';

export default function ReservationsPage() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold">
            Make a Reservation
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Secure your table for an unforgettable dining experience. We'll send a
            confirmation to your email and WhatsApp.
          </p>
          <div className="relative mt-4 sm:mt-6 h-48 sm:h-64 w-full overflow-hidden rounded-lg">
            <Image
              src="https://plus.unsplash.com/premium_photo-1661879046374-2f7298cd2ab8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fHJlc3R1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Interior of Gastronomic Gateway"
              data-ai-hint="restaurant interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 sm:p-8 shadow-lg">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
