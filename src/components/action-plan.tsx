import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

export function ActionPlan({ userEmail }: { userEmail: string }) {
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  const userData = typedQuizHistory[userEmail]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"].last_quiz;

  const conceptualErrors = userData.questions.filter(q => q.error_type === "conceptual");
  const proceduralErrors = userData.questions.filter(q => q.error_type === "procedural");
  
  const totalErrors = conceptualErrors.length + proceduralErrors.length;
  const conceptualRatio = totalErrors > 0 ? (conceptualErrors.length / totalErrors) * 100 : 0;
  const proceduralRatio = totalErrors > 0 ? (proceduralErrors.length / totalErrors) * 100 : 0;

  const primaryErrorType = conceptualRatio >= proceduralRatio ? "Conceptual" : "Procedural";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Personalized Action Plan <ShieldAlert className="w-8 h-8 text-primary" />
          </h2>
          <p className="text-muted-foreground mt-1">Strategic steps to eliminate recurring error patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Error Pattern Analysis
            </CardTitle>
            <CardDescription>Breakdown of errors encountered in the last quiz session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-red-500" /> Conceptual Errors
                  </span>
                  <span>{conceptualRatio.toFixed(0)}%</span>
                </div>
                <Progress value={conceptualRatio} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" /> Procedural Errors
                  </span>
                  <span>{proceduralRatio.toFixed(0)}%</span>
                </div>
                <Progress value={proceduralRatio} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" /> 
                Root Cause: {primaryErrorType} Dominance
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {primaryErrorType === "Conceptual" 
                  ? "Your errors stem from a misunderstanding of the underlying physics principles. You are likely applying formulas in contexts where they don't apply, or misinterpreting the physical constraints of the problem."
                  : "Your conceptual logic is sound, but you are losing marks due to mathematical slips, sign convention errors, or unit conversion mistakes. Your focus should be on 'clean' working."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Questions</span>
              <span className="font-bold">{userData.questions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Accuracy</span>
              <span className="font-bold text-green-600">
                {((userData.questions.filter(q => q.error_type === "none").length / userData.questions.length) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg. Weightage</span>
              <span className="font-bold">
                {(userData.questions.reduce((acc, q) => acc + q.weightage, 0) / userData.questions.length).toFixed(3)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2">
              <RefreshCw className="w-4 h-4" /> Re-take Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h3 className="text-xl font-bold mt-8">Strategic Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Conceptual Remediation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                <span><strong>First Principles:</strong> Don't start with formulas. Draw a Free Body Diagram (FBD) or a vector map first.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                <span><strong>Nuance Check:</strong> Re-read the section on "Vector Components" in the Reading Material. You are confusing Sine and Cosine projections.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Procedural Precision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span><strong>Unit Consistency:</strong> Always convert to SI units (m, s, kg) before plugging numbers into kinematic equations.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span><strong>Step-by-Step:</strong> Write down each algebraic step. Skipping steps is where 80% of your procedural errors occur.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Brain, RefreshCw } from "lucide-react";
