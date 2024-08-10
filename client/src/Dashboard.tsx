import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { auth, db } from "./firebase";
import { useAuth } from "./context/authContext";
import UserAvatar from "./Avatar";
import { doc, getDoc } from "firebase/firestore";
import { parseError, reportBugHelper } from "./utils";
import toast from "react-hot-toast";
import Div100vh from "react-div-100vh";
import {
  AnimatedPage,
  SettingItem,
  SettingLabel,
  SubmitButton,
  TextArea,
  LogEntry,
  Button,
} from "./styles";
import { MdBugReport, MdQuestionAnswer } from "react-icons/md";
import { AiFillEdit, AiOutlineFileDone } from "react-icons/ai";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { mirage } from "ldrs";
import Bot from "./bot/main";
import scanIcon from "./assets/lensIcon.webp";
import dnaIcon from "./assets/Property1057_DNA.png";
import quizIcon from "./assets/Property050_Medical_Chat.png";
import diagnoseIcon from "./assets/Property052_Medical_App.png";
import useLanguage from "./context/langContext";
import { signOut } from "firebase/auth";

const DashboardContainer = styled(animated.div)`
  position: relative;
  display: flex;
  max-width: 600px;
  height: 100%;
  margin: 0 auto;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  padding: 0 ${(props) => props.theme.spacing.medium} 0
    ${(props) => props.theme.spacing.medium};
    
  .med-history {
    width: 100%;
    position: relative;
    padding: ${(props) => props.theme.spacing.medium};
    border: 1px solid ${(props) => props.theme.colors.secondary};
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.small};
    font-size: 14px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
   

    .history-edit {
      position: absolute;
      top: -10px;
      right: 0;
      cursor: pointer;
      border-radius: 8px;
      background: rgba(5, 57, 71, 0.5);
      padding: 5px 10px;
    }
  }
  .dash-btns {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${(props) => props.theme.spacing.medium};
    margin-top: ${(props) => props.theme.spacing.medium};
  }
`;

const DashboardButton = styled(animated(Link))`
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: 8px;
  font-size: 14px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(10px);
  color: ${(props) => props.theme.colors.onSurface};
  text-decoration: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.small};
  transition: transform 0.3s ease-out;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 50px;
    height: 50px;
  }

  svg {
    fill: ${(props) => props.theme.colors.onSurface};
  }
`;

const IconButton = styled.button`
  position: relative;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
`;

const CloseButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
  color: #ffffff;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 20px;
