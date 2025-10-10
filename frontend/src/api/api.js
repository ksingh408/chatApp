
import axios from "axios";
import { io } from "socket.io-client";


// --------------Determine Backend URL----------------------------

let API_URL ;
if(import.meta.env.VITE_API_URL){
  API_URL=import.meta.env.VITE_API_URL
} else{
  API_URL=import.meta.env.VITE_LOCAL_API_URL;
}
// -------------- Axios Instance --------------------------------

export const publicAPI = axios.create({
  baseURL: API_URL,
 
});

// Optional: Interceptors for error handling


// publicAPI.interceptors.request.use(
//   (config)=>{
//     const token = localStorage.getItem('token');
//     if(token){
//       config.headers.Authorization =`Bearer ${token}`;
//     }
//     return config;
//   },

//   (error)=> Promise.reject(error)
// )

publicAPI.interceptors.response.use(

  (response)=> response.data,

  (error) => {
    if(error.response?.status=== 401){
      console.warn("Unauthorized! Redirecting to login...");

    }
    else if (error.response?.status >= 500) {
      console.log('server Errors')
      console.error("Server error:", error.response.data?.message || error.message);
    }
    return Promise.reject(error);
  }
  
)



// -----------------------------
// Socket.IO Setup
// -----------------------------
let socket = null;
let initialized = false;

/**
 * Connect Socket.IO
 */
export const connectSocket = () => {

  if (socket && socket.connected) return Promise.resolve(socket);

  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = io(API_URL.replace("/api", ""), {
        transports: ["websocket"],
        withCredentials: true,
      });

      socket.once("connect", () => {
        console.log("Socket connected! ID:", socket.id);
        resolve(socket);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
        reject(err);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      if (!initialized) {
        window.addEventListener("beforeunload", () => {
          if (socket) socket.disconnect();
        });
        initialized = true;
      }
    } else {
      if (socket.connected) resolve(socket);
      else {
        socket.connect();
        socket.once("connect", () => resolve(socket));
      }
    }
  });
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;


// import axios from "axios";
// import { io } from "socket.io-client";

// // -----------------------------
// // Determine Backend URL
// // -----------------------------
// // const DEV_URL = "http://localhost:5000/api"; // your local backend
// // const PROD_URL = "https://chatapp-67cs.onrender.com/api";

// const API_URL = import.meta.env.VITE_API_URL 

// // -----------------------------
// // Axios Instance
// // -----------------------------
//  const publicAPI = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // send cookies if needed
// });

// // Optional: Interceptors for error handling
// publicAPI.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("API Error:", err.response || err.message);
//     return Promise.reject(err);
//   }
// );

// // -----------------------------
// // Socket.IO Setup
// // -----------------------------
// let socket = null;

// /**
//  * Connect Socket.IO
//  */
//  const connectSocket = async () => {
//   if (!socket) {
//     socket = io(API_URL.replace("/api", ""), { // remove /api for socket
//       transports: ["websocket"],
//       withCredentials: true,
//       autoConnect: false,
//     });

//     await new Promise((resolve) => {
//       socket.connect();
//       socket.on("connect", resolve);
//     });

//     console.log("Socket connected! ID:", socket.id);

//     socket.on("connect_error", (err) => console.error("Socket error:", err));
//     socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

//     // Cleanup on unload
//     window.addEventListener("beforeunload", () => socket && socket.disconnect());
//   }

//   return socket;
// };

// /**
//  * Get socket instance
//  */
// export const getSocket = () => socket;




// export {publicAPI,connectSocket};


// // utils/socket.js
// import { io } from "socket.io-client";

// const API_URL = import.meta.env.VITE_API_URL;

// let socket = null;
// let initialized = false;

// /**
//  * Connect Socket.IO
//  */
// export const connectSocket = () => {
//   if (socket && socket.connected) return Promise.resolve(socket);

//   return new Promise((resolve, reject) => {
//     if (!socket) {
//       socket = io(API_URL.replace("/api", ""), {
//         transports: ["websocket"],
//         withCredentials: true,
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       // ✅ Events
//       socket.once("connect", () => {
//         console.log("Socket connected! ID:", socket.id);
//         resolve(socket);
//       });

//       socket.on("connect_error", (err) => {
//         console.error("Socket error:", err.message);
//         reject(err);
//       });

//       socket.on("disconnect", (reason) => {
//         console.log("Socket disconnected:", reason);
//       });

//       // Clean up on page unload
//       if (!initialized) {
//         window.addEventListener("beforeunload", () => {
//           if (socket) socket.disconnect();
//         });
//         initialized = true;
//       }
//     } else {
//       if (socket.connected) resolve(socket);
//       else {
//         socket.connect();
//         socket.once("connect", () => resolve(socket));
//       }
//     }
//   });
// };

// /**
//  * Get socket instance
//  */
// export const getSocket = () => socket;
