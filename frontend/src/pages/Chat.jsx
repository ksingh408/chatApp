


// ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import  {connectSocket, getSocket } from "../api/api.js";
import FriendList from "../component/friendList";
import ChatWindow from "../component/chatWindow";
import {publicAPI} from "../api/api.js";

const ChatPage = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  const userId = reduxUser?._id || reduxUser?.id;

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showFriendList, setShowFriendList] = useState(true);

  const socketRef = useRef(getSocket());

  useEffect(() => {
    let isMounted = true;
    let handleReceiveMessage;

    const initSocket = async () => {
      if (!socketRef.current) {
        socketRef.current = await connectSocket();
      }

      if (!isMounted || !socketRef.current) return;

      handleReceiveMessage = (data) => {
        if (data.roomId === socketRef.current.currentRoom) {
          setMessages((prev) => [...prev, data]);
        }
      };

      socketRef.current.on("receiveMessage", handleReceiveMessage);
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socketRef.current && handleReceiveMessage) {
        socketRef.current.off("receiveMessage", handleReceiveMessage);
      }
    };
  }, [userId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await publicAPI.get("/auth/friends");
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, []);

  
  useEffect(() => {
    if (search.trim() === "") return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await publicAPI.get(`/auth/search?query=${search}`);
        setFriends(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !selectedFriend || !message.trim()) return;

    const msgData = {
      text: message,
      receiverId: selectedFriend._id,
      roomId: socket.currentRoom,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  const handleSelectFriend = async (friend) => {
    if (!friend?._id || !userId) return;

    setSelectedFriend(friend);
    setShowFriendList(false);

    try {
      const res = await publicAPI.get(`/msg/${friend._id}`);
      const formattedMessages = res.data.map((m) => ({
        text: m.text,
        senderId: m.sender,
        receiverId: m.receiver,
        roomId: m.conversationId,
        createdAt: m.createdAt,
      }));
      setMessages(formattedMessages);

      const roomId = [userId, friend._id].sort().join("_");
      socketRef.current.emit("joinRoom", roomId);
      socketRef.current.currentRoom = roomId;
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };


    return (
      <div className="flex h-screen w-full bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
        {/* Friend List */}
        <div
          className={`h-full flex-col shadow-lg border-r border-gray-200 
            w-full sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 
            ${selectedFriend ? "hidden md:flex" : "flex"}`}
        >
          <FriendList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelect={handleSelectFriend}
            search={search}
            setSearch={setSearch}
          />
        </div>
    
        {/* Chat Window */}
        <div
          className={`absolute inset-0 transform transition-transform duration-300 ease-in-out 
            md:static md:flex md:flex-1 
            ${selectedFriend ? "translate-x-0" : "translate-x-full"} 
            flex flex-col`}
        >
          {selectedFriend && (
            <ChatWindow
              userId={userId}
              messages={messages}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              selectedFriend={selectedFriend}
              onBack={() => setShowFriendList(true)}
            />
          )}
        </div>
      </div>
    );
    
  
};

export default ChatPage;


// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { connectSocket, getSocket } from "../utils/socket.js";
// import FriendList from "../component/friendList";
// import ChatWindow from "../component/chatWindow";
// import publicAPI from "../api/api.js";

// const ChatPage = () => {
//   // -------------------------------
//   // 1️⃣ Redux state and local state
//   // -------------------------------
//   const reduxUser = useSelector((state) => state.auth.user);
//   const userId = reduxUser?._id || reduxUser?.id;

//   const [friends, setFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [search, setSearch] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showFriendList, setShowFriendList] = useState(true);

//   const socketRef = useRef(getSocket()); // Socket instance

//   // -------------------------------
//   // 2️⃣ Initialize socket and receive messages
//   // -------------------------------
//   useEffect(() => {
//     let isMounted = true;
//     let handleReceiveMessage;

//     const initSocket = async () => {
//       if (!socketRef.current) {
//         socketRef.current = await connectSocket();
//       }

//       if (!isMounted || !socketRef.current) return;

//       handleReceiveMessage = (data) => {
//         // Only show messages for current room
//         if (data.roomId === socketRef.current.currentRoom) {
//           setMessages((prev) => [...prev, data]);
//         }
//       };

//       socketRef.current.on("receiveMessage", handleReceiveMessage);
//     };

//     initSocket();

//     return () => {
//       isMounted = false;
//       if (socketRef.current && handleReceiveMessage) {
//         socketRef.current.off("receiveMessage", handleReceiveMessage);
//       }
//     };
//   }, [userId]);

//   // -------------------------------
//   // 3️⃣ Fetch friends from backend
//   // -------------------------------
//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const res = await publicAPI.get("/auth/friends");
//         setFriends(res.data);
//       } catch (err) {
//         console.error("Error fetching friends:", err);
//       }
//     };
//     fetchFriends();
//   }, []);

//   // -------------------------------
//   // 4️⃣ Search users with debounce
//   // -------------------------------
//   useEffect(() => {
//     if (search.trim() === "") return;

//     const delayDebounceFn = setTimeout(async () => {
//       try {
//         const res = await publicAPI.get(`/auth/search?query=${search}`);
//         setFriends(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [search]);

//   // -------------------------------
//   // 5️⃣ Send message
//   // -------------------------------
//   const sendMessage = () => {
//     const socket = socketRef.current;
//     if (!socket || !socket.connected || !selectedFriend || !message.trim()) return;
  
//     const msgData = {
//       text: message,
//       receiverId: selectedFriend._id,
//       roomId: socket.currentRoom,
//     };
  
//     // 1️⃣ Emit to backend
//     socket.emit("sendMessage", msgData);
  
//     // 2️⃣ Add message locally immediately
//   //   setMessages(prev =>{
//   //     if (prev.some(m => m.tempId === tempId)) return prev;
//   //   return  [
//   //     ...prev,
//   //     {
//   //       text: message,
//   //       senderId: { _id: userId },         // mimic backend structure
//   //       receiverId: { _id: selectedFriend._id },
//   //       roomId: socket.currentRoom,
//   //       createdAt: new Date().toISOString()
//   //     }
//   //   ]
//   // });

//     // setMessages(prev => {
//     //   if (prev.some(m => m.tempId === tempId)) return prev; // avoid duplicate
//     //   return [...prev, { ...msgData, tempId }];
//     // });
    
  
//     // 3️⃣ Clear input
//     setMessage("");
//   };
  

//   // -------------------------------
//   // 6️⃣ Handle friend selection
//   // -------------------------------
//   const handleSelectFriend = async (friend) => {
//     if (!friend?._id || !userId) return console.warn("Missing friendid or userId");

//     setSelectedFriend(friend);
//     setShowFriendList(false);

//     try {
//       // Fetch messages
//       const res = await publicAPI.get(`/msg/${friend._id}`);

//       console.log("Messages fetched:", res.data);
//       const formattedMessages = res.data.map((m) => ({
//         text: m.text,
//         senderId: m.sender,
//         receiverId: m.receiver,
//         roomId: m.conversationId,
//         createdAt: m.createdAt,
//       }));
//       console.log("Messages fetched:",  formattedMessages);
//       setMessages(formattedMessages);

//       // Join socket room
//       const roomId = [userId, friend._id].sort().join("_");
//       socketRef.current.emit("joinRoom", roomId);
//       socketRef.current.currentRoom = roomId;
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//       setMessages([]);
//     }
//   };

//   // -------------------------------
//   // 7️⃣ Render
//   // -------------------------------
//   return (
//     <div className="flex h-screen w-full bg-gray-50">
//     {/* Friend List */}
//     <div
//       className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 z-10 flex-col ${
//         selectedFriend ? "hidden md:flex" : "flex"
//       }`}
//     >
//       <FriendList
//         friends={friends}
//         selectedFriend={selectedFriend}
//         onSelect={handleSelectFriend}
//         search={search}
//         setSearch={setSearch}
//       />
//     </div>
  
//     {/* Chat Window */}
//     <div
//       className={`absolute inset-0 transform transition-transform duration-300 ease-in-out md:static md:flex md:flex-1 ${
//         selectedFriend ? "translate-x-0" : "translate-x-full"
//       } flex flex-col`}
//     >
//       {selectedFriend && (
//         <ChatWindow
//           userId={userId}
//           messages={messages}
//           message={message}
//           setMessage={setMessage}
//           sendMessage={sendMessage}
//           selectedFriend={selectedFriend}
//           onBack={() => setShowFriendList(true)}
//         />
//       )}
//     </div>
//   </div>
  
//   );
// };

// export default ChatPage;


// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { connectSocket, getSocket } from "../utils/socket.js";
// import FriendList from "../component/friendList";
// import ChatWindow from "../component/chatWindow";
// import publicAPI from "../api/api.js";
// // import { get } from "mongoose";
// // import { get } from "mongoose";

// const ChatPage = () => {
//   const reduxUser = useSelector((state) => state.auth.user); 
//   const [userId, setUserId] = useState(null); 
//   const [friends, setFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [search, setSearch] = useState(""); 
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showFriendList, setShowFriendList] = useState(true);

//   const socketRef = useRef(getSocket());
//   const token = getSocket();
//   // console.log("token in chatpage -",token);
//   // -------------------
//   // 1️⃣ Set userId: Redux first, fallback to socket
//   // -------------------
// //  console.log(socketRef.current) ;
// //   console.log(socketRef.current)


//   useEffect(() => {
//     if (reduxUser?._id) {
//       setUserId(reduxUser._id);
//     } else if (socketRef.current?.userId) {
//       setUserId(socketRef.current.userId);
//     }
//   }, [reduxUser]);

//   // -------------------
//   // 2️⃣ Initialize socket after userId is ready
//   // -------------------
//   useEffect(() => {
//     // if (!userId) return; // only init if socket not connected

//     let isMounted = true;
//     let handleReceiveMessage;

//     const initSocket = async () => {
//       if (!socketRef.current) {
//         socketRef.current = await connectSocket();
//         // console.log("Socket initialized:", socketRef.current);
//         // console.log("Socket userId:", getSocket().userId);
//       }

//       // fallback: socket.userId se userId set karo
//       if (!userId && socketRef.current.userId) {
//         setUserId(socketRef.current.userId);
//       }

//       if (!isMounted || !socketRef.current) return;

//       handleReceiveMessage = (data) => {
//         if (data.roomId === socketRef.current.currentRoom) {
//           setMessages((prev) => [...prev, data]);
//         }
//       };

//       socketRef.current.on("receiveMessage", handleReceiveMessage);
//     };

//     initSocket();

//     return () => {
//       isMounted = false;
//       if (socketRef.current && handleReceiveMessage)
//         socketRef.current.off("receiveMessage", handleReceiveMessage);
//     };
//   }, [userId]);

//   // -------------------
//   // 3️⃣ Fetch friends
//   // -------------------
//   useEffect(() => {
//     // if (!userId) return;
//     const fetchFriends = async () => {
//       try {
//         const res = await publicAPI.get("/auth/friends");
//         setFriends(res.data);
//         console.log("Friends fetched:", res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchFriends();
//   }, []);

//   // -------------------
//   // 4️⃣ Search users
//   // -------------------
//   useEffect(() => {
//     if (search.trim() === "") return;

//     const delayDebounceFn = setTimeout(async () => {
//       try {
//         const res = await publicAPI.get(`/auth/search?query=${search}`);
//         setFriends(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [search]);

//   // -------------------
//   // 5️⃣ Send message
//   // -------------------
//   const sendMessage = () => {
//     const socket = socketRef.current;
//     if (!socket || !socket.connected || !selectedFriend || !message.trim()) return;

//     const msgData = {
//       text: message,
//       senderId: userId,
//       receiverId: selectedFriend._id,
//       time: new Date().toISOString(),
//       roomId: socket.currentRoom,
//     };

//     socket.emit("sendMessage", msgData);
//     setMessages((prev) => [...prev, msgData]);
//     setMessage("");
//   };

//   // -------------------
//   // 6️⃣ Handle friend selection
//   // -------------------
//   const handleSelectFriend = async (friend) => {
//     // if (!userId) {
//     //   console.warn("userId not ready yet");
//     //   return;  // ❌ userId missing → room creation fail nahi hona chahiye
//     // }
    
//     setSelectedFriend(friend);
//     setShowFriendList(false);

//     const roomId = [ friend._id].sort().join("_");
//     socketRef.current.emit("joinRoom", roomId);
//     socketRef.current.currentRoom = roomId;
//     console.log("Joined room:", userId, friend._id,roomId);

//     try {
//       const res = await publicAPI.get(`/msg/${roomId}`);
//       const formattedMessages = res.data.map((m) => ({
//         text: m.message,
//         senderId: m.senderId,
//         receiverId: m.receiverId,
//         roomId: roomId
//       }));
//       setMessages(formattedMessages);
//     } catch (err) {
//       console.error(err);
//       setMessages([]);
//     }
//   };

//   // -------------------
//   // 7️⃣ Render
//   // -------------------
//   return (
//     <div className="flex h-screen w-full">
//       <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 z-10 ${selectedFriend ? "hidden md:flex" : "flex"}`}>
//         <FriendList
//           friends={friends}
//           selectedFriend={selectedFriend}
//           onSelect={handleSelectFriend}
//           search={search} 
//           setSearch={setSearch} 
//         />
//       </div>

//       <div className={`absolute inset-0 bg-gray-100 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-1 ${selectedFriend ? "translate-x-0" : "translate-x-full"}`}>
//         {selectedFriend && (
//           <ChatWindow
//             userId={userId}
//             messages={messages}
//             message={message}
//             setMessage={setMessage}
//             sendMessage={sendMessage}
//             selectedFriend={selectedFriend}
//             onBack={() => setShowFriendList(true)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { connectSocket, getSocket } from "../utils/socket.js";
// import FriendList from "../component/friendList";
// import ChatWindow from "../component/chatWindow";
// import publicAPI from "../api/api.js";
// import { use } from "react";

// const ChatPage = () => {
//   // const user = useSelector((state) => state.auth.user);
//   // const userId = user?._id || user?.id || null;

//   const [friends, setFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [search, setSearch] = useState(""); // <-- define state here

//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showFriendList, setShowFriendList] = useState(true);

//   // Ref for socket
//   const socketRef = useRef(getSocket());

//   // -------------------
//   // Initialize socket once
//   // -------------------
//   useEffect(() => {
//     let isMounted = true;
//     let handleReceiveMessage;

//     const initSocket = async () => {
//       if (!socketRef.current) {
//         console.log("Initializing socket...");
//         socketRef.current = await connectSocket();
//         console.log("Socket initialized:", socketRef.current);
//       }

//       if (!isMounted || !socketRef.current) return;

//       handleReceiveMessage = (data) => {
//         console.log("Message received:", data);
//         if (
//           selectedFriend &&
//           (data.senderId === selectedFriend._id || data.senderId === socketRef.current.userId)
//         ) {
//           setMessages((prev) => [...prev, data]);
//         }
//       };

//       socketRef.current.on("receiveMessage", handleReceiveMessage);
//     };

//     initSocket();

//     return () => {
//       isMounted = false;
//       if (socketRef.current && handleReceiveMessage)
//         socketRef.current.off("receiveMessage", handleReceiveMessage);
//     };
//   }, [selectedFriend]);

//   // -------------------
//   // Fetch friends list
//   // -------------------
//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const res = await publicAPI.get("/auth/friends", {
      
//         });
//         console.log("Friends fetched:", res.data);
//         setFriends(res.data);
//       } catch (err) {
//         console.error("Error fetching friends:", err);
//       }
//     };
//     fetchFriends();
//   }, []);


//   useEffect(() => {
//     if (search.trim() === "") return;


// const delayDebounceFn = setTimeout(async()=>{
//       try {
//         const res = await publicAPI.get(`/auth/search?query=${search}`);    
//         console.log("Search results:", res.data);
//         setFriends(res.data);
//       } catch (err) {
//         console.error("Error searching users:", err);
//       }
//     }, 500); // Debounce time of 500m
//     return () => clearTimeout(delayDebounceFn);
//   }, [search]);

//   // -------------------
//   // Send message
//   // -------------------
//   const sendMessage = () => {
//     const socket = socketRef.current;

//     if (!socket || !socket.connected) {
//       console.warn("Socket not connected");
//       return;
//     }

//     if (!selectedFriend || !message.trim()) {
//       console.warn("Cannot send message, missing info");
//       return;
//     }

//     const msgData = {
//       text: message,
//       receiverId: selectedFriend._id,
//       time: new Date().toISOString(),
//     };

//     console.log("Sending message:", msgData);

//     socket.emit("sendMessage", msgData);
//     setMessages((prev) => [...prev, msgData]);
//     setMessage(""); // clear input
//   };

//   // -------------------
//   // Handle friend selection
//   // -------------------
//   const handleSelectFriend = (friend) => {
//     setSelectedFriend(friend);
//     setShowFriendList(false);
//     setMessages([]); // reset messages or fetch previous chat if needed
//   };

//   // -------------------
//   // Render
//   // -------------------
//   return (
//     <div className="flex h-screen w-full">
//       {/* FriendList */}
//       <div
//         className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 z-10 ${
//           selectedFriend ? "hidden md:flex" : "flex"
//         }`}
//       >
//         <FriendList
//           friends={friends}
//           selectedFriend={selectedFriend}
//           onSelect={handleSelectFriend}
//           search={search} 
//           setSearch={setSearch} // <-- pass setter function
//         />
//       </div>

//       {/* ChatWindow */}
//       <div
//         className={`absolute inset-0 bg-gray-100 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-1 ${
//           selectedFriend ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {selectedFriend && (
//           <ChatWindow
//             userId={userId}
//             messages={messages}
//             message={message}
//             setMessage={setMessage}
//             sendMessage={sendMessage}
//             selectedFriend={selectedFriend}
//             onBack={() => setShowFriendList(true)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
