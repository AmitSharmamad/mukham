import React, { useState } from 'react';
import { 
  Fab, 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  useTheme,
  Zoom,
  Fade,
  Avatar
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Image from 'next/image';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessageId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, text: inputValue, isBot: false },
    ]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          id: userMessageId + 1, 
          text: "I'm Maruti. This is a placeholder response.", 
          isBot: true 
        },
      ]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI chat icon */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="AI Chat"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.drawer + 2,
          }}
        >
          <Avatar sx={{ width: 40, height: 40 }}>
            <Image 
              src="/assets/hanuman.jpg" 
              alt="Maruti" 
              width={40} 
              height={40} 
            />
          </Avatar>
        </Fab>
      </Zoom>

      {/* Chat window */}
      <Fade in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 320,
            height: 450,
            zIndex: theme.zIndex.drawer + 1,
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.paper 
              : '#ffffff',
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                <Image 
                  src="/assets/hanuman.jpg" 
                  alt="Maruti" 
                  width={32} 
                  height={32} 
                />
              </Avatar>
              <Typography variant="h6">Maruti</Typography>
            </Box>
            <IconButton 
              onClick={toggleChat} 
              size="small"
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: message.isBot
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : theme.palette.grey[100]
                      : theme.palette.primary.main,
                    color: message.isBot
                      ? theme.palette.text.primary
                      : theme.palette.primary.contrastText,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Input area */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.background.default 
                : theme.palette.grey[50],
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)',
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.26)',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default AIChat;
