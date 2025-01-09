import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const QuizPage = ({ route, navigation }) => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (route.params && route.params.questions) {
      setQuizData(route.params);
    } else {
      console.log("No quiz data received via params");
    }
    setLoading(false);
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz data available.</Text>
      </View>
    );
  }

  const { questions } = quizData;

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: questions[currentQuestionIndex].options[selectedOption],
        correctAnswer: questions[currentQuestionIndex].options[questions[currentQuestionIndex].answer],
        isCorrect: selectedOption === questions[currentQuestionIndex].answer,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Quiz Finished!</Text>
        <Text style={styles.resultText}>Your Score: {score}/{questions.length}</Text>

        <View style={styles.resultContainer}>
          {answers.map((answer, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultQuestion}>Q{index + 1}: {answer.question}</Text>
              <Text style={answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                Your Answer: {answer.selectedAnswer} {answer.isCorrect ? "(Correct)" : "(Incorrect)"}
              </Text>
              <Text style={styles.correctAnswer}>Correct Answer: {answer.correctAnswer}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("CourseContent")}
        >
          <Text style={styles.nextButtonText}>Back to Content</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
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
    backgroundColor: '#0E0325',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingText: {
    color: 'lightgrey',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: 'lightgrey',
    fontSize: 18,
    textAlign: 'center',
  },
  questionText: {

    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
        backgroundColor: '#0E0325',
        padding: 20,
        borderRadius: 20,
        shadowColor: 'white',
           shadowOffset: { width: 4, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
  },
  selectedOption: {
    backgroundColor: '#7979B2',
    borderColor: '#0E0325',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 20,
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#7979B2',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 12,
    backgroundColor: '#0E0325',
    padding: 10,
    borderRadius: 25,
    shadowColor: 'white',
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
  },
  resultQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  correctAnswer: {
    color: '#4CAF50',
    fontSize: 16,
  },
  incorrectAnswer: {
    color: '#F44336',
    fontSize: 16,
  },
});

export default QuizPage;
