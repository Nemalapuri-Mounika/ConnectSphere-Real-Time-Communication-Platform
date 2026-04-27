import React, { useState, useEffect } from "react";
import { socket } from "./socket";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("users_list", (data) => {
      setUsers(data);
    });
  }, []);

  const joinChat = () => {
    socket.emit("join_room", username);
  };

  const sendMessage = () => {
    const data = { username, message };
    socket.emit("send_message", data);
    setMessage("");
  };

  return (
    <div>
      <h2>ConnectSphere Chat</h2>

      <input
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={joinChat}>Join</button>

      <div>
        <h3>Online Users</h3>
        {users.map((user, i) => (
          <p key={i}>{user.username}</p>
        ))}
      </div>

      <div>
        <h3>Chat</h3>
        {chat.map((msg, i) => (
          <p key={i}>
            <b>{msg.username}:</b> {msg.message}
          </p>
        ))}
      </div>

      <input
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
