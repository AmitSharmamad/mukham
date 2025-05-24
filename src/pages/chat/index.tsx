import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer, useMediaQuery, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ChatContainer, ChatHistory } from '../../components/Chat';
import MainLayout from '../../components/MainLayout';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks';

const ChatPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const { mode, color, setThemeColor, toggleMode } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Memoize the chat ID to prevent unnecessary re-renders
  const chatId = useMemo(() => {
    return typeof router.query.id === 'string' ? router.query.id : undefined;
  }, [router.query.id]);
  
  // Use our custom hook
  const { 
    chats, 
    messages, 
    activeChat, 
    isLoading, 
    setActiveChat, 
    createNewChat, 
    deleteChat, 
    sendMessage 
  } = useChat(chatId);
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const drawerWidth = 320;

  // Effect to update URL when active chat changes
  useEffect(() => {
    if (activeChat) {
      // Use shallow routing to avoid triggering data fetching methods
      // and prevent layout shifts by keeping the current scroll position
      const urlWithId = `/chat?id=${activeChat}`;
      if (router.asPath !== urlWithId) {
        router.replace(urlWithId, undefined, { shallow: true });
      }
    } else {
      if (router.asPath !== '/chat') {
        router.replace('/chat', undefined, { shallow: true });
      }
    }
  }, [activeChat]); // Remove router dependency to prevent re-renders

  // Effect to handle drawer visibility on mobile/desktop
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]); // This is fine as it depends only on isMobile

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Event handlers that use our hook
  const handleNewChat = () => {
    createNewChat();
    
    // Close drawer on mobile after creating new chat
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    
    // Close drawer on mobile after selecting a chat
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleDeleteChat = (id: string) => {
    deleteChat(id);
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // Create drawer content
  const drawerContent = (
    <ChatHistory
      chats={chats}
      activeChat={activeChat}
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
    />
  );

  return (
    <MainLayout 
      onToggleTheme={toggleMode} 
      isDarkMode={mode === 'dark'}
      onChangeThemeColor={setThemeColor}
      currentTheme={color}
    >
      <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 64px)', // Adjusted to full height (just navbar)
        mt: -4,
        mb: -4,
        position: 'relative',
        overflow: 'hidden', // Prevent overall scroll
        alignItems: 'stretch'
      }}>
        {/* Static chat history sidebar on the left */}
        <Box
          component="nav"
          sx={{ 
            width: { xs: isMobile && !drawerOpen ? 0 : drawerWidth }, 
            flexShrink: 0,
            height: '100%',
            position: 'relative',
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            zIndex: theme.zIndex.drawer,
            display: { xs: isMobile && !drawerOpen ? 'none' : 'block', md: 'block' }
          }}
        >
          <Box
            sx={{
              width: drawerWidth,
              position: { xs: 'fixed', md: 'sticky' },
              left: { 
                xs: isMobile && !drawerOpen ? -drawerWidth : 0,
                md: 0 
              },
              top: 64, // Position it right below the navbar
              height: 'calc(100vh - 64px)', // Make it take the remaining height
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: theme.zIndex.drawer
            }}
          >
            {drawerContent}
          </Box>
        </Box>
        
        {/* Mobile drawer toggle button */}
        {isMobile && (
          <Box sx={{ 
            position: 'fixed', 
            left: drawerOpen ? drawerWidth + 16 : 16, 
            top: 76, 
            zIndex: theme.zIndex.drawer + 2,
            transition: theme.transitions.create(['left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}>
            <IconButton 
              color="inherit" 
              aria-label={drawerOpen ? "close drawer" : "open drawer"} 
              onClick={handleDrawerToggle}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 3,
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        )}
        
        {/* Main chat area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: { 
              xs: '100%', 
              md: `calc(100% - ${drawerWidth}px)` 
            },
            marginLeft: { 
              xs: 0,
              md: isMobile ? 0 : drawerWidth
            },
            transition: theme.transitions.create(['width', 'margin-left'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            borderLeft: `1px solid ${theme.palette.divider}`
          }}
        >
          <ChatContainer 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            emptyStateMessage={
              activeChat 
                ? "Start a new conversation by typing a message below."
                : "Select a chat from the sidebar or start a new one."
            }
          />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ChatPage;
