
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const connectDB = require('./Config/db.js');
const authRoutes = require('./Routes/userRoute.js');
const messageRoutes = require('./Routes/messageRoute.js');
const socketHandler = require('./Sockets/socket.js');

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({ 
    origin: "http://localhost:5173",
    // origin: "https://chat-app-orpin-tau.vercel.app", 
     credentials: true })
    );


app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/msg', messageRoutes);

// Socket.io
const io = new Server(server, { cors: {
     origin: "http://localhost:5173", 
    // origin: "https://chat-app-orpin-tau.vercel.app",
    credentials: true } });


socketHandler(io);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // -------------------
// // 1️⃣ Imports & Config
// // -------------------



// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const cookieParser = require("cookie-parser");
// const cookie = require('cookie');
// const jwt = require("jsonwebtoken");

// const connectDB = require('./Config/db.js');
// const User = require("./Models/userModel");
// const Message = require('./Models/messageModel.js');
// const authRoutes = require('./Routes/userRoute.js');
// const messageRoutes = require('./Routes/messageRoute.js');

// dotenv.config();
// connectDB();

// // -------------------
// // 2️⃣ Express & Server Setup
// // -------------------
// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// // -------------------
// // 3️⃣ Socket.io Setup
// // -------------------
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", credentials: true }
// });

// const users = new Map(); // Track connected users

// // -------------------
// // 4️⃣ Socket Auth Middleware
// // -------------------
// io.use(async (socket, next) => {
//   try {
//     const cookies = socket.handshake.headers.cookie;
//     if (!cookies) return next(new Error("No cookies"));

//     const parsedCookies = cookie.parse(cookies);
//     const token = parsedCookies.token;
//     if (!token) return next(new Error("No token"));

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) return next(new Error("User not found"));

//     socket.userId = user._id.toString();
//     next();
//   } catch (err) {
//     next(new Error("Authentication failed"));
//   }
// });

// // -------------------
// // 5️⃣ Socket Event Handlers
// // -------------------
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.userId);
//   users.set(socket.userId, socket.id);

//   // Join chat room
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log("Joined room:", roomId);
//   });

//   // Handle sending message
//   socket.on("sendMessage", async (data) => {
//     const senderId = socket.userId;
//     const { receiverId, text, roomId } = data;

//     console.log(`senderId: ${senderId}, receiverId: ${receiverId}, text: ${text}, roomId: ${roomId}`);

//     try {
//       // Save message to DB
//       const message = await Message.create({
//         sender: senderId,
//         receiver: receiverId,
//         text,
//         conversationId: roomId
//       });

//       // Update friends arrays dynamically
//       await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
//       await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });

//       // Emit saved message to room
//       io.to(roomId).emit("receiveMessage", {
//         senderId: message.sender,
//         receiverId: message.receiver,
//         text: message.text,
//         roomId: message.conversationId,
//         createdAt: message.createdAt
//       });

//     } catch (err) {
//       console.error("Error saving message:", err);
//     }
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     users.delete(socket.userId);
//     console.log("User disconnected:", socket.userId);
//   });
// });


// // ----------------------------API Routes

// app.use('/api/auth', authRoutes);
// app.use('/api/msg', messageRoutes);

// // -------------- Start Server-------

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
