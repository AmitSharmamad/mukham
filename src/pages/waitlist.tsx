import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useRouter } from 'next/router';
import { joinWaitlist } from '../services/waitlistService';

interface FormData {
  email: string;
  nature_of_work: string;
  trading_type: string;
  experience_level: string;
  work_type: string;
  age: number | '';
}

export default function WaitlistPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    nature_of_work: '',
    trading_type: '',
    experience_level: '',
    work_type: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (field: keyof FormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.nature_of_work) return 'Nature of work is required';
    if (!formData.trading_type) return 'Trading type is required';
    if (!formData.experience_level) return 'Experience level is required';
    if (!formData.work_type) return 'Work type is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) return 'Age must be between 1 and 120';

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinWaitlist({
        email: formData.email,
        nature_of_work: formData.nature_of_work,
        trading_type: formData.trading_type,
        experience_level: formData.experience_level,
        work_type: formData.work_type,
        age: Number(formData.age)
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            ✅ Successfully Registered!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for joining our waitlist. We'll notify you when we're ready to launch!
          </Typography>
          <Button variant="contained" onClick={handleGoBack} size="large">
            Go Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Join Our Waitlist
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Be the first to know when we launch! Please fill out the survey below to join our waitlist.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Nature of Work</InputLabel>
                  <Select
                    value={formData.nature_of_work}
                    onChange={handleInputChange('nature_of_work')}
                    label="Nature of Work"
                  >
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Company">Company</MenuItem>
                    <MenuItem value="Proprietary_Trading_Firm">Proprietary Trading Firm</MenuItem>
                    <MenuItem value="Asset_Management">Asset Management</MenuItem>
                    <MenuItem value="Family_Office">Family Office</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Trading Type</InputLabel>
                  <Select
                    value={formData.trading_type}
                    onChange={handleInputChange('trading_type')}
                    label="Trading Type"
                  >
                    <MenuItem value="Equity">Equity</MenuItem>
                    <MenuItem value="FNO">F&O</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={formData.experience_level}
                    onChange={handleInputChange('experience_level')}
                    label="Experience Level"
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Pro">Pro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Work Type</InputLabel>
                  <Select
                    value={formData.work_type}
                    onChange={handleInputChange('work_type')}
                    label="Work Type"
                  >
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Firm">Firm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange('age')}
                  required
                  variant="outlined"
                  inputProps={{ min: 1, max: 120 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
