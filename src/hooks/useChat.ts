import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistoryItem } from '../components/Chat';
import { ChatMessageData } from '../components/Chat';

// Mock data - would be replaced with actual API calls
const mockChats: ChatHistoryItem[] = [
  {
    id: '1',
    title: 'Trading Strategies Analysis',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    preview: 'Let me analyze your trading strategy...'
  },
  {
    id: '2',
    title: 'Market Analysis',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    preview: 'The current market conditions indicate...'
  },
  {
    id: '3',
    title: 'Portfolio Optimization',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    preview: 'Your portfolio could be optimized by...'
  }
];

// Mock conversation data - would be replaced with actual API data
const mockConversations: Record<string, ChatMessageData[]> = {
  '1': [
    {
      id: '1-1',
      content: 'Can you analyze my trading strategy for NIFTY?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: '1-2',
      content: "I'll analyze your NIFTY trading strategy. Based on the patterns you've been following, I notice a few areas for improvement. Your entry points tend to be well-timed, but your exit strategy could be more disciplined. Consider setting more concrete profit targets and stop losses to avoid emotional decision-making.",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 9)
    },
    {
      id: '1-3',
      content: 'That makes sense. What stop loss percentage would you recommend?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 8)
    },
    {
      id: '1-4',
      content: "For NIFTY trading, a stop loss of 1-1.5% is generally considered prudent for intraday trades. For swing trades, 2-3% might be more appropriate to allow for normal market fluctuations. Always align your stop loss with the market's average volatility and your risk tolerance.",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ],
  '2': [
    {
      id: '2-1',
      content: "What's your analysis on current market conditions?",
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5)
    },
    {
      id: '2-2',
      content: 'The current market is showing signs of increased volatility due to recent economic data. Inflation concerns are causing sector rotation from growth to value stocks. Keep an eye on central bank communications this week as they could impact market direction significantly.',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  ],
  '3': [
    {
      id: '3-1',
      content: 'How can I optimize my current portfolio?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25)
    },
    {
      id: '3-2',
      content: "Based on your portfolio, I'd recommend increasing your diversification across sectors. You're currently overweight in technology. Consider adding exposure to healthcare and consumer staples for better risk-adjusted returns. Also, your bond allocation could be increased slightly given current interest rate trends.",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  ]
};

export interface UseChatReturn {
  chats: ChatHistoryItem[];
  messages: ChatMessageData[];
  activeChat: string | undefined;
  isLoading: boolean;
  setActiveChat: (id: string) => void;
  createNewChat: () => string;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

export const useChat = (initialChatId?: string): UseChatReturn => {
  const [chats, setChats] = useState<ChatHistoryItem[]>(mockChats);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [activeChat, setActiveChat] = useState<string | undefined>(initialChatId);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat && mockConversations[activeChat]) {
      setMessages(mockConversations[activeChat]);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  // Get a simulated AI response based on user input
  const getAIResponse = (userMessage: string): string => {
    // Simple keyword-based responses
    const message = userMessage.toLowerCase();
    
    if (message.includes("strategy") || message.includes("trading") || message.includes("algo")) {
      return "Based on your interest in trading strategies, I'd recommend focusing on momentum indicators combined with support/resistance levels. Have you considered using the RSI (Relative Strength Index) alongside volume analysis? This combination can help identify potential entry and exit points with greater precision.";
    } else if (message.includes("market") || message.includes("analysis") || message.includes("trend")) {
      return "The current market shows mixed signals. Technical indicators suggest potential consolidation in the short term, but fundamental factors like upcoming economic data releases might introduce volatility. Keep an eye on key resistance levels and consider position sizing carefully in this environment.";
    } else if (message.includes("portfolio") || message.includes("diversification") || message.includes("risk")) {
      return "For optimal portfolio construction, consider allocating assets across uncorrelated markets. A mix of 60% equities, 25% fixed income, 10% alternatives, and 5% cash provides reasonable diversification. Within each category, focus on instruments with favorable risk-reward characteristics based on your trading time horizon.";
    } else if (message.includes("backtest") || message.includes("performance") || message.includes("returns")) {
      return "When backtesting strategies, be careful of optimization bias. Always use out-of-sample testing and walk-forward analysis to validate performance. Consider metrics beyond just returns - drawdown characteristics, Sharpe ratio, and recovery periods give a more complete picture of strategy robustness.";
    }
    
    // Default response
    return "I understand you're interested in trading. Could you provide more specific details about what aspect of trading you'd like insights on? I can help with strategy development, market analysis, portfolio optimization, or risk management approaches.";
  };

  // Create a new chat
  const createNewChat = (): string => {
    const newChatId = uuidv4();
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'New Conversation',
      lastUpdated: new Date(),
    };
    
    // Add the new chat to the list (at the beginning)
    setChats([newChat, ...chats]);
    
    // Set it as active
    setActiveChat(newChatId);
    
    // Clear messages for new chat
    setMessages([]);
    
    return newChatId;
  };

  // Delete a chat
  const deleteChat = (id: string) => {
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);
    
    // If the active chat was deleted, select another one
    if (activeChat === id) {
      if (updatedChats.length > 0) {
        setActiveChat(updatedChats[0].id);
      } else {
        setActiveChat(undefined);
      }
    }
  };

  // Send a message
  const sendMessage = async (content: string): Promise<void> => {
    let chatId = activeChat;
    
    // If no active chat, create a new one
    if (!chatId) {
      chatId = createNewChat();
    }
    
    // Create a new user message
    const userMessage: ChatMessageData = {
      id: uuidv4(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add user message to the list
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update chat preview and title if it's a new chat
    const currentChat = chats.find(chat => chat.id === chatId);
    if (currentChat) {
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          // If it's a "New Conversation", use the first message as the title
          const shouldUpdateTitle = chat.title === 'New Conversation';
          return {
            ...chat,
            title: shouldUpdateTitle ? content.substring(0, 30) + (content.length > 30 ? '...' : '') : chat.title,
            preview: content.substring(0, 40) + (content.length > 40 ? '...' : ''),
            lastUpdated: new Date()
          };
        }
        return chat;
      });
      setChats(updatedChats);
    }
    
    // Simulate API call for bot response
    setIsLoading(true);
    
    try {
      // In production, replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock bot response using our helper function
      const botResponse: ChatMessageData = {
        id: uuidv4(),
        content: getAIResponse(content),
        isUser: false,
        timestamp: new Date()
      };
      
      // Add bot response to the list
      setMessages([...updatedMessages, botResponse]);
      
      // Update the chat preview with bot's response
      const finalChats = chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            preview: botResponse.content.substring(0, 40) + (botResponse.content.length > 40 ? '...' : ''),
            lastUpdated: new Date()
          };
        }
        return chat;
      });
      setChats(finalChats);
    } catch (error) {
      console.error('Failed to get response:', error);
      // Handle error - perhaps add a system message about the failure
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chats,
    messages,
    activeChat,
    isLoading,
    setActiveChat,
    createNewChat,
    deleteChat,
    sendMessage
  };
};

export default useChat;
