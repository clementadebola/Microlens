import React, { useState, useEffect } from "react";
import styled, {
  createGlobalStyle,
  keyframes,
  css,
} from "styled-components";
import { TbLogin2 } from "react-icons/tb";
import { useSpring, animated, config } from "react-spring";
import { useTrail } from "react-spring";
import { useNavigate } from "react-router-dom";
import {
  FaDna,
  FaRobot,
  FaQuestionCircle,
  FaUsers,
  FaArrowRight,
  FaComments,
} from "react-icons/fa";
import logo from "./assets/logo.png";
import DnaIcon from "./assets/DNA.png";
import DrugIcon from "./assets/prescription_and_pills.png";
import ViralIcon from "./assets/viral.png";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.onBackground};
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

const LContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.large};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
@media(max-width:767px){
 padding: ${(props) => props.theme.spacing.medium};

}
`;

const glassEffect = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Header = styled(animated.header)`
  ${glassEffect}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.small};
  position: fixed;
  top: ${(props) => props.theme.spacing.medium};
  left: ${(props) => props.theme.spacing.medium};
  right: ${(props) => props.theme.spacing.medium};
  z-index: 1000;
`;

const Logo = styled.img`
  width: clamp(40px, 5vw, 60px);
  margin: 0;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding: ${(props) => props.theme.spacing.xlarge}
    ${(props) => props.theme.spacing.large};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding-top: 120px;
  }
`;

const HeroContent = styled.div`
  z-index: 2;
`;

const HeroTitle = styled(animated.h2)`
  font-size: ${(props) => props.theme.fontSizes.xxlarge};
  margin-bottom: ${(props) => props.theme.spacing.large};
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeroDescription = styled(animated.p)`
  font-size: ${(props) => props.theme.fontSizes.medium};
  margin-bottom: ${(props) => props.theme.spacing.xlarge};
  line-height: 1.6;
  color: #ccc;
`;

const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(134, 144, 252, 0.3),
                0 0 0 10px rgba(134, 144, 252, 0.3),
                0 0 0 20px rgba(134, 144, 252, 0.3);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(134, 144, 252, 0),
                0 0 0 20px rgba(134, 144, 252, 0),
                0 0 0 40px rgba(134, 144, 252, 0);
  }
`;

const CTAButton = styled(animated.button)`
  ${glassEffect}
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  border: none;
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.small};
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: ${ripple} 1.5s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(134, 144, 252, 0.3);
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const IllustrationContainer = styled(animated.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  height: 500px;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: ${(props) => props.theme.spacing.xlarge};
  }
`;

const AnimatedIllustration = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.secondary}
  );
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6rem;
  color: ${(props) => props.theme.colors.onPrimary};
  animation: ${floatAnimation} 6s ease-in-out infinite;
  box-shadow: 0 10px 20px rgba(134, 144, 252, 0.3);
`;

const BackgroundParticle = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  opacity: 0.5;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation: ${floatAnimation} ${(props) => props.duration}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const FeaturesSection = styled.section`
  width: 100%;
  position: relative;
  height: 350px;
  overflow: hidden;
  margin: ${(props) => props.theme.spacing.xlarge} 0;
`;

const FeatureCardContainer = styled.div`
  display: flex;
  position: absolute;
  transition: transform 0.5s ease;
`;

const FeatureCard = styled(animated.div)`
  ${glassEffect}
  padding: ${(props) => props.theme.spacing.large};
  text-align: center;
  width: 300px;
  height: 320px;
  margin-right: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 10px 20px rgba(134, 144, 252, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const FeatureTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.large};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const FeatureDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.medium};
`;

const AISection = styled.section`
  padding: ${(props) => props.theme.spacing.xlarge} 0;
  text-align: center;
  position: relative;
`;

const AITitle = styled(animated.h2)`
  font-size: ${(props) => props.theme.fontSizes.xxlarge};
  color: ${(props) => props.theme.colors.gemini};
  margin-bottom: ${(props) => props.theme.spacing.large};
`;

const AIDescription = styled(animated.p)`
  font-size: ${(props) => props.theme.fontSizes.large};
  max-width: 800px;
  margin: 0 auto ${(props) => props.theme.spacing.large};
  line-height: 1.6;
`;

const AIFeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  max-width: 600px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.medium};
`;

const AIFeatureItem = styled(animated.li)`
  ${glassEffect}
  font-size: ${(props) => props.theme.fontSizes.medium};
  padding: ${(props) => props.theme.spacing.medium};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(134, 144, 252, 0.2);
  }
