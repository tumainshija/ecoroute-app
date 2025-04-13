import React from 'react';

interface TabsProps {
  className?: string;
  children?: React.ReactNode;
  defaultValue?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  className = '', 
  children,
  defaultValue
}) => {
  return <div className={`${className}`}>{children}</div>;
};

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`flex space-x-1 rounded-lg p-1 ${className}`}>{children}</div>;
};

export const TabsTrigger: React.FC<{ className?: string; children?: React.ReactNode; value?: string }> = ({ 
  className = '', 
  children,
  value 
}) => {
  return <button className={`px-3 py-1.5 text-sm font-medium ${className}`}>{children}</button>;
};

export const TabsContent: React.FC<{ className?: string; children?: React.ReactNode; value?: string }> = ({ 
  className = '', 
  children,
  value 
}) => {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}; 