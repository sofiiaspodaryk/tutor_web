
// Global variables
const socket = new WebSocket('ws://localhost:8082');
let nickname = '';
let typingTimer = null;
const connectionStatus = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');
const typingIndicator = document.getElementById('typingIndicator');

// Connection event handlers
socket.addEventListener('open', function (event) {
    console.log('Connected to the WebSocket server');
    connectionStatus.classList.remove('offline');
    connectionStatus.classList.add('online');
    statusText.textContent = 'Connected';
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WebSocket server');
    connectionStatus.classList.remove('online');
    connectionStatus.classList.add('offline');
    statusText.textContent = 'Disconnected';
    
    // Try to reconnect after 5 seconds
    setTimeout(() => {
        statusText.textContent = 'Attempting to reconnect...';
        window.location.reload();
    }, 5000);
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
    connectionStatus.classList.remove('online');
    connectionStatus.classList.add('offline');
    statusText.textContent = 'Connection error';
});

// Message handling
socket.addEventListener('message', function (event) {
    const messagesContainer = document.getElementById('messages');
    
    try {
        const message = JSON.parse(event.data);
        
        // Handle typing indicators
        if (message.type === 'typing') {
            typingIndicator.textContent = message.content;
            return;
        }
        
        if (message.type === 'typing-stopped') {
            if (typingIndicator.textContent.includes(message.sender)) {
                typingIndicator.textContent = '';
            }
            return;
        }
        
        // Handle regular messages
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear typing indicator if someone sent a message
        if (message.type === 'message') {
            typingIndicator.textContent = '';
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        // Fallback for non-JSON messages
        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        messageElement.textContent = event.data;
        messagesContainer.appendChild(messageElement);
    }
});

// Create a formatted message element
function createMessageElement(message) {
    const messageElement = document.createElement('div');
    const timestamp = new Date(message.timestamp);
    const formattedTime = formatTime(timestamp);
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Detect URLs and make them clickable
    content.innerHTML = linkifyText(message.content);
    
    // Create message info (sender + time)
    const infoElement = document.createElement('div');
    infoElement.className = 'message-info';
    
    if (message.type === 'server') {
        // Server messages (joins, leaves, etc.)
        messageElement.className = 'message server';
        infoElement.innerHTML = `<span>${formattedTime}</span>`;
    } else if (message.sender === nickname || message.originalSender === nickname) {
        // Messages sent by this client
        messageElement.className = 'message sent';
        infoElement.innerHTML = `<span>You</span><span>${formattedTime}</span>`;
    } else {
        // Messages received from other clients
        messageElement.className = 'message received';
        infoElement.innerHTML = `<span>${message.sender || message.originalSender}</span><span>${formattedTime}</span>`;
    }
    
    // Assemble the message element
    messageElement.appendChild(content);
    messageElement.appendChild(infoElement);
    
    return messageElement;
}

// Format timestamp as HH:MM
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Make URLs in text clickable
function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

// Send message function
function sendMessage() {
    const inputField = document.getElementById('messageInput');
    const message = inputField.value.trim();
    
    if (message !== '') {
        // Create message object
        const messageObj = {
            type: 'message',
            content: message,
            sender: nickname || 'Anonymous',
            timestamp: new Date().toISOString()
        };
        
        // Send as JSON
        socket.send(JSON.stringify(messageObj));
        
        // Show message immediately in UI for better UX
        const localMessage = {...messageObj};
        const messagesContainer = document.getElementById('messages');
        const messageElement = createMessageElement(localMessage);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear input
        inputField.value = '';
        inputField.focus();
    }
}

// Set nickname function
function setNickname() {
    const nicknameInput = document.getElementById('nicknameInput');
    const newNickname = nicknameInput.value.trim();
    
    if (newNickname !== '') {
        // Store the nickname
        nickname = newNickname;
        
        // Notify the server about nickname change
        socket.send(JSON.stringify({
            type: 'nickname',
            content: `has set their nickname to ${nickname}`,
            sender: nickname,
            timestamp: new Date().toISOString()
        }));
        
        // Update UI
        document.getElementById('setNicknameButton').textContent = 'Update';
        nicknameInput.placeholder = 'Change nickname...';
        
        // Focus back to message input
        document.getElementById('messageInput').focus();
    }
}

// Handle user typing indication
function handleTyping() {
    // Clear previous timer
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
    
    // Send typing indicator
    socket.send(JSON.stringify({
        type: 'typing',
        content: `${nickname || 'Someone'} is typing...`,
        sender: nickname || 'Anonymous',
        timestamp: new Date().toISOString()
    }));
    
    // Set a timer to clear typing indicator after 2 seconds of inactivity
    typingTimer = setTimeout(() => {
        socket.send(JSON.stringify({
            type: 'typing-stopped',
            sender: nickname || 'Anonymous',
            timestamp: new Date().toISOString()
        }));
    }, 2000);
}

// Event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('messageInput').addEventListener('keypress', function(event) {
    // Send on Enter key
    if (event.key === 'Enter') {
        sendMessage();
    } else {
        // Handle typing indication
        handleTyping();
    }
});

document.getElementById('setNicknameButton').addEventListener('click', setNickname);

document.getElementById('nicknameInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        setNickname();
    }
});

// Add example emojis
const commonEmojis = ['😊', '👍', '❤️', '😂', '🎉', '👋', '🤔', '😎'];
const createEmojiPicker = () => {
    const emojiContainer = document.createElement('div');
    emojiContainer.className = 'emoji-picker';
    emojiContainer.style.display = 'flex';
    emojiContainer.style.gap = '5px';
    emojiContainer.style.marginBottom = '10px';
    
    commonEmojis.forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.textContent = emoji;
        emojiBtn.style.cursor = 'pointer';
        emojiBtn.style.fontSize = '20px';
        emojiBtn.style.border = 'none';
        emojiBtn.style.background = 'transparent';
        emojiBtn.style.borderRadius = '4px';
        emojiBtn.style.padding = '2px 5px';
        
        emojiBtn.addEventListener('click', () => {
            const inputField = document.getElementById('messageInput');
            inputField.value += emoji;
            inputField.focus();
        });
        
        emojiContainer.appendChild(emojiBtn);
    });
    
    // Insert emoji picker before the input area
    const inputArea = document.querySelector('.input-area');
    inputArea.parentNode.insertBefore(emojiContainer, inputArea);
};

// Initialize the app
window.addEventListener('load', function() {
    // Create emoji picker
    createEmojiPicker();
    
    // Focus on nickname input initially
    document.getElementById('nicknameInput').focus();
    
    // Add a welcome message to the UI
    const messagesContainer = document.getElementById('messages');
    const welcomeElement = document.createElement('div');
    welcomeElement.className = 'message server';
    welcomeElement.innerHTML = `
        <div class="message-content">Welcome to the chat! Set your nickname to get started.</div>
        <div class="message-info"><span>${formatTime(new Date())}</span></div>
    `;
    messagesContainer.appendChild(welcomeElement);
});