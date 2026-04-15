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
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ClipboardList
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  generateAISuggestions, 
  generateActionTasks, 
  generateEngagementMessage 
} from "@/src/services/geminiService";
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
  const [activeAgent, setActiveAgent] = useState<number>(0);
  
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  const userData = typedQuizHistory[userEmail]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"]?.last_quiz;
  
  const masState = userData ? (cache[userData.quiz_id] || null) : null;

  const currentQuizPayload = userData ? {
    quiz_id: userData.quiz_id,
    timestamp: userData.timestamp,
    questions: userData.questions?.map(q => ({
      question_id: q.question_id,
      answer_type: q.answer_type,
      error_type: q.error_type,
      weightage: q.weightage,
      topic: q.topic
    })) || []
  } : null;

  const runMASFlow = async () => {
    if (!userData || !currentQuizPayload || cache[userData.quiz_id]) return;

    setIsGenerating(true);
    setActiveAgent(1); // Diagnostician
    
    try {
      // Step 1: Diagnostician (Agent 2)
      const diagnosticReport = await generateAISuggestions(currentQuizPayload);
      if (!diagnosticReport) throw new Error("Diagnostician failed");
      
      setActiveAgent(2); // Content Creator
      
      // Step 2: Content Creator (Agent 3)
      const targetTopic = diagnosticReport.immediate_priority.topic;
      const errorPattern = diagnosticReport.error_patterns.find((p: any) => p.topic === targetTopic)?.analysis || "General weakness";
      const currentMastery = (userDags[userEmail]?.graph_state as any)[targetTopic]?.mastery || 0.5;
      
      const actionTasks = await generateActionTasks(targetTopic, errorPattern, currentMastery);
      
      setActiveAgent(3); // Motivator
      
      // Step 3: Motivator (Agent 4)
      // Mocking trend for now
      const trend = [0.45, 0.48, 0.52]; 
      const engagement = await generateEngagementMessage(trend, diagnosticReport.performance_summary);
      
      const fullMASPayload = {
        ...diagnosticReport,
        action_tasks: actionTasks?.tasks || [],
        engagement: engagement || null,
        timestamp: new Date().toISOString()
      };
      
      onCacheUpdate(fullMASPayload);
    } catch (error) {
      console.error("MAS Flow failed:", error);
    } finally {
      setIsGenerating(false);
      setActiveAgent(0);
    }
  };

  useEffect(() => {
    runMASFlow();
  }, [userEmail, quizHistory, userData?.quiz_id]);

  const handleRefresh = () => {
    // Clear cache for this quiz and rerun
    onCacheUpdate(null); 
    runMASFlow();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Multi-Agent Diagnostic <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
          </h2>
          <p className="text-muted-foreground mt-1">Collaborative AI analysis of your learning state.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:bg-primary/5"
          onClick={handleRefresh}
          disabled={isGenerating}
        >
          <RefreshCcw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          Rerun MAS Flow
        </Button>
      </div>

      {isGenerating && !masState ? (
        <div className="h-[500px] flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-bold">
              {activeAgent === 1 ? "Agent 2: Diagnostician Analyzing..." : 
               activeAgent === 2 ? "Agent 3: Content Creator Scaffolding..." : 
               "Agent 4: Motivator Framing Progress..."}
            </p>
            <p className="text-sm text-muted-foreground">The Multi-Agent System is collaborating to build your report.</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn(
                "w-2 h-2 rounded-full",
                activeAgent >= i ? "bg-primary" : "bg-muted"
              )} />
            ))}
          </div>
        </div>
      ) : masState ? (
        <div className="space-y-8">
          {/* Agent 4: Engagement Message (Header) */}
          {masState.engagement && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-primary/30 bg-primary/5 border-l-4">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-primary flex items-center gap-2">
                      Agent 4: Engagement Insight
                      <Badge variant="outline" className="text-[10px] bg-white">Momentum: Stable</Badge>
                    </h4>
                    <p className="text-sm leading-relaxed italic">
                      "{masState.engagement.message}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent 2: Performance Summary */}
            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Agent 2: Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-foreground/90">
                  {masState.performance_summary}
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
                    masState.confidence_score.rating === "High" ? "bg-green-500" : 
                    masState.confidence_score.rating === "Medium" ? "bg-yellow-500" : "bg-red-500"
                  )}>
                    {masState.confidence_score.rating}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{masState.confidence_score.explanation}"
                </p>
              </CardContent>
            </Card>

            {/* Agent 3: Action Tasks */}
            <Card className="lg:col-span-3 border-emerald-500/20 bg-emerald-500/5 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <ClipboardList className="w-5 h-5" />
                  Agent 3: Personalized Practice Tasks
                </CardTitle>
                <CardDescription className="text-emerald-600/70">
                  Scaffolded exercises based on your detected error signals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {masState.action_tasks?.map((task: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize bg-emerald-50 text-emerald-700 border-emerald-200">
                          {task.type} Task
                        </Badge>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="prose prose-sm max-w-none text-slate-700">
                        {task.content}
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hint</p>
                        <p className="text-xs text-slate-600 italic">{task.hint}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <h4 className="font-bold text-xl text-red-700">{masState.immediate_priority.topic}</h4>
                <p className="text-sm text-red-600/80 leading-relaxed">
                  {masState.immediate_priority.reason}
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
                  {masState.error_patterns?.map((pattern: any, i: number) => (
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
        </div>
      ) : null}

      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">About the Multi-Agent System</h3>
            <p className="text-sm text-muted-foreground mt-2">
              VECTRACE uses a collaborative framework of specialized AI agents. 
              <strong> The Architect</strong> plans your path, <strong>The Diagnostician</strong> finds gaps, 
              <strong> The Content Creator</strong> builds tasks, and <strong>The Motivator</strong> keeps you engaged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
