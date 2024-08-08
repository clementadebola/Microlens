import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useAuth } from "./context/authContext";
import { useNavigate } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import { FaArrowLeft, FaPlay, FaCheck } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import toast from "react-hot-toast";
import { mirage } from "ldrs";
import { BackButton } from "./styles";
import Div100vh from "react-div-100vh";

const OnboardingContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  justify-content: center;
  margin: 0 auto;
  background-color: ${(props) => props.theme.colors.background};
  height: 100%;
  padding: ${(props) => props.theme.spacing.medium};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 95%;
  
`;

const Input = styled.input`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  padding: ${(props) => props.theme.spacing.medium};
  border: none;
  border-radius: 18px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  width: 100%;
`;

const Button = styled(animated.button)`
  padding: ${(props) => props.theme.spacing.medium};
  border: none;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  cursor: pointer;
  width: 100%;
`;

const FormTitle = styled.h3`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.large};
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.small};
  color: ${(props) => props.theme.colors.onSurface};
`;

const Select = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.medium};
  border: none;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  font-size: ${(props) => props.theme.fontSizes.small};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${(props) => props.theme.spacing.medium};
  border: none;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  font-size: ${(props) => props.theme.fontSizes.medium};
  resize: vertical;
  min-height: 100px;
`;

const AnimatedPage = animated(styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.onSurface};
  padding: ${(props) => props.theme.spacing.medium};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`);

const VoiceOption = styled.div`
  margin: ${(props) => props.theme.spacing.medium} 0;
  padding: ${(props) => props.theme.spacing.medium};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 18px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const VoiceAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: ${(props) => props.theme.spacing.medium};
`;

const VoiceInfo = styled.div`
  flex-grow: 1;
`;

const VoiceName = styled.h4`
  margin: 0;
  font-size: ${(props) => props.theme.fontSizes.medium};
`;

const VoiceAccent = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSizes.small};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const VoiceControls = styled.div`
  display: flex;
  gap:5px;
  align-items: center;
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 10px;
  margin-left: ${(props) => props.theme.spacing.small};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const VoiceButton = styled(Button)`
  width: 60%;
  margin-top: ${(props) => props.theme.spacing.large};
`;

interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
  accent: string;
  avatar: string;
}

const Onboarding: React.FC = () => {
  const { currentUser } = useAuth();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
  });
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { speak, voices: speechKitVoices, supported } = useSpeechSynthesis();

  useEffect(() => {
    if (!currentUser?.email) {
      navigate("/auth");
    }
    const getPev = async () => {
      const docRef = doc(db, "patients", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsUpdate(true);
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
    mirage.register();
  }, []);

  useEffect(() => {
    if (supported && speechKitVoices.length > 0) {
      const filteredVoices = speechKitVoices
        .filter((voice) => voice.lang.startsWith("en"))
        .map((voice) => ({
          name: voice.name,
          lang: voice.lang,
          gender: voice.name.includes('Female') ? 'female' : 'male',
          accent: voice.name.includes('US') ? 'American' : 'British',
          avatar: voice.name.includes('Female') 
            ? `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 70)}.jpg`
            : `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`
        }));
      setAvailableVoices(filteredVoices);
    }
  }, [supported, speechKitVoices]);

  const containerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  const voiceSelectionAnimation = useSpring({
    transform: showVoiceModal ? "translateX(0%)" : "translateX(100%)",
  });

  const buttonAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: 1.05 },
    config: { tension: 300, friction: 10 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (currentUser && !isUpdate) {
        await setDoc(doc(db, "patients", currentUser.uid), patientInfo);
      } else {
        await updateDoc(doc(db, "patients", currentUser.uid), patientInfo);
      }
      setIsLoading(false);
      setShowVoiceModal(true);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const speakOutLoud = (voice: Voice) => {
    const speechKitVoice = speechKitVoices.find((v) => v.name === voice.name);
    if (speechKitVoice) {
      speak({ text: "Hi there! I'm your friendly AI assistant.", voice: speechKitVoice });
    }
  };

  const handleVoiceSelection = async (voice: Voice) => {
    try {
      setIsLoading(true);
      if (currentUser) {
        await updateDoc(doc(db, "patients", currentUser.uid), {
          selectedVoice: voice.name,
        });
        navigate("/dashboard");
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <Div100vh>
      <OnboardingContainer style={containerAnimation}>
        {isUpdate && (
          <BackButton onClick={() => navigate("/dashboard")}>
            <FaArrowLeft color="gray" size={22} />
          </BackButton>
        )}

        {!showVoiceModal ? (
          <Form onSubmit={handleSubmit}>
            <FormTitle>
              Please tell us about your{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #32DD49, #7E57C2)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                awesome self
              </span>
            </FormTitle>

            <InputGroup>
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={patientInfo.age}
                onChange={handleChange}
                autoFocus
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                value={patientInfo.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <TextArea
                id="medicalHistory"
                name="medicalHistory"
                placeholder="Example: Diagnosed with type 2 diabetes in 2015, family history of heart disease, allergic to penicillin etc."
                value={patientInfo.medicalHistory}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <Button type="submit" style={buttonAnimation}>
              {isLoading ? (
                <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
              ) : (
                "Next"
              )}
            </Button>
          </Form>
        ) : (
          <AnimatedPage style={voiceSelectionAnimation}>
            <BackButton onClick={() => setShowVoiceModal(false)}>
              <FaArrowLeft fill="#ccc" />
            </BackButton>
            <FormTitle>
              Select a{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #FF6347, #7E57C2)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                cool voice
              </span>
            </FormTitle>

            {availableVoices.map((voice) => (
              <VoiceOption key={voice.name}>
                <VoiceAvatar style={{ backgroundImage: `url(${voice.avatar})` }} />
                <VoiceInfo>
                  <VoiceName>{voice.name.replace("Microsoft", "")}</VoiceName>
                  <VoiceAccent>{voice.accent} accent</VoiceAccent>
                </VoiceInfo>
                <VoiceControls>
                  <IconButton onClick={() => speakOutLoud(voice)}>
                    <FaPlay />
                  </IconButton>
                  <span onClick={() => setSelectedVoice(voice)}>
                    {selectedVoice?.name === voice.name ? <FaCheck /> : 'Use'}
                  </span>
                </VoiceControls>
              </VoiceOption>
            ))}
            {selectedVoice && (
              <VoiceButton
                onClick={() => handleVoiceSelection(selectedVoice)}
                style={buttonAnimation}
              >
                {isLoading ? (
                  <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
                ) : (
                  "Confirm Selection"
                )}
              </VoiceButton>
            )}
          </AnimatedPage>
        )}
    </OnboardingContainer>
    </Div100vh>
  );
};

export default Onboarding;