import React from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => {
  return <div className={`relative rounded-full overflow-hidden ${className}`}>{children}</div>;
};

export const AvatarImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt = '' }) => {
  return src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : null;
};

export const AvatarFallback: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
}; 