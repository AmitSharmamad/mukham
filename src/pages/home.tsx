import { Container, Link, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Home</Typography>
      <Typography>Links to other pages:</Typography>
      <Link href="/strategy">Strategy</Link><br />
      <Link href="/reports">Reports</Link><br />
      <Link href="/docs">Docs</Link>
    </Container>
  );
}
