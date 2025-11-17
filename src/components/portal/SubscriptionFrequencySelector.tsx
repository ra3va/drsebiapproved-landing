'use client';

import { SUBSCRIPTION_CONFIG } from '@/lib/utils/subscriptions';

interface SubscriptionFrequencySelectorProps {
  basePrice: number; // in cents
  selectedFrequency: 'monthly' | 'every_60_days' | 'every_90_days';
  onSelect: (frequency: 'monthly' | 'every_60_days' | 'every_90_days') => void;
}

export function SubscriptionFrequencySelector({
  basePrice,
  selectedFrequency,
  onSelect,
}: SubscriptionFrequencySelectorProps) {
  const options: Array<{
    key: 'monthly' | 'every_60_days' | 'every_90_days';
    label: string;
    description: string;
  }> = [
    {
      key: 'monthly',
      label: 'Every 30 Days',
      description: 'Great for daily supplements',
    },
    {
      key: 'every_60_days',
      label: 'Every 60 Days',
      description: 'Perfect for periodic cleanses',
    },
    {
      key: 'every_90_days',
      label: 'Every 90 Days',
      description: 'Ideal for quarterly products',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Delivery Frequency
      </label>
      {options.map((option) => {
        const config = SUBSCRIPTION_CONFIG.FREQUENCIES[option.key];
        const discountAmount = (basePrice * config.discount) / 100;
        const finalPrice = basePrice - discountAmount;
        const isSelected = selectedFrequency === option.key;

        return (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{option.label}</span>
                  <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded">
                    Save {config.discount}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(finalPrice / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${(basePrice / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ${(discountAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className={`ml-4 ${isSelected ? 'text-green-600' : 'text-gray-300'}`}>
                {isSelected ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
