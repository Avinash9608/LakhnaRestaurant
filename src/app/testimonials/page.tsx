import { TestimonialGenerator } from '@/components/testimonial-generator';

export default function TestimonialsPage() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold">
          Voices of Our Guests
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground">
          Discover what people are saying about their experience.
        </p>
      </div>
      <TestimonialGenerator />
    </div>
  );
}
