import React, { useEffect, useRef } from "react";

const ChatWindow = ({
  userId,
  messages,
  message,
  setMessage,
  sendMessage,
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

  const friendName = selectedFriend?.username || selectedFriend?.name || "Friend";

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <button
          className="md:hidden px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
        <h2 className="font-semibold text-lg md:text-xl truncate">{friendName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => {
          const senderId = m.senderId._id || m.senderId;
          const isSender = senderId.toString() === userId?.toString();

          if (
            senderId.toString() !== userId?.toString() &&
            senderId.toString() !== selectedFriend?._id
          )
            return null;

          return (
            <div
              key={idx}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl break-words shadow-md text-[15px] md:text-base ${
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
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white shadow-inner">
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
          className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base max-h-32"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

// const ChatWindow = ({
//   userId,
//   messages,
//   message,
//   setMessage,
//   sendMessage,
//   selectedFriend,
//   onBack,
// }) => {
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 50);
//   }, [messages]);

//   const formatTime = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const friendName = selectedFriend?.username || selectedFriend?.name || "Friend";

//   return (
//     <div className="flex flex-col h-full bg-gray-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
//         <button
//           className="md:hidden p-2 text-blue-500 hover:bg-blue-100 rounded"
//           onClick={onBack}
//         >
//           ← Back
//         </button>
//         <h2 className="font-semibold text-lg md:text-xl">{friendName}</h2>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//         {messages.map((m, idx) => {
//           const senderId = m.senderId._id || m.senderId;
//           const isSender = senderId.toString() === userId?.toString();

//           if (
//             senderId.toString() !== userId?.toString() &&
//             senderId.toString() !== selectedFriend?._id
//           )
//             return null;

//           return (
//             <div
//               key={idx}
//               className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[75%] p-3 rounded-xl break-words shadow ${
//                   isSender
//                     ? "bg-blue-500 text-white text-right rounded-br-none"
//                     : "bg-white text-gray-800 text-left rounded-bl-none"
//                 }`}
//               >
//                 <div>{m.text}</div>
//                 {m.createdAt && (
//                   <div className="text-[10px] text-gray-400 mt-1 text-right">
//                     {formatTime(m.createdAt)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex p-3 border-t border-gray-200 bg-white shadow-inner">
//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
//           className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-12"
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
