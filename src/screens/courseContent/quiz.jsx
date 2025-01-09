import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const QuizPage = ({ route, navigation }) => {
  const [quizData, setQuizData] = useState(null); // State for quiz data
  const [loading, setLoading] = useState(false); // Loading state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedOption, setSelectedOption] = useState(null); // Track selected answer
  const [score, setScore] = useState(0); // Track the user's score
  const [answers, setAnswers] = useState([]); // Track answers and correctness
  const [quizFinished, setQuizFinished] = useState(false); // Track if the quiz is finished
    
  useEffect(() => {
    if (route.params && route.params.questions) {
      setQuizData(route.params); // Directly use quiz data passed in params
    } else {
      console.log("No quiz data received via params");
    }
    setLoading(false); // End loading
  }, [route.params]);

  // Show loading indicator while quizData is being processed (optional)
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  // Ensure quizData is available before proceeding
  if (!quizData) {
    return (
      <View style={styles.container}>
        <Text>No quiz data available.</Text>
      </View>
    );
  }

  const { questions } = quizData; // Extract quiz questions

  // Handle option selection
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  // Handle "Next" button press
  const handleNextQuestion = () => {
    // Check answer and update score
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    // Save the selected answer and whether it was correct
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: questions[currentQuestionIndex].options[selectedOption],
        correctAnswer: questions[currentQuestionIndex].options[questions[currentQuestionIndex].answer],
        isCorrect: selectedOption === questions[currentQuestionIndex].answer,
      },
    ]);

    // Move to the next question or end the quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for the new question
    } else {
      // End the quiz and trigger the results page
      setQuizFinished(true);
    }
  };

  // Show results page after quiz completion
  if (quizFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Quiz Finished!</Text>
        <Text style={styles.resultText}>Your Score: {score}/{questions.length}</Text>

        <View style={styles.resultContainer}>
          {answers.map((answer, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultQuestion}>{`Q${index + 1}: ${answer.question}`}</Text>
              <Text style={answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                {`Your Answer: ${answer.selectedAnswer} ${answer.isCorrect ? "(Correct)" : "(Incorrect)"}`}
              </Text>
              <Text style={styles.correctAnswer}>{`Correct Answer: ${answer.correctAnswer}`}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("CourseContent")} // Navigate back to the content page
        >
          <Text style={styles.nextButtonText}>Back to Content</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`}
      </Text>

      <View style={styles.optionsContainer}>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedOption === index && styles.selectedOption]}
            onPress={() => handleOptionSelect(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, selectedOption === null && styles.disabledButton]}
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
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  optionButton: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#d1e7dd", // Highlight color for selected option
    borderColor: "#0f5132",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultQuestion: {
    fontSize: 18,
    fontWeight: "bold",
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
