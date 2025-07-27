import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Tour, { TourStep } from '../components/Tour';

interface TourContextType {
  startTour: (steps: TourStep[], options?: { onComplete?: () => void }) => void;
  endTour: () => void;
  isActive: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<TourStep[]>([]);
  const [onComplete, setOnComplete] = useState<(() => void) | undefined>();

  const startTour = useCallback((steps: TourStep[], options?: { onComplete?: () => void }) => {
    setCurrentSteps(steps);
    setOnComplete(() => options?.onComplete);
    setIsOpen(true);
  }, []);

  const endTour = useCallback(() => {
    setIsOpen(false);
    setCurrentSteps([]);
    setOnComplete(undefined);
  }, []);

  const handleTourComplete = useCallback(() => {
    onComplete?.();
    endTour();
  }, [onComplete, endTour]);

  const value: TourContextType = {
    startTour,
    endTour,
    isActive: isOpen,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      <Tour
        steps={currentSteps}
        open={isOpen}
        onClose={endTour}
        onComplete={handleTourComplete}
      />
    </TourContext.Provider>
  );
};

export const useTourContext = (): TourContextType => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
};

export default TourProvider;
