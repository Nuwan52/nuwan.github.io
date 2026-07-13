// AI Chatbot Implementation for Nuwan's Portfolio
// This file handles the chatbot UI and interaction with n8n backend

class PortfolioChatbot {
  constructor(config = CHATBOT_CONFIG) {
    this.config = config;
    this.isOpen = false;
    this.isTyping = false;
    this.chatHistory = [];
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.loadChatHistory();
    this.addWelcomeMessage();
  }

  createChatbotHTML() {
    // Create chatbot container
    const chatbotHTML = `
      <div id="portfolio-chatbot" class="chatbot-container">
        <!-- Chat Toggle Button -->
        <button id="chat-toggle" class="chat-toggle-btn" aria-label="Toggle chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="chat-badge">AI</span>
        </button>

        <!-- Chat Window -->
        <div id="chat-window" class="chat-window">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-header-info">
              <h3>Nuwan's AI Assistant</h3>
              <span class="chat-status">Online</span>
            </div>
            <button id="chat-close" class="chat-close-btn" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Chat Messages -->
          <div id="chat-messages" class="chat-messages">
            <div class="typing-indicator" id="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- Suggested Questions -->
          <div id="suggested-questions" class="suggested-questions">
            ${this.config.suggestedQuestions.map(q => 
              `<button class="suggested-question" data-question="${q}">${q}</button>`
            ).join('')}
          </div>

          <!-- Chat Input -->
          <div class="chat-input-container">
            <textarea 
              id="chat-input" 
              class="chat-input" 
              placeholder="Ask me about Nuwan's projects, skills, or experience..."
              rows="1"
              maxlength="500"
            ></textarea>
            <button id="chat-send" class="chat-send-btn" aria-label="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  attachEventListeners() {
    // Toggle chat window
    document.getElementById('chat-toggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-close').addEventListener('click', () => this.closeChat());

    // Send message
    document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    document.getElementById('chat-input').addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    });

    // Suggested questions
    document.querySelectorAll('.suggested-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        document.getElementById('chat-input').value = question;
        this.sendMessage();
      });
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('#portfolio-chatbot')) {
        // Optional: Close when clicking outside
        // this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.add('open');
    document.getElementById('chat-toggle').style.display = 'none';
    
    // Focus input
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 300);
  }

  closeChat() {
    this.isOpen = false;
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.remove('open');
    document.getElementById('chat-toggle').style.display = 'flex';
  }

  addWelcomeMessage() {
    this.addMessage(this.config.welcomeMessage, 'bot');
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || this.isTyping) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Send to n8n backend
      const response = await this.sendToBackend(message);
      
      // Hide typing indicator
      this.hideTypingIndicator();

      // Add bot response
      const processedResponse = this.config.processResponse(response);
      this.addMessage(processedResponse, 'bot');

    } catch (error) {
      console.error('Chatbot error:', error);
      this.hideTypingIndicator();
      
      let errorMessage = this.config.errorMessages.unknownError;
      if (error.name === 'NetworkError') {
        errorMessage = this.config.errorMessages.networkError;
      } else if (error.name === 'TimeoutError') {
        errorMessage = this.config.errorMessages.timeoutError;
      }
      
      this.addMessage(errorMessage, 'bot', 'error');
    }
  }

  async sendToBackend(message) {
    const payload = this.config.preparePayload(message, this.chatHistory);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.requestConfig.timeout);

    try {
      const response = await fetch(this.config.webhookUrl, {
        ...this.config.requestConfig,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('TimeoutError');
      }
      throw error;
    }
  }

  addMessage(text, sender, type = 'normal') {
    const messagesContainer = document.getElementById('chat-messages');
    const messageId = `msg-${Date.now()}`;
    
    const messageHTML = `
      <div id="${messageId}" class="chat-message ${sender} ${type}">
        <div class="message-content">
          <p>${this.escapeHtml(text)}</p>
          <span class="message-time">${this.formatTime(new Date())}</span>
        </div>
      </div>
    `;

    // Insert before typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.insertAdjacentHTML('beforebegin', messageHTML);

    // Add to chat history
    this.chatHistory.push({
      text,
      sender,
      timestamp: new Date().toISOString(),
      type
    });

    // Limit chat history
    if (this.chatHistory.length > this.config.maxChatHistory) {
      this.chatHistory.shift();
    }

    // Scroll to bottom
    this.scrollToBottom();

    // Animate message
    setTimeout(() => {
      const messageElement = document.getElementById(messageId);
      if (messageElement) {
        messageElement.classList.add('visible');
      }
    }, 100);

    // Save to localStorage
    this.saveChatHistory();
  }

  showTypingIndicator() {
    this.isTyping = true;
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'flex';
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'none';
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveChatHistory() {
    try {
      localStorage.setItem('portfolio-chatbot-history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.warn('Could not save chat history:', error);
    }
  }

  loadChatHistory() {
    try {
      const saved = localStorage.getItem('portfolio-chatbot-history');
      if (saved) {
        this.chatHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load chat history:', error);
    }
  }

  clearChatHistory() {
    this.chatHistory = [];
    localStorage.removeItem('portfolio-chatbot-history');
    
    // Clear messages except welcome message
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
      <div class="typing-indicator" id="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    this.addWelcomeMessage();
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if config is available
  if (typeof CHATBOT_CONFIG !== 'undefined') {
    window.portfolioChatbot = new PortfolioChatbot(CHATBOT_CONFIG);
  } else {
    console.warn('Chatbot configuration not found. Please include chatbot-config.js first.');
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioChatbot;
}