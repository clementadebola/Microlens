import React from "react";
import styled from "styled-components";
import TypingEffect from "./Typing";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuBot } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";

const MessageWrapper = styled.div<{ isuser: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isuser ? "flex-end" : "flex-start")};
  margin-bottom: 0.75rem;
  position: relative;
`;

const MessageBubble = styled.div<{ isuser: boolean }>`
  display: flex;
  max-width: 70%;
  flex-direction: column;
  padding: 0.75rem 1rem;
  margin: 10px 0;
  background-color: ${(props) =>
    props.isuser ? "rgba(15, 91, 153, 0.6)" : "rgba(72, 89, 105, 0.9)"};
  color: ${(props) => (props.isuser ? "#ffffff" : "#fff")};
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: ${(props) => (props.isuser ? '20px' : '0')};
  border-bottom-right-radius: ${(props) => (props.isuser ? '0' : '20px')};

  svg{
    color:#fff;
  }
`;

const AvatarContainer = styled.div`
  margin-right: 10px;
`;

const LoadingIcon = styled(AiOutlineLoading3Quarters)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MessageText = styled.div`
  flex: 1;

`;

interface MessageProps {
  text: string;
  isUser?: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isUser = false }) => {

  return (
    <MessageWrapper isuser={isUser}>
      <MessageBubble isuser={isUser}>
        <AvatarContainer>
          {isUser ? <FaUserCircle size={24} /> : <LuBot size={24} />}
        </AvatarContainer>
        {text.length > 0 && (
          <MessageText>
            <TypingEffect text={text} isUser={isUser} />
          </MessageText>
        )}
      </MessageBubble>
    </MessageWrapper>
  );
};

export default Message;
