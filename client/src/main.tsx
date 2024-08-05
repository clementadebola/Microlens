import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authContext.tsx";
import { LanguageProvider } from "./context/langContext.tsx";
import "../i18n";

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
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
