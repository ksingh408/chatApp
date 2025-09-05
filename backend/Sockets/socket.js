const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../Models/userModel");
const Message = require("../Models/messageModel");

module.exports = (io) => {
  const users = new Map();

  // ------------------- Socket Authentication -------------------
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("No cookies"));

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId);
    users.set(socket.userId, socket.id);

    // Join a room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      socket.currentRoom = roomId;
    });

    // Send a message
    socket.on("sendMessage", async ({ receiverId, text }) => {
      try {
        if (!receiverId || !text) return;

        // Ensure consistent roomId
        const roomId = [socket.userId, receiverId].sort().join("_");

        // Save message in DB
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          text,
          conversationId: roomId,
        });

        // Add each other as friends if not already
        await User.findByIdAndUpdate(socket.userId, { $addToSet: { friends: receiverId } });
        await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: socket.userId } });

        // Emit to everyone in the room
        io.to(roomId).emit("receiveMessage", {
          senderId: message.sender,
          receiverId: message.receiver,
          text: message.text,
          roomId: message.conversationId,
          createdAt: message.createdAt,
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      users.delete(socket.userId);
      console.log("User disconnected:", socket.userId);
    });
  });
};


// const jwt = require("jsonwebtoken");
// const cookie = require("cookie");
// const User = require("../Models/userModel");
// const Message = require("../Models/messageModel");

// module.exports = (io) => {
//   const users = new Map();



// // -------------------Socket Middleware----------------------------
//   io.use(async (socket, next) => {
//     try {
//       const cookies = socket.handshake.headers.cookie;
//       if (!cookies) return next(new Error("No cookies"));

//       const parsedCookies = cookie.parse(cookies);
//       const token = parsedCookies.token;
//       if (!token) return next(new Error("No token"));

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select("-password");
//       if (!user) return next(new Error("User not found"));

//       socket.userId = user._id.toString();
//       next();
//     } catch (err) {
//       next(new Error("Authentication failed"));
//     }
//   });





//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.userId);
//     users.set(socket.userId, socket.id);

//     socket.on("joinRoom", (roomId) => socket.join(roomId));

//     socket.on("sendMessage", async ({ receiverId, text, roomId }) => {
//       try {
//         const message = await Message.create({
//           sender: socket.userId,
//           receiver: receiverId,
//           text,
//           conversationId: roomId
//         });

//         await User.findByIdAndUpdate(socket.userId, { $addToSet: { friends: receiverId } });
//         await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: socket.userId } });

//         io.to(roomId).emit("receiveMessage", {
//           senderId: message.sender,
//           receiverId: message.receiver,
//           text: message.text,
//           roomId: message.conversationId,
//           createdAt: message.createdAt
//         });
//       } catch (err) {
//         console.error("Error saving message:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       users.delete(socket.userId);
//       console.log("User disconnected:", socket.userId);
//     });
//   });
// };
