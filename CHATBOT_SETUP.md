# AI Chatbot Integration Guide

## Overview
I've successfully integrated an AI chatbot into your portfolio website that can connect to your n8n workflow. The chatbot is fully functional and ready to be configured with your backend.

## Files Created

### 1. `chatbot-config.js` - Configuration File
This is where you'll configure your n8n webhook and backend settings:

```javascript
const CHATBOT_CONFIG = {
  // === BACKEND CONFIGURATION ===
  // Replace this with your actual n8n webhook URL
  webhookUrl: 'https://your-n8n-instance.com/webhook/your-webhook-path',
  
  // Alternative: Use environment variable in production
  // webhookUrl: process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/your-webhook-path',
  
  // Request configuration
  requestConfig: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any authentication headers if your n8n workflow requires them
      // 'Authorization': 'Bearer YOUR_API_KEY',
    },
    // Timeout for requests in milliseconds
    timeout: 10000,
  },
  
  // ... other configuration options
};
```

### 2. `chatbot.js` - Main Chatbot Implementation
This handles the UI and communication with your n8n backend. It includes:
- Chat window with modern UI
- Message history management
- Typing indicators
- Error handling
- Responsive design
- Local storage for chat history

### 3. `chatbot.css` - Styling
Complete styling for the chatbot with:
- Modern, clean design that matches your portfolio
- Responsive layout for mobile and desktop
- Smooth animations and transitions
- Dark mode support
- Hover effects and micro-interactions

## How to Configure

### Step 1: Update Your n8n Webhook URL
Edit `chatbot-config.js` and replace the placeholder URL with your actual n8n webhook URL:

```javascript
webhookUrl: 'https://your-n8n-instance.com/webhook/your-webhook-path',
```

### Step 2: Add Authentication (if needed)
If your n8n workflow requires authentication, add it to the headers:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY', // Add this line
},
```

### Step 3: Customize Messages (optional)
You can customize the welcome message and suggested questions in the config file:

```javascript
welcomeMessage: "Hello! I'm Nuwan's AI assistant...",

suggestedQuestions: [
  "Tell me about Nuwan's experience",
  "What are Nuwan's key skills?",
  // ... add your own questions
],
```

## How Your n8n Workflow Should Work

### Input Format
Your n8n webhook will receive JSON data in this format:

```json
{
  "query": "What are Nuwan's key skills?",
  "history": [
    {"text": "Previous question", "sender": "user", "timestamp": "..."},
    {"text": "Previous answer", "sender": "bot", "timestamp": "..."}
  ],
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

### Expected Output Format
Your n8n workflow should return JSON in this format:

```json
{
  "message": "Nuwan has extensive skills in Python, C++, robotics, AI, and industrial automation..."
}
```

Or simply return a string:

```json
"Nuwan has extensive skills in Python, C++, robotics, AI, and industrial automation..."
```

## Features Included

### Chat UI Features
- **Toggle Button**: Floating chat button with "AI" badge
- **Chat Window**: Modern chat interface with header and message area
- **Typing Indicator**: Animated dots when waiting for responses
- **Suggested Questions**: Quick-start questions for users
- **Message History**: Stores conversations in localStorage
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Professional transitions and effects

### Technical Features
- **Error Handling**: Network errors, timeouts, and server errors
- **Auto-scroll**: Chat automatically scrolls to latest messages
- **Message Timestamps**: Shows when messages were sent
- **Character Limit**: 500 character limit for messages
- **Context Awareness**: Sends last 5 messages for context

## Testing the Chatbot

### Without Backend Connection
The chatbot will work immediately with a fallback response when no backend is configured:

1. Open `index-advanced.html` in your browser
2. Click the floating chat button in the bottom-right corner
3. Try sending a message - you'll see the error handling in action

### With Backend Connection
1. Update your n8n webhook URL in `chatbot-config.js`
2. Ensure your n8n workflow is active and can handle POST requests
3. Test the chatbot - it should now respond with your n8n workflow output

## Customization Options

### Colors and Styling
You can customize the chatbot colors in `chatbot-config.js`:

```javascript
colors: {
  primary: '#6366f1',      // Main brand color
  primaryDark: '#4f46e5',  // Darker shade
  secondary: '#f3f4f6',    // Background for bot messages
  text: '#111827',         // Main text color
  userMessage: '#6366f1',  // User message background
  botMessage: '#f3f4f6',   // Bot message background
  error: '#ef4444'         // Error message color
}
```

### Position and Size
Adjust the chat window position and size:

```javascript
position: {
  bottom: '20px',
  right: '20px',
  width: '380px',
  height: '500px'
}
```

## Integration Complete

The chatbot is now fully integrated into your portfolio website. It will:

1. ✅ Appear as a floating chat button in the bottom-right corner
2. ✅ Open a modern chat interface when clicked
3. ✅ Send user messages to your n8n workflow
4. ✅ Display responses from your AI backend
5. ✅ Handle errors gracefully
6. ✅ Work on mobile and desktop devices
7. ✅ Maintain chat history across sessions

Simply update your n8n webhook URL in `chatbot-config.js` and the chatbot will be fully functional with your AI backend!