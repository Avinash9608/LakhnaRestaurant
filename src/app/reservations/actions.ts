'use server';

import { z } from 'zod';

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

export async function createReservation(formData: unknown) {
  const validatedFields = reservationSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  // Placeholder for Twilio WhatsApp confirmation
  console.log('Reservation created:', validatedFields.data);
  console.log(
    'Sending WhatsApp confirmation via Twilio to:',
    validatedFields.data.phone
  );

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: `Reservation confirmed for ${validatedFields.data.name} on ${validatedFields.data.date} at ${validatedFields.data.time}. A confirmation will be sent via WhatsApp.`,
  };
}
