import { Box, Container, Link, Typography, Grid, Stack, IconButton } from '@mui/material';
import { GitHub, Twitter, LinkedIn, Email } from '@mui/icons-material';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        position: 'relative',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="div" gutterBottom>
              सूत्रम् (Sutram)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Revolutionizing trading with intelligent automation. Build, test, and deploy sophisticated algorithmic trading strategies across all markets.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <GitHub />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <LinkedIn />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Email />
              </IconButton>
            </Stack>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" component="div" gutterBottom>
              Product
            </Typography>
            <Stack spacing={1}>
              <Link href="/features" color="text.secondary" underline="hover">
                Features
              </Link>
              <Link href="/pricing" color="text.secondary" underline="hover">
                Pricing
              </Link>
              <Link href="/marketplace" color="text.secondary" underline="hover">
                Marketplace
              </Link>
              <Link href="/scanners" color="text.secondary" underline="hover">
                Scanners
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" component="div" gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="/docs" color="text.secondary" underline="hover">
                Documentation
              </Link>
              <Link href="/community" color="text.secondary" underline="hover">
                Community
              </Link>
              <Link href="/support" color="text.secondary" underline="hover">
                Support
              </Link>
              <Link href="/blog" color="text.secondary" underline="hover">
                Blog
              </Link>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" component="div" gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" color="text.secondary" underline="hover">
                About Us
              </Link>
              <Link href="/careers" color="text.secondary" underline="hover">
                Careers
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact
              </Link>
              <Link href="/news" color="text.secondary" underline="hover">
                News
              </Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" component="div" gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link href="/privacy" color="text.secondary" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover">
                Terms of Service
              </Link>
              <Link href="/cookies" color="text.secondary" underline="hover">
                Cookie Policy
              </Link>
              <Link href="/disclaimer" color="text.secondary" underline="hover">
                Disclaimer
              </Link>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            pt: 3,
            mt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} सूत्रम् (Sutram). All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="/status" color="text.secondary" underline="hover">
              Status
            </Link>
            <Link href="/security" color="text.secondary" underline="hover">
              Security
            </Link>
            <Link href="/api" color="text.secondary" underline="hover">
              API
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;