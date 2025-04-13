import React from 'react';

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>;
};

export const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <h3 className={`text-2xl font-semibold ${className}`}>{children}</h3>;
};

export const CardDescription: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;
}; 