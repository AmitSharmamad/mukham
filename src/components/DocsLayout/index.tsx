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
  Paper,
  Container,
  alpha,
  Tooltip,
  Breadcrumbs
} from '@mui/material';
import { 
  ExpandLess, 
  ExpandMore, 
  Menu as MenuIcon, 
  ChevronLeft,
  Article,
  Home
} from '@mui/icons-material';
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
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(!isTablet);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  // Get current breadcrumbs
  const getBreadcrumbs = () => {
    const paths = router.pathname.split('/').filter(Boolean);
    if (paths.length <= 1) return [];
    
    // Remove docs from the path
    paths.shift();
    
    // Format remaining paths
    return paths.map(path => {
      const formattedPath = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return formattedPath;
    });
  };
  
  const breadcrumbs = getBreadcrumbs();

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerToggleDesktop = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCategoryClick = (category: string) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category]
    });
  };

  // Find the active category and item
  const findActiveItem = () => {
    for (const category of docNavigation) {
      for (const item of category.items) {
        if (item.path === router.pathname) {
          return { category: category.category, item: item.title };
        }
      }
    }
    return null;
  };

  const activeItem = findActiveItem();

  const drawer = (
    <Box 
      sx={{ 
        overflow: 'auto',
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.6) 
          : theme.palette.background.paper,
        borderRight: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.1 : 0.2)}`,
      }}
    >
      <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main
          }}
        >
          Documentation
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggleDesktop} sx={{ color: theme.palette.text.secondary }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        {docNavigation.map((category) => (
          <Box key={category.category}>
            <ListItemButton 
              onClick={() => handleCategoryClick(category.category)}
              sx={{
                mb: 0.5,
                borderRadius: '8px',
                backgroundColor: openCategories[category.category] 
                  ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.05) 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.05),
                }
              }}
            >
              <ListItemText 
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {category.category}
                  </Typography>
                } 
              />
              {openCategories[category.category] ? (
                <ExpandLess sx={{ color: theme.palette.text.secondary }} />
              ) : (
                <ExpandMore sx={{ color: theme.palette.text.secondary }} />
              )}
            </ListItemButton>
            <Collapse in={openCategories[category.category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {category.items.map((item) => {
                  const isActive = router.pathname === item.path;
                  return (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      href={item.path}
                      selected={isActive}
                      sx={{
                        pl: 4,
                        py: 1,
                        borderRadius: '8px',
                        mb: 0.5,
                        backgroundColor: isActive 
                          ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.1) 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
                        },
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.08),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.1),
                          }
                        }
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                              fontWeight: isActive ? 500 : 400
                            }}
                          >
                            {item.title}
                          </Typography>
                        } 
                      />
                      {isActive && (
                        <Box 
                          sx={{ 
                            width: 4, 
                            height: 24, 
                            borderRadius: '2px', 
                            backgroundColor: theme.palette.primary.main,
                            ml: 1
                          }} 
                        />
                      )}
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: { xs: '100%', md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          pt: { xs: 3, md: 4 },
          pb: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            justifyContent: 'space-between'
          }}
        >
          <Box>
            {isMobile || !drawerOpen ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={isMobile ? handleDrawerToggle : handleDrawerToggleDesktop}
                sx={{ mr: 2, display: { lg: !drawerOpen ? 'inline-flex' : 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
          
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'inline-flex', ml: 1 }}>
              <Link href="/docs" passHref style={{ textDecoration: 'none' }}>
                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontSize: '0.875rem',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  <Home sx={{ mr: 0.5, fontSize: '1rem' }} />
                  Docs
                </Typography>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <Typography
                  key={index}
                  color={index === breadcrumbs.length - 1 ? "text.primary" : "text.secondary"}
                  sx={{ 
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: index === breadcrumbs.length - 1 ? 500 : 400
                  }}
                >
                  {index === breadcrumbs.length - 1 && (
                    <Article sx={{ mr: 0.5, fontSize: '1rem' }} />
                  )}
                  {crumb}
                </Typography>
              ))}
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {activeItem && (
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Reading: <Typography component="span" color="primary" fontWeight={500}>{activeItem.item}</Typography>
              </Typography>
            )}
          </Box>
        </Box>
        <Container 
          maxWidth="lg" 
          disableGutters 
          sx={{ 
            mt: 2, 
            mx: 'auto',
            maxWidth: '900px'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
