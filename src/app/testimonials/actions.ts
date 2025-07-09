'use server';

import { generateTestimonialSummary } from '@/ai/flows/generate-testimonial-summary';

export async function getTestimonialSummary(customerReviews: string) {
  if (!customerReviews) {
    return { error: 'Customer reviews cannot be empty.' };
  }

  try {
    const result = await generateTestimonialSummary({ customerReviews });
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