`;

const Footer = styled.footer`
  ${glassEffect}
  padding: ${(props) => props.theme.spacing.large};
  text-align: center;
  margin-top: auto;
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatbotButton = styled.button`
  ${glassEffect}
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  border: none;
  padding: ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.fontSizes.large};
  cursor: pointer;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Landing = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [aiFeatures] = useState([
    "Advanced image recognition 🔍",
    "Natural language processing 🗣️",
    "Real-time data analysis 📊",
    "Continuous learning and improvement 🧠",
    "Personalized health inquiries 🩺",
    "Real-time responses ⚡",
  ]);

  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Diagnosis",
      description:
        "Get accurate disease diagnoses using our advanced AI algorithms.",
    },
    {
      icon: <FaDna />,
      title: "Bacterial Identification",
      description:
        "Quickly identify bacteria from samples with high precision.",
    },
    {
      icon: <FaQuestionCircle />,
      title: "Interactive Quizzes",
      description:
        "Test and improve your medical knowledge with our engaging quizzes.",
    },
    {
      icon: <FaUsers />,
      title: "For All Users",
      description:
        "Designed for both healthcare professionals and curious individuals.",
    },
    {
      icon: <FaComments />,
      title: "AI Chatbot",
      description:
        "Get personalized health inquiries and real-time responses from our AI chatbot.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  const headerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.wobbly,
  });

  const heroContentAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.molasses,
    delay: 300,
  });

  const ctaButtonAnimation = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: config.wobbly,
    delay: 600,
  });

  const illustrationAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.8) rotate(-10deg)" },
    to: { opacity: 1, transform: "scale(1) rotate(0deg)" },
    config: config.molasses,
    delay: 450,
  });

  const aiTitleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.molasses,
  });

  const aiFeatureTrail = useTrail(aiFeatures.length, {
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: config.molasses,
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <GlobalStyle />
      <LContainer>
        <Header style={headerAnimation}>
          <Logo src={logo} alt="Logo" />
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
              onClick={()=>navigate('/auth')}
            > <TbLogin2 size={26} fill='#ccc' /></div>
         
        </Header>

        <HeroSection>
          <HeroContent>
            <HeroTitle style={heroContentAnimation}>
              Revolutionizing Medical Diagnostics
            </HeroTitle>
            <AnimatedIllustration
              style={{ width: "150px", height: "150px", position: "absolute" }}
            >
              <img width={"80%"} src={DrugIcon} alt="Drug Icon" />
            </AnimatedIllustration>
            <HeroDescription style={heroContentAnimation}>
              Microlens uses advanced AI to provide accurate diagnoses and
              bacterial identification for healthcare professionals and
              individuals alike.
            </HeroDescription>

            <CTAButton
              style={ctaButtonAnimation}
              onClick={() => navigate("/auth")}
            >
              Get Started <FaArrowRight />
            </CTAButton>
          </HeroContent>

          <IllustrationContainer style={illustrationAnimation}>
            <AnimatedIllustration>
              <img width={"300px"} src={DnaIcon} alt="DNA Icon" />
            </AnimatedIllustration>
          </IllustrationContainer>

          {[...Array(5)].map((_, index) => (
            <BackgroundParticle
              key={index}
              size={Math.random() * 50 + 20}
              color={'#8690fc'}
              top={Math.random() * 100}
              left={Math.random() * 100}
              duration={Math.random() * 10 + 5}
              delay={Math.random() * 2}
            />
          ))}
        </HeroSection>

        <AnimatedIllustration style={{ width: "200px", height: "200px" }}>
          <img width={"200px"} src={ViralIcon} alt="Viral Icon" />
        </AnimatedIllustration>

        <FeaturesSection id="features">
          <FeatureCardContainer
            style={{
              transform: `translateX(-${currentFeature * 320}px)`,
              width: `${features.length * 320}px`,
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureCardContainer>
        </FeaturesSection>

        <AISection id="ai">
          <AITitle style={aiTitleAnimation}>Powered by Gemini AI 🧠</AITitle>
          <AIDescription style={aiTitleAnimation}>
            Microlens integrates cutting-edge Gemini AI technology to provide
            unparalleled accuracy in medical diagnostics and bacterial
            identification.
          </AIDescription>
          <AIFeatureList>
            {aiFeatureTrail.map((props, index) => (
              <AIFeatureItem key={index} style={props}>
                {aiFeatures[index]}
              </AIFeatureItem>
            ))}
          </AIFeatureList>
        </AISection>

        <Footer id="contact">
          <p>&copy; 2024 Microlens.</p>
          <p>Contact: microlens@gmail.com📧</p>
        </Footer>

        <ChatbotContainer>
          <ChatbotButton onClick={toggleChatbot}>
            <FaComments />
          </ChatbotButton>
          {isChatbotOpen && (
            <div>
              {/* Add your chatbot component here */}
           
            </div>
          )}
        </ChatbotContainer>
      </LContainer>
    </>
  );
};

export default Landing;