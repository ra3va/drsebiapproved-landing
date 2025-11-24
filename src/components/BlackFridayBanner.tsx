'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function BlackFridayBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // PREVIEW MODE: Set to true to always show banner for testing
    const PREVIEW_MODE = true;

    // Black Friday sale: Nov 25 00:00 PST → Nov 30 00:00 PST (Saturday 12 AM)
    const now = new Date();
    const currentYear = now.getFullYear();

    const saleStart = new Date(`November 25, ${currentYear} 00:00:00 PST`);
    const saleEnd = new Date(`November 30, ${currentYear} 00:00:00 PST`);

    // Check if we're in the Black Friday window OR preview mode is on
    if (PREVIEW_MODE || (now >= saleStart && now <= saleEnd)) {
      setIsVisible(true);

      const calculateTimeLeft = () => {
        const difference = saleEnd.getTime() - new Date().getTime();

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        } else {
          setIsVisible(false);
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-yellow-600/20 shadow-2xl"
      style={{
        background: 'linear-gradient(to right, #000000, #1f2937, #000000)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 py-3 md:py-4">
          {/* Main Message */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-2xl md:text-3xl"
            >
              🔥
            </motion.div>
            <div className="text-center md:text-left">
              <div className="text-yellow-400 font-bold text-sm md:text-base tracking-wider">
                BLACK FRIDAY SALE
              </div>
              <div className="text-white text-xs md:text-sm font-medium">
                30% OFF SITEWIDE | CODE: <span className="text-yellow-400 font-bold">BLACKFRIDAY30</span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-white/60 text-xs md:text-sm font-medium hidden md:inline">
              ENDS IN
            </span>
            <div className="flex gap-1.5 md:gap-2">
              {[
                { value: timeLeft.days, label: 'D' },
                { value: timeLeft.hours, label: 'H' },
                { value: timeLeft.minutes, label: 'M' },
                { value: timeLeft.seconds, label: 'S' }
              ].map((unit, index) => (
                <div key={unit.label} className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-600/20 rounded blur"></div>
                    <div
                      className="relative rounded px-2 md:px-3 py-1.5 md:py-2 min-w-[40px] md:min-w-[50px]"
                      style={{
                        background: 'linear-gradient(to bottom right, #d97706, #b45309)'
                      }}
                    >
                      <div className="text-white font-bold text-base md:text-xl text-center leading-none">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div className="text-yellow-200 text-[9px] md:text-xs font-medium text-center leading-none mt-0.5">
                        {unit.label}
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <span className="text-yellow-600 font-bold mx-0.5 md:mx-1 text-sm md:text-base">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        className="h-0.5"
        style={{
          background: 'linear-gradient(to right, transparent, #d97706, transparent)'
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
}
