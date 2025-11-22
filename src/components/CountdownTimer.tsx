'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  hours?: number; // Default 72 hours
  storageKey?: string; // LocalStorage key for persistence
  onExpire?: () => void; // Callback when timer expires
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownTimer({
  hours = 72,
  storageKey = 'winback-timer-expiry',
  onExpire,
  className = ''
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Get or set expiry time
    let expiryTime = localStorage.getItem(storageKey);

    if (!expiryTime) {
      // Set new expiry time
      const now = new Date();
      now.setHours(now.getHours() + hours);
      expiryTime = now.toISOString();
      localStorage.setItem(storageKey, expiryTime);
    }

    // Calculate time remaining
    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime!).getTime();
      const total = expiry - now;

      if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((total % (1000 * 60)) / 1000);

      return { days, hours: hoursLeft, minutes, seconds, total };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.total <= 0) {
        setIsExpired(true);
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hours, storageKey, onExpire]);

  if (!timeRemaining) {
    return null; // Loading state
  }

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-red-600 text-xl font-bold">Offer Expired</p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center gap-4 md:gap-6">
        {timeRemaining.days > 0 && (
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 min-w-[80px]">
            <span className="text-3xl md:text-4xl font-bold text-green-600">
              {timeRemaining.days}
            </span>
            <span className="text-sm text-gray-600 mt-1">
              {timeRemaining.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        )}
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 min-w-[80px]">
          <span className="text-3xl md:text-4xl font-bold text-green-600">
            {String(timeRemaining.hours).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-600 mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 min-w-[80px]">
          <span className="text-3xl md:text-4xl font-bold text-green-600">
            {String(timeRemaining.minutes).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-600 mt-1">Minutes</span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 min-w-[80px]">
          <span className="text-3xl md:text-4xl font-bold text-green-600">
            {String(timeRemaining.seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-600 mt-1">Seconds</span>
        </div>
      </div>
    </div>
  );
}
