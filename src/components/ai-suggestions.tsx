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
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAISuggestions } from "@/src/services/geminiService";
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

export function AISuggestions({ 
  userEmail,
  userDags,
  quizHistory,
  cache,
  onCacheUpdate
}: { 
  userEmail: string;
  userDags: any;
  quizHistory: any;
  cache: Record<string, any>;
  onCacheUpdate: (report: any) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  const userData = typedQuizHistory[userEmail]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"].last_quiz;
  
  const report = cache[userData.quiz_id] || null;

  const currentQuizPayload = {
    quiz_id: userData.quiz_id,
    timestamp: userData.timestamp,
    questions: userData.questions.map(q => ({
      question_id: q.question_id,
      answer_type: q.answer_type,
      error_type: q.error_type,
      weightage: q.weightage,
      topic: q.topic
    }))
  };

  const fetchSuggestions = async () => {
    // If we already have a report for this quiz, don't regenerate unless explicitly requested (handled by handleRefresh)
    if (cache[userData.quiz_id]) return;

    setIsGenerating(true);
    try {
      const data = await generateAISuggestions(currentQuizPayload);
      if (data) {
        onCacheUpdate(data);
      }
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [userEmail, quizHistory, userData.quiz_id]);

  const handleRefresh = async () => {
    setIsGenerating(true);
    try {
      const data = await generateAISuggestions(currentQuizPayload);
      if (data) {
        onCacheUpdate(data);
      }
    } catch (error) {
      console.error("Failed to refresh AI suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            AI Diagnostic Report <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
          </h2>
          <p className="text-muted-foreground mt-1">Deep analysis of your latest performance and knowledge state.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:bg-primary/5"
          onClick={handleRefresh}
          disabled={isGenerating}
        >
          <RefreshCcw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          Regenerate Report
        </Button>
      </div>

      {isGenerating && !report ? (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Analyzing quiz data and generating insights...</p>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Summary */}
          <Card className="lg:col-span-2 border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/90">
                {report.performance_summary}
              </p>
            </CardContent>
          </Card>

          {/* Confidence Score */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Confidence Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Rating:</span>
                <Badge className={cn(
                  "font-bold px-3 py-1",
                  report.confidence_score.rating === "High" ? "bg-green-500" : 
                  report.confidence_score.rating === "Medium" ? "bg-yellow-500" : "bg-red-500"
                )}>
                  {report.confidence_score.rating}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{report.confidence_score.explanation}"
              </p>
            </CardContent>
          </Card>

          {/* Immediate Priority */}
          <Card className="border-red-500/20 bg-red-500/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Immediate Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h4 className="font-bold text-xl text-red-700">{report.immediate_priority.topic}</h4>
              <p className="text-sm text-red-600/80 leading-relaxed">
                {report.immediate_priority.reason}
              </p>
              <Button variant="destructive" className="w-full mt-2" onClick={() => window.location.hash = "#reading"}>
                Fix This Now
              </Button>
            </CardContent>
          </Card>

          {/* Error Patterns */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Error Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.error_patterns.map((pattern, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                    <h5 className="font-bold text-sm text-primary">{pattern.topic}</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pattern.analysis}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">About the Suggest Agent</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This report is generated by the <strong>Suggest Agent</strong>, which analyzes your raw quiz payload to identify subtle patterns in your learning journey.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
