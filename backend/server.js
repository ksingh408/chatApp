
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

console.log(process.env.FRONTEND_URL)

const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};
 
app.use(cors(corsOptions))
 


app.use(express.json());
app.use(cookieParser());

// API routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
  });
  
app.use('/api/auth', authRoutes);
app.use('/api/msg', messageRoutes);

// Socket.io
const io = new Server(server, { cors: corsOptions });


socketHandler(io);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