`;


const LanguageSelector = styled.select`
  padding: ${(props) => props.theme.spacing.small};
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.onSurface};
`;

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
    selectedVoice: "",
  });

  const [bugDescription, setBugDescription] = useState("");
  const [isHapticFeedbackEnabled, setIsHapticFeedbackEnabled] = useState(false);
  const [showUpdateLog, setShowUpdateLog] = useState(false);
  const [showReportBug, setShowReportBug] = useState(false);
  const [isBugReportLoading, setIsBugReportLoading] = useState(false);
  const updateLogAnimation = useSpring({
    opacity: showUpdateLog ? 1 : 0,
    transform: showUpdateLog ? "translateY(0%)" : "translateY(100%)",
  });

  const reportBugAnimation = useSpring({
    opacity: showReportBug ? 1 : 0,
    transform: showReportBug ? "translateY(0%)" : "translateY(100%)",
  });

  const updateLogs = [
    {
      version: "1.0.0",
      date: "July 20, 2024",
      changes: [
        t("Added real-time scanning and image capture functionality"),
        t("Implemented history feature for saved scans"),
        t(
          "Implemented a chatbot for personalized assistance; powered by Google's Gemini AI"
        ),
        t(
          "Added Authentication page (Signup, Signin and Federated Auth(Google Oauth)"
        ),
        t("Integrated with firebase to store user details and scans"),
        t("Integrated Google's Gemini AI for Image analysis and prediction"),
        t("Added a health diagnostic agent powered by Google's Gemini AI"),
        t("Added speech functionality"),
        t("Multilanguage support"),
        t("Added Quiz"),
      ],
    },
  ];

  const submitBugReport = async () => {
    try {
      setIsBugReportLoading(true);
      await reportBugHelper(bugDescription);
      setIsBugReportLoading(false);
      toast.success(t("Bug report submitted successfully"));
      setBugDescription("");
    } catch (error: any) {
      setIsBugReportLoading(false);
      toast.error(
        t("Failed to submit bug report due to") + " " + error.message
      );
    }
  };

  useEffect(() => {
    if (!currentUser?.email) {
      navigate("/auth");
    }
    const getPev = async () => {
      const docRef = doc(db, "patients", currentUser?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const patientInfo = docSnap.data();

        setPatientInfo((prev) => ({
          ...prev,
          age: patientInfo?.age,
          gender: patientInfo?.gender,
          selectedVoice: patientInfo?.selectedVoice,
          medicalHistory: patientInfo?.medicalHistory,
        }));
      }
    };

    getPev();
  }, [currentUser, navigate]);

  const containerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  useEffect(() => {
    mirage.register();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Failed to log out: " + parseError(error.message));
    }
  };

  return (
      <DashboardContainer style={containerAnimation}>
        <UserAvatar />
        <div className="med-history">
          <span
            className="history-edit"
            onClick={() => navigate("/onboarding")}
          >
            {t("Edit")}
            <AiFillEdit />
          </span>
          <span>
            {t("Age")} ー {patientInfo.age || "N/A"}
          </span>
          <span>
            {t("Gender")} ー {patientInfo.gender || "N/A"}
          </span>
          <span>
            {t("Medical History")} ー {patientInfo.medicalHistory || "N/A"}
          </span>
          <span>
            {t("Voice")} ー{" "}
            {patientInfo.selectedVoice?.replace("Microsoft", "") || "N/A"}
          </span>
        </div>
        <div className="dash-btns">
          <DashboardButton to="/diagnose" style={{ background: "#045A69" }}>
            <img src={diagnoseIcon} width={45} />
            {t("Diagnose Me")}
          </DashboardButton>
          <DashboardButton to="/scan" style={{ background: "#3B3F70" }}>
            <img src={scanIcon} width={45} /> {t("Scan")}
          </DashboardButton>
          <DashboardButton to="/quiz" style={{ background: "#0F7536" }}>
            <img src={quizIcon} width={45} /> {t("Quiz")}
          </DashboardButton>
        </div>
        <SettingItem>
          <SettingLabel>{t("Haptic Feedback")}</SettingLabel>
          <label className="switch">
            <input
              type="checkbox"
              checked={isHapticFeedbackEnabled}
              onChange={() =>
                setIsHapticFeedbackEnabled(!isHapticFeedbackEnabled)
              }
            />
            <span className="slider"></span>
          </label>
        </SettingItem>

        <SettingItem>
          <SettingLabel>{t("Preferred Language")}</SettingLabel>
          <LanguageSelector
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="yo">Yorùbá</option>
            <option value="it">Italiano</option>
            <option value="zh">中文</option>
            <option value="ar">العربية</option>
            <option value="hi">हिन्दी</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
            <option value="sw">Kiswahili</option>
            <option value="ko">한국어</option>
          </LanguageSelector>
        </SettingItem>

        <SettingItem>
          <div className="st-i" onClick={() => setShowUpdateLog(true)}>
            <AiOutlineFileDone fill="teal" size={26} />
            {t("Update Logs")}
          </div>
        </SettingItem>
        <SettingItem>
          <div className="st-i" onClick={() => setShowReportBug(true)}>
            <MdBugReport fill="red" size={26} />
            {t("Report a Bug")}
          </div>
        </SettingItem>
        <AnimatedPage style={reportBugAnimation}>
          <CloseButton onClick={() => setShowReportBug(false)}>
            <FaArrowLeft />
          </CloseButton>
          <h3>{t("Report a Bug")}</h3>
          <TextArea
            placeholder={t("Describe the bug you encountered...")}
            value={bugDescription}
            disabled={isBugReportLoading}
            onChange={(e) => setBugDescription(e.target.value)}
          />
          <SubmitButton disabled={isBugReportLoading} onClick={submitBugReport}>
            {isBugReportLoading ? (
              <>
                <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
              </>
            ) : (
              t("Submit Report")
            )}
          </SubmitButton>
        </AnimatedPage>

        <AnimatedPage style={updateLogAnimation}>
          <CloseButton onClick={() => setShowUpdateLog(false)}>
            <FaArrowLeft />
          </CloseButton>
          <h3>{t("Update Logs")}</h3>
          {updateLogs.map((log, index) => (
            <LogEntry key={index}>
              <h4>
                {t("Version")} {log.version} - {log.date}
              </h4>
              <ul>
                {log.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
            </LogEntry>
          ))}
        </AnimatedPage>

        <SettingItem>
          {currentUser?.email && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                gap: "10px",
                fontSize: "13px",
                borderRadius: "8px",
                padding: "5px 10px",
                background: "rgba(5, 57, 71, 0.5)",
              }}
              onClick={logout}
            >
              <IoLogOut size={22} />
              {t("Logout")}
            </div>
          )}
        </SettingItem>
        <div
          style={{
            padding: "10px",
            width: "100%",
            marginLeft: "10%",
            marginTop: "20%",
          }}
        >
          <Bot />
        </div>
      </DashboardContainer>
  );
};

export default Dashboard;
