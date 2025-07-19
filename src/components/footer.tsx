import Link from "next/link";
import { UtensilsCrossed, Facebook, Twitter, Instagram } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/testimonials", label: "Testimonials" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold">
                Gastronomic Gateway
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Experience the art of fine dining, where every dish tells a story
              of flavor and passion.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition hover:text-primary"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition hover:text-primary"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition hover:text-primary"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <p className="font-headline font-medium">Navigate</p>
              <ul className="mt-4 space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-headline font-medium">Contact Us</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:contact@gastronomicgateway.com"
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    lakhnarestrudent@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919608989499"
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    +91 9608989499
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-headline font-medium">Visit Us</p>
              <a
                href="https://maps.google.com/?q=Lakhna,Bihar,804453,India"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-sm text-muted-foreground transition hover:text-primary"
              >
                Lakhna, Bihar 804453, India
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/20 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Gastronomic Gateway. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
