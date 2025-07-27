import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Fade,
  Backdrop,
  useTheme,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Optional action to perform when step is shown
}

interface TourProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const Tour: React.FC<TourProps> = ({ steps, open, onClose, onComplete }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const getCurrentStep = () => steps[currentStep];

  // Find target element and calculate position
  const updateTargetElement = useCallback(() => {
    const step = getCurrentStep();
    if (!step?.target) {
      setTargetElement(null);
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      setTargetElement(element);
      setTargetRect(element.getBoundingClientRect());
    } else {
      setTargetElement(null);
      setTargetRect(null);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (open) {
      updateTargetElement();
      // Execute step action if provided
      const step = getCurrentStep();
      if (step?.action) {
        step.action();
      }
    }
  }, [open, currentStep, updateTargetElement]);

  useEffect(() => {
    if (open) {
      const handleResize = () => updateTargetElement();
      const handleScroll = () => updateTargetElement();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [open, updateTargetElement]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    onComplete?.();
    onClose();
  };

  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const step = getCurrentStep();
    const preferredPosition = step.position || 'bottom';
    const margin = 16;
    const modalWidth = 380;
    const modalHeight = 300;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Calculate positions for each direction
    const positions = {
      top: {
        top: targetRect.top - margin,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, -100%)',
      },
      bottom: {
        top: targetRect.bottom + margin,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, 0)',
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left - margin,
        transform: 'translate(-100%, -50%)',
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + margin,
        transform: 'translate(0, -50%)',
      },
      center: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    // Get the preferred position
    let selectedPosition = positions[preferredPosition as keyof typeof positions] || positions.bottom;
    
    // Convert to numbers for boundary checks
    let finalTop = typeof selectedPosition.top === 'string' ? 
      (viewport.height * parseFloat(selectedPosition.top)) / 100 : selectedPosition.top;
    let finalLeft = typeof selectedPosition.left === 'string' ? 
      (viewport.width * parseFloat(selectedPosition.left)) / 100 : selectedPosition.left;

    // Basic viewport boundary checks
    if (finalLeft < margin) {
      finalLeft = margin;
    } else if (finalLeft > viewport.width - modalWidth - margin) {
      finalLeft = viewport.width - modalWidth - margin;
    }

    if (finalTop < margin) {
      finalTop = margin;
    } else if (finalTop > viewport.height - modalHeight - margin) {
      finalTop = viewport.height - modalHeight - margin;
    }

    return {
      top: finalTop,
      left: finalLeft,
      transform: 'none',
    };
  };

  if (!open || steps.length === 0) return null;

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {targetRect ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: theme.zIndex.modal,
            pointerEvents: 'none',
            background: `
              linear-gradient(to right, 
                rgba(0, 0, 0, 0.7) 0%, 
                rgba(0, 0, 0, 0.7) ${targetRect.left}px,
                transparent ${targetRect.left}px,
                transparent ${targetRect.right}px,
                rgba(0, 0, 0, 0.7) ${targetRect.right}px,
                rgba(0, 0, 0, 0.7) 100%
              ),
              linear-gradient(to bottom,
                rgba(0, 0, 0, 0.7) 0%,
                rgba(0, 0, 0, 0.7) ${targetRect.top}px,
                transparent ${targetRect.top}px,
                transparent ${targetRect.bottom}px,
                rgba(0, 0, 0, 0.7) ${targetRect.bottom}px,
                rgba(0, 0, 0, 0.7) 100%
              )
            `,
          }}
        />
      ) : (
        <Backdrop
          open={open}
          sx={{
            zIndex: theme.zIndex.modal,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        />
      )}

      {targetRect && (
        <Box
          sx={{
            position: 'fixed',
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            zIndex: theme.zIndex.modal + 1,
            border: `3px solid ${theme.palette.primary.main}`,
            borderRadius: 2,
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            boxShadow: `0 0 0 8px ${theme.palette.primary.main}15`,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: `0 0 0 0 ${theme.palette.primary.main}40`,
              },
              '70%': {
                boxShadow: `0 0 0 12px ${theme.palette.primary.main}00`,
              },
              '100%': {
                boxShadow: `0 0 0 0 ${theme.palette.primary.main}00`,
              },
            },
          }}
        />
      )}

      <Fade in={open}>
        <Paper
          elevation={16}
          sx={{
            position: 'fixed',
            ...tooltipPosition,
            zIndex: theme.zIndex.modal + 2,
            maxWidth: { xs: '95vw', sm: 380 },
            width: { xs: '95vw', sm: 'auto' },
            minWidth: { xs: 280, sm: 320 },
            maxHeight: '80vh',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[16],
          }}
        >
          <LinearProgress
            variant="determinate"
            value={(currentStep + 1) / steps.length * 100}
            sx={{
              height: 4,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ExploreIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: '1.5rem' }} />
              <Typography variant="h6" sx={{ flex: 1, fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 600 }}>
                {getCurrentStep().title}
              </Typography>
              <Chip
                label={`${currentStep + 1} / ${steps.length}`}
                size="small"
                variant="outlined"
                sx={{ 
                  mr: 1,
                  fontWeight: 500,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }}
              />
              <IconButton 
                size="small" 
                onClick={onClose}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.6,
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
              }}
            >
              {getCurrentStep().content}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Button
                size="small"
                onClick={handlePrev}
                disabled={currentStep === 0}
                startIcon={<PrevIcon />}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main + '08',
                  },
                }}
              >
                Previous
              </Button>

              <Button
                size="small"
                onClick={onClose}
                variant="text"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Exit Tour
              </Button>

              <Button
                size="small"
                onClick={handleNext}
                variant="contained"
                endIcon={currentStep === steps.length - 1 ? null : <NextIcon />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {currentStep === steps.length - 1 ? 'Finish Tour' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default Tour;
