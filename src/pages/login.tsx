import { Box, Button, Container, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:9090/api/auth/google/login';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to सूत्रम्
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          Login with Google
        </Button>
      </Box>
    </Container>
  );
}