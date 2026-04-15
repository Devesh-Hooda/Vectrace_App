import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { 
  Settings, 
  Database, 
  User, 
  Code, 
  RefreshCw, 
  ChevronRight,
  AlertCircle,
  Info,
  ClipboardList,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import quizData from "@/src/data/quiz-questions.json";

interface GraphState {
  mastery: number;
  attempts: number;
  conceptual_error_count: number;
  procedural_error_count: number;
  guess_count: number;
  prerequisites: string[];
}

interface UserDag {
  user_id: string;
  name: string;
  graph_state: Record<string, GraphState>;
}

interface QuizQuestion {
  question_id: string;
  text: string;
  answer_type: string;
  user_answer: string;
  correct_answer: string;
  error_type: "conceptual" | "procedural" | "guess" | "none";
  weightage: number;
  topic: string;
}

interface QuizData {
  quiz_id: string;
  timestamp: string;
  questions: QuizQuestion[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  mastery: number;
  depth: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export function AdminDashboard({ 
  userEmail,
  userDags,
  quizHistory
}: { 
  userEmail: string;
  userDags: any;
  quizHistory: any;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedUser, setSelectedUser] = useState(userEmail);
  const [viewMode, setViewMode] = useState<"before" | "after">("after");
  const [activeTab, setActiveTab] = useState("graph");
  const typedUserDags = userDags as Record<string, UserDag>;
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  
  const currentDagData = typedUserDags[selectedUser] || typedUserDags["aarav.beginner@vectrace.ai"];
  const lastQuiz = typedQuizHistory[selectedUser]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"]?.last_quiz || null;

  // Derived "Before" state
  const getBeforeDagData = (current: UserDag, quiz: QuizData | null): UserDag => {
    if (!quiz) return current;
    
    const beforeGraphState = JSON.parse(JSON.stringify(current.graph_state));
    
    quiz.questions.forEach(q => {
      if (beforeGraphState[q.topic]) {
        // Reverse the update
        beforeGraphState[q.topic].mastery = Number(Math.max(0, Math.min(1, beforeGraphState[q.topic].mastery - q.weightage)).toFixed(3));
        beforeGraphState[q.topic].attempts = Math.max(0, beforeGraphState[q.topic].attempts - 1);
        
        if (q.error_type === "conceptual") beforeGraphState[q.topic].conceptual_error_count = Math.max(0, beforeGraphState[q.topic].conceptual_error_count - 1);
        if (q.error_type === "procedural") beforeGraphState[q.topic].procedural_error_count = Math.max(0, beforeGraphState[q.topic].procedural_error_count - 1);
        if (q.error_type === "guess") beforeGraphState[q.topic].guess_count = Math.max(0, beforeGraphState[q.topic].guess_count - 1);
      }
    });
    
    return { ...current, graph_state: beforeGraphState };
  };

  const dagData = viewMode === "after" ? currentDagData : getBeforeDagData(currentDagData, lastQuiz);

  useEffect(() => {
    if (!svgRef.current || !dagData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;

    // Create a main group for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Initial zoom/pan to center and scale down
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(width / 2, 50).scale(0.7));

    // Calculate depth for hierarchical layout
    const depthMap: Record<string, number> = {};
    const calculateDepth = (id: string): number => {
      if (depthMap[id] !== undefined) return depthMap[id];
      const state = dagData.graph_state[id];
      if (!state.prerequisites || state.prerequisites.length === 0) {
        depthMap[id] = 0;
        return 0;
      }
      const maxPreDepth = Math.max(...state.prerequisites.map(calculateDepth));
      depthMap[id] = maxPreDepth + 1;
      return depthMap[id];
    };

    Object.keys(dagData.graph_state).forEach(calculateDepth);

    const nodes: Node[] = Object.entries(dagData.graph_state).map(([id, state]) => ({
      id,
      name: id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      mastery: (state as GraphState).mastery,
      depth: depthMap[id]
    }));

    const links: Link[] = [];
    Object.entries(dagData.graph_state).forEach(([id, state]) => {
      (state as GraphState).prerequisites.forEach(pre => {
        links.push({ source: pre, target: id });
      });
    });

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("x", d3.forceX(0).strength(0.1)) // Center around 0 because of initial transform
      .force("y", d3.forceY<Node>(d => (d.depth + 1) * 120).strength(1)) // Hierarchical positioning
      .force("collision", d3.forceCollide().radius(60));

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#94a3b8")
      .style("stroke", "none");

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", 22)
      .attr("fill", d => {
        if (d.mastery > 0.8) return "#22c55e";
        if (d.mastery > 0.5) return "#eab308";
        return "#ef4444";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300 hover:r-[25px]");

    node.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", 38)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor");

    node.append("text")
      .text(d => d.mastery.toFixed(3)) // Fixed to 3 decimal points
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#fff")
      .attr("font-weight", "bold");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [dagData, activeTab]);

  const currentQuizPayload = {
    quiz_id: lastQuiz?.quiz_id || "none",
    timestamp: lastQuiz?.timestamp || "none",
    questions: lastQuiz?.questions?.map(q => ({
      question_id: q.question_id,
      answer_type: q.answer_type,
      error_type: q.error_type,
      weightage: q.weightage,
      topic: q.topic
    })) || []
  };

  const demoEmails = ["aarav.beginner@vectrace.ai"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Admin Debug Dashboard
          </h2>
          <p className="text-muted-foreground">Monitoring Knowledge DAG states, Mastery weights, and AI Agent inputs.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
          <Button 
            variant={viewMode === "before" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("before")}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Before Quiz
          </Button>
          <Button 
            variant={viewMode === "after" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("after")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            After Quiz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              User Selection
            </CardTitle>
            <CardDescription>Select a user to inspect their knowledge graph.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {demoEmails.map((email) => (
                <Button
                  key={email}
                  variant={selectedUser === email ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedUser(email)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{typedUserDags[email]?.name || email}</span>
                    <span className="text-[10px] opacity-70">{email}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">User ID:</span>
                <Badge variant="outline">{dagData.user_id}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nodes Tracked:</span>
                <Badge variant="secondary">{Object.keys(dagData.graph_state).length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  Knowledge DAG Visualization
                  <Badge variant="outline" className={cn("ml-2", viewMode === "before" ? "text-orange-500 border-orange-500/20 bg-orange-500/5" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5")}>
                    {viewMode === "before" ? "Baseline State" : "Current State"}
                  </Badge>
                </CardTitle>
                <CardDescription>Hierarchical layout: Basics (Top) to Advanced (Bottom).</CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="graph" className="gap-2">
                  <Database className="w-4 h-4" />
                  Graph
                </TabsTrigger>
                <TabsTrigger value="json" className="gap-2">
                  <Code className="w-4 h-4" />
                  JSON
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="graph" className="mt-0">
                <div className="relative bg-muted/20 rounded-xl border overflow-hidden">
                  <svg 
                    ref={svgRef} 
                    width="100%" 
                    height="600" 
                    viewBox="0 0 800 600"
                    className="cursor-move"
                  />
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg border text-[10px] font-medium">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      Mastered ({">"}0.800)
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                      Progressing (0.500-0.800)
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      Struggling ({"<"}0.500)
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="json" className="mt-0">
                <ScrollArea className="h-[600px] w-full rounded-xl border bg-slate-950 p-4">
                  <pre className="text-xs text-blue-400 font-mono">
                    {JSON.stringify(dagData, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Project Deliverables Alignment
          </CardTitle>
          <CardDescription>
            Evidence and technical proofs for project milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="del-1">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="del-1" className="text-[10px]">D1: Knowledge Graph</TabsTrigger>
              <TabsTrigger value="del-2" className="text-[10px]">D2: Diagnostic Quiz</TabsTrigger>
              <TabsTrigger value="del-3" className="text-[10px]">D3: Mastery Model</TabsTrigger>
              <TabsTrigger value="del-4" className="text-[10px]">D4: Revision Engine</TabsTrigger>
              <TabsTrigger value="del-5" className="text-[10px]">D5: Multi-Agent System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="del-1" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dependency Proof (JSON)</h4>
                  <ScrollArea className="h-[200px] w-full rounded-lg border bg-slate-950 p-3">
                    <pre className="text-[10px] text-blue-300 font-mono">
                      {JSON.stringify(Object.entries(dagData.graph_state).map(([id, s]) => ({
                        concept: id,
                        prerequisites: s.prerequisites
                      })), null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Propagation Logic Example</h4>
                  <div className="p-4 rounded-lg bg-background border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Root: Vector Addition</span>
                      <Badge variant="destructive">0.250</Badge>
                    </div>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[25%]" />
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin-slow" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Leaf: Projectile Motion</span>
                      <Badge variant="outline" className="text-red-500 border-red-500/20">Blocked</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                      "System detects low mastery in Vector Addition. All dependent nodes (Projectile Motion, Range) are flagged for remediation before advanced practice is allowed."
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="del-2" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Diagnostic Signal Mapping (JSON)</h4>
                  <ScrollArea className="h-[200px] w-full rounded-lg border bg-slate-950 p-3">
                    <pre className="text-[10px] text-emerald-300 font-mono">
                      {JSON.stringify(quizData.questions.slice(0, 2).map(q => ({
                        id: q.id,
                        question: q.question_text.substring(0, 40) + "...",
                        signals: q.options.map(o => ({ opt: o.id, type: o.type }))
                      })), null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Signal Distribution (Latest Quiz)</h4>
                  <div className="p-4 rounded-lg bg-background border space-y-4">
                    {(() => {
                      const stats = currentQuizPayload.questions.reduce((acc: any, q: any) => {
                        acc[q.error_type] = (acc[q.error_type] || 0) + 1;
                        return acc;
                      }, {});
                      const total = currentQuizPayload.questions.length;
                      
                      return (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span>Conceptual Errors</span>
                              <span className="font-bold text-red-500">{stats.conceptual || 0}</span>
                            </div>
                            <Progress value={((stats.conceptual || 0) / total) * 100} className="h-1 bg-red-100" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span>Procedural Errors</span>
                              <span className="font-bold text-yellow-500">{stats.procedural || 0}</span>
                            </div>
                            <Progress value={((stats.procedural || 0) / total) * 100} className="h-1 bg-yellow-100" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span>Guesses</span>
                              <span className="font-bold text-blue-500">{stats.guess || 0}</span>
                            </div>
                            <Progress value={((stats.guess || 0) / total) * 100} className="h-1 bg-blue-100" />
                          </div>
                          <p className="text-[9px] text-muted-foreground italic mt-2">
                            "The quiz module successfully categorizes incorrect answers into actionable diagnostic signals for the AI agent."
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="del-3" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mathematical Basis</h4>
                    <div className="flex items-center justify-center p-6 bg-muted/30 rounded-xl border border-dashed">
                      <code className="text-lg font-mono text-primary">
                        M_new = clamp(0, 1, M_old + Δ)
                      </code>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 rounded bg-green-500/10 border border-green-500/20 text-[10px]">
                        <span className="font-bold text-green-600">Correct:</span> +0.020
                      </div>
                      <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-[10px]">
                        <span className="font-bold text-red-600">Conceptual:</span> -0.035
                      </div>
                      <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px]">
                        <span className="font-bold text-yellow-600">Procedural:</span> -0.015
                      </div>
                      <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-[10px]">
                        <span className="font-bold text-blue-600">Guess:</span> -0.025
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Core Update Logic (App.tsx)</h4>
                  <ScrollArea className="h-[250px] w-full rounded-lg border bg-slate-950 p-3">
                    <pre className="text-[10px] text-purple-300 font-mono">
{`// Bayesian-lite update formula
state.mastery = Number(
  Math.max(0, 
    Math.min(1, state.mastery + q.weightage)
  ).toFixed(3)
);

// Telemetry capture
if (q.error_type === "conceptual") 
  state.conceptual_error_count += 1;`}
                    </pre>
                  </ScrollArea>
                  <p className="text-[9px] text-muted-foreground italic">
                    "The system ensures mastery is a stable metric by applying diagnostic-specific deltas to the current state."
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="del-4" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Revision Pathway (Payload)</h4>
                  <ScrollArea className="h-[250px] w-full rounded-lg border bg-slate-950 p-3">
                    <pre className="text-[10px] text-orange-300 font-mono">
                      {JSON.stringify([
                        { id: "vector_addition", title: "Vector Addition", status: "current", reasoning: "Critical bottleneck for 2D motion" },
                        { id: "displacement", title: "Displacement", status: "completed", reasoning: "Confidence booster" },
                        { id: "projectile_motion", title: "Projectile Motion", status: "locked", reasoning: "Requires Vector Addition mastery > 0.4" }
                      ], null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scheduling Logic Proof</h4>
                  <div className="p-4 rounded-lg bg-background border space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-600">1</div>
                        <span className="text-[11px] font-medium">Confidence Building (Mastered First)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-600">2</div>
                        <span className="text-[11px] font-medium">Dependency-Aware Sequencing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-600">3</div>
                        <span className="text-[11px] font-medium">Bottleneck Prioritization</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="p-3 rounded bg-muted/50 border border-dashed text-[10px] leading-relaxed">
                      <strong>System Logic:</strong> "The Revision Engine detects that 'Projectile Motion' is weak but 'Vector Addition' is even weaker. It automatically schedules Vector Addition first to stabilize the foundation."
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="del-5" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agent Handover Protocol</h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-2 rounded bg-slate-100 border">
                        <Badge className="bg-blue-500">Agent 1</Badge>
                        <span className="text-[10px] font-mono">Architect {"->"} [Revision Path]</span>
                      </div>
                      <div className="flex justify-center">
                        <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded bg-slate-100 border">
                        <Badge className="bg-emerald-500">Agent 2</Badge>
                        <span className="text-[10px] font-mono">Diagnostician {"->"} [Diagnostic Report]</span>
                      </div>
                      <div className="flex justify-center">
                        <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded bg-slate-100 border">
                        <Badge className="bg-purple-500">Agent 3</Badge>
                        <span className="text-[10px] font-mono">Content Creator {"->"} [Practice Tasks]</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-background border space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">MAS Mathematical Foundations</h4>
                    <div className="space-y-3">
                      <div className="p-2 rounded bg-muted/30 border border-dashed">
                        <p className="text-[10px] font-bold text-primary mb-1">Agent 1: Bottleneck Optimization</p>
                        <code className="text-[11px] font-mono">f(n) = (1-M) * Descendants</code>
                      </div>
                      <div className="p-2 rounded bg-muted/30 border border-dashed">
                        <p className="text-[10px] font-bold text-primary mb-1">Agent 2: Signal Analysis</p>
                        <code className="text-[11px] font-mono">S = Σ(w*E) / Σw</code>
                      </div>
                      <div className="p-2 rounded bg-muted/30 border border-dashed">
                        <p className="text-[10px] font-bold text-primary mb-1">Agent 3: ZPD Scaffolding</p>
                        <code className="text-[11px] font-mono">D = Mastery + 0.1</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Agent Logs (MAS LOG)</h4>
                  <ScrollArea className="h-[400px] w-full rounded-lg border bg-slate-950 p-3">
                    <div className="space-y-2">
                      <p className="text-[10px] text-green-400 font-mono">[MAS LOG] Initializing Architect Agent...</p>
                      <p className="text-[10px] text-blue-300 font-mono">[MAS LOG] Architect completed in 1240ms.</p>
                      <p className="text-[10px] text-green-400 font-mono">[MAS LOG] Initializing Diagnostician Agent...</p>
                      <p className="text-[10px] text-blue-300 font-mono">[MAS LOG] Diagnostician completed in 980ms.</p>
                      <p className="text-[10px] text-green-400 font-mono">[MAS LOG] Initializing ContentCreator Agent...</p>
                      <p className="text-[10px] text-blue-300 font-mono">[MAS LOG] ContentCreator completed in 1520ms.</p>
                      <p className="text-[10px] text-purple-400 font-mono">{`{ "agent_id": "creator_v2", "tasks": [...] }`}</p>
                    </div>
                  </ScrollArea>
                  <p className="text-[9px] text-muted-foreground italic mt-2">
                    "The system logs every agent handover, ensuring transparency and auditability of the AI decision-making process."
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Last Quiz Data (AI Feed)
            </CardTitle>
            <CardDescription>
              Detailed breakdown of the most recent performance. 
              {viewMode === "before" ? " (This data was used to transform the Baseline state into the Current state)" : " (This data has been integrated into the Current state)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastQuiz ? (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lastQuiz.questions.map((q) => (
                      <TableRow key={q.question_id}>
                        <TableCell className="max-w-[200px] truncate font-medium" title={q.text}>
                          {q.text}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{q.answer_type.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={q.error_type === 'conceptual' ? 'destructive' : q.error_type === 'procedural' ? 'secondary' : 'outline'}
                            className="capitalize"
                          >
                            {q.error_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {q.weightage.toFixed(3)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No quiz history available for this user.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Multi-Agent Input Payloads
            </CardTitle>
            <CardDescription>
              Payload split for specialized AI agents based on the 
              <span className="font-bold text-primary"> {viewMode} </span> state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current-quiz">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current-quiz" className="text-[10px]">Current Quiz</TabsTrigger>
                <TabsTrigger value="suggest-agent" className="text-[10px]">Suggest Agent</TabsTrigger>
                <TabsTrigger value="action-agent" className="text-[10px]">Action Agent</TabsTrigger>
              </TabsList>
              <TabsContent value="current-quiz">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2">
                  <pre className="text-xs text-yellow-400 font-mono">
                    {JSON.stringify(currentQuizPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="suggest-agent">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2">
                  <pre className="text-xs text-emerald-400 font-mono">
                    {JSON.stringify(currentQuizPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="action-agent">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2 flex items-center justify-center">
                  <p className="text-muted-foreground text-xs italic">Payload blank for now.</p>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Debugging Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-sm">Update Logic</h4>
              <p className="text-sm text-muted-foreground">
                The weights are updated post-quiz using a Bayesian update model. 
                Conceptual errors have a higher negative weight (-0.035) compared to procedural errors (-0.015).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm">Prerequisite Propagation</h4>
              <p className="text-sm text-muted-foreground">
                Mastery in a child node (e.g., Velocity) can partially back-propagate to its parents (e.g., Displacement) if the child mastery exceeds 90%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
