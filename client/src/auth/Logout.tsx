import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { Button } from "../styles";
import { parseError } from "../utils";

const Logout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Failed to log out: " + parseError(error.message));
    }
  };
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
      }}
    >
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          borderRadius: "10px",
        }}
        onClick={logout}
      >
        <IoLogOut size={20} /> Logout
      </Button>
    </div>
  );
};

export default Logout;
