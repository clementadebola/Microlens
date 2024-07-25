import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authContext.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
      }}
      reverseOrder={false}
    />
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
