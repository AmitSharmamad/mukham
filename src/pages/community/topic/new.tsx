import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Breadcrumbs,
  Link,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: 'General Discussion',
    slug: 'general-discussion',
    description: 'General topics related to algo trading',
    display_order: 1
  },
  {
    id: 2,
    name: 'Strategy Development',
    slug: 'strategy-development',
    description: 'Discuss and share algo trading strategies',
    display_order: 2
  },
  {
    id: 3,
    name: 'Technical Analysis',
    slug: 'technical-analysis',
    description: 'Discussions about technical indicators and analysis',
    display_order: 3
  },
  {
    id: 4,
    name: 'Platform Support',
    slug: 'platform-support',
    description: 'Get help using our platform',
    display_order: 4
  },
  {
    id: 5,
    name: 'Market Commentary',
    slug: 'market-commentary',
    description: 'Discussions about current market conditions',
    display_order: 5
  },
  {
    id: 6,
    name: 'Programming Help',
    slug: 'programming-help',
    description: 'Get help with coding your algorithms',
    display_order: 6
  },
  {
    id: 7,
    name: 'Success Stories',
    slug: 'success-stories',
    description: 'Share your algo trading success stories',
    display_order: 7
  }
];

// Available tags for topics
const availableTags = [
  'backtesting',
  'beginner',
  'machine-learning',
  'mean-reversion',
  'momentum',
  'optimization',
  'pairs-trading',
  'performance',
  'python',
  'risk-management',
  'strategy',
  'technical-indicators',
  'trading-psychology',
  'tutorial',
  'volatility'
];

export default function NewTopic() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  // Form validation states
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    setCategories(mockCategories);
  }, []);

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const {
      target: { value },
    } = event;
    
    // Limit to 5 tags
    if (Array.isArray(value) && value.length <= 5) {
      setSelectedTags(value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.length < 5) {
      setTitleError('Title must be at least 5 characters long');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    // Validate content
    if (!content.trim()) {
      setContentError('Content is required');
      isValid = false;
    } else if (content.length < 20) {
      setContentError('Content must be at least 20 characters long');
      isValid = false;
    } else {
      setContentError('');
    }
    
    // Validate category
    if (!category) {
      setCategoryError('Please select a category');
      isValid = false;
    } else {
      setCategoryError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log({
        title,
        content,
        category_id: parseInt(category),
        tags: selectedTags
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to community page on success
      router.push('/community');
    } catch (error) {
      console.error('Error creating topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            href="/community" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Community
          </Link>
          <Typography color="text.primary">New Topic</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Create New Topic
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Box>

      <Paper 
        component="form"
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2
        }}
        onSubmit={handleSubmit}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Topic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!titleError}
            helperText={titleError}
            placeholder="Enter a clear and descriptive title"
            inputProps={{ maxLength: 150 }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'right', display: 'block' }}>
            {title.length}/150
          </Typography>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="category-label" error={!!categoryError}>
            Category
          </InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            required
            error={!!categoryError}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {categoryError && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {categoryError}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="tags-label">Tags (up to 5)</InputLabel>
          <Select
            labelId="tags-label"
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            input={<OutlinedInput id="select-multiple-tags" label="Tags (up to 5)" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {availableTags.map((tag) => (
              <MenuItem
                key={tag}
                value={tag}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
              >
                {tag}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" sx={{ mt: 0.5, ml: 2 }}>
            Select up to 5 tags that describe your topic
          </Typography>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Content"
            multiline
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            error={!!contentError}
            helperText={contentError || "You can use markdown formatting for your content."}
            placeholder="Share your thoughts, questions, or ideas in detail..."
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Topic...' : 'Create Topic'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}