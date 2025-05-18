import React from 'react';
import { Box, BoxProps, alpha, Divider, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface DocContentProps extends BoxProps {
  title?: string;
  subtitle?: string;
}

const StyledDocContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
    : '0 2px 10px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.8 : 0.3)}`,
  overflow: 'hidden',
  padding: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius * 2,
    borderBottomLeftRadius: theme.shape.borderRadius * 2,
  }
}));

export const DocContent: React.FC<DocContentProps> = ({ 
  children, 
  title, 
  subtitle,
  sx, 
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <StyledDocContent
      sx={{
        ...sx
      }}
      {...props}
    >
      {title && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {subtitle}
              </Typography>
            )}
            <Divider sx={{ mt: 1, mb: 3 }} />
          </Box>
        </>
      )}
      {children}
    </StyledDocContent>
  );
};

export default DocContent;
