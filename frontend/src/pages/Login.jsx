import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import publicAPI from '../api/api.js';
// import { connectSocket, getSocket } from "../utils/socket"; 
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice"; 
// import {connectSocket} from '../utils/socket.js';
import image from '../assets/Art.png';




const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, loginWithRedirect,isAuthenticated,logout } = useAuth0();
  



    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // 🔹 Call thunk action
        const res = await dispatch(loginUser({ email, password }));

        if (res.meta.requestStatus === "fulfilled") {
          
          console.log("✅ Login success:", res.payload);
  
          // ✅ UserId from redux store
          const user = res.payload;
          console.log("User ID after login:", user.id);


        //  console.log("user in localStorage -", localStorage.setItem("user", JSON.stringify(user)));
          
        
          navigate("/chat");
        } else {
          alert("Login failed!");
        }
      } catch (err) {
        console.error("❌ Login error:", err);
        alert("Something went wrong");
      }
    };
  
    return (    
        <div className="flex items-center justify-center min-h-screen bg-[#323131] p-4">
        <div className="bg-[#e9dede] flex flex-col-reverse md:flex-row items-center w-full max-w-[800px] md:h-[620px] rounded-bl-4xl shadow-[0_0_25px_red] overflow-hidden">
      
          {/* Form Section */}
          <div className="flex-1 p-6 md:p-8 bg-[#e9dede] text-black  flex flex-col justify-center items-center ml-3 hover:bg-[#f7f0f0] hover:shadow-md transition">
            <h2 className="text-xl md:text-3xl font-serif mb-8 text-center">Login to your account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[340px] flex flex-col items-center">
              <div className="w-full">
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-left">Username</label>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-400 rounded"
                />
              </div>
      
              <div className="w-full">
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-left">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-400 rounded"
                />
              </div>
      
              <button
                type="submit"
                className="w-full bg-[#162D3A] text-white py-3 rounded-lg hover:bg-[#0d1a21] transition-colors"
              >
                Login
              </button>
            </form>

<div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
            <div className="h-px w-full bg-slate-200"></div>
                    OR
                    <div className="h-px w-full bg-slate-200"></div>
                    </div>
           
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => loginWithRedirect()}
              >
                <div className="px-6 sm:px-0 max-w-xl">
                  {isAuthenticated?(    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Log Out
               </button>):( 
       <button type="button" className="text-white w-full  bg-[#4d6283] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"><svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Login with Google</button>)
       } 
</div>
              </span>
            
            

            
            <p className="text-center mt-6 w-full max-w-[380px] text-gray-600">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Signup
              </span>
            </p>
          </div>
      
          {/* Image Section */}
          <div className='flex-1 w-full h-[100px] md:h-[500px] mb-4 md:mb-0 md:mx-4 rounded-2xl overflow-hidden'>
            <img src={image} alt="Login" className="w-full h-[110px] md:h-full mt-4 p-2 object-cover rounded-2xl" />
          </div>
      
        </div>
      </div>
      
    );
}      

export default Login;