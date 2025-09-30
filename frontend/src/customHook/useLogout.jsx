import { useDispatch } from "react-redux";  
import { logout } from "../redux/authSlice.js";
import { useNavigate } from "react-router-dom";
import { getSocket, publicAPI } from "../api/api.js";


const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const socket = getSocket();

            if (socket) {
                socket.disconnect();
            }
            
            await publicAPI.post("auth/logout", {}, { withCredentials: true });
            dispatch(logout());
            navigate("/");
        }
        catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return handleLogout;
}
export default useLogout;