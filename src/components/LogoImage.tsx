import React from 'react';
import { Link } from 'react-router-dom';

interface LogoImageProps {
  className?: string;
}

export default function LogoImage({ className = "" }: LogoImageProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="https://i.postimg.cc/QxJp5ffv/Maitri-Rainbow.png" 
        alt="Maitri Logo" 
        className="h-24 w-auto mr-3 mt-2"
        loading="eager"
      />
    </Link>
  );
}