import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { mirage } from "ldrs";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.jpg";
import Div100vh from 'react-div-100vh'
import {
  Container,
  Logo,
  Button,
  BackButton,
  Input,
  FederatedButton,
  Form,
  ErrorMessage,
  StyledLink,
  PasswordInputWrapper,
  PasswordToggle,
} from "../styles";
import { parseError } from "../utils";
import { useAuth } from "../context/authContext";

interface FormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  
  useEffect(() => {
    if (currentUser?.email) {
      navigate("/");
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    mirage.register();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitLoading(true);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Signed up successfully");
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(parseError(error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed up successfully");
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(parseError(error.message));
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Div100vh>
<Container>
      <BackButton onClick={() => navigate("/auth")}>
        <FaArrowLeft size={22} color="#ccc"/>
      </BackButton>
      <Logo src={logo} alt="Microlens" />
      <h2>Sign Up</h2>
      <FederatedButton onClick={handleGoogleSignUp}>
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
        Sign up with Google
      </FederatedButton>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors.email && (
          <ErrorMessage>
            <FaInfoCircle />
            {errors.email.message}
          </ErrorMessage>
        )}
        <PasswordInputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          <PasswordToggle onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </PasswordToggle>
        </PasswordInputWrapper>
        {errors.password && <ErrorMessage><FaInfoCircle />{errors.password.message}</ErrorMessage>}
        <Button type="submit" disabled={submitLoading}>
          {submitLoading ? (
            <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
          ) : (
            "Sign Up"
          )}
        </Button>
      </Form>
      <StyledLink to="/signin">Already have an account? Sign in</StyledLink>
    </Container>

    </Div100vh>
    
  );
};

export default SignUp;
