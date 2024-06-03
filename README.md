
# Chat Application

This is a real-time chat application built with Express, Socket.io, and React. It allows users to join a chat room, send messages, and receive notifications when new messages are posted.

## Setup Instructions
The Backend(Server) is deployed on "Render Platform". In order to rund the Backend locally, follow following instructions.
### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/chat-application.git
   cd chat-application/backend

2. **Install Dependencies:**
    ```bash
    npm install

3. **Run the Server:**
    ```bash
    npm start

4. **Change the URL that passed to io method(frontend/src/App.jsx: line:18)**

    URL: "http://localhost:5000/"

### Frontend Setup

1. **Navigate to the Frontend Directory:**
    ```bash
    cd ../frontend

2. **Install Dependencies:**
    ```bash
    npm install

4. **Run the Development Server:**
    ```bash
    npm start

This will start the React development server on http://localhost:5173.

# Application Structure

## Backend (/backend)

### `index.js`
- Main server file that sets up Express, Socket.io, and CORS.

### Socket.io Logic
- Listens for new connections.
- Handles `join room`, `chat message`, and `room message` events.

## Frontend (/frontend)

### `src/Login.jsx`
- Login React component that renders the login interface.

### `src/App.jsx`
- Main React component that renders the chat interface.

### `src/RoomChat.jsx`
- Room chat component that renders the rooms.

### Important State Managements
- `messages`: Array of chat messages.
- `input`: Current message input.

### Socket Events
- Connects to the server and joins a room.
- Listens for incoming messages and updates state.
- Sends messages to the server.

# Assumptions and Limitations

## Assumptions
- Users are assumed to be joining the main single predefined room first.
- The application assumes that users have the necessary permissions to allow browser notifications.
- The backend server is assumed to be running and accessible at the specified URL.

## Limitations
- **Single Main Room Chat**: The current implementation supports main single chat room. All the clients in the server receive the messages form others.
- **Four Private Room Chat**: Those who are in the paticular room can send and receive messages within that paticular room.
- **No User Authentication**: There is no user authentication or authorization implemented.
- **Basic Error Handling**: Limited error handling and validation are in place. Enhancing this would improve the robustness of the application.
- **Notification Permissions**: The application requests notification permissions on component mount, which might not be the best user experience. This could be improved by asking for permissions at a more appropriate time.
- **Message Persistence**: Messages are not persisted and will be lost when the server restarts. Implementing a database would resolve this.

## Additional Notes
- Ensure you have Node.js installed on your system before setting up the application.
