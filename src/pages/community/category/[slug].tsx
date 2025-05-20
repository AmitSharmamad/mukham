import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Button,
  useTheme
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import TopicList from '../../../components/Community/TopicList';
import { Category } from '../../../components/Community/CategoryList';

// Mock data for categories
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

export default function CategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const router = useRouter();
  const { slug } = router.query;
  const theme = useTheme();

  useEffect(() => {
    // In a real app, this would be an API call
    if (slug) {
      const foundCategory = mockCategories.find(
        category => category.slug === slug
      );
      if (foundCategory) {
        setCategory(foundCategory);
      }
    }
  }, [slug]);

  if (!category) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading category...</Typography>
      </Box>
    );
  }

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
          <Typography color="text.primary">{category.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {category.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {category.description}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            sx={{ mr: 2 }}
            onClick={() => router.push('/community')}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => router.push('/community/topic/new')}
          >
            New Topic
          </Button>
        </Box>
      </Box>

      <TopicList category={category} />
    </Box>
  );
}