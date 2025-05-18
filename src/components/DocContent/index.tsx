import React from 'react';
import { Box, BoxProps, alpha, Divider, Typography, useTheme, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface DocContentProps extends BoxProps {
  title?: string;
  subtitle?: string;
}

const StyledDocContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
    : '0 1px 3px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  padding: theme.spacing(5),
  width: '100%',
  position: 'relative',
  border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  fontWeight: 400,
                  maxWidth: '700px',
                  lineHeight: 1.5
                }}
              >
                {subtitle}
              </Typography>
            )}
            <Divider sx={{ mt: 1, mb: 3 }} />
          </Box>
        </>
      )}
      <Box sx={{ 
        '& p': { 
          lineHeight: 1.7,
          fontSize: '1.05rem',
          mb: 2.5
        },
        '& h5': {
          fontWeight: 600,
          mb: 2,
          mt: 4,
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
        },
        '& ul': {
          pl: 3,
          mb: 3
        },
        '& li': {
          mb: 1.5
        }
      }}>
        {children}
      </Box>
    </StyledDocContent>
  );
};

export default DocContent;
