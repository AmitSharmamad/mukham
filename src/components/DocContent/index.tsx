import React from 'react';
import { Box, BoxProps, alpha, Divider, Typography, useTheme, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface DocContentProps extends BoxProps {
  title?: string;
  subtitle?: string;
  tags?: string[];
}

const StyledDocContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
    : '0 2px 10px rgba(0, 0, 0, 0.03)',
  overflow: 'hidden',
  padding: theme.spacing(5),
  width: '100%',
  position: 'relative',
  border: theme.palette.mode === 'dark' 
    ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
    : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
}));

// Styled anchor links for headings
const AnchorWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  '&:hover .anchor-link': {
    opacity: 1,
  },
}));

const AnchorLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  marginLeft: -28,
  opacity: 0,
  paddingRight: 8,
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '& svg': {
    width: 20,
    height: 20,
  },
}));

export const DocContent: React.FC<DocContentProps> = ({ 
  children, 
  title, 
  subtitle,
  tags,
  sx, 
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <StyledDocContent
      sx={{
        ...sx,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` 
            : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        }
      }}
      {...(props as any)}
    >
      {title && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
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
                  maxWidth: '800px',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {tags && tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 3, flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }} 
                  />
                ))}
              </Box>
            )}
            
            <Divider sx={{ 
              mt: 1, 
              mb: 4,
              opacity: 0.6
            }} />
          </Box>
        </>
      )}
      <Box sx={{ 
        '& p': { 
          lineHeight: 1.8,
          fontSize: '1.05rem',
          mb: 2.5,
          color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.85) : theme.palette.text.primary,
        },
        '& h5': {
          fontWeight: 600,
          mb: 2.5,
          mt: 4.5,
          pt: 1,
          fontSize: '1.3rem',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          paddingBottom: 2
        },
        '& ul': {
          pl: 3,
          mb: 3
        },
        '& li': {
          mb: 1.5
        },
        '& strong': {
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
        },
        '& a': {
          color: theme.palette.primary.main,
          textDecoration: 'none',
          borderBottom: `1px dotted ${alpha(theme.palette.primary.main, 0.5)}`,
          transition: 'all 0.2s',
          '&:hover': {
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            borderBottomStyle: 'solid',
          }
        },
        '& blockquote': {
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          margin: theme.spacing(2, 0),
          padding: theme.spacing(1, 0, 1, 2),
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '4px',
          '& p': {
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
          }
        },
        '& code': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.primary.dark, 0.2) 
            : alpha(theme.palette.primary.light, 0.2),
          padding: theme.spacing(0.5, 1),
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.9em',
          color: theme.palette.mode === 'dark' 
            ? theme.palette.primary.light 
            : theme.palette.primary.dark,
        },
        '& pre': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.common.black, 0.3) 
            : alpha(theme.palette.common.black, 0.05),
          padding: theme.spacing(2),
          borderRadius: '6px',
          overflowX: 'auto',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
            color: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.8) 
              : theme.palette.text.primary,
          }
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: '6px',
          margin: theme.spacing(3, 0),
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
            : '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: theme.spacing(3),
          border: `1px solid ${theme.palette.divider}`,
          '& th': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.black, 0.3) 
              : alpha(theme.palette.common.black, 0.03),
            padding: theme.spacing(1.5),
            textAlign: 'left',
            fontWeight: 600,
          },
          '& td': {
            padding: theme.spacing(1.5),
            borderTop: `1px solid ${theme.palette.divider}`,
          },
        }
      }}>
        {children}
      </Box>
    </StyledDocContent>
  );
};

export default DocContent;
