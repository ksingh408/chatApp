const user = require('../Models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uploadToCloudinary =require('../Utiles/uploadtoCloudinary.js')
const fs = require("fs")



//-------------------Register-------------------------------------------------


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let profilePicUrl = null;
        if(req.file){
            const cloudinayResult = await uploadToCloudinary(req.file.path , "profilePics")

            profilePicUrl=cloudinayResult.secure_url

            // delete local file after uploading
            fs.unlinkSync(req.file.path);
        }

        const newUser = new user({
            username,
            email,
            password: hashPassword,
            profilePic: profilePicUrl
        });

        await newUser.save();

        
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//--------------------Login-------------------------------


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
       console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // true in production with HTTPS
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

          console.log (existingUser)
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                profilePic: existingUser.profilePic
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};






// ------------------------Auth check ----------------------------------------

const checkAuth = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.json({ loggedIn: false });
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ loggedIn: false });
  
        const existingUser = await user.findById(decoded.id);
        if (!existingUser) return res.json({ loggedIn: false });
  
        res.json({
          loggedIn: true,
          user: {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
          },
        });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


//   --------------------- Logout -------------------------------

const logout =("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure:false, 
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {register,login,checkAuth,logout};


