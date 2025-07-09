import { TestimonialGenerator } from '@/components/testimonial-generator';

export default function TestimonialsPage() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">
          Voices of Our Guests
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover what people are saying about their experience.
        </p>
      </div>
      <TestimonialGenerator />
    </div>
  );
}
