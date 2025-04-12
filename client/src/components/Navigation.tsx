import React, { useState } from 'react';
import { Link } from 'wouter';
import Logo from './ui/Logo';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path}>
              <div className="text-primary hover:text-secondary transition-colors font-semibold cursor-pointer">
                {link.name}
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <div className="mr-4">
            <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect x="0" y="0" width="100" height="33.3" fill="#002B7F" />
                <rect x="0" y="33.3" width="100" height="33.3" fill="#FCD116" />
                <rect x="0" y="66.6" width="100" height="33.3" fill="#CE1126" />
              </svg>
            </div>
          </div>
          
          <Logo />
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.path}>
                    <div 
                      className="text-primary hover:text-secondary transition-colors font-semibold text-lg cursor-pointer"
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
    </header>
  );
};

export default Navigation;
