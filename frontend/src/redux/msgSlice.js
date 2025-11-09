// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAPI } from "../api/api";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
   async({friendId , userId , limit = 15 ,page =1})=>{

    const res = await publicAPI.get(`/msg/${friendId}?limit=${limit}&page=${page}`);
    
    return { data: res.messages, page:res.page, hasMore: res.hasMore };
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
    page:1,
    hasMore: true,
  },

 

  reducers: {
    addMessage: (state, action) => {
      const msg = action.payload;
      // check if message already exists 
      const exists = state.items.some(
        (m)=>
        (m._id && msg._id && m._id === msg._id) ||
        (m.createdAt === msg.createdAt && m.senderId === msg.senderId)
      );
      if(!exists){
        state.items.push(msg);
      }
     
    },
    // prependMessages: (state, action) => {
    //   state.items = [...action.payload, ...state.items];
    // },
    
    clearMessages: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },


  extraReducers:(builder) =>{
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        
        const {data ,page ,hasMore} = action.payload;

        if(page ===1){
          state.items = data.reverse();
        }
        else{
          state.items = [...data.reverse(), ...state.items];
        }

        state.page = page;
        state.hasMore = hasMore;
        
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
