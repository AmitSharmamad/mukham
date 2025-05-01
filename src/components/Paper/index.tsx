import React from 'react';
import { Paper as MuiPaper, PaperProps as MuiPaperProps, useTheme, alpha } from '@mui/material';

export interface PaperProps extends MuiPaperProps {
  // Add any additional props needed for your custom implementation
  noPadding?: boolean;
}

export const Paper: React.FC<PaperProps> = ({ children, sx, elevation = 1, noPadding = false, ...props }) => {
  const theme = useTheme();
  
  // Determine border style based on theme mode and elevation
  const getBorderStyle = () => {
    // Only add border in dark mode or when elevation is 0
    if (theme.palette.mode === 'dark' || elevation === 0) {
      return {
        border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.8 : 0.3)}`,
      };
    }
    return {};
  };
  
  return (
    <MuiPaper
      elevation={elevation}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
        ...getBorderStyle(),
        // Apply padding if not disabled and not outlined
        ...((!noPadding && props.variant !== 'outlined') ? { p: 3 } : {}),
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiPaper>
  );
};

export default Paper;
