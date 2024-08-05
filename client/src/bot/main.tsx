import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import Message from "./Message";
import boDoc from "../assets/boDoc.png";
import { ping } from "ldrs";
import { RiCollapseDiagonal2Line, RiRobot3Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { dotPulse } from "ldrs";
import { axiosInstance, removeAsterisks } from "../utils";
import { LuSend } from "react-icons/lu";
import useLanguage from "../context/langContext";

const Container = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: fixed;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1000;
  top: 0;
  left:0;
  transform: translate(-50%, -50%);
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AnimatedContainer = animated(Container);

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #16304966;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  .collapse {
    width: 25px;
    height: 25px;
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ededed;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const Logo = styled.img`
  background-color: transparent;
  width: 30px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 20px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const Subtitle = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #888;
`;

const ChatArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 60px;
`;

const InputContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px;
  background-color: #1e2329;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: none;
  border-radius: 20px 0 0 20px;
  background-color: #2c3e50;
  color: #ffffff;

  &::placeholder {
    color: #7f8c8d;
  }
`;

const SendButton = styled.button<{ isloading: boolean }>`
  padding: 0 20px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  background-color: ${({ isloading }) => (isloading ? "#78838e" :'#8690fc' )};
  color: white;
  border-radius: 0 20px 20px 0;
  cursor: ${({ isloading }) => (isloading ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;
`;

const OptionsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
`;

const OptionButton = styled.button`
  background-color: #2c3e50;
  border: 1px solid ${(props) => props.theme.colors.primary} ;
  border-radius: 20px;
  color: #ecf0f1;
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background-color: #34495e;
    transform: scale(1.05);
  }
`;
const CollapsedButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 30px;
  background-color: transparent;
  color: #7eacb5;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  gap: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
     right: 10px;

}
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
  }
`;

const bacteriaOptions = [
  { icon: "🦠", text: "Clostridium perfringens" },
  { icon: "🦠", text: "Escherichia coli" },
  { icon: "🦠", text: "Staphylococcus aureus" },
  { icon: "🦠", text: "Mycobacterium tuberculosis" },
];

const virusOptions = [
  { icon: "🧬", text: "Influenza Virus" },
  { icon: "🧬", text: "HIV" },
  { icon: "🧬", text: "Hepatitis B" },
  { icon: "🧬", text: "SARS-CoV-2" },
];

const helminthOptions = [
  { icon: "🐛", text: "Ascaris lumbricoides" },
  { icon: "🐛", text: "Schistosoma mansoni" },
  { icon: "🐛", text: "Taenia solium" },
  { icon: "🐛", text: "Enterobius vermicularis" },
];

const protozoaOptions = [
  { icon: "🦠", text: "Plasmodium falciparum" },
  { icon: "🦠", text: "Giardia lamblia" },
  { icon: "🦠", text: "Toxoplasma gondii" },
  { icon: "🦠", text: "Trypanosoma cruzi" },
];

const medicationOptions = [
  { icon: "💊", text: "Amoxicillin" },
  { icon: "💊", text: "Ciprofloxacin" },
  { icon: "💊", text: "Metronidazole" },
  { icon: "💊", text: "Ivermectin" },
];

const articleOptions = [
  { icon: "📄", text: "Antibiotic Resistance" },
  { icon: "📄", text: "Vaccine Development" },
  { icon: "📄", text: "Parasite Life Cycles" },
  { icon: "📄", text: "Viral Pathogenesis" },
];

interface TMessage {
  text: string;
  isUser: boolean;
}

const Bot: React.FC = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [options, setOptions] = useState<{ icon: string; text: string }[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t, language} = useLanguage();
  const springProps = useSpring({
    opacity: isCollapsed ? 0 : 1,
    transform: isCollapsed ? "scale(0)" : "scale(1)",
    config: { tension: 300, friction: 20 },
  });

  const collapsedButtonSpring = useSpring({
    opacity: isCollapsed ? 1 : 0,
    transform: isCollapsed ? "scale(1)" : "scale(0)",
    config: { tension: 300, friction: 20 },
  });

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, isLoading: false, isUser: true };
    setMessages((prevMessages: TMessage[]) => [...prevMessages, userMessage]);

    setUserInput("");

    await generateResponse(userInput);
  };
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSend();
      }
    };

    document.addEventListener("keydown", handleKeyPress as any);

    return () => {
      document.removeEventListener("keydown", handleKeyPress as any);
    };
  }, [handleSend]);

  function getRandomOptions() {
    const allOptions = [
      ...bacteriaOptions,
      ...virusOptions,
      ...helminthOptions,
      ...protozoaOptions,
      ...medicationOptions,
      ...articleOptions,
    ];

    const shuffled = allOptions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }

  useEffect(() => {
    setOptions(getRandomOptions());
  }, []);

  const generateResponse = async (query: string) => {
    try {
      setMessageLoading(true);
      const { data } = await axiosInstance.post(`/query`, {
        query,
        language
      });
      setMessageLoading(false);

      setMessages((prevMessages: TMessage[]) => [
        ...prevMessages,
        {
          text: removeAsterisks(data?.response),
          isUser: false,
        },
      ]);
    } catch (error: any) {
      setMessageLoading(false);
      toast.error(error.message);
      console.error("Error generating response:", error);
    }
  };
  useEffect(() => {
    dotPulse.register();
  }, []);

  const handleOptionClick = (option: string) => {
    setUserInput(option);
    handleSend();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    ping.register();
  }, []);

  return (
    <>
      <AnimatedContainer style={springProps}>
        <Header>
          <div style={{ display: "flex" }}>
            <Logo src={boDoc} />
            <div>
              <Title>Jhmeel</Title>
              <Subtitle>
                {t('Online')} <l-ping size="20" speed="2" color="#16cf3b"></l-ping>
              </Subtitle>
            </div>
          </div>
          <span className="collapse" onClick={toggleCollapse}>
            <RiCollapseDiagonal2Line fill="#fff" size={24} />
          </span>
        </Header>
        <ChatArea>
          {messages.map((msg: TMessage, index: number) => (
            <Message key={index} text={msg.text} isUser={msg.isUser} />
          ))}
          {messageLoading && (
            <div
              style={{
                background: "rgba(72, 89, 105, 0.9)",
                width: "fit-content",
                padding: "0.65rem 0.9rem",
                borderRadius: "20px",
              }}
            >
              <l-dot-pulse size="25" speed="1.3" color="grey"></l-dot-pulse>
            </div>
          )}
        </ChatArea>
        {messages.length === 0 && (
          <OptionsArea>
            {options.map((option, index) => (
              <OptionButton
                key={index}
                onClick={() => handleOptionClick(option.text)}
              >
                {option.icon} {option.text}
              </OptionButton>
            ))}
          </OptionsArea>
        )}

        <InputContainer>
          <Input
            type="text"
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t("Ask a question...")}
          />
          <SendButton
            ref={buttonRef}
            isloading={messageLoading}
            disabled={messageLoading}
            onClick={handleSend}
          >
            <LuSend size={22} />
          </SendButton>
        </InputContainer>
      </AnimatedContainer>
      <animated.div style={collapsedButtonSpring}>
        <CollapsedButton onClick={toggleCollapse}>
          <RiRobot3Fill
            style={{
              position: "absolute",
              left: -20,
              color:'#8690fc'            }}
            size={35}
          />
         {t('Ask Jhmeel')}
        </CollapsedButton>
      </animated.div>
    </>
  );
};

export default Bot;
