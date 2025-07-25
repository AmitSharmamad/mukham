import { useState, useCallback } from 'react';
import { TourStep } from '../components/Tour';

interface UseTourOptions {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const useTour = (steps: TourStep[], options: UseTourOptions = {}) => {
  const [isOpen, setIsOpen] = useState(options.autoStart || false);

  const startTour = useCallback(() => {
    setIsOpen(true);
  }, []);

  const endTour = useCallback(() => {
    setIsOpen(false);
    options.onComplete?.();
  }, [options]);

  const resetTour = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    startTour,
    endTour,
    resetTour,
    steps,
  };
};

export default useTour;
