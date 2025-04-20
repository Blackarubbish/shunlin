import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'bg-primary-light text-primary-dark border-primary-dark flex items-center gap-2 rounded-lg border px-4 py-3 shadow-md',
        className
      )}>
      <AlertCircle size={20} className="text-primary-dark" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
