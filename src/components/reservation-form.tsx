'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createReservation } from '@/app/reservations/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  date: z.string().min(1, 'Please select a date.'),
  time: z.string().min(1, 'Please select a time.'),
  guests: z.coerce
    .number()
    .min(1, 'Must have at least 1 guest.')
    .max(12, 'For parties larger than 12, please call us.'),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: 2,
    },
  });

  async function onSubmit(data: ReservationFormValues) {
    setIsSubmitting(true);
    const result = await createReservation(data);
    setIsSubmitting(false);

    if (result.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please check the form for errors.',
      });
    } else {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 555-555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Booking...' : 'Book a Table'}
        </Button>
      </form>
    </Form>
  );
}
