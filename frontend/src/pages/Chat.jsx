


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
 const [socketReady , setSocketReady] = useState(false);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    let mounted = true;
   

    const initSocket = async () => {
     try{
        const socket = await connectSocket();
      
if (mounted){
        socketRef.current=socket;
        setSocketReady(true);
      
      socket.on("receiveMessage", (msg)=>{
        setMessages((prev)=>[...prev,msg]);
      });
    }
  }  catch(err){
    console.error("Socket connection failed:", err);
  }
}

  initSocket();

    return () => {
      mounted = false;
      if (socketRef.current ) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await publicAPI.get("/auth/friends");
        setFriends(res.data);
        console.log(res.data);
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
        console.log(res.data);
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
      console.log(res.data);
      const formattedMessages = res.data.map((m) => ({
        text: m.text,
        senderId: m.sender,
        receiverId: m.receiver,
        roomId: m.conversationId,
        createdAt: m.createdAt,
      }));
      setMessages(formattedMessages);

      const roomId = [userId, friend._id].sort().join("_");
      if(!socketRef.current || !socketRef.current.connected){
        socketRef.current = await connectSocket();
      }
      socketRef.current.emit("joinRoom", roomId);
      socketRef.current.currentRoom = roomId;
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };


    return (
      <div className="flex  h-screen w-screen bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden
      ">
        
        {/*---------------------------------------- Friend List----------------------------------- */}

        <div
          className={`h-full flex-col shadow-lg border-r border-gray-200 
            w-full sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-2/9 
            ${showFriendList ? "flex" : "hidden"} md:flex`}
        >
          <FriendList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelect={handleSelectFriend}
            search={search}
            setSearch={setSearch}
          />
        </div>

    
     {/*----------------- Chat Window ----------------------------*/}

        {selectedFriend && !showFriendList && (
  <div
    className="absolute inset-0 transform bg-amber-900 transition-transform duration-200 ease-in-out
               md:static md:flex md:w-2/3 lg:w-3/3 xl:w-6/9 flex flex-col"
  >

    <ChatWindow
      userId={userId}
      messages={messages}
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
      selectedFriend={selectedFriend}
      onBack={() => setShowFriendList(true)}
    />
  </div>
)}

      </div>
    );
    
  
};

export default ChatPage;
