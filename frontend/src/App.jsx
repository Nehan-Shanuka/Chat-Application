import { useState, useEffect } from "react";
import io from "socket.io-client";

import RoomChat from "./RoomChat";

// eslint-disable-next-line react/prop-types
function App({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState("");
  const [room, setRoom] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const fetchSocketInfo = async () => {
      try {
        const newSocket = io("https://chat-application-gago.onrender.com");
        setSocket(newSocket);

        newSocket.on("your id", (id) => {
          setId(id);
        });

        newSocket.emit("set username", username);

        newSocket.on("chat message", (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg]);

          // Check if the message is not from the current user
          if (newSocket.id !== msg.id) {
          // Display browser notification
          if (Notification.permission === "granted") {
            new Notification(`New Message From ${msg.user}`, {
              body: msg.text,
            });
          
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification(`New Message From ${username}`, {
                  body: msg.text,
                });
              }
            });
          }
        }

          // Request notification permission on component mount
          if (
            Notification.permission !== "granted" &&
            Notification.permission !== "denied"
          ) {
            Notification.requestPermission();
          }
        });

        // Return a cleanup function to disconnect the socket
        return () => {
          newSocket.off("chat message");
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching socket info:", error);
      }
    };

    fetchSocketInfo();
  }, [username]);

  // Send message to the server when the user clicks the Send button
  const sendMessage = () => {
    console.log("socket", socket);
    socket.emit("chat message", input);
    setInput("");
  };

  // Handle the Enter key to send the message when the user presses Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // If the user joins a room, render the RoomChat component
  if (room) {
    console.log("roomName", roomName);
    return <RoomChat room={roomName} username={username} socket={socket} />;
  }

  return (
    <div className="w-full h-screen">
      <div className="h-screen max-w-3xl mx-auto">
        <div className="h-5/6 flex items-center justify-center">
          <div className="h-5/6 w-10/12 py-6 flex items-center justify-center border-2 border-black bg-black rounded-3xl">
            <ul className="w-11/12 h-full p-3 border-2 border-black bg-white overflow-auto">
              {messages.map((msg, idx) => (
                <li
                  key={idx}
                  className={`flex ${id === msg.id ? "justify-end" : ""} pb-2`}
                >
                  <div
                    className={`
                ${id !== msg.id ? "bg-amber-400" : "bg-gray-400"}
                rounded-lg
                px-2
                py-1
                w-fit
                `}
                  >
                    {id === msg.id ? "" : <strong>{msg.user}: </strong>}{" "}
                    {msg.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="">
          <div className="flex justify-between w-1/2 mx-auto">
            <input
              className="border-2 border-black w-10/12 px-2 py-1 rounded-md"
              type="text"
              placeholder="Enter the message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              onSubmit={sendMessage}
              className="border-2 border-black px-2 py-1 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
        <div className="flex justify-between px-28 py-4">
          <button
            className="py-3 px-3 border-2"
            onClick={() => {
              setRoom(true);
              setRoomName("Room One");
            }}
          >
            ROOM 1
          </button>
          <button
            className="py-3 px-3 border-2"
            onClick={() => {
              setRoom(true);
              setRoomName("Room Two");
            }}
          >
            ROOM 2
          </button>
          <button
            className="py-3 px-3 border-2"
            onClick={() => {
              setRoom(true);
              setRoomName("Room Three");
            }}
          >
            ROOM 3
          </button>
          <button
            className="py-3 px-3 border-2"
            onClick={() => {
              setRoom(true);
              setRoomName("Room Four");
            }}
          >
            ROOM 4
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
