// AI Chatbot Configuration
// This file contains all the configuration for connecting to your n8n workflow backend

const CHATBOT_CONFIG = {
  // === BACKEND CONFIGURATION ===
  // Replace this with your actual n8n webhook URL
  // webhookUrl: 'https://n8n.srv1089989.hstgr.cloud/webhook-test/96709969-bac1-4d03-935b-d5d8b6d037f1',
  webhookUrl: 'https://n8n.srv1089989.hstgr.cloud/webhook/96709969-bac1-4d03-935b-d5d8b6d037f1',
  
  // Alternative: Use environment variable in production
  // webhookUrl: process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/your-webhook-path',
  
  // Request configuration
  requestConfig: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any authentication headers if your n8n workflow requires them
      // 'Authorization': 'nuwan1998',
    },
    // Timeout for requests in milliseconds
    timeout: 10000,
  },
  
  // === CHATBOT BEHAVIOR ===
  // Welcome message when chatbot is first opened
  welcomeMessage: "Hello! I'm Nuwan's AI assistant. I can tell you about his projects, skills, experience, and background. What would you like to know?",
  
  // Suggested questions to help users get started
  suggestedQuestions: [
    "Tell me about Nuwan's experience",
    "What are Nuwan's key skills?",
    "Describe Nuwan's AI chatbot project",
    "What's Nuwan's educational background?",
    "How can I contact Nuwan?"
  ],
  
  // Typing indicator simulation (in milliseconds)
  typingIndicatorDuration: 1500,
  
  // Maximum number of messages to keep in chat history
  maxChatHistory: 50,
  
  // === UI CONFIGURATION ===
  // Chat window position and size
  position: {
    bottom: '20px',
    right: '20px',
    width: '380px',
    height: '500px'
  },
  
  // Chat theme colors (can be overridden with your portfolio theme)
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#f3f4f6',
    text: '#111827',
    textLight: '#6b7280',
    userMessage: '#6366f1',
    botMessage: '#f3f4f6',
    error: '#ef4444'
  },
  
  // Animation settings
  animations: {
    openDuration: 300,
    messageAnimationDuration: 300,
    typingIndicatorBlinkSpeed: 800
  },
  
  // === RESPONSE HANDLING ===
  // Function to process the response from n8n before displaying it
  processResponse: (response) => {
    // You can customize this function based on your n8n response format
    if (response && response.message) {
      return response.message;
    } else if (response && typeof response === 'string') {
      return response;
    } else {
      return "I'm sorry, I couldn't process that request. Please try again.";
    }
  },
  
  // Function to prepare the payload before sending to n8n
  preparePayload: (userMessage, chatHistory) => {
    // You can customize this based on what your n8n workflow expects
    return {
      query: userMessage,
      history: chatHistory.slice(-5), // Send last 5 messages for context
      timestamp: new Date().toISOString()
    };
  },
  
  // Error handling
  errorMessages: {
    networkError: "I'm having trouble connecting to my knowledge base. Please try again later.",
    timeoutError: "Request timed out. Please try again.",
    unknownError: "Something went wrong. Please try again."
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHATBOT_CONFIG;
}

// For browser usage
if (typeof window !== 'undefined') {
  window.CHATBOT_CONFIG = CHATBOT_CONFIG;
}