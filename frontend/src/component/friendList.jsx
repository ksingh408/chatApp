// // // import React from "react";
// import React from "react";
// FriendList.jsx
import React from "react";

const FriendList = ({ friends, search, setSearch, onSelect, selectedFriend }) => {
  
  const filteredFriends = (friends || []).filter((f) => {
    const name = f.name || f.username || f.email || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });


  return (

      <div className="flex flex-col h-screen bg-gray-100 border-r border-gray-500 shadow-md">

      {/* ---------------------------------Search Input ---------------------------------*/}
      <div className="p-4 position-relative">
      <h2 className="text-2xl font-bold text-start my-2 ml-6 text-gray-800">Chats</h2>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search friends..."
        className="mx-auto w-7/8 flex items-center justify-self-auto p-2 mb-2 border rounded-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
      />


      {/*---------------------------------------------Friend List ------------------------------------ */}


    
      <div className="flex-1 overflow-y-auto  px-2">

        {filteredFriends.map((f) => {
          const isSelected = selectedFriend?._id === f._id;
          return (
            <div
            key={f._id}
            onClick={() => onSelect(f)}
            className={`flex items-center justify-self-auto p-3 border border-gray-300 rounded-lg cursor-pointer transition font-bold ${
              isSelected
                ? "bg-gray-50 text-gray-600 shadow-md"
                : "bg-white hover:bg-blue-200 text-gray-700"
            }`}
          >

            {/* --------Profile picture or placeholder circle --------*/}

            <span className="w-13 h-13 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
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
          <div className="text-gray-600 text-sm text-center mt-4">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};


export default FriendList;
