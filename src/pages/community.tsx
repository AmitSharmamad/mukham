import { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Tab, 
  Tabs,
  Button,
  Divider,
  useTheme 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import CategoryList from '../components/Community/CategoryList';
import TopicList from '../components/Community/TopicList';
import Leaderboard from '../components/Community/Leaderboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Community() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Community
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              onClick={() => window.location.href = '/community/topic/new'}
            >
              New Topic
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join discussions with fellow algo traders, share strategies, and learn from the community.
          </Typography>
          
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px 8px 0 0',
            pl: 2,
            pr: 2
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="community tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main
                },
                '& .MuiTab-root.Mui-selected': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <Tab label="Categories" />
              <Tab label="Recent Topics" />
              <Tab label="Leaderboard" />
              <Tab label="Popular Topics" />
              <Tab label="Unanswered" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CategoryList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TopicList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Leaderboard />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Popular Topics</Typography>
              <Typography variant="body2" color="text.secondary">
                Coming soon. We'll show the most active discussions here.
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Unanswered Topics</Typography>
              <Typography variant="body2" color="text.secondary">
                Coming soon. Topics that need your expertise will be shown here.
              </Typography>
            </Box>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
}