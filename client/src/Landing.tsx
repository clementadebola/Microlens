import React, { useState, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useSpring, animated } from "react-spring";
import Reveal from "react-reveal/Reveal";
import health from "./assets/heath.gif";

const theme = {
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
    gemini: "#1A73E8", // Official Gemini AI color
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
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.onBackground};
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.large};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled(animated.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
  background-color: ${(props) => props.theme.colors.surface};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.large};
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.a`
  color: ${(props) => props.theme.colors.onSurface};
  text-decoration: none;
  margin-left: ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.medium};
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  //   padding-top: 80px;
  padding: ${(props) => props.theme.spacing.xlarge}
    ${(props) => props.theme.spacing.large};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding-top: 80px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled(animated.h2)`
  font-size: 3rem;
  margin-bottom: ${(props) => props.theme.spacing.large};
  color: ${(props) => props.theme.colors.primary};
`;

const HeroDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.large};
  margin-bottom: ${(props) => props.theme.spacing.xlarge};
`;

const CTAButton = styled(animated.button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  border: none;
  padding: ${(props) => props.theme.spacing.medium}
    ${(props) => props.theme.spacing.large};
  font-size: ${(props) => props.theme.fontSizes.medium};
  cursor: pointer;
  border-radius: 5px;
`;

const IllustrationContainer = styled(animated.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: ${(props) => props.theme.spacing.xlarge};
  }
`;

const StyledIllustration = styled.img`
  max-width: 100%;
  height: auto;
`;

const FeaturesSection = styled.section`
  padding: ${(props) => props.theme.spacing.xlarge} 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.large};
`;

const FeatureCard = styled(animated.div)`
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 10px;
  text-align: center;
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
`;

const AITitle = styled.h2`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.gemini};
  margin-bottom: ${(props) => props.theme.spacing.large};
`;

const AIDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.large};
  max-width: 800px;
  margin: 0 auto ${(props) => props.theme.spacing.large};
`;

const AIFeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  max-width: 600px;
`;

const AIFeatureItem = styled.li`
  font-size: ${(props) => props.theme.fontSizes.medium};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const Footer = styled.footer`
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  text-align: center;
  margin-top: auto;
`;

const Landing = () => {
  const [aiFeatures, setAiFeatures] = useState([
    "Advanced image recognition 🔍",
    "Natural language processing 🗣️",
    "Real-time data analysis 📊",
    "Continuous learning and improvement 🧠",
  ]);

  const headerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const heroTitleAnimation = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 300,
  });

  const ctaButtonAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay: 600,
  });

  const featureCardAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const aiTitleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

   const illustrationAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 450,
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header style={headerAnimation}>
          <Logo>Microlens 🔬</Logo>
          <Nav>
            <NavItem href="#features">Features</NavItem>
            <NavItem href="#ai">AI Integration</NavItem>
            <NavItem href="#contact">Contact</NavItem>
          </Nav>
        </Header>

        <HeroSection>
          <HeroContent>
            <HeroTitle style={heroTitleAnimation}>
              Revolutionize Medical Diagnostics 🚀
            </HeroTitle>
            <HeroDescription>
              Microlens uses advanced AI to provide accurate diagnoses and
              bacterial identification for healthcare professionals and
              individuals alike.
            </HeroDescription>
            <CTAButton style={ctaButtonAnimation}>Get Started 🎉</CTAButton>
          </HeroContent>

          <IllustrationContainer style={illustrationAnimation}>
            <StyledIllustration
              src={health}
              alt="Medical Diagnostics Illustration"
            />
          </IllustrationContainer>
        </HeroSection>

        <FeaturesSection id="features">
          <Reveal effect="fadeInUp">
            <FeatureGrid>
              <FeatureCard style={featureCardAnimation}>
                <FeatureTitle>AI-Powered Diagnosis 🤖</FeatureTitle>
                <FeatureDescription>
                  Get accurate disease diagnoses using our advanced AI
                  algorithms.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard style={featureCardAnimation}>
                <FeatureTitle>Bacterial Identification 🦠</FeatureTitle>
                <FeatureDescription>
                  Quickly identify bacteria from samples with high precision.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard style={featureCardAnimation}>
                <FeatureTitle>Interactive Quizzes 📚</FeatureTitle>
                <FeatureDescription>
                  Test and improve your medical knowledge with our engaging
                  quizzes.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard style={featureCardAnimation}>
                <FeatureTitle>For All Users 👥</FeatureTitle>
                <FeatureDescription>
                  Designed for both healthcare professionals and curious
                  individuals.
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Reveal>
        </FeaturesSection>

        <AISection id="ai">
          <AITitle>Powered by Gemini AI 🧠</AITitle>
          <AIDescription>
            Microlens integrates cutting-edge Gemini AI technology to provide
            unparalleled accuracy in medical diagnostics and bacterial
            identification.
          </AIDescription>
          <AIFeatureList>
            {aiFeatures.map((feature, index) => (
              <AIFeatureItem key={index}>{feature}</AIFeatureItem>
            ))}
          </AIFeatureList>
        </AISection>

        <Footer id="contact">
          <p>&copy; 2024 Microlens. All rights reserved.</p>
          <p>Contact: info@microlens.com 📧</p>
        </Footer>
      </AppContainer>
    </ThemeProvider>
  );
};

export default Landing;
