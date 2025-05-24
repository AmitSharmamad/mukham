import { Box, Paper, Typography, useTheme, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Image from 'next/image';

export interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
}

// Styled components for message bubbles
const UserMessageBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '18px 18px 0 18px',
  padding: theme.spacing(1.5, 2),
  maxWidth: '85%',
  wordBreak: 'break-word',
  boxShadow: theme.shadows[1],
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: -5,
    width: 10,
    height: 10,
    backgroundColor: theme.palette.primary.main,
    clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
  },
}));

const BotMessageBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.grey[800] 
    : theme.palette.grey[100],
  color: theme.palette.text.primary,
  borderRadius: '18px 18px 18px 0',
  padding: theme.spacing(1.5, 2),
  maxWidth: '85%',
  wordBreak: 'break-word',
  boxShadow: theme.shadows[1],
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: -5,
    width: 10,
    height: 10,
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[100],
    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
  },
}));

export const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  const theme = useTheme();
  const formattedTime = timestamp ? 
    new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).format(timestamp) : '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 1.5,
        mb: 3,
        width: '100%',
        opacity: 1,
        animation: isUser 
          ? 'slideInRight 0.3s ease-in-out'
          : 'slideInLeft 0.3s ease-in-out',
        '@keyframes slideInRight': {
          '0%': {
            opacity: 0,
            transform: 'translateX(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)'
          },
        },
        '@keyframes slideInLeft': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)'
          },
        },
      }}
    >
      {/* Avatar */}
      <Box sx={{ pt: 0.5 }}>
        {isUser ? (
          <Avatar 
            sx={{ 
              width: 38, 
              height: 38, 
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
              },
              animation: 'pulseUser 2s infinite ease-in-out',
              '@keyframes pulseUser': {
                '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                '70%': { boxShadow: '0 0 0 6px rgba(25, 118, 210, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' },
              },
            }}
          >
            <AccountCircleIcon />
          </Avatar>
        ) : (
          <Avatar 
            sx={{ 
              width: 38, 
              height: 38, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              color: theme.palette.secondary.main,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
              },
              animation: 'pulseBot 2s infinite ease-in-out',
              '@keyframes pulseBot': {
                '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                '70%': { boxShadow: '0 0 0 6px rgba(156, 39, 176, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' },
              },
            }}
          >
            <Image 
              src="/assets/hanuman.jpg" 
              alt="Maruti" 
              width={24} 
              height={24} 
            />
          </Avatar>
        )}
      </Box>

      {/* Message content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: 'calc(100% - 60px)'
      }}>
        {isUser ? (
          <UserMessageBubble elevation={1}>
            <Typography variant="body1" sx={{ 
              fontWeight: 400, 
              lineHeight: 1.6,
              letterSpacing: '0.01em',
              '& a': {
                color: 'inherit',
                textDecoration: 'underline',
                fontWeight: 500,
              },
              '& code': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: '0.1em 0.4em',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
              }
            }}>{content}</Typography>
          </UserMessageBubble>
        ) : (
          <BotMessageBubble elevation={1}>
            <Typography variant="body1" sx={{ 
              fontWeight: 400, 
              lineHeight: 1.6,
              letterSpacing: '0.01em',
              '& a': {
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                textDecoration: 'underline',
                fontWeight: 500,
              },
              '& code': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                padding: '0.1em 0.4em',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
              }
            }}>{content}</Typography>
          </BotMessageBubble>
        )}
        {timestamp && (
          <Typography 
            variant="caption" 
            color="textSecondary"
            sx={{ 
              mt: 0.5, 
              mx: 1, 
              fontSize: '0.75rem', 
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                transform: 'translateY(-1px)'
              }
            }}
          >
            {formattedTime}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
