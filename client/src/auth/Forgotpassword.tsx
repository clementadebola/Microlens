import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { mirage } from "ldrs";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.jpg";
import {
  Container,
  Logo,
  Button,
  BackButton,
  Input,
  Form,
  ErrorMessage,
} from "../styles";
import { parseError } from "../utils";

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    mirage.register();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitLoading(true);
      await sendPasswordResetEmail(auth, data.email);
      toast.success(`Password reset email sent to ${data.email}`);
      navigate("/signin");
    } catch (error: any) {
      toast.error(parseError(error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/signin")}>
        <FaArrowLeft size={22} color="#ccc" />
      </BackButton>
      <Logo src={logo} alt="Microlens" />
      <h2>Reset Password</h2>
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
        <Button type="submit" disabled={submitLoading}>
          {submitLoading ? (
            <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
          ) : (
            "Reset Password"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
