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
    }, 20);
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
    <div className="flex flex-col h-screen bg-gray-50">
    {/* Header */}
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <button
        className="md:hidden px-2 py-1 rounded hover:bg-gray-100"
        onClick={onBack}
      >
        ←
      </button>
      <img
        src={profilePic || selectedFriend?.profilePic || "/default-avatar.png"}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <h2 className="font-semibold text-lg text-gray-800 truncate">
        {friendName}
      </h2>
    </div>
  
    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m, idx) => {
        const senderId = m.senderId._id || m.senderId;
        const isSender = senderId.toString() === userId?.toString();
  
        const currentDateLabel = getDateLabel(m.createdAt);
        const prevMessage = messages[idx - 1];
        const prevDateLabel = prevMessage ? getDateLabel(prevMessage.createdAt) : null;
  
        return (
          <React.Fragment key={idx}>
            {currentDateLabel !== prevDateLabel && (
              <div className="flex justify-center my-3">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {currentDateLabel}
                </span>
              </div>
            )}
  
            <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] sm:max-w-[70%] md:max-w-[60%] p-3 rounded-2xl break-words text-sm shadow 
                  ${isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"}`}
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
    <div className="flex items-center gap-1 p-3 border-t border-gray-200 bg-white">
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
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm max-h-28"
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  </div>
  );
}
export default React.memo(ChatWindow);

