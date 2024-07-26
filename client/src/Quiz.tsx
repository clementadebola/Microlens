import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import {
  FiClock,
  FiSettings,
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
import correctST from './assets/correct.mp3'
import failST from './assets/fail.mp3'

const Quiz: React.FC = () => {
  const [settings, setSettings] = useState<TQuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "What is the first-line treatment for an acute asthma attack?",
      answers: [
        "Long-acting beta-agonists",
        "Inhaled corticosteroids",
        "Short-acting beta-agonists",
        "Leukotriene receptor antagonists",
      ],
      correctAnswer: "Short-acting beta-agonists",
    },
    {
      id: 2,
      text: "Which lab test is most commonly used to diagnose diabetes mellitus?",
      answers: [
        "Complete blood count",
        "Hemoglobin A1c",
        "Lipid panel",
        "Thyroid function test",
      ],
      correctAnswer: "Hemoglobin A1c",
    },
    {
      id: 3,
      text: "What is the primary treatment for an uncomplicated urinary tract infection (UTI) in adults?",
      answers: [
        "Azithromycin",
        "Amoxicillin",
        "Trimethoprim-sulfamethoxazole",
        "Doxycycline",
      ],
      correctAnswer: "Trimethoprim-sulfamethoxazole",
    },
    {
      id: 4,
      text: "Which of the following is a common side effect of ACE inhibitors?",
      answers: ["Hypoglycemia", "Hyperkalemia", "Constipation", "Weight gain"],
      correctAnswer: "Hyperkalemia",
    },
    {
      id: 5,
      text: "What is the recommended first-line medication for hypertension in patients with diabetes?",
      answers: [
        "Calcium channel blockers",
        "ACE inhibitors",
        "Beta-blockers",
        "Diuretics",
      ],
      correctAnswer: "ACE inhibitors",
    },
    {
      id: 6,
      text: "Which vaccine is recommended for all adults over the age of 65?",
      answers: [
        "Influenza vaccine",
        "Pneumococcal vaccine",
        "Hepatitis B vaccine",
        "Shingles vaccine",
      ],
      correctAnswer: "Pneumococcal vaccine",
    },
    {
      id: 7,
      text: "What is the standard treatment for a patient with a confirmed deep vein thrombosis (DVT)?",
      answers: [
        "Oral antibiotics",
        "Warfarin",
        "Ibuprofen",
        "Inhaled corticosteroids",
      ],
      correctAnswer: "Warfarin",
    },
    {
      id: 8,
      text: "Which imaging modality is most appropriate for diagnosing a suspected pulmonary embolism?",
      answers: ["Ultrasound", "Chest X-ray", "CT pulmonary angiography", "MRI"],
      correctAnswer: "CT pulmonary angiography",
    },
    {
      id: 9,
      text: "What is the first-line treatment for major depressive disorder?",
      answers: [
        "Cognitive behavioral therapy",
        "Selective serotonin reuptake inhibitors (SSRIs)",
        "Antipsychotics",
        "Benzodiazepines",
      ],
      correctAnswer: "Selective serotonin reuptake inhibitors (SSRIs)",
    },
    {
      id: 10,
      text: "In patients with chronic obstructive pulmonary disease (COPD), which medication is used to manage symptoms on a daily basis?",
      answers: [
        "Short-acting beta-agonists",
        "Long-acting beta-agonists",
        "Inhaled corticosteroids",
        "Systemic corticosteroids",
      ],
      correctAnswer: "Long-acting beta-agonists",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(7);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const correctSound = new Audio(correctST);
  const incorrectSound = new Audio(failST);

  useEffect(() => {
    if (settings) {
      fetchQuestions();
    }
  }, [settings]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleNextQuestion();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/generate-quize", settings);
      console.log(data);
      setIsLoading(false);
      setQuestions(data);
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

    setTimeout(() => handleNextQuestion(), 1000);
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(7);
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

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeLeft(7);
    } else {
      setSettings(null);
    }
  };

  return (
    <QuizContainer>
      {showConfetti && <Confetti />}
      {!settings ? (
        <QuizSettings isLoading={isLoading} onSettingsSubmit={setSettings} />
      ) : quizFinished ? (
        <QuizResults questions={questions} userAnswers={userAnswers} />
      ) : (
        <>
          <BackButton onClick={handleBack}>
            <FaArrowLeft fill="#ccc" />
          </BackButton>
          <DifficultyLabel difficulty={settings.difficulty}>
            {settings.difficulty.toUpperCase()}
          </DifficultyLabel>
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            timeLeft={timeLeft}
            totalQuestions={questions.length}
            currentQuestionIndex={currentQuestionIndex}
          />
        </>
      )}
    </QuizContainer>
  );
};

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
  max-width: 600px;
  margin: 0 auto;
  color: ${(props) => props.theme.colors.onBackground};
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

