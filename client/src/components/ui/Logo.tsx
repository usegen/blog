import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  };

  return (
    <Link href="/">
      <div className={`flex items-center space-x-2 cursor-pointer ${className}`}>
        <i className="fas fa-map-marker-alt text-secondary text-xl"></i>
        <span className="font-display font-bold text-lg md:text-xl text-primary">Romania Explorer</span>
      </div>
    </Link>
  );
};

export default Logo;
