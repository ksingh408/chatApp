
const Message = require("../Models/messageModel.js");


//---------------------------------sendMessage---------------------------------------

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


//-----------------------------Get Message ----------------------------------------------

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    const roomId = [ userId,friendId].sort().join("_");

    const total = await Message.countDocuments({ conversationId: roomId });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    console.log(page,limit);
    const messages = await Message.find({ conversationId: roomId })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit);
 
      const hasMore = page * limit < total;
    res.json({
      messages,
      page,
      hasMore,
      totalPages: Math.ceil(total / limit),});
  } catch (err) {
    console.error("Error in getMessages:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteMessage = async (req,res)=>{

  try{
    const messageId = req.params.id;
    const userId = req.user.id;
console.log(messageId)
    const message = await Message.findById(messageId);
console.log("messageId :",message);
     if(!message){
      return res.status(404).json({message:"message not found "});

    }

    if(message.sender.toString()!== userId){
      return res.status(403).json({ message: "You cannot delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({success:true , messageId})
  }
  catch(err){
    console.error("Error in deleteMessage:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { sendMessage, getMessages , deleteMessage };
