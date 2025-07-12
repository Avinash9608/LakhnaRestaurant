'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getTestimonialSummary } from '@/app/testimonials/actions';
import { Loader2, Wand2, Check, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function TestimonialGenerator() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [approvedTestimonial, setApprovedTestimonial] = useState(
    'The Forest Floor Steak was a revelation! Cooked to perfection with an earthy mushroom reduction that was simply divine. A must-try!'
  );

  const handleGenerate = async () => {
    if (!reviews) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some customer reviews first.',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedSummary('');
    const result = await getTestimonialSummary(reviews);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: result.error,
      });
    } else if (result.summary) {
      setGeneratedSummary(result.summary);
      toast({
        title: 'Summary Generated!',
        description: 'Review the new testimonial below.',
      });
    }
  };

  const handleApprove = () => {
    if (generatedSummary) {
      setApprovedTestimonial(generatedSummary);
      setGeneratedSummary('');
      toast({
        title: 'Approved!',
        description: 'The new featured testimonial is now live.',
      });
    }
  };

  const handleReject = () => {
    setGeneratedSummary('');
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h2 className="mb-4 font-headline text-3xl font-bold">
            Generate Featured Testimonial
          </h2>
          <p className="mb-6 text-muted-foreground">
            Paste in customer reviews and let our AI generate a catchy summary.
            You can then approve it to be featured.
          </p>
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste customer reviews here... e.g., 'The ambiance was amazing and the food was delicious! Will be back for sure.'"
            value={reviews}
            onChange={e => setReviews(e.target.value)}
            rows={10}
            className="bg-card/80 backdrop-blur-sm"
          />
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full btn-gradient"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>

        {generatedSummary && (
          <Card className="mt-8 bg-secondary">
            <CardHeader>
              <CardTitle>Generated Summary</CardTitle>
              <CardDescription>
                Approve this to make it the featured testimonial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="italic">"{generatedSummary}"</p>
              <div className="mt-4 flex gap-4">
                <Button onClick={handleApprove} className="btn-gradient">
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button onClick={handleReject} variant="destructive">
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="mb-4 font-headline text-3xl font-bold">
          Featured Testimonial
        </h2>
        <Card className="border-primary/50 bg-primary/10">
          <CardContent className="pt-6">
            <blockquote className="text-xl font-semibold italic leading-relaxed text-foreground">
              "{approvedTestimonial}"
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
