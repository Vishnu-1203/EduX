// E:\Blockchain project\EduX\src\screens/QuizPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from "react-native";
import auth from '@react-native-firebase/auth';
import { recordQuizAttempt, hasQuizBeenAttempted } from "../../utils/rewardfunctions";

const QuizPage = ({ route, navigation }) => {
  // Expecting questions, courseId, and quizId to be passed via route.params
  const { questions, courseId, quizId } = route.params;
  console.log(route.params, "quiz page route.params");
  
  // Use a ref to keep track of score synchronously
  const scoreRef = useRef(0);
  const [quizData] = useState({ questions });
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0); // For UI display
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [rewardGiven, setRewardGiven] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    if (!quizFinished && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !quizFinished) {
      Alert.alert("Time's up!", "The quiz time has expired.");
      finishQuiz(scoreRef.current);
    }
  }, [timeLeft, quizFinished]);

  // Option selection handler
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  // Proceed to next question or finish the quiz
  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    if (isCorrect) {
      scoreRef.current += 1;
    }
    
    // Record answer details
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {
        question: currentQuestion.question,
        selectedAnswer: currentQuestion.options[selectedOption],
        correctAnswer: currentQuestion.options[currentQuestion.answer],
        isCorrect: isCorrect,
      },
    ]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setScore(scoreRef.current);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
    } else {
      setScore(scoreRef.current);
      finishQuiz(scoreRef.current);
    }
  };

  // Finish quiz and record attempt in Firestore using the computed final score
  const finishQuiz = async (finalScore) => {
    setQuizFinished(true);
    console.log("Final score to record:", finalScore);
    const userId = auth().currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
    
    const alreadyAttempted = await hasQuizBeenAttempted(userId, courseId, quizId);
    if (!alreadyAttempted && !rewardGiven) {
      const recorded = await recordQuizAttempt(userId, courseId, quizId, finalScore);
      if (recorded) {
        console.log("Quiz attempt recorded successfully with score:", finalScore);
        Alert.alert("Quiz Completed", "Your reward has been recorded!");
      } else {
        console.error("Error recording quiz attempt.");
        Alert.alert("Error", "There was an error recording your quiz attempt.");
      }
      setRewardGiven(true);
    } else {
      Alert.alert("Quiz Already Attempted", "You have already attempted this quiz.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (!quizData || !questions) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz data available.</Text>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.finishedContentContainer}
      >
        <Text style={styles.resultText}>
          Quiz Finished! Your Score: {score}/{questions.length}
        </Text>
        {answers.map((answer, index) => (
          <View key={index} style={styles.resultItem}>
            <Text style={styles.resultQuestion}>
              Q{index + 1}: {answer.question}
            </Text>
            <Text style={answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
              Your Answer: {answer.selectedAnswer} {answer.isCorrect ? "(Correct)" : "(Incorrect)"}
            </Text>
            <Text style={styles.correctAnswer}>
              Correct Answer: {answer.correctAnswer}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("CourseContent", { courseId })}
        >
          <Text style={styles.nextButtonText}>Back to Content</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time Left: {timeLeft} sec</Text>
      <Text style={styles.questionText}>
        Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
      </Text>

      <View style={styles.optionsContainer}>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedOption === null && styles.disabledButton,
        ]}
        onPress={handleNextQuestion}
        disabled={selectedOption === null}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0325",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#0E0325",
    padding: 20,
  },
  finishedContentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  timerText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingText: {
    color: "lightgrey",
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    color: "lightgrey",
    fontSize: 18,
    textAlign: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
    backgroundColor: "#0E0325",
    padding: 20,
    borderRadius: 20,
    shadowColor: "white",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedOption: {
    backgroundColor: "#7979B2",
    borderColor: "#0E0325",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 20,
    color: "#fff",
  },
  nextButton: {
    backgroundColor: "#7979B2",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
    backgroundColor: "#0E0325",
    padding: 10,
    borderRadius: 25,
    shadowColor: "white",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  resultQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  correctAnswer: {
    color: "#4CAF50",
    fontSize: 16,
  },
  incorrectAnswer: {
    color: "#F44336",
    fontSize: 16,
  },
});

export default QuizPage;
