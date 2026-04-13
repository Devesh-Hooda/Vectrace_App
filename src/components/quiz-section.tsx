import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ClipboardCheck, 
  AlertCircle, 
  Play, 
  Clock, 
  Target, 
  Trophy,
  Info,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import quizData from "@/src/data/quiz-questions.json";

export function QuizSection({ onViewInsights }: { onViewInsights: () => void }) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [shuffledQuestions, setShuffledQuestions] = useState(quizData.questions);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  const questions = shuffledQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  // Helper to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    // Shuffle options for each question
    const newShuffledQuestions = quizData.questions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    
    setShuffledQuestions(newShuffledQuestions);
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(1200);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNextQuestion = () => {
    if (selectedOptionId) {
      setAnswers({ ...answers, [currentQuestion.id]: selectedOptionId });
      setSelectedOptionId(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const userAnswerId = answers[q.id];
      const correctOption = q.options.find(opt => opt.type === "correct");
      if (userAnswerId === correctOption?.id) {
        correctCount++;
      }
    });
    return {
      score: Math.round((correctCount / questions.length) * 100),
      correct: correctCount,
      total: questions.length
    };
  };

  if (quizCompleted) {
    const { score, correct, total } = calculateScore();
    const passed = score >= 70;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-8"
      >
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className={`h-2 w-full ${passed ? "bg-green-500" : "bg-red-500"}`} />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              {passed ? (
                <Trophy className="w-10 h-10 text-yellow-500" />
              ) : (
                <Brain className="w-10 h-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
            <CardDescription className="text-lg">
              {passed ? "Excellent work! You've mastered these concepts." : "Keep practicing! You're getting there."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-1">Your Score</p>
                <p className={`text-4xl font-black ${passed ? "text-green-500" : "text-primary"}`}>{score}%</p>
              </div>
              <div className="p-6 rounded-2xl bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-1">Accuracy</p>
                <p className="text-4xl font-black text-foreground">{correct}/{total}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Passing Requirement</span>
                <span>70%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Next Steps
              </h4>
              <p className="text-sm text-muted-foreground">
                Head over to the <strong>AI Suggestions</strong> tab to see a detailed breakdown of your performance and get a personalized study plan.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 p-8 bg-muted/20">
            <Button variant="outline" className="flex-1 gap-2" onClick={() => {
              setQuizStarted(false);
              setQuizCompleted(false);
              setHasAcceptedTerms(false);
            }}>
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button className="flex-1 gap-2" onClick={onViewInsights}>
              View AI Insights
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (quizStarted) {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <Card className="px-4 py-2 border-primary/20 bg-primary/5 flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
          </Card>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {currentQuestion.concept_id.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-2xl leading-tight">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all hover:bg-muted/50",
                  selectedOptionId === option.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-transparent bg-muted/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                    selectedOptionId === option.id ? "bg-primary text-primary-foreground" : "bg-background border"
                  )}>
                    {option.id}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
                {selectedOptionId === option.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </CardContent>
          <CardFooter className="justify-between border-t bg-muted/10 p-6">
            <p className="text-xs text-muted-foreground italic">
              Tip: Read all options carefully before selecting.
            </p>
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedOptionId}
              className="px-8 font-bold gap-2"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kinematics Quiz</h2>
          <p className="text-muted-foreground mt-1">Test your knowledge on motion, vectors, and equations.</p>
        </div>
        <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/20 px-3 py-1">
          Level: Intermediate
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Instructions Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                Quiz Instructions
              </CardTitle>
              <CardDescription>Please read the following carefully before starting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Time Limit</p>
                    <p className="text-xs text-muted-foreground">20 minutes for {questions.length} questions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Target className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Passing Score</p>
                    <p className="text-xs text-muted-foreground">Minimum 70% to earn XP.</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Rules & Guidelines
                </h4>
                <ul className="space-y-2">
                  {[
                    "Each question has only one correct answer.",
                    "You cannot go back to previous questions once submitted.",
                    "Ensure a stable internet connection before starting.",
                    "The timer starts immediately after clicking 'Start Quiz'.",
                    "Closing the tab will result in automatic submission."
                  ].map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-3 mt-6">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-700 leading-relaxed">
                  <strong>Note:</strong> This quiz covers all subtopics of Kinematics including 2D Motion and Graphs. Make sure you have reviewed the Reading Material.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 bg-muted/20 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={hasAcceptedTerms}
                  onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I have read the instructions and am ready to start the quiz.
                </label>
              </div>
              <Button 
                className="w-full sm:w-auto px-8 font-bold gap-2" 
                disabled={!hasAcceptedTerms}
                onClick={handleStartQuiz}
              >
                <Play className="w-4 h-4 fill-current" />
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Stats/Info Column */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Previous Best</span>
                <span className="text-sm font-bold">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attempts</span>
                <span className="text-sm font-bold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="text-sm font-bold">72%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Trophy className="w-24 h-24 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete this quiz with a score above 90% to unlock the <strong>"Kinematics Expert"</strong> badge and earn 500 bonus XP.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
