import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Paper, 
  Chip,
  useTheme,
  Divider,
  Button
} from '@mui/material';
import { Forum, Description, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/router';

// Mock data for categories based on the schema
const mockCategories = [
  {
    id: 1,
    name: 'General Discussion',
    slug: 'general-discussion',
    description: 'General topics related to algo trading',
    display_order: 1,
    topic_count: 32,
    post_count: 126
  },
  {
    id: 2,
    name: 'Strategy Development',
    slug: 'strategy-development',
    description: 'Discuss and share algo trading strategies',
    display_order: 2,
    topic_count: 47,
    post_count: 213
  },
  {
    id: 3,
    name: 'Technical Analysis',
    slug: 'technical-analysis',
    description: 'Discussions about technical indicators and analysis',
    display_order: 3,
    topic_count: 24,
    post_count: 79
  },
  {
    id: 4,
    name: 'Platform Support',
    slug: 'platform-support',
    description: 'Get help using our platform',
    display_order: 4,
    topic_count: 18,
    post_count: 93
  },
  {
    id: 5,
    name: 'Market Commentary',
    slug: 'market-commentary',
    description: 'Discussions about current market conditions',
    display_order: 5,
    topic_count: 28,
    post_count: 134
  },
  {
    id: 6,
    name: 'Programming Help',
    slug: 'programming-help',
    description: 'Get help with coding your algorithms',
    display_order: 6,
    topic_count: 36,
    post_count: 147
  },
  {
    id: 7,
    name: 'Success Stories',
    slug: 'success-stories',
    description: 'Share your algo trading success stories',
    display_order: 7,
    topic_count: 15,
    post_count: 72
  }
];

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  topic_count: number;
  post_count: number;
}

interface CategoryListProps {
  onCategorySelect?: (category: Category) => void;
}

export const CategoryList = ({ onCategorySelect }: CategoryListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // In a real app, this would be an API call
    setCategories(mockCategories);
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      router.push(`/community/category/${category.slug}`);
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Forum Categories
        </Typography>
        <Button 
          variant="outlined"
          size="small"
          href="/community/activity"
          endIcon={<ArrowForward />}
        >
          Recent Activity
        </Button>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {categories.map((category, index) => (
          <Box key={category.id}>
            {index > 0 && <Divider sx={{ my: 1 }} />}
            <ListItem
              alignItems="flex-start"
              sx={{ 
                py: 2,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)' 
                }
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <ListItemIcon>
                <Forum color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
                    {category.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        icon={<Description sx={{ fontSize: '0.8rem !important' }} />} 
                        label={`${category.topic_count} Topics`}
                        sx={{ 
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(66, 66, 120, 0.8)' 
                            : 'rgba(230, 230, 250, 0.8)'
                        }}
                      />
                      <Chip 
                        size="small" 
                        icon={<Forum sx={{ fontSize: '0.8rem !important' }} />} 
                        label={`${category.post_count} Posts`}
                        sx={{ 
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(66, 66, 120, 0.8)' 
                            : 'rgba(230, 230, 250, 0.8)'
                        }}
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryList;