const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

// Create Express application
const app = express();
const PORT = 8082;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
let userCount = 0;

wss.on('connection', (socket) => {
    userCount++;
    const userId = `User${userCount}`;
    socket.userId = userId;
    clients.add(socket);
    console.log(`New client connected: ${userId}`);
    
    // Send welcome message to the new client
    const welcomeMsg = JSON.stringify({
        type: 'server',
        content: `Welcome to the chat, ${userId}!`,
        sender: 'Server',
        timestamp: new Date().toISOString()
    });
    socket.send(welcomeMsg);
    
    // Announce new user to all other clients
    const announceMsg = JSON.stringify({
        type: 'server',
        content: `${userId} has joined the chat`,
        sender: 'Server',
        timestamp: new Date().toISOString()
    });
    broadcastMessage(announceMsg, socket);

    socket.on('message', (message) => {
        try {
            const msgString = message.toString();
            console.log(`Received from ${userId}: ${msgString}`);
            
            // Parse the message if it's JSON
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(msgString);
                
                // Nickname change handling
                if (parsedMessage.type === 'nickname' && parsedMessage.sender) {
                    const oldUserId = userId;
                    socket.userId = parsedMessage.sender;
                    userId = parsedMessage.sender;
                    
                    // Announce nickname change
                    const nicknameMsg = JSON.stringify({
                        type: 'server',
                        content: `${oldUserId} is now known as ${userId}`,
                        sender: 'Server',
                        timestamp: new Date().toISOString()
                    });
                    broadcastMessage(nicknameMsg);
                    return;
                }
                
                // Typing indicators handling
                if (parsedMessage.type === 'typing') {
                    // Only forward typing indicators to other clients
                    const typingMsg = JSON.stringify({
                        type: 'typing',
                        content: parsedMessage.content,
                        sender: userId,
                        timestamp: new Date().toISOString()
                    });
                    broadcastMessage(typingMsg, socket);
                    return;
                }
                
                if (parsedMessage.type === 'typing-stopped') {
                    // Forward typing stopped indicator
                    const stoppedMsg = JSON.stringify({
                        type: 'typing-stopped',
                        sender: userId,
                        timestamp: new Date().toISOString()
                    });
                    broadcastMessage(stoppedMsg, socket);
                    return;
                }
                
                // Regular message handling
                // Add server timestamp and original sender info
                parsedMessage.timestamp = new Date().toISOString();
                parsedMessage.originalSender = userId;
                
                // Broadcast the message to all connected clients
                broadcastMessage(JSON.stringify(parsedMessage), socket);
            } catch (e) {
                // If not JSON, still broadcast but in a structured format
                const formattedMsg = JSON.stringify({
                    type: 'message',
                    content: msgString,
                    sender: userId,
                    timestamp: new Date().toISOString()
                });
                broadcastMessage(formattedMsg, socket);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    socket.on('close', () => {
        clients.delete(socket);
        console.log(`Client disconnected: ${userId}`);
        
        // Announce user departure
        const leaveMsg = JSON.stringify({
            type: 'server',
            content: `${userId} has left the chat`,
            sender: 'Server',
            timestamp: new Date().toISOString()
        });
        broadcastMessage(leaveMsg);
    });
});

// Function to broadcast messages to all clients except the sender
function broadcastMessage(message, excludeSocket = null) {
    clients.forEach((client) => {
        if ((!excludeSocket || client !== excludeSocket) && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});