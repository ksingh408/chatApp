// ---------------------ChatPage.jsx------------------------



// ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import  {connectSocket, getSocket } from "../api/api.js";
import FriendList from "../component/friendList";
import ChatWindow from "../component/chatWindow";
import {publicAPI} from "../api/api.js";
import { useCallback } from "react";

const ChatPage = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  const userId = reduxUser?._id || reduxUser?.id;
  const dispatach = useDispatch();

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showFriendList, setShowFriendList] = useState(true);
  const [socketReady, setSocketReady] = useState(false);

  const socketRef = useRef(getSocket());

  // ------------------- Initialize Socket -------------------
  useEffect(() => {


    const initSocket = async () => {
      try {
        const socket = await connectSocket();
           socketRef.current = socket;
           setSocketReady(true);

           
           socket.on("receiveMessage", (msg) => {
            if (msg.senderId === userId) return; // ignore own messages
            setMessages(prev => [...prev, msg]);
          });
          //   socket.on("receiveMessage", (msg) => {
          //     setMessages((prev) => {
          //       // avoid duplicates
          //       const already = prev.some(
          //         (m) => m.createdAt === msg.createdAt && m.senderId === msg.senderId
          //       );
          //       if (already) return prev;
            
          //       return [...prev, msg];
          //     });
          // });
        
      } catch (err) {
        console.error("Socket connection failed:", err);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // ------------------- Fetch Friends -------------------
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await publicAPI.get("/auth/friends");
        setFriends(res);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, []);

  // ------------------- Search Friends (Debounce) -------------------
  useEffect(() => {
    if (search.trim() === "") return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await publicAPI.get(`/auth/search?query=${search}`);
        setFriends(res || []);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // ------------------- Send Message -------------------
  const sendMessage = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !selectedFriend || !message.trim()) return;

    const msgData = {
      text: message,
      receiverId: selectedFriend._id,
      roomId: socket.currentRoom,
    };

    setMessages(prev => [
      ...prev,
      { ...msgData, senderId: userId, createdAt: new Date().toISOString() }
    ]);

    socket.emit("sendMessage", msgData);
    setMessage("");
  }, [message, selectedFriend]);

  // ------------------- Handle Friend Selection -------------------
  const handleSelectFriend = useCallback(
    async (friend) => {
      if (!friend?._id || !userId) return;

      setSelectedFriend(friend);
      setShowFriendList(false);

      try {
        const res = await publicAPI.get(`/msg/${friend._id}`);
        console.log(res);

        const formattedMessages = res.map((m) => ({
          text: m.text,
          senderId: m.sender,
          receiverId: m.receiver,
          roomId: m.conversationId,
          createdAt: m.createdAt,
        }));
        setMessages(formattedMessages);

        const roomId = [userId, friend._id].sort().join("_");

        if (!socketRef.current || !socketRef.current.connected) {
          socketRef.current = await connectSocket();
        }

        socketRef.current.emit("joinRoom", roomId);
        socketRef.current.currentRoom = roomId;
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    },
    [userId]
  );

  // ------------------- JSX -------------------
  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Friend List */}
      <div
        className={`h-full flex-col border-r border-gray-200 
          w-full sm:w-2/5 md:w-1/3 lg:w-2/9
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

      {/* Chat Window */}
      {selectedFriend && !showFriendList && (
        <div className="absolute inset-0 bg-amber-950 md:static md:flex md:w-2/3 lg:w-7/9 flex flex-col">
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
