// import dotenv from "dotenv";
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
// import { Server } from "socket.io";
// const { Server } = require("socket.io");
// const { addUser, removeUser } = require('./functions/socketFunctions')
// const removeUser = require('./functions/socketFunctions/removeUser')
const connectDB = require("./config/db");
dotenv.config({ path: "./src/config/config.env" }); //load env vars

//global vars
// global.io;
// global.onlineUsers = [];

//server setup
const PORT = process.env.PORT || 8001;

// DatabaseConnection.initialize().then(() => {

var server = http.createServer(app);
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// let io: Server;

// const onlineUsers: string[] = [];
// global.io;
// io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket", socket.id);
//   io.to(socket.id).emit("reconnect", socket.id);
//   console.log('online users',global.onlineUsers)

//   socket.on("join", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("logout", () => {
//     removeUser(socket.id);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log("user disconnected", socket.id);
//   });
// });
// });
