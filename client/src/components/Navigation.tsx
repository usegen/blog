import React, { useState } from 'react';
import { Link } from 'wouter';
import Logo from './ui/Logo';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>, path: string) => {
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.includes('#')) {
      e.preventDefault();
      const id = path.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'About', path: '/#about' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo */}
          <Logo />
          
          {/* Right side - Navigation and Icons */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path}>
                  <div 
                    onClick={(e) => handleScroll(e, link.path)}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold cursor-pointer text-lg px-3 py-1.5"
                  >
                    {link.name}
                  </div>
                </Link>
              ))}
            </nav>

            {/* Instagram Link */}
            <a 
              href="https://www.instagram.com/ZazitRumunsku" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors px-3 py-1.5"
            >
              <Instagram className="h-6 w-6" />
              <span className="hidden md:inline font-semibold text-lg">Instagram</span>
            </a>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-primary hover:text-primary/80 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-6 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.path}>
                      <div 
                        className="text-primary hover:text-primary/80 transition-colors font-semibold text-xl cursor-pointer px-4 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </div>
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
};

export default Navigation;
