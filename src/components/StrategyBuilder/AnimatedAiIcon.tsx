import React from 'react';
import { Box, keyframes, useTheme, SxProps, Theme } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

// Define the pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
`;

// Define the orbit animation
const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(10px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(10px) rotate(-360deg);
  }
`;

interface AnimatedAiIconProps {
  sx?: SxProps<Theme>;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  size?: 'small' | 'medium' | 'large';
}

const AnimatedAiIcon: React.FC<AnimatedAiIconProps> = ({ 
  sx = {}, 
  color = 'primary',
  size = 'medium'
}) => {
  const theme = useTheme();
  
  // Determine icon size based on the size prop
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 32;
      case 'medium':
      default:
        return 24;
    }
  };

  // Get the color from the theme
  const getColor = () => {
    if (color === 'inherit') return 'currentColor';
    return theme.palette[color].main;
  };

  const iconSize = getIconSize();
  const iconColor = getColor();

  return (
    <Box
      sx={{
        position: 'relative',
        width: iconSize,
        height: iconSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
    >
      {/* Gemini-like particles orbiting around */}
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: iconSize / 6,
            height: iconSize / 6,
            borderRadius: '50%',
            backgroundColor: iconColor,
            animation: `${orbit} 3s linear infinite`,
            animationDelay: `${index * 0.5}s`,
            opacity: 0.7,
            transform: `rotate(${index * 120}deg) translateX(${iconSize / 2}px)`,
          }}
        />
      ))}
      
      {/* Central icon with pulse animation */}
      <Box
        sx={{
          animation: `${pulse} 2s ease-in-out infinite`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <AutoAwesomeIcon 
          color={color} 
          sx={{ 
            fontSize: iconSize * 0.8,
          }} 
        />
      </Box>
    </Box>
  );
};

export default AnimatedAiIcon;
