const express = require("express");
const router = express.Router();

const { sendMessage, getMessages } = require("../Controllers/messageController");
const protect = require("../Middlewares/authMiddleware");

// Protect these routes
// router.post("/",  postMessage);
// router.get("/:userId/:friendId",  fetchMessage);


router.post("/send", protect, sendMessage);
router.get("/:friendId", protect, getMessages);

module.exports = router;
