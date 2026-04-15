import React from "react";
import { motion } from "motion/react";
import { 
  ClipboardList, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Lock,
  ArrowRight,
  Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function DailyChallenge({ 
  masState 
}: { 
  masState: any 
}) {
  if (!masState) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-lg font-bold">Challenge Locked</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Complete a quiz and generate AI Suggestions to unlock your personalized daily challenges.
          </p>
        </div>
      </div>
    );
  }

  const tasks = masState.action_tasks || [];
  const guidedTasks = tasks.filter((t: any) => t.type === "guided");
  const challengeTasks = tasks.filter((t: any) => t.type === "challenge");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Daily Challenge <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
          </h2>
          <p className="text-muted-foreground mt-1">
            Targeted practice for <span className="font-bold text-foreground">{masState.immediate_priority?.topic?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
          5 Tasks Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Guided Examples Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-lg">Guided Examples (3)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidedTasks.map((task: any, i: number) => (
              <Card key={i} className="border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-500 text-white border-none text-[10px] uppercase">Guided</Badge>
                    <span className="text-[10px] font-bold text-purple-900/50">#0{i + 1}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-purple-900">{task.title || "Guided Practice"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none text-purple-900/80 text-xs leading-relaxed">
                    {task.content}
                  </div>
                  <div className="p-3 rounded-lg bg-white/50 border border-purple-200">
                    <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Expert Hint</p>
                    <p className="text-[11px] text-purple-800 italic">{task.hint}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Challenge Problems Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg">Challenge Problems (2)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challengeTasks.map((task: any, i: number) => (
              <Card key={i} className="border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Target className="w-20 h-20 text-orange-500" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-orange-500 text-white border-none text-[10px] uppercase">Challenge</Badge>
                    <span className="text-[10px] font-bold text-orange-900/50">#0{i + 4}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-orange-900">{task.title || "Mastery Challenge"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm max-w-none text-orange-900/80 leading-relaxed">
                    {task.content}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 px-6 py-3 border-orange-200 text-orange-700 hover:bg-orange-100 font-bold h-auto">
                      View Hint
                    </Button>
                    <Button className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20 h-auto">
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">Mastery Through Practice</h3>
            <p className="text-sm text-muted-foreground mt-2">
              These tasks are generated by <strong>Agent 3: The Content Creator</strong>. 
              They are specifically designed to bridge the gaps identified in your latest diagnostic report.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
