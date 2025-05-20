import { Box, Container, Link, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            flexWrap: 'wrap'
          }}
        >
          <Link href="/terms" color="inherit" underline="hover">
            Terms & Conditions
          </Link>
          <Link href="/privacy" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="/docs" color="inherit" underline="hover">
            Docs
          </Link>
          <Link href="/careers" color="inherit" underline="hover">
            Careers
          </Link>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} सूत्रम्. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;