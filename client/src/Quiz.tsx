import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import {
  FiClock,
  FiThumbsUp,
  FiThumbsDown,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import styled, { keyframes } from "styled-components";
import Confetti from "react-confetti";
import { BackButton } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "./utils";
import {
  Field,
  Question,
  QuestionDifficulty,
  QuizSettings as TQuizSettings,
} from "./types";
import toast from "react-hot-toast";
import { mirage } from "ldrs";
import { useNavigate } from "react-router-dom";
import correctST from "./assets/correct.mp3";
import failST from "./assets/fail.mp3";
import Bot from "./bot/main";
import useLanguage from "./context/langContext";
import Div100vh from "react-div-100vh";

const Quiz: React.FC = () => {
  const [settings, setSettings] = useState<TQuizSettings | null>({
    difficulty: "medium",
    numberOfQuestions: 10,
    field: "physiology",
    timeInSeconds: 15,
  });
  const { t, language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(settings?.timeInSeconds || 15);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [field, setField] = useState<Field>("physiology");
  const [timeInSeconds, setTimeInSeconds] = useState<number>(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const correctSound = new Audio(correctST);
  const incorrectSound = new Audio(failST);
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleNextQuestion();
            return settings?.timeInSeconds || 15;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, settings?.timeInSeconds]);

  useEffect(() => {
    mirage.register();
  }, []);

  const fetchQuestions = async (settings: TQuizSettings) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/generate-quiz", {
        ...settings,
        language,
      });
      setQuestions(data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error("Error fetching questions:", error.message);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });

    if (isCorrect) {
      correctSound.play();
    } else {
      incorrectSound.play();
    }

    setSelectedAnswer(answer);
    setTimeout(() => handleNextQuestion(), 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(settings?.timeInSeconds || 15);
      setSelectedAnswer(null);
    } else {
      handleQuizFinish();
    }
  };

  const handleQuizFinish = () => {
    setQuizFinished(true);
    const correctAnswersCount = userAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    if (correctAnswersCount > questions.length / 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      setSettings({ difficulty, numberOfQuestions, field, timeInSeconds });
      await fetchQuestions({
        difficulty,
        numberOfQuestions,
        field,
        timeInSeconds,
      });
    }
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  const expandProps = useSpring({
    maxHeight: expanded ? "500px" : "0px",
    opacity: expanded ? 1 : 0,
    config: { duration: 300 },
  });

  const correctAnswersCount = userAnswers.filter(
    (answer, index) => answer === questions[index]?.correctAnswer
  ).length;

  const questionsToShow = expanded ? questions : questions.slice(0, 2);

  return (
    <Div100vh>
      <QuizContainer>
        <BackButton onClick={() => navigate("/dashboard")}>
          <FaArrowLeft fill="#ccc" />
        </BackButton>
        {showConfetti && <Confetti />}
        {!settings || questions.length === 0 ? (
          <SettingsForm onSubmit={handleSettingsSubmit}>
            <h3 style={{ alignSelf: "center" }}>{t("Quiz Settings")}</h3>
            <SettingsGrid>
              <SettingsItem>
                <label>{t("Difficulty")}:</label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as QuestionDifficulty)
                  }
                >
                  <option value="easy">{t("Easy")}</option>
                  <option value="medium">{t("Medium")}</option>
                  <option value="hard">{t("Hard")}</option>
                </select>
              </SettingsItem>
              <SettingsItem>
                <label>{t("Time (seconds)")}:</label>
                <input
                  type="number"
                  min="1"
                  value={timeInSeconds}
                  disabled={isLoading}
                  onChange={(e) => setTimeInSeconds(parseInt(e.target.value))}
                />
              </SettingsItem>
              <SettingsItemWide>
                <label>{t("Number of Questions")}:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfQuestions}
                  disabled={isLoading}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                />
              </SettingsItemWide>
              <SettingsItemWide>
                <label>{t("Field")}:</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value as Field)}
                >
                  <option value="physiology">Physiology</option>
                  <option value="anatomy">Anatomy</option>
                  <option value="microbiology">Microbiology</option>
                  <option value="pathology">Pathology</option>
                  <option value="hematology">Hematology</option>
                  <option value="histopathology">Histopathology</option>
                  <option value="chemical pathology">Chemical Pathology</option>
                </select>
              </SettingsItemWide>
            </SettingsGrid>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <l-mirage size="60" speed="2.5" color="white"></l-mirage>
              ) : (
                t("Start Quiz")
              )}
            </Button>
          </SettingsForm>
        ) : quizFinished ? (
          <ResultsContainer>
            {correctAnswersCount > questions.length / 2 && <Confetti />}
            <CongratsMessage>
              {correctAnswersCount >= ((Math.floor(questions.length - 1)) / 2) ? (
                <>
                  🎉 {t("Congratulations")}!
                  <FiThumbsUp />
                </>
              ) : (
                <>
                  😔 Try again next time! <FiThumbsDown />
                </>
              )}
            </CongratsMessage>
            <p>
              You answered {correctAnswersCount} out of {questions.length}{" "}
              questions correctly!
            </p>
            <ResultsList>
              {questionsToShow.map((question, index) => (
                <ResultItem
                  key={index}
                  isCorrect={userAnswers[index] === question.correctAnswer}
                >
                  <QuestionText>{question.text}</QuestionText>
                  <AnswerText>Your answer: {userAnswers[index]}</AnswerText>
                  <CorrectAnswerText>
                    Correct answer: {question.correctAnswer}
                  </CorrectAnswerText>
                </ResultItem>
              ))}
            </ResultsList>
            {!expanded && questions.length > 2 && (
              <ExpandButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <FiChevronUp /> : <FiChevronDown />}{" "}
                {expanded ? "Hide" : t("Read more")}
              </ExpandButton>
            )}
            {expanded && (
              <animated.div style={expandProps}>
                <ResultsList>
                  {questions.slice(2).map((question, index) => (
                    <ResultItem
                      key={index + 2}
                      isCorrect={
                        userAnswers[index + 2] === question.correctAnswer
                      }
                    >
                      <QuestionText>{question.text}</QuestionText>
                      <AnswerText>
                        Your answer: {userAnswers[index + 2]}
                      </AnswerText>
                      <CorrectAnswerText>
                        Correct answer: {question.correctAnswer}
                      </CorrectAnswerText>
                    </ResultItem>
                  ))}
                </ResultsList>
              </animated.div>
            )}
            <Button onClick={() => window.location.reload()}>Retry Quiz</Button>
          </ResultsContainer>
        ) : (
          <>
            <BackButton onClick={() => window.location.reload()}>
              <FaArrowLeft fill="#ccc" />
            </BackButton>
            <DifficultyLabel difficulty={settings.difficulty}>
              {t(
                settings.difficulty.charAt(0).toUpperCase() +
                  settings.difficulty.slice(1)
              )}
            </DifficultyLabel>
            <animated.div style={fadeIn}>
              {questions[currentQuestionIndex]?.text && (
                <Card>
                  <QuestionHeader>
                    <h3>
                      Question {currentQuestionIndex + 1}/{questions.length}
                    </h3>

                    <div className="floader">
                      <div className="face">
                        <div className="fcircle"></div>
                      </div>
                      <Timer>
                        <FiClock />
                        <span>{timeLeft}s</span>
                      </Timer>
                    </div>
                  </QuestionHeader>
                  <QuestionText>
                    {questions[currentQuestionIndex]?.text}
                  </QuestionText>
                  <AnswerList>
                    {questions[currentQuestionIndex]?.answers.map(
                      (answer, index) => (
                        <AnswerButton
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        isAnswer={selectedAnswer === answer}
                        isCorrect={
                          selectedAnswer === answer &&
                          answer ===
                            questions[currentQuestionIndex].correctAnswer
                        }
                        disabled={selectedAnswer !== null}
                      >
                        {answer || "N/A"}
                      </AnswerButton>
                      )
                    )}
                  </AnswerList>
                </Card>
              )}
            </animated.div>
          </>
        )}
        <div
          style={{
            padding: "10px",
            width: "100%",
            marginLeft: "15%",
            marginTop: "36%",
          }}
        >
          <Bot />
        </div>
      </QuizContainer>
    </Div100vh>
  );
};

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  max-width: 600px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.onBackground};
  background-color: ${({ theme }) => theme.colors.background};
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const DifficultyLabel = styled.div<{ difficulty: QuestionDifficulty }>`
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme, difficulty }) =>
    difficulty === "easy"
      ? theme.colors.secondary
      : difficulty === "medium"
      ? theme.colors.primary
      : theme.colors.error};
  color: ${({ theme, difficulty }) =>
    difficulty === "easy" ? theme.colors.onSecondary : theme.colors.onPrimary};
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  width: 100%;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SettingsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  label {
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: bold;
    color: ${({ theme }) => theme.colors.onSurface};
  }

  select,
  input {
    padding: 10px 20px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.onBackground};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 16px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const SettingsItemWide = styled(SettingsItem)`
  grid-column: span 2;
