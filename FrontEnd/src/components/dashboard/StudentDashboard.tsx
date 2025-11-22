import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, FileQuestion, Award, User, LogOut, Play } from "lucide-react";
import { toast } from "sonner";

// Enhanced Quiz interface
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

// Demo quizzes data
const demoQuizzes: Quiz[] = [
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
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>(demoQuizzes);
  const [completedQuizzes, setCompletedQuizzes] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load quiz statistics from localStorage
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
      // Store current quiz in localStorage
      localStorage.setItem('currentQuiz', JSON.stringify(quiz));
      navigate(`/quiz/${quizId}`);
    }
  };

  const filteredQuizzes = availableQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  QuizCard component
  const QuizCard = () => (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileQuestion className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Available Quizzes</CardTitle>
            <CardDescription>Take practice quizzes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Access all available quizzes and test your knowledge in various subjects.
          </p>
          {/* Quick preview of available quizzes count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Total Quizzes:</span>
            <span className="font-medium text-primary">{availableQuizzes.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>Subjects:</span>
            <span className="font-medium text-primary">Programming</span>
          </div>
          <Button 
            onClick={() => navigate("/quizzes")} 
            variant="gradient" 
            className="w-full"
          >
            View All Quizzes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Quick Stats card
  const StatsCard = () => (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
      <CardHeader>
        <CardTitle>Quiz Statistics</CardTitle>
        <CardDescription>Your testing progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Quizzes</span>
          <span className="text-2xl font-bold text-primary">{availableQuizzes.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completed Quizzes</span>
          <span className="text-2xl font-bold text-accent">{completedQuizzes}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Average Score</span>
          <span className="text-2xl font-bold text-primary">{averageScore}%</span>
        </div>
      </CardContent>
    </Card>
  );

  const handleLogout = () => {
    // Remove auth and app data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentQuiz");
    localStorage.removeItem("quizStats");
    // remove any other app-specific keys if present
    sessionStorage.removeItem("redirectUrl");

    // Show toast then navigate
    toast.success("Logged out successfully", { duration: 2000, position: "top-right" });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-card/50 p-6 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Dashboard
              </h2>
              <p className="text-muted-foreground">Access your courses and quizzes</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quiz Card */}
            <QuizCard />

            {/* Find Teachers Card */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Find Teachers</CardTitle>
                    <CardDescription>Search and connect</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Search for teachers by email or name and send connection requests.
                </p>
                <Button onClick={() => navigate("/find-teachers")} variant="gradient" className="w-full">Search Teachers</Button>
              </CardContent>
            </Card>

            {/* My Courses Card */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Enrolled courses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View all courses you're enrolled in and track your progress.
                </p>
                <Button variant="outline" className="w-full">View Courses</Button>
              </CardContent>
            </Card>

            {/* My Results Card */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>My Results</CardTitle>
                    <CardDescription>Quiz performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your quiz scores, progress, and detailed performance reports.
                </p>
                <Button variant="outline" className="w-full">View Results</Button>
              </CardContent>
            </Card>

            {/* My Teachers Card */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>My Teachers</CardTitle>
                    <CardDescription>Connected teachers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View all teachers you're connected with and manage connections.
                </p>
                <Button variant="outline" className="w-full">View Teachers</Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <StatsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
