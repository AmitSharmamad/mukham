import React from 'react';
import { IconButton, Tooltip, Fab } from '@mui/material';
import { Explore as ExploreIcon, Help as HelpIcon } from '@mui/icons-material';
import { useTourContext } from '../../context/TourContext';
import { getTourSteps } from '../../constants/tourSteps';
import { TourStep } from '../Tour';

interface TourButtonProps {
  variant?: 'icon' | 'fab';
  tourSteps?: TourStep[];
  tourContext?: 'main' | 'trading' | 'strategy-builder';
  onTourComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary' | 'inherit';
  tooltip?: string;
}

const TourButton: React.FC<TourButtonProps> = ({
  variant = 'icon',
  tourSteps,
  tourContext = 'main',
  onTourComplete,
  size = 'medium',
  color = 'primary',
  tooltip = 'Take a tour',
}) => {
  const { startTour, isActive } = useTourContext();

  const handleStartTour = () => {
    if (isActive) return;
    
    const steps = tourSteps || getTourSteps(tourContext);
    startTour(steps, { onComplete: onTourComplete });
  };

  const icon = variant === 'fab' ? <HelpIcon /> : <ExploreIcon />;

  if (variant === 'fab') {
    return (
      <Tooltip title={tooltip}>
        <Fab
          onClick={handleStartTour}
          disabled={isActive}
          size={size}
          color={color}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: (theme) => theme.shadows[8],
            '&:hover': {
              boxShadow: (theme) => theme.shadows[12],
            },
          }}
        >
          {icon}
        </Fab>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleStartTour}
        disabled={isActive}
        size={size}
        color={color === 'inherit' ? 'default' : color}
        sx={{
          fontSize: '1.75rem',
          width: 48,
          height: 48,
          color: color === 'inherit' ? 'inherit' : undefined,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default TourButton;
