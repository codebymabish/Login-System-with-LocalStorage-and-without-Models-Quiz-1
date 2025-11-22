import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, AlertCircle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Demo questions for each quiz
const demoQuestions: { [key: string]: Question[] } = {
  "quiz-1": [
    {
      id: 1,
      text: "What is JavaScript?",
      options: [
        "A programming language",
        "A markup language",
        "A styling language",
        "A database"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: "Which keyword is used to declare variables in JavaScript?",
      options: ["var", "let", "const", "All of the above"],
      correctAnswer: 3
    }
    // Add more questions as needed
  ],
  // Add questions for other quizzes
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Load quiz from localStorage
    const quizData = localStorage.getItem('currentQuiz');
    if (quizData) {
      const quiz = JSON.parse(quizData);
      setCurrentQuiz(quiz);
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      
      // Load demo questions for this quiz
      if (demoQuestions[quiz.id]) {
        setQuestions(demoQuestions[quiz.id]);
      }
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    // Calculate score
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    
    // Update localStorage stats
    const statsString = localStorage.getItem('quizStats');
    const stats = statsString ? JSON.parse(statsString) : { completed: 0, average: 0 };
    const newStats = {
      completed: stats.completed + 1,
      average: Math.round((stats.average * stats.completed + score) / (stats.completed + 1))
    };
    localStorage.setItem('quizStats', JSON.stringify(newStats));
    
    setQuizCompleted(true);
    alert(`Quiz completed! Your score: ${score}%`);
    navigate('/student-dashboard');
  };

  if (!currentQuiz || questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 ">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{currentQuiz.title}</CardTitle>
                <CardDescription>{currentQuiz.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Timer className="h-5 w-5" />
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress indicator */}
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <p>{questions[currentQuestion].text}</p>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      answers[questions[currentQuestion].id] === index
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/20 hover:border-primary/50'
                    }`}
                    onClick={() => handleAnswer(questions[currentQuestion].id, index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={submitQuiz} variant="gradient">
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  variant="gradient"
                >
                  Next Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}