// // // import React from "react";
// import React from "react";
// FriendList.jsx
import React from "react";

const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
  const filteredFriends = friends.filter((f) => {
    const name = f.name || f.username || f.email || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    // <div className="h-screen flex flex-col pt-4  bg-white border-r border-gray-200 shadow-md">
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-md">
      {/* Search Input */}
      <h2 className="text-2xl font-bold text-start mb-2 ml-6 text-gray-800">Chats</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search friends..."
        className="w-60 p-1 mb-4 ml-4 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
      />

      {/* Friend List */}
      {/* <div className="flex-1 overflow-y-auto space-y-2"> */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-4">
        {filteredFriends.map((f) => {
          const isSelected = selectedFriend?._id === f._id;
          return (
            <div
            key={f._id}
            onClick={() => onSelect(f)}
            className={`flex items-center justify-self-auto p-3 rounded-lg cursor-pointer transition font-medium ${
              isSelected
                ? "bg-gray-50 text-gray-600 shadow-md"
                : "bg-white hover:bg-blue-100 text-gray-700"
            }`}
          >
            {/* Profile picture or placeholder circle */}
            <span className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {f.profilePic ? (
                <img
                  src={f.profilePic}
                  alt={f.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold">{f.username?.[0] || "U"}</span>
              )}
            </span>
      
            {/* Username / fallback */}
            <span className="text-base ml-5">{f.username || f.name || f.email}</span>
          </div>
          );
        })}

        {filteredFriends.length === 0 && (
          <div className="text-gray-400 text-sm text-center mt-4">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;

// const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
//   const filteredFriends = friends.filter((f) => {
//     const name = f.name || f.username || f.email || "";
//     return name.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div className="h-full flex flex-col p-3 bg-gray-100 border-r border-gray-300 shadow-sm">
//       {/* Search Input */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search friends..."
//         className="w-full p-2 mb-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Friend List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {filteredFriends.map((f) => {
//           const isSelected = selectedFriend?._id === f._id;
//           return (
//             <div
//               key={f._id}
//               onClick={() => onSelect(f)}
//               className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
//                 isSelected
//                   ? "bg-blue-100 text-blue-700 font-semibold shadow"
//                   : "hover:bg-gray-200"
//               }`}
//             >
//               <span className="font-medium">{f.username || f.name || f.email}</span>
//             </div>
//           );
//         })}

//         {filteredFriends.length === 0 && (
//           <div className="text-gray-400 text-sm text-center mt-4">No users found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendList;


// import React from "react";

// const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
//   const filteredFriends = friends.filter((f) => {
//     const name = f.name || f.username || f.email || "";
//     return name.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div className="h-full flex flex-col p-3 bg-gray-100 border-r border-gray-300 shadow-sm">
//       {/* Search Input */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search friends..."
//         className="w-full p-2 mb-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Friend List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {filteredFriends.map((f) => {
//           const isSelected = selectedFriend?._id === f._id;
//           return (
//             <div
//               key={f._id}
//               onClick={() => onSelect(f)}
//               className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
//                 isSelected
//                   ? "bg-blue-100 text-blue-700 font-semibold shadow"
//                   : "hover:bg-gray-200"
//               }`}
//             >
//               <span className="font-medium">{f.username || f.name || f.email}</span>
//             </div>
//           );
//         })}

//         {filteredFriends.length === 0 && (
//           <div className="text-gray-400 text-sm text-center mt-4">No users found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendList;


// const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
//   // -------------------------------
//   // Filter friends (case-insensitive search)
//   // -------------------------------
//   const filteredFriends = friends.filter((f) => {
//     const name = f.name || f.username || f.email || "";
//     return name.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div className="h-full flex flex-col p-3 bg-gray-200 border-r border-gray-700">
//       {/* Search Input */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search friends or users..."
//         className="w-full p-2 mb-4 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Friend / User List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {filteredFriends.map((f) => {
//           const isSelected = selectedFriend?._id === f._id;
//           return (
//             <div
//               key={f._id}
//               onClick={() => onSelect(f)}
//               className={`p-2 rounded flex items-center justify-between  cursor-pointer transition ${
//                 isSelected
//                   ? "bg-gray-200 text-black hover:bg-gray-50 hover:shadow-md  font-semibold"
//                   : "bg-gray-200 hover:bg-gray-50 hover:shadow-md"
//               }`}
//             >
//               {/* Friend Name */}
//               <span className="font-medium  ">{f.username || f.name || f.email}</span>

//               {/* Start Chat Button (only if not already selected) */}
          
//             </div>
//           );
//         })}

//         {/* No results found */}
//         {filteredFriends.length === 0 && (
//           <div className="text-gray-400 text-sm">No users found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendList;
