import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { db } from "./firebase";
import { useAuth } from "./context/authContext";
import UserAvatar from "./Avatar";
import Logout from "./auth/Logout";
import { doc, getDoc } from "firebase/firestore";
import { reportBugHelper } from "./utils";
import { FaUserDoctor } from "react-icons/fa6";
import toast from "react-hot-toast";
import {
  AnimatedPage,
  SettingItem,
  SettingLabel,
  SubmitButton,
  TextArea,
  LogEntry,
  Button,
} from "./styles";
import { MdBugReport } from "react-icons/md";
import { AiFillEdit, AiOutlineFileDone } from "react-icons/ai";
import { IoLogIn } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { mirage } from "ldrs";
import { IoMdQrScanner } from "react-icons/io";
import Bot from "./bot/main";

const DashboardContainer = styled(animated.div)`
  position: relative;
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
 overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.large};
  .med-history {
    width: 100%;
    position: relative;
    padding: ${(props) => props.theme.spacing.large};
    border: 1px solid ${(props) => props.theme.colors.secondary};
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 13px;

    .history-edit {
      position: absolute;
      top: -10px;
      right: 0;
      cursor: pointer;
      border-radius:8px;
      background: rgba(5, 57, 71, 0.5);
      padding:5px 10px;
    }
  }
  .dash-btns {
    width: 100%;
    display: flex;
    justify-content: center;
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

const DashboardButton = styled(animated(Link))`
  margin: ${(props) => props.theme.spacing.medium};
  padding: ${(props) => props.theme.spacing.small};
  border: none;
  border-radius: 4px;
  font-size:13px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  text-decoration: none;
  text-align: center;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:3px;
  width: 150px;
&::active{
    text-decoration:none;
}
`;

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
    selectedVoice:""
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
        "Added real-time scanning and image capture functionality",
        "Implemented history feature for saved scans",
        "Implemented a chatbot for personalized assistance; powered by Google's Gemini AI",
        "Added Authentication page (Signup, Signin and Federated Auth(Google Oauth)",
        "Integrated with firebase to store user details and scans",
        "Integrated Google's Gemini AI for Image analysis and prediction",
        "Added a health diagnostic agent powered by Google's Gemini AI",
        "Added speech functionality"
      ],
    },
  ];

  const submitBugReport = async () => {
    try {
      setIsBugReportLoading(true);
      await reportBugHelper(bugDescription);
      setIsBugReportLoading(false);
      toast.success("Bug report submitted successfully");
      setBugDescription("");
    } catch (error: any) {
      setIsBugReportLoading(false);
      toast.error("Failed to submit bug report due to", error.message);
    }
  };

  useEffect(() => {
    if (!currentUser?.email) {
        navigate('/auth')
    }
    const getPev = async () => {
      const docRef = doc(db, "patients", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const patientInfo = docSnap.data();

        setPatientInfo((prev) => ({
          ...prev,
          age: patientInfo?.age,
          gender: patientInfo?.gender,
          medicalHistory: patientInfo?.medicalHistory,
        }));
      }
    };

    getPev();
  }, []);

  const containerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const buttonAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: 1.05 },
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    mirage.register();
  }, []);

  return (
    <DashboardContainer style={containerAnimation}>
      <UserAvatar />
      <div className="med-history">
        <span className="history-edit" onClick={()=>navigate('/onboarding')}>Edit<AiFillEdit /></span>
        <span>Age ー {patientInfo.age || "N/A"}</span>
        <span>Gender ー{patientInfo.gender || "N/A"}</span>
        <span>Medical History ー {patientInfo.medicalHistory || "N/A"}</span>
        <span>Voice ー {patientInfo.selectedVoice?.replace('Microsoft','') || "N/A"}</span>
      </div>
      <div className="dash-btns">
        <DashboardButton to="/diagnose" style={buttonAnimation}>
          Diagnose Me <FaUserDoctor />
        </DashboardButton>
        <DashboardButton to="/scan" style={buttonAnimation}>
          Scan <IoMdQrScanner />
        </DashboardButton>
      </div>
      <SettingItem>
        <SettingLabel>Haptic Feedback</SettingLabel>
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
        <div className="st-i" onClick={() => setShowUpdateLog(true)}>
          <AiOutlineFileDone size={25} />
          Update Logs
        </div>
      </SettingItem>
      <SettingItem>
        <div className="st-i" onClick={() => setShowReportBug(true)}>
          <MdBugReport size={25} />
          Report a Bug
        </div>
      </SettingItem>
      <AnimatedPage style={reportBugAnimation}>
        <CloseButton onClick={() => setShowReportBug(false)}>
          <FaArrowLeft />
        </CloseButton>
        <h3>Report a Bug</h3>
        <TextArea
          placeholder="Describe the bug you encountered..."
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
            "Submit Report"
          )}
        </SubmitButton>
      </AnimatedPage>

      <AnimatedPage style={updateLogAnimation}>
        <CloseButton onClick={() => setShowUpdateLog(false)}>
          <FaArrowLeft />
        </CloseButton>
        <h3>Update Logs</h3>
        {updateLogs.map((log, index) => (
          <LogEntry key={index}>
            <h4>
              Version {log.version} - {log.date}
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
        {currentUser?.email ? (
          <Logout />
        ) : (
          <Button
            style={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              borderRadius: "10px",
            }}
            onClick={() => navigate("/auth")}
          >
            <IoLogIn size={20} /> Login
          </Button>
        )}
      </SettingItem>
    <SettingItem>
     
    </SettingItem>
    <div style={{padding:'10px',width:'100%',marginLeft:"10%",marginTop:"30%"}}>
    <Bot/>
    </div>
    </DashboardContainer>
  );
};

export default Dashboard;
