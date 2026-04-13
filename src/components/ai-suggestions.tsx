import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Target,
  Brain,
  RefreshCcw,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import quizHistory from "../data/quiz-history.json";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question_id: string;
  text: string;
  answer_type: string;
  user_answer: string;
  correct_answer: string;
  error_type: "conceptual" | "procedural" | "none";
  weightage: number;
  topic: string;
}

interface QuizData {
  quiz_id: string;
  timestamp: string;
  questions: QuizQuestion[];
}

export function AISuggestions({ userEmail }: { userEmail: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  const userData = typedQuizHistory[userEmail]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"].last_quiz;

  useEffect(() => {
    // Auto-refresh once on mount
    setIsGenerating(true);
    const timer = setTimeout(() => setIsGenerating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const conceptualErrors = userData.questions.filter(q => q.error_type === "conceptual");
  const proceduralErrors = userData.questions.filter(q => q.error_type === "procedural");

  const suggestions = [
    {
      id: "1",
      type: "concept_fix",
      title: conceptualErrors.length > 0 ? `Fix ${conceptualErrors.length} Conceptual Gaps` : "Concept Mastery",
      description: conceptualErrors.length > 0 
        ? `You have more conceptual errors than others in topics like ${[...new Set(conceptualErrors.map(q => q.topic.replace('_', ' ')))].join(', ')}. Focus on the fundamental laws before proceeding.`
        : "Your conceptual understanding is solid. Focus on speed and precision now.",
      action: "Review Fundamentals",
      icon: <Target className="w-5 h-5 text-red-500" />,
      priority: conceptualErrors.length > 0 ? "High" : "Low",
      color: conceptualErrors.length > 0 ? "border-red-500/20 bg-red-500/5" : "border-green-500/20 bg-green-500/5"
    },
    {
      id: "2",
      type: "practice_recommendation",
      title: proceduralErrors.length > 0 ? "Procedural Accuracy" : "Advanced Practice",
      description: proceduralErrors.length > 0
        ? `You're making ${proceduralErrors.length} calculation errors. Your logic is correct, but your implementation needs more drill practice.`
        : "You're ready for JEE Advanced level multi-concept problems. Try the mixed-topic challenge.",
      action: "Start Drills",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      priority: proceduralErrors.length > 0 ? "Medium" : "Low",
      color: proceduralErrors.length > 0 ? "border-yellow-500/20 bg-yellow-500/5" : "border-blue-500/20 bg-blue-500/5"
    },
    {
      id: "3",
      type: "reading_material",
      title: "Recommended Resources",
      description: conceptualErrors.length > 0 
        ? `Based on your struggle with ${conceptualErrors[0].topic.replace('_', ' ')}, we recommend the 'Advanced Vector Analysis' guide.`
        : "Explore our curated list of JEE Advanced previous year questions for Kinematics.",
      action: "Read Material",
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      priority: "Medium",
      color: "border-blue-500/20 bg-blue-500/5"
    }
  ];

  const handleRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            AI Study Insights <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
          </h2>
          <p className="text-muted-foreground mt-1">Personalized recommendations based on your latest quiz performance.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:bg-primary/5"
          onClick={handleRefresh}
          disabled={isGenerating}
        >
          <RefreshCcw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          Refresh Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("h-full border-2 transition-all hover:shadow-md", suggestion.color)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-background shadow-sm">
                    {suggestion.icon}
                  </div>
                  <Badge variant="outline" className="bg-background/50">
                    {suggestion.priority} Priority
                  </Badge>
                </div>
                <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {suggestion.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full group font-bold" variant="secondary">
                  {suggestion.action}
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">How it works</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Our AI agent analyzes your quiz JSON output, looking at <strong>concept_id</strong>, <strong>error types</strong>, and <strong>weights</strong> to determine exactly where your knowledge gaps are.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge variant="secondary">Conceptual Analysis</Badge>
            <Badge variant="secondary">Procedural Error Tracking</Badge>
            <Badge variant="secondary">Prerequisite Mapping</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
