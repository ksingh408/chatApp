import React, { useEffect, useRef } from "react";

const ChatWindow = ({
  userId,
  messages,
  message,
  setMessage,
  sendMessage,
  profilePic,
  selectedFriend,
  onBack,
}) => {

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages]);


  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }


  const getDateLabel = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const today = new Date();
  
    const sameDay = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
  
    // Today
    if (sameDay(d, today)) return "Today";
  
    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (sameDay(d, yesterday)) return "Yesterday";
  
    // Else → normal date
    return d.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  



  const friendName = selectedFriend?.username || selectedFriend?.name || "Friend";


  return (
   
    <div className="flex flex-col h-screen w-auto  lg:w-300 bg-cyan-200">

      {/* ------------------------------------Header ----------------------------------------------*/}
   
       <div className="flex items-center justify-start p-2 bg-gradient-to-br from-gray-50 via-gray-100  text-shadow-gray-600 shadow-md">
        <button
          className="md:hidden px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xl font-bold -ml-4"
          onClick={onBack}
        >
          ←
        </button>

        <div className="flex  space-x-3">
          <img
            src={ profilePic || selectedFriend?.profilePic || "/default-avatar.png" }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
          />
        </div>
        <h2 className="font-semibold  text-lg ml-4 md:text-xl truncate">{friendName}</h2>
      </div>


     
 {/* -----------------------------------------Messages ---------------------------------------------- */}
      
       
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
         {messages.map((m, idx) => {
  const senderId = m.senderId._id || m.senderId;
  const isSender = senderId.toString() === userId?.toString();

  if (
    senderId.toString() !== userId?.toString() &&
    senderId.toString() !== selectedFriend?._id
  )
    return null;

    
  // ----------------------------Date separator check-----------------------

  const currentDateLabel = getDateLabel(m.createdAt);
  const prevMessage = messages[idx - 1];
  const prevDateLabel = prevMessage ? getDateLabel(prevMessage.createdAt) : null;

  return (
    <React.Fragment key={idx}>

      {/* Show separator only when date changes */}
      
      {currentDateLabel !== prevDateLabel && (
        <div className="flex justify-center my-4">
          <span className="bg-gray-300 text-black text-md px-3 py-1 rounded-full shadow-md">
            {currentDateLabel}
          </span>
        </div>
      )}

      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[60%] sm:max-w-[40%] p-2 rounded-2xl break-words shadow-md text-[15px] md:text-base ${
            isSender
              ? "bg-blue-500 text-white text-right rounded-br-none"
              : "bg-gray-200 text-gray-900 text-left rounded-bl-none"
          }`}
        >
          <div>{m.text}</div>
          {m.createdAt && (
            <div
              className={`text-xs mt-1 ${
                isSender ? "text-blue-100" : "text-gray-500"
              } text-right`}
            >
              {formatTime(m.createdAt)}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
})}
 
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {/* <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white shadow-inner">
       */}  <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white shadow-inner">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base max-h-32"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-400 text-white hover:opacity-90 transition font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

