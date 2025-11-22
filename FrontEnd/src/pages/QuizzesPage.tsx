import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Play } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: number;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status?: 'not_started' | 'in_progress' | 'completed';
}

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    // Load demo quizzes (replace with API call in production)
    setAvailableQuizzes([
      {
        id: "quiz-1",
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics",
        timeLimit: 30,
        questions: 20,
        subject: "Programming",
        difficulty: "Easy",
        status: "not_started"
      },
      {
        id: "quiz-2",
        title: "React Components",
        description: "Understanding React component lifecycle",
        timeLimit: 45,
        questions: 25,
        subject: "Programming",
        difficulty: "Medium",
        status: "not_started"
      },
      {
        id: "quiz-3",
        title: "TypeScript Advanced",
        description: "Advanced concepts in TypeScript",
        timeLimit: 60,
        questions: 30,
        subject: "Programming",
        difficulty: "Hard",
        status: "not_started"
      }
    ]);

    // Load stats from localStorage
    const stats = localStorage.getItem('quizStats');
    if (stats) {
      const { completed, average } = JSON.parse(stats);
      setCompletedQuizzes(completed);
      setAverageScore(average);
    }
  }, []);

  const handleStartQuiz = (quizId: string) => {
    const quiz = availableQuizzes.find(q => q.id === quizId);
    if (quiz) {
      localStorage.setItem('currentQuiz', JSON.stringify(quiz));
      navigate(`/quiz/${quizId}`);
    }
  };

  const filteredQuizzes = availableQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-card/50 p-6 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Available Quizzes
              </h2>
              <p className="text-muted-foreground">Take practice quizzes to test your knowledge</p>
            </div>
            <Button 
              onClick={() => navigate("/student-dashboard")} 
              variant="outline"
              size="sm"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-card">
            <CardContent className="p-4">
              <input
                type="text"
                placeholder="Search quizzes by title or subject..."
                className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FileQuestion className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {quiz.title}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📝 {quiz.questions} questions</span>
                      <span>⏱️ {quiz.timeLimit} mins</span>
                      <span>📚 {quiz.subject}</span>
                    </div>
                    <Button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Card */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Quizzes</span>
                <span className="text-2xl font-bold text-primary">{availableQuizzes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold text-accent">{completedQuizzes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="text-2xl font-bold text-primary">{averageScore}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}