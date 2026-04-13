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
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import userDags from "../data/user-dags.json";
import quizHistory from "../data/quiz-history.json";

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
  error_type: "conceptual" | "procedural" | "none";
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

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedUser, setSelectedUser] = useState(userEmail);
  const typedUserDags = userDags as Record<string, UserDag>;
  const typedQuizHistory = quizHistory as Record<string, { last_quiz: QuizData }>;
  
  const [dagData, setDagData] = useState<UserDag>(typedUserDags[selectedUser] || typedUserDags["aarav.beginner@vectrace.ai"]);
  const [lastQuiz, setLastQuiz] = useState<QuizData | null>(typedQuizHistory[selectedUser]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"]?.last_quiz || null);

  useEffect(() => {
    const data = typedUserDags[selectedUser] || typedUserDags["aarav.beginner@vectrace.ai"];
    const quiz = typedQuizHistory[selectedUser]?.last_quiz || typedQuizHistory["aarav.beginner@vectrace.ai"]?.last_quiz || null;
    setDagData(data);
    setLastQuiz(quiz);
  }, [selectedUser, typedUserDags, typedQuizHistory]);

  useEffect(() => {
    if (!svgRef.current || !dagData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;

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
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY<Node>(d => (d.depth + 1) * 100).strength(1)) // Hierarchical positioning
      .force("collision", d3.forceCollide().radius(50));

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

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const node = svg.append("g")
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
      .text(d => d.mastery.toFixed(3)) // 3 decimal pointers
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
  }, [dagData]);

  const learningPathAgentPayload = {
    agent_id: "learning_path_optimizer",
    context: {
      user_id: dagData.user_id,
      mastery_profile: dagData.graph_state,
      prerequisite_violations: Object.entries(dagData.graph_state)
        .filter(([_, state]) => (state as GraphState).mastery < 0.4 && (state as GraphState).prerequisites.length > 0)
        .map(([id]) => id)
    }
  };

  const suggestionAgentPayload = {
    agent_id: "personalized_recommender",
    context: {
      last_quiz_performance: lastQuiz,
      struggling_topics: Object.entries(dagData.graph_state)
        .filter(([_, state]) => (state as GraphState).mastery < 0.5)
        .map(([id]) => id)
    }
  };

  const actionPlanAgentPayload = {
    agent_id: "error_pattern_analyzer",
    context: {
      error_distribution: {
        conceptual: Object.values(dagData.graph_state).reduce((acc: number, s) => acc + (s as GraphState).conceptual_error_count, 0),
        procedural: Object.values(dagData.graph_state).reduce((acc: number, s) => acc + (s as GraphState).procedural_error_count, 0)
      },
      recent_errors: lastQuiz?.questions.filter(q => q.error_type !== "none")
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Admin Debug Dashboard
          </h2>
          <p className="text-muted-foreground">Monitoring Knowledge DAG states, Mastery weights, and AI Agent inputs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset State
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
              {Object.keys(typedUserDags).map((email) => (
                <Button
                  key={email}
                  variant={selectedUser === email ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedUser(email)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{typedUserDags[email].name}</span>
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
          <Tabs defaultValue="graph">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Knowledge DAG Visualization</CardTitle>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Last Quiz Data (AI Feed)
            </CardTitle>
            <CardDescription>Detailed breakdown of the most recent performance.</CardDescription>
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
            <CardDescription>Paylod split for specialized AI agents.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="path-agent">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="path-agent" className="text-[10px]">Path Agent</TabsTrigger>
                <TabsTrigger value="suggest-agent" className="text-[10px]">Suggest Agent</TabsTrigger>
                <TabsTrigger value="action-agent" className="text-[10px]">Action Agent</TabsTrigger>
              </TabsList>
              <TabsContent value="path-agent">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2">
                  <pre className="text-xs text-emerald-400 font-mono">
                    {JSON.stringify(learningPathAgentPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="suggest-agent">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2">
                  <pre className="text-xs text-blue-400 font-mono">
                    {JSON.stringify(suggestionAgentPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="action-agent">
                <ScrollArea className="h-[350px] w-full rounded-xl border bg-slate-950 p-4 mt-2">
                  <pre className="text-xs text-purple-400 font-mono">
                    {JSON.stringify(actionPlanAgentPayload, null, 2)}
                  </pre>
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
