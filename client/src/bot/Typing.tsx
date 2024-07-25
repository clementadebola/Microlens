import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaRegCopy, FaRegHeart, FaHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { RiSpeakLine } from "react-icons/ri";
import { useAuth } from "../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSpeechSynthesis } from "react-speech-kit";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Cursor = styled.span`
  font-weight: bold;
  animation: ${blink} 1s infinite;
`;

const IconTray = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: color 0.2s;
  outline: none;

  &:hover {
    color: #333;
    border: none;
    outline: none;
  }
`;

interface TypingEffectProps {
  text: string;
  isUser: boolean;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, isUser }) => {
  const { currentUser } = useAuth();
  const { speak, cancel } = useSpeechSynthesis();
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    let index = 0;
    if (isUser) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      return;
    }
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        // Scroll to bottom
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isUser]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  const speakOut = (text: string) => {
    speak({
      text,
      voice: selectedVoice
        ? window.speechSynthesis
            .getVoices()
            .find((voice) => voice.name === selectedVoice)
        : undefined,
    });
  };
  return (
    <div ref={containerRef}>
      <span style={{ fontSize: "13px" }}>
        {displayedText}
        {!isTypingComplete && <Cursor>|</Cursor>}
      </span>
      {isTypingComplete && !isUser && (
        <IconTray>
          <IconButton onClick={handleLike}>
            {isLiked ? <FaHeart fill="crimson" /> : <FaRegHeart />}
          </IconButton>
          <IconButton onClick={handleCopy}>
            <FaRegCopy />
          </IconButton>
          <IconButton onClick={() => speakOut(displayedText)}>
            <RiSpeakLine />
          </IconButton>
        </IconTray>
      )}
    </div>
  );
};

export default TypingEffect;
