import { Container, Typography, Link } from '@mui/material';

export default function Docs() {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Documentation</Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <Link href="/docs/strategy">How to build strategies</Link>
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <Link href="/docs/usage">How to use this application</Link>
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <Link href="/docs/overview">Application Overview</Link>
      </Typography>
    </Container>
  );
}
