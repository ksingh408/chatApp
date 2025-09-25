const express = require('express');
const router = express.Router();
const protect = require('../Middlewares/authMiddleware');
const upload =require('../Middlewares/multerMiddleware');
// console.log(upload);
const {register,login} =require('../Controllers/userController');
const {searchUser,getFriends} =require('../Controllers/friendController')

router.post('/register',upload.single('profilePic') , register);
router.post('/login' , login);
router.get("/search",protect,  searchUser);
router.get("/friends",protect,  getFriends);


// router.get("/search", protect, searchUser);
// router.get("/friends", protect, getFriends);
module.exports=router;
