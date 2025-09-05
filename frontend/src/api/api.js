import axios from "axios";

const publicAPI = axios.create({
  baseURL: "https://chatapp-s96a.onrender.com/api", // only the base
  withCredentials: true
});

export default publicAPI;
