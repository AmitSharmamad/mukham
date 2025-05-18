import { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  Typography, 
  Divider, 
  useTheme, 
  useMediaQuery, 
  IconButton,
  Collapse,
  ListSubheader,
  Paper
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon, ChevronLeft } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 260;

// Documentation structure with nested categories
const docNavigation = [
  {
    category: 'Getting Started',
    items: [
      { title: 'Introduction', path: '/docs/getting-started/introduction' },
      { title: 'Platform Overview', path: '/docs/getting-started/platform-overview' },
      { title: 'Quick Start Guide', path: '/docs/getting-started/quick-start' },
    ]
  },
  {
    category: 'Strategy',
    items: [
      { title: 'Strategy Overview', path: '/docs/strategy/overview' },
      { title: 'Creating a Strategy', path: '/docs/strategy/creating' },
      { title: 'Entry Conditions', path: '/docs/strategy/entry-conditions' },
      { title: 'Exit Conditions', path: '/docs/strategy/exit-conditions' },
      { title: 'Backtesting', path: '/docs/strategy/backtesting' },
    ]
  },
  {
    category: 'Indicators',
    items: [
      { title: 'Indicator Overview', path: '/docs/indicators/overview' },
      { title: 'Price Action Indicators', path: '/docs/indicators/price-action' },
      { title: 'Momentum Indicators', path: '/docs/indicators/momentum' },
      { title: 'Trend Indicators', path: '/docs/indicators/trend' },
      { title: 'Volatility Indicators', path: '/docs/indicators/volatility' },
      { title: 'Volume Indicators', path: '/docs/indicators/volume' },
    ]
  },
  {
    category: 'Reports',
    items: [
      { title: 'Report Overview', path: '/docs/reports/overview' },
      { title: 'Performance Metrics', path: '/docs/reports/performance-metrics' },
      { title: 'Analytics', path: '/docs/reports/analytics' },
    ]
  },
  {
    category: 'Advanced',
    items: [
      { title: 'API Reference', path: '/docs/advanced/api-reference' },
      { title: 'Best Practices', path: '/docs/advanced/best-practices' },
      { title: 'Troubleshooting', path: '/docs/advanced/troubleshooting' },
    ]
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(!isTablet);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  // Initialize open state for categories based on current route
  useEffect(() => {
    const initialOpenState: { [key: string]: boolean } = {};
    docNavigation.forEach(category => {
      // Check if any item in this category matches the current path
      const isActive = category.items.some(item => router.pathname === item.path);
      initialOpenState[category.category] = isActive;
    });
    setOpenCategories(initialOpenState);
  }, [router.pathname]);

  // Update drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(!isTablet);
  }, [isTablet]);

  const handleToggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen(!drawerOpen);
    }
  };

  const isItemActive = (path: string) => router.pathname === path;

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', borderRight: `1px solid ${theme.palette.divider}` }}>
      <Typography 
        variant="h6" 
        sx={{ 
          px: 3, 
          py: 2, 
          fontWeight: 500,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
        Documentation
      </Typography>
      <List 
        sx={{ 
          width: '100%',
          py: 0
        }}
        component="nav"
      >
        {docNavigation.map((section) => (
          <Box key={section.category}>
            <ListItemButton 
              onClick={() => handleToggleCategory(section.category)}
              sx={{ 
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: openCategories[section.category] ? 
                  (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)') : 
                  'transparent'
              }}
            >
              <ListItemText 
                primary={section.category} 
                primaryTypographyProps={{ 
                  variant: 'subtitle1',
                  fontWeight: 500
                }}
              />
              {openCategories[section.category] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategories[section.category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item) => (
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    key={item.path}
                    selected={isItemActive(item.path)}
                    sx={{
                      pl: 4,
                      py: 1,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)',
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.08)',
                        }
                      },
                    }}
                  >
                    <ListItemText 
                      primary={item.title} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        sx: {
                          fontWeight: isItemActive(item.path) ? 500 : 400
                        }
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100%', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#f5f7f9' }}>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          mr: 2, 
          ml: 1,
          display: { xs: 'block' },
          position: 'fixed',
          top: 70,
          left: drawerOpen && !isMobile ? drawerWidth - 12 : 10,
          zIndex: 1100,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        {drawerOpen && !isMobile ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={isMobile ? mobileOpen : drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            top: { xs: 0, sm: 64 },
            height: { xs: '100%', sm: 'calc(100% - 64px)' },
            borderRight: 'none',
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 0 15px rgba(0, 0, 0, 0.05)'
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 },
          ml: { xs: 0 },
          width: '100%',
          maxWidth: '100%',
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          ...(drawerOpen && !isMobile && {
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
          }),
        }}
      >
        <Box sx={{ mb: 2, mt: { xs: 4, sm: 0 } }} />
        <Paper 
          elevation={1} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            borderRadius: 1,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : '#ffffff',
            width: '100%',
            minHeight: 'calc(100vh - 130px)',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};
