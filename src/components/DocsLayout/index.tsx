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
  ListSubheader
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 280;

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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const handleToggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isItemActive = (path: string) => router.pathname === path;

  const drawer = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          px: 3, 
          py: 2, 
          fontWeight: 400,
          borderBottom: `1px solid ${theme.palette.divider}`
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
              }}
            >
              <ListItemText 
                primary={section.category} 
                primaryTypographyProps={{ 
                  variant: 'subtitle1',
                  fontWeight: 400
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
                        borderRight: `3px solid ${theme.palette.primary.main}`,
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
                      primaryTypographyProps={{ variant: 'body2' }}
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
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 2, 
            ml: 1,
            display: { sm: 'block', md: 'none' },
            position: 'fixed',
            top: 70,
            left: 0,
            zIndex: 1100,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            top: { xs: 0, sm: 64 },
            height: { xs: '100%', sm: 'calc(100% - 64px)' },
            borderRight: `1px solid ${theme.palette.divider}`
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          pt: { xs: 2, sm: 3 },
          ml: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%'
        }}
      >
        <Box sx={{ mb: 2, mt: { xs: 4, sm: 0 } }} />
        {children}
      </Box>
    </Box>
  );
};
