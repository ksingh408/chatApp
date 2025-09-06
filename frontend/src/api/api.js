// import axios from "axios";


import axios from "axios";
import { io } from "socket.io-client";

// -----------------------------
// Determine Backend URL
// -----------------------------
const DEV_URL = "http://localhost:5000/api"; // your local backend
const PROD_URL = "https://chatapp-67cs.onrender.com/api";

export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? DEV_URL : PROD_URL);
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || (import.meta.env.MODE === "development" ? "http://localhost:5173" : "https://your-frontend.vercel.app");

// -----------------------------
// Axios Instance
// -----------------------------
export const publicAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies if needed
});

// Optional: Interceptors for error handling
publicAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response || err.message);
    return Promise.reject(err);
  }
);

// -----------------------------
// Socket.IO Setup
// -----------------------------
let socket = null;

/**
 * Connect Socket.IO
 */
export const connectSocket = async () => {
  if (!socket) {
    socket = io(API_URL.replace("/api", ""), { // remove /api for socket
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });

    await new Promise((resolve) => {
      socket.connect();
      socket.on("connect", resolve);
    });

    console.log("Socket connected! ID:", socket.id);

    socket.on("connect_error", (err) => console.error("Socket error:", err));
    socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

    // Cleanup on unload
    window.addEventListener("beforeunload", () => socket && socket.disconnect());
  }

  return socket;
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;


// import { io } from "socket.io-client";

// const publicAPI = axios.create({
//   baseURL : import.meta.env.VITE_API_URL,
  
//   withCredentials: true
// });

// export default publicAPI;





// let socket;

// export const connectSocket = async () => {
//   if (!socket) {
//     socket = io(
//       import.meta.env.VITE_API_URL.replace("/api", ""),
  
//       {
//       transports: ["websocket"],
//       withCredentials: true,
//       autoConnect: false, // manual connect
//     });

//     await new Promise((resolve) => {
//       socket.connect();
//       socket.on("connect", resolve);
//     });

//     console.log("Socket is actually connected now, ID:", socket.id);
//   }

//   return socket;
// };

// export const getSocket = () => socket;







