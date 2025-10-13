const express = require("express");
const router = express.Router();

const { sendMessage, getMessages, deleteMessage } = require("../Controllers/messageController");
const protect = require("../Middlewares/authMiddleware");

router.post("/send", protect, sendMessage);
router.get("/:friendId", protect, getMessages);
router.delete("/:id" ,protect, deleteMessage)

module.exports = router;
