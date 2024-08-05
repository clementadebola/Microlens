import { Suspense, useEffect, lazy } from "react";
import { Route, useLocation, Routes } from "react-router-dom";
import { IoCloudOfflineOutline } from "react-icons/io5";
const Auth = lazy(() => import("./auth/PreAuth"));
const SignIn = lazy(() => import("./auth/Signin"));
const SignUp = lazy(() => import("./auth/Signup"));
const ForgotPassword = lazy(() => import("./auth/Forgotpassword"));
const Scanner = lazy(() => import("./Scanner"));
const Onboarding = lazy(() => import("./Onboarding"));
const Dashboard = lazy(() => import("./Dashboard"));
const DiagnosisPage = lazy(() => import("./Diagnosis"));
const Landing = lazy(() => import("./Landing"));
const Quiz = lazy(() => import("./Quiz"));
import toast, { useToasterStore } from "react-hot-toast";
import MainLoader from "./MainLoader";
import { DefaultTheme, ThemeProvider } from "styled-components";


const theme: DefaultTheme = {
  colors: {
    background: "#050813",
    surface: "#1E1E1E",
    primary: "#8690fc",
    secondary: "#025a75",
    success: "#0f750f",
    error: "#a80707",
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
    onPrimary: "#000000",
    onSecondary: "#000000",
    onError: "#000000",
  },
  fontSizes: {
    small: "0.8rem",
    medium: "1rem",
    large: "1.2rem",
    xlarge: "1.5rem",
  },
  spacing: {
    small: "0.5rem",
    medium: "1rem",
    large: "1.5rem",
    xlarge: "2rem",
  },
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

function App() {
  const { pathname } = useLocation();
  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 2;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  useEffect(() => {
    if (!navigator.onLine) {
      toast("You are currently offline!", {
        style: {
          backgroundColor: "gray",
          color: "#fff",
        },
        icon: <IoCloudOfflineOutline />,
      });
    }
  }, [pathname]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      console.log("Unable to access camera: " + (err as Error).message);
    }
  };

  useEffect(() => {
    requestCameraAccess();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<MainLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/diagnose" element={<DiagnosisPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
