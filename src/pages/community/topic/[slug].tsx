import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Chip,
  Breadcrumbs,
  Link,
  Grid,
  useTheme
} from '@mui/material';
import { 
  ArrowBack,
  ThumbUp,
  ThumbUpOutlined,
  Reply,
  Flag,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { Topic } from '../../../components/Community/TopicList';

// Mock data for a single topic
const mockTopic = {
  id: 1,
  title: 'Introduction to Mean Reversion Strategies',
  slug: 'introduction-to-mean-reversion-strategies',
  content: `
  Mean reversion is a financial theory suggesting that asset prices and returns eventually return back to the long-run mean or average level of the entire dataset.

  ## Key Components
  
  1. **Identifying the Mean**: First, you need to determine what constitutes the "normal" level for the asset. This could be a moving average, historical average, or other statistical measures.
  
  2. **Measuring Deviation**: Once you've established the mean, you need to quantify how far the current price has deviated from this baseline. This is often done using standard deviations or z-scores.
  
  3. **Entry/Exit Signals**: Define the conditions under which you'll enter a trade (when deviation is significant) and exit (when price reverts to mean or deviates further).
  
  ## Example Strategy
  
  Here's a basic mean reversion strategy:
  
  - Calculate a 20-day moving average for a stock
  - When the price moves 2 standard deviations below the moving average, buy
  - When it reverts to the moving average, sell
  
  ## Common Challenges
  
  - False signals during strong trends
  - Determining the appropriate time window
  - Risk management when prices continue to deviate
  
  Has anyone implemented a mean reversion strategy successfully? What parameters and risk management techniques worked best for you?
  `,
  category_id: 2,
  category_name: 'Strategy Development',
  category_slug: 'strategy-development',
  author: {
    id: 'user1',
    name: 'TradingPro',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    joined_date: '2022-01-15T08:30:00Z',
    post_count: 127
  },
  is_pinned: true,
  view_count: 342,
  created_at: '2023-04-15T10:30:00Z',
  last_activity_at: '2023-04-18T14:22:00Z',
  reply_count: 3,
  like_count: 18,
  tags: ['mean-reversion', 'strategy', 'beginner']
};

// Mock data for replies
const mockReplies = [
  {
    id: 101,
    topic_id: 1,
    author: {
      id: 'user2',
      name: 'AlgoWhiz',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      joined_date: '2022-02-18T14:20:00Z',
      post_count: 83
    },
    content: `
    Great introduction to mean reversion! I've been trading a variant of this strategy for about a year now.

    I found that adding volume confirmation helps reduce false signals. Specifically, I look for higher than average volume when the price deviates significantly from the mean, which often indicates a stronger likelihood of reversion.

    For risk management, I use a time-based stop loss. If the price doesn't start reverting within 5 trading days, I exit the position regardless of the price level. This has saved me from several prolonged deviations.

    Another tip: mean reversion tends to work better in range-bound markets and specific sectors like utilities and consumer staples. I avoid applying this strategy to high-growth tech stocks or during major market regime changes.
    `,
    is_solution: false,
    created_at: '2023-04-15T13:45:00Z',
    like_count: 12
  },
  {
    id: 102,
    topic_id: 1,
    author: {
      id: 'user3',
      name: 'DataScientist',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      joined_date: '2022-03-22T09:15:00Z',
      post_count: 156
    },
    content: `
    I'd like to add some statistical considerations that have improved my mean reversion strategies:

    1. **Test for stationarity** - Before applying mean reversion, make sure your asset's price series is actually stationary (or can be transformed to become stationary). The Augmented Dickey-Fuller test is useful for this.

    2. **Adapt your mean** - Instead of using a simple moving average, consider using an exponentially weighted moving average that gives more weight to recent prices. This helps the strategy adapt to changing market regimes.

    3. **Dynamic volatility measurement** - Rather than using a fixed standard deviation threshold, implement a dynamic volatility measurement like ATR (Average True Range) to adjust your entry signals according to current market conditions.

    4. **Consider pairs trading** - One of the most robust forms of mean reversion is pairs trading, where you look at the spread between two correlated securities rather than the absolute price of a single security.

    These modifications have significantly improved the Sharpe ratio of my mean reversion strategies, especially during volatile market periods.
    `,
    is_solution: true,
    created_at: '2023-04-16T09:22:00Z',
    like_count: 16
  },
  {
    id: 103,
    topic_id: 1,
    author: {
      id: 'user4',
      name: 'RiskManager',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      joined_date: '2022-04-10T16:40:00Z',
      post_count: 92
    },
    content: `
    From a risk management perspective, I'd caution against using mean reversion strategies without proper safeguards:

    1. Always use stop losses - Yes, they might get triggered during temporary spikes, but they're essential to protect your capital when the assumed reversion doesn't happen.

    2. Position sizing is crucial - I recommend not allocating more than 2% of your portfolio to a single mean reversion trade, especially when volatility is high.

    3. Watch for fundamental changes - Mean reversion assumes the underlying fundamentals haven't changed. Always check if there's news or structural changes in the market that might invalidate your reversion thesis.

    4. Mean reversion strategies often have high win rates but poor risk-reward ratios. A few large losses can wipe out many small gains, so monitor your strategy's performance carefully.

    5. Consider using options for defined risk exposure when implementing these strategies in volatile markets.
    `,
    is_solution: false,
    created_at: '2023-04-17T11:15:00Z',
    like_count: 9
  }
];

export default function TopicDetailPage() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState('');
  const [likedReplies, setLikedReplies] = useState<number[]>([]);
  const [isTopicLiked, setIsTopicLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const theme = useTheme();

  useEffect(() => {
    // In a real app, these would be API calls
    if (slug && slug === mockTopic.slug) {
      setTopic(mockTopic as any);
      setReplies(mockReplies);
    }
  }, [slug]);

  const handleLikeReply = (replyId: number) => {
    setLikedReplies(prev => 
      prev.includes(replyId) 
        ? prev.filter(id => id !== replyId)
        : [...prev, replyId]
    );
  };

  const handleLikeTopic = () => {
    setIsTopicLiked(!isTopicLiked);
  };

  const handleBookmarkTopic = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    
    // In a real app, this would be an API call
    const newReplyObj = {
      id: Date.now(), // Temporary ID
      topic_id: topic?.id,
      author: {
        id: 'currentUser',
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
        joined_date: new Date().toISOString(),
        post_count: 1
      },
      content: newReply,
      is_solution: false,
      created_at: new Date().toISOString(),
      like_count: 0
    };
    
    setReplies([...replies, newReplyObj]);
    setNewReply('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!topic) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading topic...</Typography>
      </Box>
    );
  }

  const renderMarkdown = (content: string | undefined) => {
    // Return empty fragment if content is undefined
    if (!content) return <></>;
    
    // This is a simplified markdown renderer
    // In a real app, use a markdown library
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <Typography key={i} variant="h6" gutterBottom sx={{ mt: 2 }}>{line.replace('## ', '')}</Typography>
      }
      if (line.startsWith('- ')) {
        return <Typography key={i} variant="body1" component="li" sx={{ ml: 2, mt: 1 }}>{line.replace('- ', '')}</Typography>
      }
      if (line.trim() === '') {
        return <Box key={i} sx={{ height: '16px' }} />
      }
      return <Typography key={i} variant="body1" paragraph>{line}</Typography>
    });
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
          <Link 
            color="inherit" 
            href={`/community/category/${topic.category_slug}`}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {topic.category_name}
          </Link>
          <Typography color="text.primary" noWrap sx={{ maxWidth: 300 }}>
            {topic.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {topic.title}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Box>

      {/* Topic tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {topic.tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(66, 66, 120, 0.8)' 
                : 'rgba(230, 230, 250, 0.8)'
            }}
          />
        ))}
      </Box>

      {/* Topic content card */}
      <Card 
        elevation={2}
        sx={{ 
          mb: 4,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2
        }}
      >
        <CardHeader
          avatar={
            <Avatar 
              src={topic.author.avatar} 
              alt={topic.author.name}
              sx={{ width: 48, height: 48 }}
            >
              {topic.author.name.charAt(0)}
            </Avatar>
          }
          title={
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {topic.author.name}
            </Typography>
          }
          subheader={
            <Box>
              <Typography variant="body2" color="text.secondary">
                Posted {formatDate(topic.created_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {topic.author.post_count} posts
              </Typography>
            </Box>
          }
        />

        <CardContent>
          <Box sx={{ pl: 1, pr: 1 }}>
            {renderMarkdown(topic.content)}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={isTopicLiked ? <ThumbUp /> : <ThumbUpOutlined />}
              onClick={handleLikeTopic}
              color={isTopicLiked ? 'primary' : 'inherit'}
            >
              {isTopicLiked ? topic.like_count + 1 : topic.like_count} Likes
            </Button>
            
            <Button
              startIcon={<Reply />}
              onClick={() => document.getElementById('replyForm')?.focus()}
            >
              Reply
            </Button>
          </Box>
          
          <Box>
            <IconButton 
              aria-label="report"
              title="Report this topic"
            >
              <Flag />
            </IconButton>
            <IconButton 
              aria-label="bookmark"
              title={isBookmarked ? "Remove bookmark" : "Bookmark this topic"}
              onClick={handleBookmarkTopic}
              color={isBookmarked ? 'primary' : 'inherit'}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
        </CardActions>
      </Card>

      {/* Replies section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Replies ({replies.length})
        </Typography>

        {replies.map((reply, index) => (
          <Card 
            key={reply.id}
            elevation={2}
            sx={{ 
              mb: 3,
              backgroundColor: reply.is_solution 
                ? (theme.palette.mode === 'dark' ? 'rgba(66, 130, 66, 0.15)' : 'rgba(230, 250, 230, 0.5)')
                : (theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
              borderRadius: 2,
              borderLeft: reply.is_solution ? `4px solid ${theme.palette.success.main}` : 'none'
            }}
          >
            <CardHeader
              avatar={
                <Avatar 
                  src={reply.author.avatar} 
                  alt={reply.author.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {reply.author.name.charAt(0)}
                </Avatar>
              }
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {reply.author.name}
                  </Typography>
                  {reply.is_solution && (
                    <Chip 
                      label="Best Answer" 
                      size="small" 
                      color="success" 
                      sx={{ height: 20 }}
                    />
                  )}
                </Box>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  {formatDate(reply.created_at)}
                </Typography>
              }
            />

            <CardContent>
              <Box sx={{ pl: 1, pr: 1 }}>
                {renderMarkdown(reply.content)}
              </Box>
            </CardContent>

            <CardActions sx={{ px: 3, pb: 2 }}>
              <Button
                startIcon={likedReplies.includes(reply.id) ? <ThumbUp /> : <ThumbUpOutlined />}
                onClick={() => handleLikeReply(reply.id)}
                color={likedReplies.includes(reply.id) ? 'primary' : 'inherit'}
              >
                {likedReplies.includes(reply.id) ? reply.like_count + 1 : reply.like_count} Likes
              </Button>
              
              <Button
                startIcon={<Reply />}
                onClick={() => {
                  const replyForm = document.getElementById('replyForm');
                  if (replyForm) {
                    replyForm.focus();
                    setNewReply(`@${reply.author.name} `);
                  }
                }}
              >
                Reply
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Reply form */}
      <Paper 
        component="form"
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2
        }}
        onSubmit={handleSubmitReply}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Post a Reply
        </Typography>
        
        <TextField
          id="replyForm"
          multiline
          fullWidth
          rows={6}
          variant="outlined"
          placeholder="Share your thoughts or ask a question..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={!newReply.trim()}
          >
            Post Reply
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}