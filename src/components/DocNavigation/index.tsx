import React from 'react';
import { Box, Button, Divider, Typography, useTheme, alpha, Paper } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Link from 'next/link';

interface DocNavigationProps {
  prevDoc?: {
    title: string;
    path: string;
  };
  nextDoc?: {
    title: string;
    path: string;
  };
}

export const DocNavigation: React.FC<DocNavigationProps> = ({ prevDoc, nextDoc }) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 8, 
        pt: 4,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` 
      }}
    >
      {prevDoc ? (
        <Paper
          component={Link}
          href={prevDoc.path}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            p: 2,
            borderRadius: 2,
            flex: 1,
            mr: nextDoc ? 2 : 0,
            transition: 'all 0.2s ease',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              transform: 'translateX(-4px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <ArrowBackIos sx={{ 
            fontSize: 18, 
            color: theme.palette.primary.main,
            mr: 1
          }} />
          <Box>
            <Typography variant="caption" sx={{ 
              opacity: 0.7, 
              display: 'block',
              color: theme.palette.text.secondary
            }}>
              Previous
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
              }}
            >
              {prevDoc.title}
            </Typography>
          </Box>
        </Paper>
      ) : <Box sx={{ flex: 1 }} />}
      
      {nextDoc && (
        <Paper
          component={Link}
          href={nextDoc.path}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            textDecoration: 'none',
            p: 2,
            borderRadius: 2,
            flex: 1,
            ml: prevDoc ? 2 : 0,
            transition: 'all 0.2s ease',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              transform: 'translateX(4px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ 
              opacity: 0.7, 
              display: 'block',
              color: theme.palette.text.secondary
            }}>
              Next
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
              }}
            >
              {nextDoc.title}
            </Typography>
          </Box>
          <ArrowForwardIos sx={{ 
            fontSize: 18, 
            color: theme.palette.primary.main,
            ml: 1
          }} />
        </Paper>
      )}
    </Box>
  );
};

export default DocNavigation;
