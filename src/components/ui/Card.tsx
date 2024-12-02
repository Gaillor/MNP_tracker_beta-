import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', onClick, ...props }: CardProps) {
  return (
    <div 
      className={`bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: Omit<CardProps, 'onClick'>) {
  return (
    <div className={`px-4 py-5 border-b border-gray-200 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: Omit<CardProps, 'onClick'>) {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: Omit<CardProps, 'onClick'>) {
  return (
    <div className={`px-4 py-4 border-t border-gray-200 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}