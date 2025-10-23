import React,{ useEffect, useState } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Welcome from './pages/Welcome.jsx';
import Chat from './pages/Chat.jsx';

import { publicAPI } from './api/api.js'; 

function App() {

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

useEffect(() => {
  const checkAuth = async () => {

    try {
      const res = await publicAPI.get("/auth/check");
      setLoggedIn(res.loggedIn);
    } catch (err) {
      console.error("Auth check failed:", err);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

console.log("Auth status:", { loggedIn, loading });
if (loading) {
  console.log("Loading auth status...");
  return <div>Loading...</div>; // or a spinner
}

  return (
    <>
      <Router>
        <Routes>
           <Route path="/" element={loggedIn ? <Chat/>:<Welcome/>} />
          {/* <Route path='/chat' element={hasCookie ? <Chat/>:<Welcome/>} /> */} 
          <Route path='/chat' element={<Chat/>} />

        </Routes>
      </Router>
     
      {/* Toast system */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  )
}

export default App
