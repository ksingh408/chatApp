import axios from "axios";

import { io } from "socket.io-client";

const publicAPI = axios.create({
  baseURL : import.meta.env.VITE_API_URL,
  
  withCredentials: true
});

export default publicAPI;





let socket;

export const connectSocket = async () => {
  if (!socket) {
    socket = io(
      import.meta.env.VITE_API_URL.replace("/api", ""),
  
      {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false, // manual connect
    });

    await new Promise((resolve) => {
      socket.connect();
      socket.on("connect", resolve);
    });

    console.log("Socket is actually connected now, ID:", socket.id);
  }

  return socket;
};

export const getSocket = () => socket;







