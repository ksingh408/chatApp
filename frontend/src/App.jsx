import { useState } from 'react'
import react from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signup from './pages/Signup.jsx';
import Welcome from './pages/Welcome.jsx';
import Chat from './pages/Chat.jsx';
// import Dashboard from './pages/Dashboard.jsx';
function App() {

    const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    // const [isLoggedIn, setIsLoggedIn] = useState(hasCookie);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={hasCookie ? <chat/>:<Welcome/>} />
          {/* <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} /> */}
          <Route path="/chat" element={<Chat />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
     
    
    </>
  )
}

export default App
