import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { CartProvider } from '@/context/cart-context';
import { Lora, Open_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Gastronomic Gateway',
  description: 'An exquisite dining experience.',
};

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          lora.variable,
          openSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}