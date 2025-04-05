import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-primary-light text-primary-dark border-primary-dark flex items-center gap-2 rounded-lg border px-4 py-3 shadow-md">
      <AlertCircle size={20} className="text-primary-dark" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