`;

const Card = styled.div`
  color: ${({ theme }) => theme.colors.onSurface};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 100%;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.onSurface};
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
  animation: beat 1s infinite;
  color: #fff;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
  @keyframes beat {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.5;
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const AnswerButton = styled.button<{ isAnswer: boolean; isCorrect: boolean }>`
  background: ${({ theme, isAnswer, isCorrect }) =>
    isAnswer
      ? isCorrect
        ? theme.colors.success
        : theme.colors.error
      : theme.colors.primary};
  color: ${({ theme }) => theme.colors.onSurface};
  padding: ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: 18px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  animation: ${({ isAnswer, isCorrect }) => isAnswer && !isCorrect && shake}
    0.5s;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::before {
    width: 200px;
    height: 200px;
    margin-left: -100px;
    margin-top: -100px;
    opacity: 0;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.onSurface};
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow-y: scroll;
`;

const CongratsMessage = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  margin-top: 5px;
`;

const ResultItem = styled.div<{ isCorrect: boolean }>`
  background-color: ${({ theme, isCorrect }) =>
    isCorrect ? theme.colors.success : theme.colors.error}22;
  color: ${({ theme }) => theme.colors.onSurface};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-left: 5px solid
    ${({ theme, isCorrect }) =>
      isCorrect ? theme.colors.success : theme.colors.error};
`;

const AnswerText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.small};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const CorrectAnswerText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.small};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.success};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: 10px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing.large};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryVariant};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  &:hover {
    text-decoration: underline;
  }
`;

export default Quiz;