const DifficultyLabel = styled.div<{ difficulty: QuestionDifficulty }>`
  padding: ${(props) =>
    `${props.theme.spacing.small} ${props.theme.spacing.medium}`};
  border-radius: 5px;
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSizes.small};
  margin-bottom: ${(props) => props.theme.spacing.large};
  background-color: ${(props) =>
    props.difficulty === "easy"
      ? props.theme.colors.secondary
      : props.difficulty === "medium"
      ? props.theme.colors.primary
      : props.theme.colors.error};
  color: ${(props) => props.theme.colors.onSecondary};
`;

const QuizSettings: React.FC<{
  isLoading: boolean;
  onSettingsSubmit: (settings: TQuizSettings) => void;
}> = ({ isLoading, onSettingsSubmit }) => {
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [field, setField] = useState<Field>("physiology");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    !isLoading && onSettingsSubmit({ difficulty, numberOfQuestions, field });
  };
  useEffect(() => {
    mirage.register();
  }, []);
const navigate = useNavigate()
  return (
    <SettingsForm onSubmit={handleSubmit}>
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft fill="#ccc" />
      </BackButton>
      <h3
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <FiSettings /> Quiz Settings
      </h3>
      <SettingsGrid>
        <SettingsItem>
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as QuestionDifficulty)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </SettingsItem>
        <SettingsItem>
          <label>Number of Questions:</label>
          <input
            type="number"
            min="1"
            max="50"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
          />
        </SettingsItem>
        <SettingsItem>
          <label>Field:</label>
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
        </SettingsItem>
      </SettingsGrid>
      <Button type="submit">
        {" "}
        {isLoading ? (
          <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
        ) : (
          "Start Quiz"
        )}
      </Button>
    </SettingsForm>
  );
};

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 10px;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.medium};
`;

const SettingsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.small};

  label {
    font-weight: bold;
    color: ${(props) => props.theme.colors.onSurface};
  }

  select,
  input {
    padding: ${(props) => props.theme.spacing.small};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.onBackground};
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 10px;
  }
`;

const QuestionCard: React.FC<{
  question: Question;
  onAnswerSelect: (answer: string) => void;
  timeLeft: number;
  totalQuestions: number;
  currentQuestionIndex: number;
}> = ({
  question,
  onAnswerSelect,
  timeLeft,
  totalQuestions,
  currentQuestionIndex,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswerSelect(answer);
  };

  return (
    <animated.div style={fadeIn}>
      {question?.text && (
        <Card>
          <QuestionHeader>
            <h4>
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </h4>
            <Timer>
              <FiClock />
              <span>{timeLeft}s</span>
            </Timer>
          </QuestionHeader>
          <QuestionText>{question?.text}</QuestionText>
          <AnswerList>
            {question?.answers.map((answer, index) => (
              <AnswerButton
                key={index}
                onClick={() => handleAnswer(answer)}
                isAnswer={selectedAnswer === answer}
                isCorrect={
                  selectedAnswer === answer && answer === question.correctAnswer
                }
              >
                {answer || "N/A"}
              </AnswerButton>
            ))}
          </AnswerList>
        </Card>
      )}
    </animated.div>
  );
};

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.medium};

  h3 {
    font-size: ${(props) => props.theme.fontSizes.large};
    color: ${(props) => props.theme.colors.onSurface};
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.fontSizes.medium};
  color: ${(props) => props.theme.colors.primary};
  animation: beat 1s infinite;

  svg {
    margin-right: ${(props) => props.theme.spacing.small};
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
  font-size: ${(props) => props.theme.fontSizes.small};
  margin-bottom: ${(props) => props.theme.spacing.large};
  min-width:100%;
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.small};
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(10px); }
  50% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

