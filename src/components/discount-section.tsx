'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function DiscountSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/send-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        toast({
          title: "🎉 Discount Code Sent!",
          description: data.message,
          duration: 5000,
        });
        
        // Scroll to order section after a short delay
        setTimeout(() => {
          scrollToOrderSection();
        }, 1500);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        toast({
          title: "❌ Error",
          description: data.error || 'Failed to send discount code',
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      toast({
        title: "❌ Network Error",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setEmail('');
  };

  if (success) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-card shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="font-headline text-3xl font-bold text-green-600">
                🎉 Discount Code Sent!
              </h2>
              <p className="text-lg text-muted-foreground">
                Check your email for your exclusive 10% discount code!
              </p>
              <p className="text-sm text-muted-foreground">
                Scroll down to place your order with the discount code.
              </p>
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={scrollToOrderSection}
                  className="btn-gradient"
                >
                  📞 Place Order Now
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                >
                  Get Another Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6 text-center">
        <Card className="max-w-2xl mx-auto p-8 bg-card shadow-lg">
          <h2 className="font-headline text-3xl font-bold text-primary">
            🎁 Get 10% Off Your First Order!
          </h2>
          <p className="text-lg text-muted-foreground mt-2 mb-6">
            Subscribe to receive special deals, updates, and coupons straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${error ? 'border-red-500' : ''}`}
                aria-label="Email"
                disabled={loading}
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              className="btn-gradient min-w-[140px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Get Discount'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>✨ First-time customers only</p>
            <p>⏰ Code expires in 30 days</p>
            <p className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded mt-2">
              📧 <strong>Email Delivery:</strong> Your discount code will be sent directly to your email inbox.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
} 