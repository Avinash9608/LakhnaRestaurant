import Link from 'next/link';
import { Utensils, Home, Package, Star, Tag, Users, Calendar, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Utensils className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-sm sm:text-base">Gastronomic Gateway</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/menu"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Menu Items
              </Link>
              <Link
                href="/dashboard/popular-items"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Star className="h-4 w-4" />
                Popular Items
              </Link>
              <Link
                href="/dashboard/offers"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Tag className="h-4 w-4" />
                Offers
              </Link>
              <Link
                href="/dashboard/gallery"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Gallery
              </Link>
              <Link
                href="/dashboard/reservations"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Calendar className="h-4 w-4" />
                Reservations
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="text-sm sm:text-base">Upgrade to Pro</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full text-xs sm:text-sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Utensils className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Gastronomic Gateway</span>
                  </Link>
                </div>
                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/menu"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Package className="h-4 w-4" />
                      Menu Items
                    </Link>
                    <Link
                      href="/dashboard/popular-items"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Star className="h-4 w-4" />
                      Popular Items
                    </Link>
                    <Link
                      href="/dashboard/offers"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Tag className="h-4 w-4" />
                      Offers
                    </Link>
                    <Link
                      href="/dashboard/gallery"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Users className="h-4 w-4" />
                      Gallery
                    </Link>
                    <Link
                      href="/dashboard/reservations"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Calendar className="h-4 w-4" />
                      Reservations
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </nav>
                </div>
                <div className="mt-auto p-4">
                  <Card>
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle className="text-sm sm:text-base">Upgrade to Pro</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Unlock all features and get unlimited access to our support
                        team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="w-full text-xs sm:text-sm">
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              View Site
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 