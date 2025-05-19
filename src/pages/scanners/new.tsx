import React from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScannerBuilder from '../../components/Scanner/ScannerBuilder';
import { createScanner } from '../../services/scannerService';

const NewScanner: React.FC = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const handleSaveScanner = async (scannerData: any) => {
    try {
      const newScanner = await createScanner(scannerData);
      router.push(`/scanners/${newScanner.id}`);
    } catch (err) {
      console.error('Error creating scanner:', err);
      setError('An error occurred while creating the scanner. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/scanners');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/scanners')}
          sx={{ mb: 2 }}
        >
          Back to Scanners
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Scanner
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <ScannerBuilder
        onSave={handleSaveScanner}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default NewScanner;
