import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { MdEmail } from "react-icons/md";
import {
  Container,
  Logo,
  FederatedButton,
  StyledLink,
} from "../styles";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { parseError } from "../utils";
import { useAuth } from "../context/authContext";
import Div100vh from 'react-div-100vh'

const Auth: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser?.email) {
      navigate("/dashboard");
    }
  });
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(parseError(error.message));
    }
  };
  return (
    <Div100vh>
<Container>
      <Logo src={logo} alt="Microlens" />
      <FederatedButton onClick={handleGoogleSignIn}>
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
          />
          <path
            fill="#34A853"
            d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
          />
          <path
            fill="#FBBC05"
            d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
          />
          <path
            fill="#EA4335"
            d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
          />
          <path fill="none" d="M2 2h44v44H2z" />
        </svg>
        Sign in with Google
      </FederatedButton>
      <FederatedButton onClick={() => navigate("/signin")}>
        <MdEmail size={20} /> Sign in with Email
      </FederatedButton>
      <StyledLink to="/signup">
        Don't have an account? <span style={{ color: "#dc3c34" }}>Sign up</span>
      </StyledLink>
    </Container>
    </Div100vh>
    
  );
};

export default Auth;
