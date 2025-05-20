import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  ChatBubble, 
  Visibility, 
  Bookmark, 
  BookmarkBorder,
  ThumbUp,
  PushPin
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Category } from './CategoryList';

// Mock data for topics
const mockTopics = [
  {
    id: 1,
    title: 'Introduction to Mean Reversion Strategies',
    slug: 'introduction-to-mean-reversion-strategies',
    category_id: 2,
    author: {
      id: 'user1',
      name: 'TradingPro',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    is_pinned: true,
    view_count: 342,
    created_at: '2023-04-15T10:30:00Z',
    last_activity_at: '2023-04-18T14:22:00Z',
    reply_count: 24,
    like_count: 18,
    tags: ['mean-reversion', 'strategy', 'beginner']
  },
  {
    id: 2,
    title: 'Optimizing Backtesting Performance for Complex Strategies',
    slug: 'optimizing-backtesting-performance',
    category_id: 2,
    author: {
      id: 'user2',
      name: 'AlgoWhiz',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    is_pinned: false,
    view_count: 278,
    created_at: '2023-04-12T08:15:00Z',
    last_activity_at: '2023-04-17T11:32:00Z',
    reply_count: 17,
    like_count: 12,
    tags: ['backtesting', 'optimization', 'performance']
  },
  {
    id: 3,
    title: 'Machine Learning Models for Market Prediction: A Comparison',
    slug: 'machine-learning-models-for-market-prediction',
    category_id: 2,
    author: {
      id: 'user3',
      name: 'DataScientist',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    is_pinned: false,
    view_count: 426,
    created_at: '2023-04-08T15:45:00Z',
    last_activity_at: '2023-04-16T09:28:00Z',
    reply_count: 32,
    like_count: 27,
    tags: ['machine-learning', 'prediction', 'comparison']
  },
  {
    id: 4,
    title: 'Risk Management Techniques for Algorithmic Trading',
    slug: 'risk-management-techniques',
    category_id: 2,
    author: {
      id: 'user4',
      name: 'RiskManager',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    is_pinned: false,
    view_count: 315,
    created_at: '2023-04-05T11:20:00Z',
    last_activity_at: '2023-04-14T16:05:00Z',
    reply_count: 21,
    like_count: 19,
    tags: ['risk-management', 'strategy', 'advanced']
  },
  {
    id: 5,
    title: 'Building Your First Momentum Strategy',
    slug: 'building-first-momentum-strategy',
    category_id: 2,
    author: {
      id: 'user5',
      name: 'MomentumTrader',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    is_pinned: false,
    view_count: 289,
    created_at: '2023-04-03T09:10:00Z',
    last_activity_at: '2023-04-12T13:47:00Z',
    reply_count: 15,
    like_count: 11,
    tags: ['momentum', 'strategy', 'tutorial']
  }
];

export interface Topic {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  last_activity_at: string;
  reply_count: number;
  like_count: number;
  tags: string[];
}

interface TopicListProps {
  category?: Category;
}

export const TopicList = ({ category }: TopicListProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [bookmarkedTopics, setBookmarkedTopics] = useState<number[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // In a real app, this would be an API call filtered by category_id
    if (category) {
      const filteredTopics = mockTopics.filter(topic => topic.category_id === category.id);
      setTopics(filteredTopics);
    } else {
      setTopics(mockTopics);
    }
  }, [category]);

  const handleTopicClick = (topic: Topic) => {
    router.push(`/community/topic/${topic.slug}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const toggleBookmark = (e: React.MouseEvent, topicId: number) => {
    e.stopPropagation();
    setBookmarkedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {category ? `Topics in ${category.name}` : 'Recent Topics'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => router.push('/community/topic/new')}
        >
          New Topic
        </Button>
      </Box>

      <List sx={{ width: '100%' }}>
        {topics.map((topic, index) => (
          <Box key={topic.id}>
            {index > 0 && <Divider sx={{ my: 1 }} />}
            <ListItem 
              alignItems="flex-start"
              sx={{ 
                py: 2,
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: topic.is_pinned ? (
                  theme.palette.mode === 'dark' ? 'rgba(66, 66, 120, 0.15)' : 'rgba(230, 230, 250, 0.5)'
                ) : 'transparent',
                '&:hover': { 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)' 
                }
              }}
              onClick={() => handleTopicClick(topic)}
            >
              <ListItemAvatar>
                <Avatar src={topic.author.avatar} alt={topic.author.name}>
                  {topic.author.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {topic.is_pinned && (
                      <Tooltip title="Pinned topic">
                        <PushPin 
                          fontSize="small" 
                          color="secondary" 
                          sx={{ mr: 1, transform: 'rotate(45deg)' }} 
                        />
                      </Tooltip>
                    )}
                    <Typography 
                      variant="subtitle1" 
                      color="primary"
                      sx={{ 
                        fontWeight: 500,
                        display: 'inline' 
                      }}
                    >
                      {topic.title}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {topic.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ 
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(66, 66, 120, 0.8)' 
                              : 'rgba(230, 230, 250, 0.8)'
                          }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          by <strong>{topic.author.name}</strong> • {formatDate(topic.created_at)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Tooltip title={`${topic.view_count} views`}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Visibility fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {topic.view_count}
                            </Typography>
                          </Box>
                        </Tooltip>
                        
                        <Tooltip title={`${topic.reply_count} replies`}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ChatBubble fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {topic.reply_count}
                            </Typography>
                          </Box>
                        </Tooltip>
                        
                        <Tooltip title={`${topic.like_count} likes`}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThumbUp fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {topic.like_count}
                            </Typography>
                          </Box>
                        </Tooltip>
                        
                        <IconButton
                          size="small"
                          onClick={(e) => toggleBookmark(e, topic.id)}
                          sx={{ ml: 0.5 }}
                        >
                          {bookmarkedTopics.includes(topic.id) ? (
                            <Bookmark fontSize="small" color="primary" />
                          ) : (
                            <BookmarkBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
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

export default TopicList;