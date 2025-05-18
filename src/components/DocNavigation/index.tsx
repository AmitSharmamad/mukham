import React from 'react';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
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
        mt: 6, 
        pt: 4,
        borderTop: `1px solid ${theme.palette.divider}` 
      }}
    >
      {prevDoc ? (
        <Button
          component={Link}
          href={prevDoc.path}
          startIcon={<ArrowBackIos />}
          variant="text"
          color="primary"
          sx={{ 
            textAlign: 'left',
            justifyContent: 'flex-start',
            '&:hover': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.main
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Previous</Typography>
            <Typography variant="body2">{prevDoc.title}</Typography>
          </Box>
        </Button>
      ) : <Box />}
      
      {nextDoc && (
        <Button
          component={Link}
          href={nextDoc.path}
          endIcon={<ArrowForwardIos />}
          variant="text"
          color="primary"
          sx={{ 
            textAlign: 'right',
            justifyContent: 'flex-end',
            '&:hover': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.main
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Next</Typography>
            <Typography variant="body2">{nextDoc.title}</Typography>
          </Box>
        </Button>
      )}
    </Box>
  );
};

export default DocNavigation;
