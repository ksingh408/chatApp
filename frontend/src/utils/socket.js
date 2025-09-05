



import { io } from "socket.io-client";

let socket;

export const connectSocket = async () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
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


// import { io } from "socket.io-client";

// let socket;

// export const connectSocket = () => {
//   if (!socket) {
//     socket = io("http://localhost:5000", {
//       transports: ["websocket"],
//       withCredentials: true, // cookies sent with handshake
//       autoConnect: false     // manual connect after login
//     });
//   }



// if (!socket.connected) {
//     socket.connect();
//     socket.on("connect", () => {
//       console.log("Socket is actually connected now, ID:", socket.id);
//     });
//   }
  
//   return socket;
// };

// export const getSocket = () => socket;


