const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store users
let users = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (username) => {
    users.push({ id: socket.id, username });
    io.emit("users_list", users);
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit("users_list", users);
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
