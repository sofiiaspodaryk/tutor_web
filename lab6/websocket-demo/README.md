# Real-time WebSocket Chat

This project provides a feature-rich real-time chat application that allows seamless communication between multiple clients using WebSockets. The modern UI and enhanced user experience make it suitable for a variety of use cases.

## Project Structure

```
websocket-demo
├── server
│   └── server.js        # WebSocket server implementation
├── public
│   ├── index.html       # Client-side HTML structure
│   └── client.js        # Client-side JavaScript for WebSocket communication
├── package.json         # npm configuration file
├── .gitignore           # Files and directories to ignore in Git
└── README.md            # Project documentation
```

## Features

- Real-time messaging with instant delivery
- Customizable user nicknames
- Typing indicators to show when someone is composing a message
- Connection status monitoring with auto-reconnect
- Message timestamps
- Automatic URL detection with clickable links
- Emoji support
- Responsive design that works on desktop and mobile
- Server notifications for user activities (joins, leaves, nickname changes)
- JSON-based message protocol

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd websocket-demo
   ```

2. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

1. Start the WebSocket server:

   ```
   npm start
   ```
   or
   ```
   node server/server.js
   ```

2. Open your web browser and navigate to `http://localhost:8082` to access the chat interface.

3. Open multiple browser tabs or windows to simulate multiple users. Each client can:
   - Set a custom nickname
   - Send messages that appear instantly
   - See when others are typing
   - Click on links shared in messages
   - Use emoji shortcuts

## How to Use

1. When you first join, you'll be assigned an automatic User ID
2. Set your nickname using the field at the top of the chat
3. Type your message in the input box and press Enter or click Send
4. Click on an emoji to insert it into your message
5. The connection status indicator shows whether you're connected or disconnected
6. If you get disconnected, the application will try to reconnect automatically

### Technologies Used

- WebSocket for real-time communication
- Node.js for the server-side implementation
- HTML/CSS for the client-side interface

### License

This project is licensed under the MIT License.