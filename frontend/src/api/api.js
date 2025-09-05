import axios from "axios";

const publicAPI = axios.create({
 
   baseURL:"https://chatapp-s96a.onrender.com"
  withCredentials: true
});

export default publicAPI;
