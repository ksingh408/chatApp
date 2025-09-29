// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {publicAPI} from "../api/api.js";

export const registerUser = createAsyncThunk(
  "auth/registerUser", async({username,email,password,profilePic},{rejectWithValue})=>{

    try{
      const res = await publicAPI.post(
        "auth/register" , {username,
          email,
          password,
          profilePic}
      );
             return res.data
      
    }
    catch(err){
      return rejectWithValue(err.response?.data || "server error")
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await publicAPI.post(
        "auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(res.user);
      return res; // backend must return { user, token? }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);




const authSlice = createSlice({

  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      // localStorage.removeItem("user"); // ✅ clear localStorage
    },
  },


  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        console.log(state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })


      .addCase(registerUser.pending,(state)=>{
        state.loading =true;
        state.error = true;
      })
      .addCase(registerUser.fulfilled,(state , action)=>{
        state.loading = false;
        state.user = action.payload.user;

      })
      .addCase(registerUser.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || "register failed"
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
