// src/redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedFriend: null,
  },
  reducers: {
    setSelectedFriend: (state, action) => {
      state.selectedFriend = action.payload;
    },
    clearSelectedFriend: (state) => {
      state.selectedFriend = null;
    },
  },
});

export const { setSelectedFriend, clearSelectedFriend } = chatSlice.actions;
export default chatSlice.reducer;
