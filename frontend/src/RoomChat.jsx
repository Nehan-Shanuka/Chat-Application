/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import App from "./App";

// eslint-disable-next-line react/prop-types
function RoomChat({ room, username, socket }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("join room", room);

      socket.emit("get rooms");

      const handleRoomMessage = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      };

      socket.on("room message", handleRoomMessage);

      return () => {
        socket.off("room message", handleRoomMessage);
      };
    }
  }, [room, socket]);

  const sendMessage = () => {
    socket.emit("room message", room, input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (leave) {
    return <App username={username} />;
  }

  return (
    <div className="w-full h-screen">
      <div className="h-screen max-w-3xl mx-auto">
        <h1 className="text-3xl text-center pt-6">{room}</h1>
        <div className="h-4/6 my-6 flex items-center justify-center">
          <div className="h-full w-10/12 py-6 flex items-center justify-center bg-black border-2 border-black rounded-3xl">
            <ul className="w-11/12 h-full p-3 border-2 border-black bg-white overflow-auto">
              {messages.map((msg, idx) =>
                msg.room === room ? (
                  <li
                    key={idx}
                    className={`flex ${
                      username === msg.user ? "justify-end" : ""
                    } pb-2`}
                  >
                    <div
                      className={`${
                        username !== msg.user ? "bg-amber-400" : "bg-gray-400"
                      } rounded-lg px-2 py-1 w-fit`}
                    >
                      {username === msg.user ? (
                        ""
                      ) : (
                        <strong>{msg.user}: </strong>
                      )}{" "}
                      {msg.text}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
        <div>
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
              onClick={sendMessage}
              className="border-2 border-black px-2 py-1 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
        <div className="flex py-5">
          <button
            className="border-2 border-black px-2 py-1 rounded-md mx-auto"
            onClick={() => setLeave(true)}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomChat;
