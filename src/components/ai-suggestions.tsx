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

const FALLBACK_REPORT = {
  agent_id: "diagnostician_v3_fallback",
  performance_summary: "Your performance shows strong baseline knowledge with specific friction in multi-dimensional vector decomposition.",
  structured_analysis: {
    conceptual_gaps: [
      { topic: "Vector Components", insight: "Difficulty isolating horizontal and vertical components in projectile motion." }
    ],
    procedural_friction: [
      { topic: "Trigonometric Application", insight: "Recurring sign errors when applying Cosine/Sine to non-standard angles." }
    ],
    actionable_steps: [
      { step: "Component Mapping", benefit: "Reduces algebraic slips by standardizing the FBD process." }
    ]
  },
  immediate_priority: { topic: "projectile_motion", reason: "Highest weighted error rate detected in recent quiz." },
  confidence_score: { rating: "Medium", explanation: "Consistent logic but procedural slips are capping mastery." },
  action_tasks: [
    { type: "guided", title: "Projectile Decomposition", content: "### Guided Task: Projectile Decomposition\n\nA ball is thrown at 20m/s at an angle of 30°. Calculate the initial vertical velocity ($v_{0y}$). \n\n**Hint:** Use $v_y = v \\cdot \\sin(\\theta)$.", hint: "Remember that vertical corresponds to the opposite side of the angle." },
    { type: "guided", title: "Horizontal Range", content: "### Guided Task: Horizontal Range\n\nCalculate the horizontal distance traveled by a projectile launched at 10m/s horizontally from a height of 5m.", hint: "Time of flight is determined solely by the vertical drop." },
    { type: "guided", title: "Impact Velocity", content: "### Guided Task: Impact Velocity\n\nDetermine the final velocity vector of a particle that has been accelerating at 2m/s² for 5 seconds from rest.", hint: "Use the first kinematic equation: $v = u + at$." },
    { type: "challenge", title: "The Inclined Plane", content: "### Challenge: The Inclined Plane\n\nDecompose a gravity vector ($g$) into components parallel and perpendicular to a plane inclined at 15°.", hint: "The angle between gravity and the normal is equal to the incline angle." },
    { type: "challenge", title: "Relative Motion", content: "### Challenge: Relative Motion\n\nA boat moves at 5m/s relative to a river flowing at 2m/s. Calculate the time to cross a 100m wide river if heading straight across.", hint: "The crossing time depends only on the velocity component perpendicular to the banks." }
  ],
  engagement: { message: "You're hitting the 'Plateau of Latent Potential'. Keep pushing through these procedural hurdles!", milestone_alert: "Mastery Momentum: +5%" }
};

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
      let diagnosticReport = await generateAISuggestions(currentQuizPayload);
      
      if (diagnosticReport?.error === "QUOTA_EXHAUSTED") {
        console.warn("Gemini Quota Exhausted. Using fallback diagnostic report.");
        onCacheUpdate({ ...FALLBACK_REPORT, timestamp: new Date().toISOString(), is_fallback: true });
        return;
      }

      if (!diagnosticReport) throw new Error("Diagnostician failed");
      
      setActiveAgent(2); // Content Creator
      
      // Step 2: Content Creator (Agent 3)
      const targetTopic = diagnosticReport.immediate_priority.topic;
      const errorPattern = diagnosticReport.structured_analysis?.conceptual_gaps?.find((p: any) => p.topic === targetTopic)?.insight || 
                          diagnosticReport.structured_analysis?.procedural_friction?.find((p: any) => p.topic === targetTopic)?.insight || 
                          "General weakness";
      const currentMastery = (userDags[userEmail]?.graph_state as any)[targetTopic]?.mastery || 0.5;
      
      let actionTasks = await generateActionTasks(targetTopic, errorPattern, currentMastery);
      
      if (actionTasks?.error === "QUOTA_EXHAUSTED") {
        // If only creator fails, we can still use fallback tasks with real diagnostic
        actionTasks = { tasks: FALLBACK_REPORT.action_tasks };
      }

      setActiveAgent(3); // Motivator
      
      // Step 3: Motivator (Agent 4)
      // Mocking trend for now
      const trend = [0.45, 0.48, 0.52]; 
      let engagement = await generateEngagementMessage(trend, diagnosticReport.performance_summary);
      
      if (engagement?.error === "QUOTA_EXHAUSTED") {
        engagement = FALLBACK_REPORT.engagement;
      }

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
        <div className="flex items-center gap-3">
          {masState?.is_fallback && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1.5 py-1">
              <AlertCircle className="w-3 h-3" />
              Quota Mode: Using Offline Insights
            </Badge>
          )}
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar: Diagnostic Summary & Priority */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-red-500/20 bg-red-500/5 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Immediate Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h4 className="font-bold text-lg text-red-700 leading-tight">
                    {masState.immediate_priority.topic.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h4>
                  <p className="text-xs text-red-600/80 leading-relaxed">
                    {masState.immediate_priority.reason}
                  </p>
                  <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => window.location.hash = "#reading"}>
                    Fix This Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge className={cn(
                    "font-bold px-3 py-1 w-full justify-center",
                    masState.confidence_score.rating === "High" ? "bg-green-500" : 
                    masState.confidence_score.rating === "Medium" ? "bg-yellow-500" : "bg-red-500"
                  )}>
                    {masState.confidence_score.rating} Level
                  </Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    "{masState.confidence_score.explanation}"
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content: Systemic Analysis Flow */}
            <div className="lg:col-span-3 space-y-8">
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                  <h3 className="font-bold flex items-center gap-2 text-primary">
                    <Target className="w-5 h-5" />
                    Diagnostic Overview
                  </h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-xl font-medium leading-relaxed text-foreground/90 mb-8">
                    {masState.performance_summary}
                  </p>

                  <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50">
                    {/* Step 1: Conceptual */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-purple-100 border-2 border-purple-500 flex items-center justify-center z-10">
                        <Brain className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-purple-900 uppercase tracking-widest text-xs">Phase 1: Conceptual Mapping</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {masState.structured_analysis?.conceptual_gaps?.map((gap: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
                              <p className="text-xs font-bold text-purple-900">{gap.topic}</p>
                              <p className="text-xs text-purple-800/70 leading-relaxed">{gap.insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Procedural */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center z-10">
                        <RefreshCcw className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-blue-900 uppercase tracking-widest text-xs">Phase 2: Procedural Friction</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {masState.structured_analysis?.procedural_friction?.map((gap: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                              <p className="text-xs font-bold text-blue-900">{gap.topic}</p>
                              <p className="text-xs text-blue-800/70 leading-relaxed">{gap.insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Actionable */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center z-10">
                        <Zap className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-orange-900 uppercase tracking-widest text-xs">Phase 3: Strategic Action</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {masState.structured_analysis?.actionable_steps?.map((step: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-1">
                              <p className="text-xs font-bold text-orange-900">{step.step}</p>
                              <p className="text-xs text-orange-800/70 leading-relaxed">{step.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t p-6 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Detailed practice tasks have been moved to the <span className="font-bold text-primary">Daily Challenge</span> tab.</p>
                  <Button variant="link" className="gap-2 text-primary" onClick={() => window.location.hash = "#daily-challenge"}>
                    Go to Daily Challenge <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
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
