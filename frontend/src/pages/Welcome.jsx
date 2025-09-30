// ---------------------ChatPage.jsx------------------------

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";

import image from "../assets/7563799.jpg";

import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { registerUser } from "../redux/authSlice";


export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preview profile picture
  useEffect(() => {

    if (!profilePic) return setPreview(null);
    const objectUrl = URL.createObjectURL(profilePic);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password || (isSignUp && !username)) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }


    try {
      if (isSignUp) {
        // SIGNUP
       const res = await dispatch(registerUser({username,email,password,profilePic})).unwrap();
       toast.success("Signup successful!.");
     
        navigate("/chat");
       }
     

       else {
        // LOGIN via Redux
         const res = await dispatch(loginUser({ email, password })).unwrap();
         toast.success("✅ Login success:", res.payload);
         navigate("/chat"); // redirect to chat or dashboard
        
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  
  return (
    
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1f1f2e]">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-[100%] h-[90%] bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400 animate-gradient bg-[length:400%_400%] rounded-full opacity-50 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-[120%] h-[120%] bg-gradient-to-bl from-blue-600 via-cyan-500 to-teal-400 animate-gradient-reverse bg-[length:400%_400%] rounded-full opacity-40 blur-3xl translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* -----------------------------Panels -----------------*/}

      <div className={`relative flex flex-col auth:flex-row w-[80%] md:w-[85%] max-w-4xl h-[50%] shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-700 ${isSignUp ? "auth:flex-row-reverse" : ""}`}>
        

        {/* -------------------------Left Panel------------------------------ */}

        <div className="flex-1 flex flex-col justify-center items-center text-white px-4 py-4 md:p-8 max:p-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 transition-all duration-700">
          <h1 className="text-xl md:text-5xl font-bold my-0.5 md:my-3  text-center auth:text-left">
            {isSignUp ? "Join ChatApp" : "Welcome Back!"}
          </h1>
          <p className="text-lg md:text-xl mb-2 max:mb-8 max-w-md text-center auth:text-left text-gray-200">
            {isSignUp
              ? "Create an account and connect with friends."
              : "Connect with your friends and family."}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-4 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition hidden auth:block"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
          <img src={image} alt="Illustration" className="w-3/4 md:w-full mt-6 rounded-xl shadow-lg hidden auth:block" />
        </div>


        {/* ------------------Right Panel - Form -------------------*/}

        <div className="flex-1 flex flex-col justify-center items-center bg-[#1a1a1d]/90 text-gray-200 px-10 py-2 md:p-8 mx:p-16 transition-all duration-900 backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{isSignUp ? "Create Account" : "Login to Your Account"}</h2>

          <form className="w-full max-w-sm flex flex-col gap-1 md:gap-2 max:gap-4" onSubmit={handleSubmit}>

            {isSignUp && (
              <div className="flex items-center gap-2 bg-[#2a2a2e] px-3 py-1.5
              md:py-2 rounded-full">
                <MdAlternateEmail className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-500"
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-2 bg-[#2a2a2e] px-3 py-2 rounded-full">
              <MdAlternateEmail className="text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center gap-2 bg-[#2a2a2e] px-3 py-2 rounded-full relative">
              <FaFingerprint className="text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-500"
                required
              />
              {showPassword ? (
                <FaRegEyeSlash className="absolute right-3 cursor-pointer text-gray-400" onClick={togglePasswordView} />
              ) : (
                <FaRegEye className="absolute right-3 cursor-pointer text-gray-400" onClick={togglePasswordView} />
              )}
            </div>

            {isSignUp && (
              <>
                {/* <div className="flex items-center gap-2 bg-[#2a2a2e] px-3 py-2 rounded-full relative">
                  <FaFingerprint className="text-gray-400 text-lg" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-200 placeholder-gray-500"
                    required
                  />
                </div> */}

                {/* Optional profile picture */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Profile Picture (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="p-2 rounded-lg bg-[#2a2a2e] border border-gray-600 text-gray-200"
                  />
                  {preview && (
                    <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mt-2 object-cover" />
                  )}
                </div>
              </>
            )}

            <button
              className="w-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-pink-500 hover:via-fuchsia-600 hover:to-purple-700 transition"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="flex w-full items-center gap-2 py-2 md:py-4 max:py-6 text-sm text-gray-400">
            <div className="h-px w-full bg-gray-700"></div>
            <span>OR</span>
            <div className="h-px w-full bg-gray-700"></div>
          </div>

          {/* Social Logins */}
          <div className="flex w-full justify-between gap-3">
            <div className="p-2 md:px-6 bg-[#2a2a2e] cursor-pointer rounded-xl hover:bg-[#3a3a3f] transition text-white flex items-center justify-center">
              <BsApple className="text-lg md:text-xl" />
            </div>
            <div className="p-2 md:px-6 bg-[#2a2a2e] cursor-pointer rounded-xl hover:bg-[#3a3a3f] transition text-white flex items-center justify-center">
              <img src="/google-icon.png" alt="google" className="w-6 md:w-7" />
            </div>
            <div className="p-2 md:px-6 bg-[#2a2a2e] cursor-pointer rounded-xl hover:bg-[#3a3a3f] transition text-white flex items-center justify-center">
              <FaXTwitter className="text-lg md:text-xl" />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-pink-400 font-semibold hover:underline">
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>

      {/* Tailwind animation styles */}
      <style>{`
        @keyframes gradient {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-gradient {animation: gradient 10s ease infinite;}
        .animate-gradient-reverse {animation: gradient 12s ease infinite reverse;}
        @media (min-width: 820px) {
          .auth\\:flex-row { flex-direction: row; }
          .auth\\:flex-row-reverse { flex-direction: row-reverse; }
          .auth\\:text-left { text-align: left; }
          .auth\\:block { display: block; }
        }
      `}</style>
    </div>
  );
}
