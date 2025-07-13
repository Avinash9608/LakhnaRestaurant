'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Truck, Monitor, Phone, Gift, MapPin, Car, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What are your opening hours?",
    answer: "🕛 We're open daily from 12:00 PM to 11:00 PM, including weekends and holidays.",
    icon: <Clock className="h-5 w-5" />
  },
  {
    question: "Do you offer home delivery?",
    answer: "🚚 Yes, we deliver within Lakhna. Order via call or WhatsApp.",
    icon: <Truck className="h-5 w-5" />
  },
  {
    question: "Is online ordering available?",
    answer: "💻 Absolutely! You can order through our website or WhatsApp.",
    icon: <Monitor className="h-5 w-5" />
  },
  {
    question: "Do you take table reservations?",
    answer: "📞 Yes, reserve your table via call, WhatsApp, or through the Reservation section on our website.",
    icon: <Phone className="h-5 w-5" />
  },
  {
    question: "Do you provide catering for events?",
    answer: "🎉 Yes, we cater for parties, birthdays, and weddings. Contact us for custom packages.",
    icon: <PartyPopper className="h-5 w-5" />
  },
  {
    question: "Are there any current offers or discounts?",
    answer: "🎁 Yes! Get 10% off your first order when you subscribe. Check our website or WhatsApp for more deals.",
    icon: <Gift className="h-5 w-5" />
  },
  {
    question: "Where are you located?",
    answer: "📍 In Lakhna Town, Etawah District, Uttar Pradesh.",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    question: "Is parking available?",
    answer: "🅿️ Yes, we offer limited parking outside the restaurant.",
    icon: <Car className="h-5 w-5" />
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      marginTop: 0
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      marginTop: 16,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/20 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Lakhna Restaurant
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors duration-300">
                  <CardHeader className="pb-0">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        variant="ghost"
                        className="group w-full justify-between p-0 h-auto text-left font-semibold text-base sm:text-lg hover:bg-transparent"
                        onClick={() => toggleItem(index)}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="text-primary"
                            variants={iconVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            {item.icon}
                          </motion.div>
                          <span className="group-hover:text-blue-600 transition-colors duration-200">{item.question}</span>
                        </div>
                        <motion.div
                          animate={{ 
                            rotate: openItems.includes(index) ? 180 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </CardHeader>
                  <AnimatePresence>
                    {openItems.includes(index) && (
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <CardContent className="pt-0">
                          <motion.div 
                            className="pl-8 text-muted-foreground"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <p className="text-sm sm:text-base leading-relaxed">
                              {item.answer}
                            </p>
                          </motion.div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" className="transition-all duration-300 hover:shadow-lg">
                  <a href="tel:+919608989499" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="transition-all duration-300 hover:shadow-lg">
                  <a href="https://wa.me/919608989499" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 