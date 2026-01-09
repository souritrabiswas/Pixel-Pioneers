
import React from 'react';
import { CompassIcon } from './icons';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-amber-400">
      <CompassIcon className="h-12 w-12 animate-spin mb-3" />
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
