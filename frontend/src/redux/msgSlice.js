// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAPI } from "../api/api";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
   async({friendId , userId , limit = 15 ,page =1})=>{
    const res = await publicAPI.get(`/msg/${friendId}`);
    return res.data;
   })

   export const deletemessage = createAsyncThunk("messages/deleteMessage",
    async(messageId,{rejectWithValue})=>{
      try{
        if (!messageId) throw new Error("Message ID is undefined");

       const res= await publicAPI.delete(`/msg/${messageId}`);
        console.log(res.messageId);
        return res.messageId;
      }
      catch(err){
        return rejectWithValue(err.response?.data || err.message)
      }
    }
   )

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
 

  reducers: {
    // addMessage: (state, action) => {
    //   state.items.push(action.payload);
    // },
    // prependMessages: (state, action) => {
    //   state.items = [...action.payload, ...state.items];
    // },
    // clearMessages: (state) => {
    //   state.items = [];
    // },
  },


  extraReducers:(builder) =>{
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload)
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletemessage.fulfilled, (state,action)=>{
        state.items = state.items.filter((m)=>m._id !== action.payload);
      })
      .addCase(deletemessage.rejected, (state, action) => {
        console.error("Delete failed:", action.payload);
      });
  }
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
