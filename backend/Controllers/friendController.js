// controllers/userController.js
const User = require("../Models/userModel.js");

 const searchUser = async (req, res) => {
  try {
    const { query } = req.query; // example: /api/users/search?query=john
    console.log("query is",query)
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
     $or:[ {username: { $regex: query, $options: "i" }}, 
      {email: { $regex: query, $options: "i" }}// case-insensitive search
     ],
      _id: { $ne: req.user.id }, // exclude logged-in user
    }).select("username email");
console.log(users)
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



 const getFriends = async (req, res) => {
 
  // ---------------console.log("sender ID in getfriends ",req.user._id)
  // console.log(req.user._id)

    try {
      const user = await User.findById(req.user._id).populate(
        "friends",
        "username email"
      ).select("friend");

      
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.friends && user.friends.length > 0 ? user.friends : [0]);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  module.exports={searchUser,getFriends}