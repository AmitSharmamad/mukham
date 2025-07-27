import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Avatar,
  IconButton,
  useTheme 
} from '@mui/material';
import { LinkedIn as LinkedInIcon } from '@mui/icons-material';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Madgula Ajit',
    role: 'CEO',
    initials: 'MA',
    linkedin: 'https://www.linkedin.com/in/madgula-ajit-87316818a/',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: 'Marella Kishore',
    role: 'CMO',
    initials: 'MK',
    linkedin: 'https://www.linkedin.com/in/krishmarella/',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
];

export default function About() {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Us
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            Meet our leadership team driving innovation in algorithmic trading
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  elevation={8}
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '20px',
                    transition: 'all 0.4s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: `0 20px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
                      '& .avatar': {
                        transform: 'scale(1.1)',
                      },
                      '& .linkedin-btn': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: member.bgGradient,
                      borderRadius: '20px 20px 0 0',
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      mb: 3,
                    }}
                  >
                    <Avatar
                      className="avatar"
                      sx={{
                        width: 100,
                        height: 100,
                        background: member.bgGradient,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: `0 8px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      {member.initials}
                    </Avatar>
                    
                    <IconButton
                      className="linkedin-btn"
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                        bgcolor: '#0077b5',
                        color: 'white',
                        width: 36,
                        height: 36,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: '0 4px 12px rgba(0,119,181,0.3)',
                        '&:hover': {
                          bgcolor: '#005885',
                          transform: 'translateY(0) scale(1.1)',
                          boxShadow: '0 6px 16px rgba(0,119,181,0.4)',
                        }
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: theme.palette.text.primary,
                      background: member.bgGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}
                  >
                    {member.name}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      color: theme.palette.text.secondary,
                      mb: 1,
                    }}
                  >
                    {member.role}
                  </Typography>

                  <Box
                    sx={{
                      width: 40,
                      height: 3,
                      background: member.bgGradient,
                      borderRadius: 2,
                      mt: 1,
                    }}
                  />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