const AnswerButton = styled.button<{ isAnswer: boolean; isCorrect: boolean }>`
  background: ${(props) =>
    props.isAnswer
      ? props.isCorrect
        ? props.theme.colors.success
        : props.theme.colors.error
      : props.theme.colors.primary};
  color: ${(props) =>
    props.isCorrect
      ? props.theme.colors.onSurface
      : props.theme.colors.onPrimary};
  padding: ${(props) => props.theme.spacing.small};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSizes.small};
  transition: background-color 0.1s ease;

  animation: ${(props) => props.isAnswer && !props.isCorrect && shake} 0.5s;
`;

const QuizResults: React.FC<{
  questions: Question[];
  userAnswers: (string | null)[];
}> = ({ questions, userAnswers }) => {
  const correctAnswersCount = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;

  const [expanded, setExpanded] = useState(false);

  const expandProps = useSpring({
    maxHeight: expanded ? "500px" : "0px",
    opacity: expanded ? 1 : 0,
    config: { duration: 300 },
  });

  const questionsToShow = expanded ? questions : questions.slice(0, 2);

  return (
    <ResultsContainer>
      {correctAnswersCount > questions.length / 2 && <Confetti />}
      <CongratsMessage>
        {correctAnswersCount >= questions.length / 2 ? (
          <>
            🎉 Congratulations!
            <FiThumbsUp />
          </>
        ) : (
          <>
            😔 Try again next time! <FiThumbsDown />
          </>
        )}
      </CongratsMessage>
      <p>
        You answered {correctAnswersCount} out of {questions.length} questions
        correctly!
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
          {expanded ? "Hide" : "Read More"}
        </ExpandButton>
      )}
      {expanded && (
        <animated.div style={expandProps}>
          <ResultsList>
            {questions.slice(2).map((question, index) => (
              <ResultItem
                key={index + 2}
                isCorrect={userAnswers[index + 2] === question.correctAnswer}
              >
                <QuestionText>{question.text}</QuestionText>
                <AnswerText>Your answer: {userAnswers[index + 2]}</AnswerText>
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
  );
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  border-radius: 10px;
  width: 100%;
  position: relative;
  overflow: hidden;

  p {
    font-size: 13px;
  }
`;

const CongratsMessage = styled.h2`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${(props) => props.theme.fontSizes.large};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

const ResultItem = styled.div<{ isCorrect: boolean }>`
  background-color: ${(props) =>
    props.isCorrect ? props.theme.colors.success : props.theme.colors.error};
  color: ${(props) => props.theme.colors.onSurface};
  padding: ${(props) => props.theme.spacing.medium};
  margin: 5px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AnswerText = styled.p`
  margin-top: ${(props) => props.theme.spacing.small};
`;

const CorrectAnswerText = styled.p`
  margin-top: ${(props) => props.theme.spacing.small};
  font-weight: bold;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
  border: none;
  border-radius: 18px;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSizes.small};
  margin-top: ${(props) => props.theme.spacing.large};

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.onSurface};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  font-size: ${(props) => props.theme.fontSizes.small};
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.spacing.medium};
`;

export default Quiz;
