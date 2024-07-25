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
import { axiosInstance } from "./utils";
import toast from "react-hot-toast";
import lisen from "./assets/listen.sound.mp3";
import {
  FaMicrophone,
  FaKeyboard,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { BackButton } from "./styles";
import { useNavigate } from "react-router-dom";
import { mirage } from "ldrs";

const DiagnosisContainer = styled(animated.div)`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  justify-content: center;
  min-height: 100vh;
  padding: ${(props) => props.theme.spacing.large};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: ${(props) => props.theme.spacing.large};
`;

const InputToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ToggleButton = styled.button`
  background-color: ${(props) => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) => props.active ? props.theme.colors.surface : props.theme.colors.text};
  border: none;
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
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
  color:#ccc;
  border: 1px solid ${(props) => props.theme.colors.border};
  resize: vertical;
  font-family: inherit;
  font-size: 13px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.surface};
  border: none;
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
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
  color:#ccc;
  max-height: 150px;
  font-size: 13px;
  overflow-y: auto;
`;

const DiagnosisResult = styled(animated.div)`
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 8px;
  border-left: 3px solid ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

const DiagnosisPage: React.FC = () => {
  const { currentUser } = useAuth();
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
  const [transcriptVal, setTranscriptVal] = useState("")
  const navigate = useNavigate();

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
        }
      }
    };
    fetchVoicePreference();
  }, [currentUser]);

  useEffect(() => {
    mirage.register();
  }, []);


    useEffect(()=>{
  setTranscriptVal(transcript)
  },[transcript])

  const handleDiagnosis = async (complaint: string) => {
    if (currentUser) {
      setIsLoading(true);
      const docRef = doc(db, "patients", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const patientInfo = docSnap.data();
        try {
          const { data } = await axiosInstance.post("/diagnose", {
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
      setTranscriptVal('')
    setTextInput("");
  };

  const speakDiagnosis = (diagnosisData: any) => {
    const text = `Your diagnosis is ${
      diagnosisData.diagnosis
    }. Recommended medications are ${diagnosisData.medication.join(", ")}.`;
    speak({
      text,
      voice: selectedVoice
        ? window.speechSynthesis
            .getVoices()
            .find((voice) => voice.name === selectedVoice)
        : undefined,
    });
  };

  const toggleListening = () => {
    audioRef.current.play();
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setDiagnosis(null);
        setTranscriptVal('')
      resetTranscript();
    }
  };

  const handleSubmit = () => {
    if (inputMethod === "voice") {
      handleDiagnosis(transcriptVal);
    } else {
      handleDiagnosis(textInput);
    }
  };
  useEffect(() => {
    return () => {
      setDiagnosis(null);
      resetTranscript();
      setTranscriptVal('')
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }


  return (
    <DiagnosisContainer style={containerAnimation}>
      <BackButton onClick={() => navigate("/")}>
        <FaArrowLeft color="gray" size={22} />
      </BackButton>
      <h3>How may I help you today?</h3>
      <Druid />
      <InputContainer>
        <InputToggle>
          <ToggleButton
            active={inputMethod === "voice"}
            onClick={() => setInputMethod("voice")}
          >
            <FaMicrophone /> Voice
          </ToggleButton>
          <ToggleButton
            active={inputMethod === "text"}
            onClick={() => {
              setInputMethod("text");
              toggleListening();
            }}
          >
            <FaKeyboard /> Text
          </ToggleButton>
        </InputToggle>
        {inputMethod === "voice" ? (
          <>
            {inputMethod === "voice" && (
              <span className="dots_loader" onClick={toggleListening}>
                {listening ? "Stop Listening" : "Click and Start Speaking"}
              </span>
            )}
            {listening && (
              <TranscriptBox contentEditable
              onBlur={(e) => {
                setTranscriptVal(e.target.innerText);
              }}>{transcriptVal}</TranscriptBox>
            )}
          </>
        ) : (
          <TextArea
            value={textInput}
            autoFocus
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your symptoms here..."
          />
        )}
        {(transcript || textInput) && (
          <SubmitButton onClick={handleSubmit}>
           
            {isLoading ? (
              <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
            ) : (
              <> <FaPaperPlane style={{ marginRight: "8px" }} />Get Diagnosis</>
            )}
          </SubmitButton>
        )}
      </InputContainer>
      {diagnosis && (
        <DiagnosisResult>
          <h4>Diagnosis: {diagnosis.diagnosis}</h4>
          <h4>Recommended Medication:</h4>
          <ul style={{fontSize:'13px'}}>
            {diagnosis.medication.map((med: string, index: number) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
        </DiagnosisResult>
      )}

    </DiagnosisContainer>
  );
};

export default DiagnosisPage;
