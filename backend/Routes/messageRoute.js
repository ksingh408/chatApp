const express = require("express");
const router = express.Router();

const { sendMessage, getMessages, deleteMessage } = require("../Controllers/messageController");
const protect = require("../Middlewares/authMiddleware");

// Protect these routes
// router.post("/",  postMessage);
// router.get("/:userId/:friendId",  fetchMessage);


router.post("/send", protect, sendMessage);
router.get("/:friendId", protect, getMessages);
router.delete("/:id" ,protect, deleteMessage)

module.exports = router;
