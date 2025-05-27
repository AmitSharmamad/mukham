import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, useTheme, Fade, CircularProgress, Divider, Avatar } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export interface ChatMessageData {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: ChatMessageData[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}

export const ChatContainer = ({ 
  messages = [],
  onSendMessage,
  isLoading = false,
  emptyStateMessage = "Type a message to start a conversation..."
}: ChatContainerProps) => {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages if auto-scroll is enabled
    if (messagesEndRef.current && autoScrollEnabled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScrollEnabled]);

  // Handle scroll events to determine if auto-scroll should be enabled
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
    
    setAutoScrollEnabled(scrolledToBottom);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        position: 'relative'
      }}
    >
      {/* Chat messages area */}
      <Box 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          px: { xs: 2, sm: 3 }, 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          scrollBehavior: 'smooth',
          height: 'calc(100vh - 180px)', // Full-height minus navbar and input box
          width: '100%', // Ensure full width
          pb: 6, // Add bottom padding for better scrolling
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.2)',
            }
          }
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              opacity: 0.8,
              padding: 3,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 0.8 },
              },
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 450,
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.03)' 
                  : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                  : '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 25px rgba(0, 0, 0, 0.3)'
                    : '0 6px 25px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <Box 
                component="div" 
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                    '70%': { boxShadow: '0 0 0 15px rgba(25, 118, 210, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' },
                  }
                }}
              >
                <Avatar sx={{ width: 30, height: 30 }}>
                  <Image 
                    src="/hanuman.jpg" 
                    alt="Maruti" 
                    width={30} 
                    height={30} 
                  />
                </Avatar>
              </Box>
              <Typography 
                variant="h6" 
                color="primary" 
                sx={{ mb: 2, fontWeight: 500 }}
              >
                Welcome to Maruti Chat
              </Typography>
              <Typography 
                variant="body1" 
                color="textSecondary" 
                sx={{ mb: 2 }}
              >
                {emptyStateMessage}
              </Typography>
              <Typography 
                variant="caption" 
                color="textSecondary"
                sx={{ 
                  opacity: 0.7,
                  fontStyle: 'italic'
                }}
              >
                Ask me about trading strategies, market analysis, or portfolio optimization
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ flexGrow: 1 }}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
            </Box>
            {isLoading && (
              <Fade in={isLoading} timeout={300}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center', 
                  my: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(0, 0, 0, 0.02)',
                }}>
                  <CircularProgress 
                    size={24} 
                    thickness={4} 
                    sx={{ 
                      color: theme.palette.primary.main,
                      mb: 1,
                      animation: 'spin 1.2s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ 
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.6 },
                        '50%': { opacity: 1 },
                      },
                    }}
                  >
                    Thinking...
                  </Typography>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      
      {/* Input section */}
      <Box sx={{ 
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.default,
      }}>
        <Divider 
          sx={{ 
            '&::before, &::after': {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          }} 
        />
        <Box 
          sx={{ 
            p: 2.5, 
            pt: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.paper 
              : theme.palette.grey[50],
            backgroundImage: theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0))'
              : 'linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0))',
            borderTop: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 -4px 6px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          <ChatInput 
            onSend={onSendMessage} 
            isLoading={isLoading} 
            placeholder="Type your message here..."
          />
          {messages.length > 0 && (
            <Typography 
              variant="caption" 
              color="textSecondary"
              align="center"
              sx={{ 
                display: 'block', 
                mt: 1, 
                opacity: 0.5,
                fontSize: '0.7rem',
              }}
            >
              Pressing Enter will send your message
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatContainer;
