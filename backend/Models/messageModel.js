
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;


// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     conversationId: {        // same as roomId
//       type: String,          // string like "user1_user2"
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", messageSchema);
// // export default Message;
 
 



// // const mongoose = require('mongoose');


// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     conversationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);
// export default Message;

