
// FriendList.jsx
import React from "react";
// import { useSelector } from "react-redux";
import useLogout from "../customHook/useLogout.jsx";

const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
  
  const filteredFriends = (friends || []).filter((f) => {
    const name = f.name || f.username || f.email || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleLogout = useLogout();


  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm">
 
  {/*------------------ Header --------------------*/}
  <div className="flex flex-row items-center p-4 border-b border-gray-200 justify-between">
  <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
  <button
    onClick={handleLogout}
    className="px-2 py-2 text-sm text-gray-800 rounded-lg hover:bg-red-200 transition"
  >
    Logout
  </button>
</div>

  {/* ------------------------Search Input ---------------------------------*/}
  <div className="p-3">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search friends..."
      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
    />
  </div>

  {/* ---------------------------Friend List -------------------*/}
  <div className="flex-1 overflow-y-auto px-2 space-y-0">
    {filteredFriends.map((f) => {
      const isSelected = selectedFriend?._id === f._id;
      return (
        <div
          key={f._id}
          onClick={() => onSelect(f)}
          className={`flex items-center p-2 rounded-lg cursor-pointer transition 
            ${isSelected ? "bg-blue-100 border border-blue-300 shadow-sm" : "hover:bg-gray-100"}`}
        >
          {/* Profile picture */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {f.profilePic ? (
              <img src={f.profilePic} alt={f.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 font-bold text-lg">
                {f.username?.[0] || "U"}
              </span>
            )}
          </div>

          {/* Username */}
          <span className="ml-4 text-gray-800 font-medium truncate">
            {f.username || f.name || f.email}
          </span>
        </div>
      );
    })}

    {filteredFriends.length === 0 && (
      <div className="text-gray-500 text-sm text-center mt-6">No users found</div>
    )}
  </div>
</div>

    
  );
};


export default React.memo(FriendList);
