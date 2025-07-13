'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartSheet } from '@/components/cart-sheet';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/reviews', label: 'Write Review' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="font-headline text-lg sm:text-xl font-bold text-foreground">
            Gastronomic Gateway
          </span>
        </Link>
        
        <nav className="hidden items-center space-x-4 sm:space-x-6 text-sm font-medium md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-muted-foreground transition-colors hover:text-primary',
                pathname === link.href && 'text-primary'
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <CartSheet />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="grid gap-4 py-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold">Menu</span>
                  </div>
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary py-2',
                        pathname === link.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
