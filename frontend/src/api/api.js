import axios from "axios";

const publicAPI = axios.create({
  baseURL: "http://localhost:5000/api", // only the base
  // baseURL:"https://chatapp-s96a.onrender.com"
  withCredentials: true
});

export default publicAPI;
