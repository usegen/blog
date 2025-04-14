import React from 'react';
import { Link } from 'wouter';
import Logo from './ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-gray-600 mb-4">Sharing the beauty and wonder of Romania with travelers from around the world.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-secondary" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-primary hover:text-secondary" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-primary hover:text-secondary" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-primary hover:text-secondary" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-primary">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-secondary">About Me</a></li>
              <li><a href="#" className="hover:text-secondary">Work With Me</a></li>
              <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Romania Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
