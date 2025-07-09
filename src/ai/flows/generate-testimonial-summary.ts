'use server';

/**
 * @fileOverview AI-powered testimonial summary generator.
 *
 * - generateTestimonialSummary - A function that generates a short, catchy summary from customer reviews.
 * - GenerateTestimonialSummaryInput - The input type for the generateTestimonialSummary function.
 * - GenerateTestimonialSummaryOutput - The return type for the generateTestimonialSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestimonialSummaryInputSchema = z.object({
  customerReviews: z
    .string()
    .describe('A collection of customer reviews to summarize.'),
});
export type GenerateTestimonialSummaryInput = z.infer<
  typeof GenerateTestimonialSummaryInputSchema
>;

const GenerateTestimonialSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, catchy summary of the customer reviews, suitable for use as a featured testimonial.'
    ),
});
export type GenerateTestimonialSummaryOutput = z.infer<
  typeof GenerateTestimonialSummaryOutputSchema
>;

export async function generateTestimonialSummary(
  input: GenerateTestimonialSummaryInput
): Promise<GenerateTestimonialSummaryOutput> {
  return generateTestimonialSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestimonialSummaryPrompt',
  input: {schema: GenerateTestimonialSummaryInputSchema},
  output: {schema: GenerateTestimonialSummaryOutputSchema},
  prompt: `You are a marketing expert tasked with generating catchy summaries from customer reviews.

  Given the following customer reviews, create a short, impactful summary that highlights the positive aspects and can be used as a featured testimonial.

  Customer Reviews: {{{customerReviews}}}
  `,
});

const generateTestimonialSummaryFlow = ai.defineFlow(
  {
    name: 'generateTestimonialSummaryFlow',
    inputSchema: GenerateTestimonialSummaryInputSchema,
    outputSchema: GenerateTestimonialSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
