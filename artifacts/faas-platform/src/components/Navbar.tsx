import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onBookNow: () => void;
}

export function Navbar({ onBookNow }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md text-primary-foreground">
            <Tractor className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-primary">KhetBook</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#equipment" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Equipment
          </a>
          <a href="#insights" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            AI Insights
          </a>
          <a href="#operators" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Operators
          </a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Reviews
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="hidden lg:flex" asChild>
            <a href="tel:+911800123456">Call Us</a>
          </Button>
          <Button onClick={onBookNow}>
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background absolute top-16 left-0 w-full shadow-lg">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <a
              href="#equipment"
              className="text-base font-medium py-2 border-b"
              onClick={handleNavClick}
            >
              Equipment
            </a>
            <a
              href="#insights"
              className="text-base font-medium py-2 border-b"
              onClick={handleNavClick}
            >
              AI Insights
            </a>
            <a
              href="#operators"
              className="text-base font-medium py-2 border-b"
              onClick={handleNavClick}
            >
              Operators
            </a>
            <a
              href="#testimonials"
              className="text-base font-medium py-2 border-b"
              onClick={handleNavClick}
            >
              Reviews
            </a>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={() => { handleNavClick(); onBookNow(); }} className="w-full">
                Book Now
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="tel:+911800123456">Call Us</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
