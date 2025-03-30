import { useState } from 'react';
import { Box, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Select } from '../components/Select';

const SUPPORT_CATEGORIES = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'account', label: 'Account Related' },
  { value: 'strategy', label: 'Strategy Building' },
  { value: 'other', label: 'Other' },
];

const faqs = [
  {
    question: 'How do I create my first strategy?',
    answer: 'Navigate to the Strategy page and click on "Create Strategy" button. Follow the step-by-step guide to build your strategy using our intuitive builder interface.',
  },
  {
    question: 'What is the minimum capital required?',
    answer: 'The minimum capital requirement varies based on the instruments you choose to trade and your broker\'s requirements.',
  },
  {
    question: 'How can I backtest my strategy?',
    answer: 'In the Strategy Builder, you can set backtest parameters including date range and initial capital. The system will simulate your strategy\'s performance over historical data.',
  },
];

export default function Support() {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
  });

  const handleChange = (field: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Support
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Contact Support
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject')(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    fullWidth
                    label="Category"
                    options={SUPPORT_CATEGORIES}
                    value={formData.category}
                    onChange={handleChange('category')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description')(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    '&:not(:last-child)': { mb: 1 },
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
