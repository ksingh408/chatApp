import { useState } from 'react'
import react from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signup from './pages/Signup.jsx';
import Welcome from './pages/Welcome.jsx';
import Chat from './pages/Chat.jsx';
// import Dashboard from './pages/Dashboard.jsx';
function App() {

  const [hasCookie, setHasCookie] = useState(document.cookie.split(";").some((item) => item.trim().startsWith('token=')));

  console.log("Has Cookie: ", hasCookie);

  return (
    <>
      <Router>
        <Routes>
           <Route path="/" element={hasCookie ? <Chat/>:<Welcome/>} />
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
