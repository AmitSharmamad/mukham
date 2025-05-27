import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, Divider, IconButton, Tooltip, useTheme, InputBase, alpha, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, DeleteOutline as DeleteIcon, Search as SearchIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Image from 'next/image';

export interface ChatHistoryItem {
  id: string;
  title: string;
  lastUpdated: Date;
  preview?: string;
}

interface ChatHistoryProps {
  chats: ChatHistoryItem[];
  activeChat?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const ChatHistorySidebar = styled(Paper)(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: 0,
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper 
    : theme.palette.grey[50],
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  boxShadow: theme.palette.mode === 'dark'
    ? '1px 0 5px rgba(0,0,0,0.15)'
    : '1px 0 5px rgba(0,0,0,0.05)',
}));

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.08)
    : alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.12)
      : alpha(theme.palette.common.black, 0.06),
  },
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  width: '100%',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  '&:focus-within': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette.common.black, 0.08),
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.9rem',
  },
}));

const ChatListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  borderRadius: theme.spacing(1.5),
  margin: theme.spacing(0.5, 1),
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: '0.2s',
  }),
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 3px 8px rgba(0, 0, 0, 0.2)'
      : '0 3px 8px rgba(0, 0, 0, 0.1)',
    '& .delete-button': {
      opacity: 1,
      transform: 'translateX(0)',
    }
  },
  ...(isActive && {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.16)' 
      : theme.palette.action.selected,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 6px rgba(0, 0, 0, 0.15)'
      : '0 2px 6px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : theme.palette.action.hover,
      boxShadow: theme.palette.mode === 'dark'
        ? '0 3px 10px rgba(0, 0, 0, 0.25)'
        : '0 3px 10px rgba(0, 0, 0, 0.15)',
    }
  }),
}));

export const ChatHistory = ({ 
  chats, 
  activeChat, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat 
}: ChatHistoryProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewChat = () => {
    onNewChat();
  };

  const handleSelectChat = (id: string) => {
    onSelectChat(id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();  // Prevent triggering the list item click
    onDeleteChat(id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      }).format(date);
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    }
  };

  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.preview && chat.preview.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : chats;

  return (
    <ChatHistorySidebar elevation={0}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.background.paper 
          : theme.palette.grey[50],
        zIndex: 10
      }}>
        <Typography 
          variant="h6"
          sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Avatar sx={{ width: 24, height: 24 }}>
            <Image 
              src="/hanuman.jpg" 
              alt="Maruti" 
              width={24} 
              height={24} 
            />
          </Avatar>
          Maruti Chat
        </Typography>

        <Tooltip title="New conversation">
          <IconButton 
            onClick={handleNewChat}
            size="small"
            color="primary"
            sx={{ 
              borderRadius: 1.5,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.dark,
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ 
        px: 2, 
        py: 1.5, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: '61px',
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.background.paper 
          : theme.palette.grey[50],
        zIndex: 9
      }}>
        <SearchBox>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search conversations…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </Box>
      
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        height: 'calc(100vh - 175px)', // Adjust for header and search box
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(0, 0, 0, 0.3)',
        },
        pb: 4 // Add padding at the bottom for better scrolling
      }}>
        <List sx={{ py: 0 }}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ListItem key={chat.id} disablePadding>
                <ChatListItem 
                  isActive={activeChat === chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <ListItemText 
                    primary={chat.title}
                    secondary={chat.preview}
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: 'body2',
                      fontWeight: activeChat === chat.id ? 'medium' : 'normal',
                      color: activeChat === chat.id ? 'primary' : 'textPrimary'
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      variant: 'caption',
                      color: 'textSecondary',
                      sx: { opacity: 0.8 }
                    }}
                    sx={{ pr: 4 }}
                  />
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      minWidth: 'auto',
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color="textSecondary"
                      sx={{ 
                        mb: 0.5, 
                        fontSize: '0.7rem',
                        opacity: 0.7
                      }}
                    >
                      {formatDate(chat.lastUpdated)}
                    </Typography>
                    <Tooltip title="Delete conversation">
                      <IconButton 
                        size="small" 
                        className="delete-button"
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        sx={{ 
                          opacity: 0,
                          transform: 'translateX(5px)',
                          transition: 'all 0.3s ease-in-out',
                          color: theme.palette.text.secondary,
                          padding: 0.5,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.03)',
                          '&:hover': {
                            color: theme.palette.error.main,
                            transform: 'scale(1.1) rotate(5deg)',
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ChatListItem>
              </ListItem>
            ))
          ) : (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.7
            }}>
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(0, 0, 0, 0.02)',
                  p: 3,
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.divider}`,
                  maxWidth: '80%',
                  mb: 2
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {searchQuery ? "No matching conversations found" : "No chat history yet"}
                </Typography>
                {!searchQuery && (
                  <Typography variant="caption" color="textSecondary">
                    Start a new conversation by clicking the + button
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </List>
      </Box>
    </ChatHistorySidebar>
  );
};

export default ChatHistory;
