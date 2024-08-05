import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./context/authContext";
import Druid from "./Blob";
import { axiosInstance, parseEmail, removeAsterisks } from "./utils";
import toast from "react-hot-toast";
import lisen from "./assets/listen.sound.mp3";
import drugListIcon from './assets/Property_medicine_prescription_and_pills.png'
import {
  FaMicrophone,
  FaKeyboard,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { BackButton } from "./styles";
import { useNavigate } from "react-router-dom";
import { mirage } from "ldrs";
import Div100vh from "react-div-100vh";
import useLanguage from "./context/langContext";

const DiagnosisContainer = styled(animated.div)`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  justify-content: space-;
  height: 100%;
  padding: ${(props) => props.theme.spacing.large};
  padding-top: 5.5rem;
  overflow-y: scroll;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: ${(props) => props.theme.spacing.large}+20;
`;

const InputToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ToggleButton = styled.button`
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) =>
    props.active ? props.theme.colors.surface : props.theme.colors.text};
  border: none;
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  margin: 0 ${(props) => props.theme.spacing.small};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: 8px;
  color: #ccc;
  border: 1px solid ${(props) => props.theme.colors.border};
  resize: vertical;
  font-family: inherit;
  font-size: 13px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.surface};
  border: none;
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  border-radius: 20px;
  cursor: pointer;
  margin-top: ${(props) => props.theme.spacing.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 70%;

  &:hover {
    opacity: 0.8;
  }
`;

const TranscriptBox = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: 8px;
  margin-top: ${(props) => props.theme.spacing.medium};
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.border};
  color: #ccc;
  max-height: 150px;
  font-size: 13px;
  overflow-y: auto;
`;

const DiagnosisResult = styled(animated.div)`
  position: relative;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 8px;
  border-left: 3px solid ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

const DiagnosisPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();
  const { speak, cancel } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio(lisen));
  const [transcriptVal, setTranscriptVal] = useState("");
  const [currentUserPayload, setCurrentUserPayload] = useState(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const containerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  useEffect(() => {
    const fetchVoicePreference = async () => {
      if (currentUser) {
        const docRef = doc(db, "patients", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSelectedVoice(docSnap.data().selectedVoice);
          setCurrentUserPayload(docSnap.data());
        }
      }
    };
    fetchVoicePreference();
  }, [currentUser]);

  useEffect(() => {
    mirage.register();
  }, []);

  useEffect(() => {
    setTranscriptVal(transcript);
  }, [transcript]);

  const handleDiagnosis = async (complaint: string) => {
    if (currentUser) {
      setIsLoading(true);
      const docRef = doc(db, "patients", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const patientInfo = docSnap.data();
        try {
          const { data } = await axiosInstance.post("/diagnose", {
            language,
            patientInfo,
            complaint,
          });
          setIsLoading(false);
          setDiagnosis(data);
          speakDiagnosis(data);
        } catch (error) {
          setIsLoading(false);
          toast.error(error.message);
        }
      }
    }
    resetTranscript();
    setTranscriptVal("");
    setTextInput("");
  };

  const speakDiagnosis = (diagnosisData: any) => {
    SpeechRecognition.stopListening();
  
    const text = `${t('Your diagnosis is')} ${
      diagnosisData.diagnosis
    }. ${t('Recommended medications are')} ${diagnosisData.medication.join(", ")}.`;
    
    setIsSpeaking(true);
    speak({
      text,
      voice: selectedVoice
        ? window.speechSynthesis
            .getVoices()
            .find((voice) => voice.name === selectedVoice)
        : undefined,
      onEnd: () => setIsSpeaking(false),
    });
  };

  const toggleListening = () => {
    audioRef.current.play();
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setDiagnosis(null);
      setTranscriptVal("");
      resetTranscript();
    }
  };

  const handleSubmit = () => {
    cancel();
    if (inputMethod === "voice") {
      handleDiagnosis(transcriptVal);
    } else {
      handleDiagnosis(textInput);
    }
  };
  useEffect(() => {
    return () => {
      cancel();
      setDiagnosis(null);
      resetTranscript();
      setTranscriptVal("");
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }
  const userGender = currentUserPayload?.gender.toLowerCase();
  const title =
    userGender == "male" ? "Mr" : userGender == "female" ? "Mrs" : "";
  const greetings = `${t('Good day')} ${title} ${
    currentUser?.displayName?.split(" ")[0] || parseEmail(currentUser?.email)
  }, ${t('how may I help')}`;


  return (
    <Div100vh>
      <DiagnosisContainer style={containerAnimation}>
        <BackButton
          onClick={() => {
            cancel();
            navigate("/dashboard");
          }}
        >
          <FaArrowLeft color="gray" size={22} />
        </BackButton>
        <h3 style={{ textAlign: "center" }}>{greetings}</h3>
        <Druid />
        <InputContainer>
          <InputToggle>
            <ToggleButton
              active={inputMethod === "voice"}
              onClick={() => setInputMethod("voice")}
            >
              <FaMicrophone /> {t('Voice')}
            </ToggleButton>
            <ToggleButton
              active={inputMethod === "text"}
              onClick={() => {
                setInputMethod("text");
                toggleListening();
              }}
            >
              <FaKeyboard /> {t('Text')}
            </ToggleButton>
          </InputToggle>
          {inputMethod === "voice" ? (
            <>
              {inputMethod === "voice" && (
                <span className="dots_loader" onClick={toggleListening}>
                  {listening
                    ? t("Click to Stop Listening")
                    : t("Click and Start Speaking")}
                </span>
              )}
              {listening && (
                <TranscriptBox
                  contentEditable
                  onBlur={(e) => {
                    setTranscriptVal(e.target.innerText);
                  }}
                >
                  {transcriptVal}
                </TranscriptBox>
              )}
            </>
          ) : (
            <TextArea
              value={textInput}
              autoFocus
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t("Type your symptoms here...")}
            />
          )}
          {(transcript || textInput) && (
            <SubmitButton onClick={handleSubmit}>
              {isLoading ? (
                <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
              ) : (
                <>
                  {" "}
                  <FaPaperPlane style={{ marginRight: "8px" }} />
                  {t('Get Diagnosis')}
                </>
              )}
            </SubmitButton>
          )}
        </InputContainer>
        {diagnosis && (
          <DiagnosisResult>
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() =>
                isSpeaking ? cancel() : speakDiagnosis(diagnosis)
              }
            >
              {isSpeaking ? <HiSpeakerXMark /> : <HiSpeakerWave />}
            </span>
            <h4>Diagnosis: </h4>
            <p style={{ fontSize: "13px" }}>
              {removeAsterisks(diagnosis.diagnosis)}
            </p>
            <h4 style={{display:'flex',alignItems:'center', gap:'2px'}}> <img width={45} src={drugListIcon}/> {t('Recommended Medication')}</h4>
            <ul style={{ fontSize: "13px" }}>
              {diagnosis.medication.map((med: string, index: number) => (
                <li key={index}>{removeAsterisks(med)}</li>
              ))}
            </ul>
          </DiagnosisResult>
        )}
      </DiagnosisContainer>
    </Div100vh>
  );
};

export default DiagnosisPage;
