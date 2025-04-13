import React from 'react';

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  children,
  asChild = false,
  onClick
}) => {
  if (asChild) {
    return <>{children}</>;
  }
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}; 