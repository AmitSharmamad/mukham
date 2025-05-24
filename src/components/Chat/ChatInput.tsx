import { useState, useRef, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, Tooltip, CircularProgress, useTheme, Typography } from '@mui/material';
import { Send as SendIcon, Mic as MicIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInputContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 2, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper 
    : theme.palette.background.default,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 5px 0 rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 3px 8px 0 rgba(0, 0, 0, 0.4)' 
      : '0 3px 12px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[300],
  },
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    transform: 'translateY(-2px)',
    borderColor: theme.palette.primary.main,
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 0),
    fontSize: 16,
    lineHeight: 1.5,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&::placeholder': {
      opacity: 0.6,
      fontStyle: 'italic',
      fontSize: '0.95rem',
      transition: 'opacity 0.2s',
    },
    '&:focus::placeholder': {
      opacity: 0.4,
    },
  },
  '&.Mui-focused': {
    '& .MuiInputBase-input': {
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 0 0 100px rgba(0,0,0,0.04) inset' 
        : '0 0 0 100px rgba(0,0,0,0.01) inset',
    }
  }
}));

export const ChatInput = ({ 
  onSend, 
  isLoading = false, 
  placeholder = 'Type a message...', 
  disabled = false 
}: ChatInputProps) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus input when component mounts
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setCharCount(newMessage.length);
  };

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
      setCharCount(0);
      
      // Refocus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <ChatInputContainer 
        sx={{
          transform: isFocused ? 'translateY(-2px)' : 'none',
          pl: 2,
          pr: 1
        }}
      >
        <Tooltip title="Attach file (coming soon)">
          <span>
            <IconButton 
              size="small" 
              disabled={disabled || isLoading}
              sx={{ 
                mr: 1, 
                opacity: 0.7,
                transition: 'all 0.2s', 
                '&:hover': { opacity: 1 } 
              }}
            >
              <AttachFileIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <StyledInputBase
          inputRef={inputRef}
          placeholder={placeholder}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          fullWidth
          multiline
          maxRows={4}
          disabled={disabled || isLoading}
          sx={{
            opacity: disabled ? 0.7 : 1,
            mx: 0.5
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Voice input (coming soon)">
            <span>
              <IconButton 
                size="small" 
                disabled={disabled || isLoading}
                sx={{ 
                  opacity: 0.7,
                  transition: 'all 0.2s', 
                  '&:hover': { opacity: 1 } 
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={isLoading ? "Processing..." : "Send message"}>
            <span>
              <IconButton 
                onClick={handleSend} 
                disabled={!message.trim() || isLoading || disabled}
                color="primary"
                size="medium"
                sx={{
                  backgroundColor: message.trim() && !disabled && !isLoading 
                    ? theme.palette.primary.main 
                    : 'transparent',
                  color: message.trim() && !disabled && !isLoading 
                    ? theme.palette.primary.contrastText 
                    : theme.palette.action.disabled,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: message.trim() && !disabled && !isLoading 
                      ? theme.palette.primary.dark 
                      : 'transparent',
                    transform: message.trim() && !disabled && !isLoading 
                      ? 'scale(1.05)' 
                      : 'none',
                    boxShadow: message.trim() && !disabled && !isLoading 
                      ? '0 2px 5px rgba(0,0,0,0.2)' 
                      : 'none',
                  },
                  '&:active': {
                    transform: message.trim() && !disabled && !isLoading 
                      ? 'scale(0.95)' 
                      : 'none',
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </ChatInputContainer>
      
      {/* Character count */}
      {charCount > 0 && (
        <Typography 
          variant="caption" 
          color={charCount > 500 ? "error" : "textSecondary"}
          sx={{ 
            position: 'absolute',
            right: 16,
            bottom: -18,
            fontSize: '0.7rem',
            opacity: 0.7,
            transition: 'all 0.2s',
          }}
        >
          {charCount} {charCount === 1 ? 'character' : 'characters'}
        </Typography>
      )}
    </Box>
  );
};

export default ChatInput;
