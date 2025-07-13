import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Truck, Smartphone, Calendar, Gift, ParkingCircle, Users } from 'lucide-react';

const faqs = [
  {
    question: 'What are your opening hours?',
    answer: 'We are open daily from 12:00 PM to 11:00 PM, including weekends and public holidays.',
    icon: <Clock className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Do you offer home delivery?',
    answer: 'Yes! Fast, hygienic home delivery is available within Lakhna. Order by phone or WhatsApp.',
    icon: <Truck className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Is online ordering available?',
    answer: 'Yes, you can order via our website or WhatsApp.',
    icon: <Smartphone className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Do you take table reservations?',
    answer: 'Yes, reserve a table by phone, WhatsApp, or through our website’s reservation section.',
    icon: <Calendar className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Do you provide catering for events?',
    answer: 'Yes, we cater for birthdays, weddings, and functions. Contact us for custom packages.',
    icon: <Users className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Are there any current offers?',
    answer: 'Get 10% off your first order when you subscribe! Check our website and WhatsApp for deals.',
    icon: <Gift className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Where is Lakhna Restaurant located?',
    answer: 'Lakhna Town, Etawah District, Uttar Pradesh.',
    icon: <MapPin className="w-5 h-5 text-primary" />,
  },
  {
    question: 'Is parking available?',
    answer: 'Yes, limited parking is available outside the restaurant.',
    icon: <ParkingCircle className="w-5 h-5 text-primary" />,
  },
];

export function FAQSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl font-bold md:text-4xl text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={faq.question} className="border-none">
              <Card className="bg-muted/40 shadow-md">
                <AccordionTrigger className="flex items-center gap-3 text-lg font-semibold px-6 py-4 no-underline hover:no-underline focus:no-underline">
                  {faq.icon}
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="text-muted-foreground text-base px-6 pb-4 pt-0">
                    {faq.answer}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 