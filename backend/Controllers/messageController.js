const mongoose = require("mongoose");
const Message = require("../Models/messageModel.js");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text required" });
    }

    // Create a unique roomId based on two user IDs
    const roomId = [req.user.id, receiverId].sort().join("_");

    const message = new Message({
      conversationId: roomId, // using roomId instead of Conversation
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    await message.save();

    res.json(message);
  } catch (err) {
    console.error("Error in sendMessage:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;
  //  console.log(`${userId} & ${friendId} & ${mongoose.Types.ObjectId.isValid(friendId)}`)
  //   if (!mongoose.Types.ObjectId.isValid(friendId)) {
  //     return res.status(400).json({ message: "Invalid Friend ID" });
  //   }

    // Use same roomId logic as in sendMessage
    const roomId = [ userId,friendId].sort().join("_");

    const messages = await Message.find({ conversationId: roomId })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error in getMessages:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { sendMessage, getMessages };


// // controllers/messageController.js
// // const Conversation = "../models/Conversation.js";
// const Message = "../models/Message.js";

// const sendMessage = async (req, res) => {
//   try {
//     const { receiverId, text } = req.body;

//     if (!receiverId || !text) {
//       return res.status(400).json({ message: "Receiver and text required" });
//     }

//     // Check if conversation exists
//     let conversation = await Conversation.findOne({
//       participants: { $all: [req.user.id, receiverId] },
//     });

//     // If not, create a new one
//     if (!conversation) {
//       conversation = new Conversation({
//         participants: [req.user.id, receiverId],
//       });
//       await conversation.save();
//     }

//     // Save message
//     const message = new Message({
//       conversationId: conversation._id,
//       sender: req.user.id,
//       text,
//     });
//     await message.save();

//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// const getMessages = async (req, res) => {
//   try {
//     const userId = req.user.id;       // always get sender from token
//     const friendId = req.params.friendId;
//     console.log(`userId ${userId} & friendId ${friendId}`)

//     if (!friendId) return res.status(400).json({ message: "Friend ID required" });

//     // Find messages between the two users
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, receiver: friendId },
//         { sender: friendId, receiver: userId },
//       ],
//     })
//       .populate("sender", "username email")
//       .populate("receiver", "username email")
//       .sort({ createdAt: 1 }); // oldest first

//     res.json(messages);
//   } catch (err) {
//     console.error("Error in getMessages:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

  

// module.exports={sendMessage,getMessages}



// const Message = require('../Models/messageModel');


// const postMessage = async (req,res)=>{
//     try{
//     const {reciverId ,senderId ,text}= req.body;
//     const newMessage = new Message({reciverId,senderId,text});

//     if (!senderId || !reciverId || !text) {
//         return res.status(400).json({ error: "All fields are required" });
//       }

//      await newMessage.save();
//     res.status(201).json(newMessage);


//     }
//     catch(err){
//         res.status(500).json({error:err.message});
//     }
// }

// const fetchMessage = async(req,res)=>{
//     try{
//         const {reciverId, senderId} = req.params;

//         const messages = await Message.find({
//             $or:[
//                 {senderId:userId , reciverId:friendId},
//                 {senderId:friendId , reciverId:userId}
//             ]
//         }).sort({createdAt:1});

//         res.json(messages);
        
//     }
//     catch(err){
//         res.status(500).json({error:err.message});
//     }
// }

// module.exports ={postMessage,fetchMessage}