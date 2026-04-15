import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Zap,
  Target,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/src/components/theme-provider";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { LearningPath } from "@/src/components/learning-path";
import { ReadingMaterial } from "@/src/components/reading-material";
import { QuizSection } from "@/src/components/quiz-section";
import { AISuggestions } from "@/src/components/ai-suggestions";
import { DailyChallenge } from "@/src/components/daily-challenge";
import { AdminDashboard } from "@/src/components/admin-dashboard";
import { Shop } from "@/src/components/shop";
import { cn } from "@/lib/utils";
import { generateLearningPath } from "@/src/services/geminiService";
import userDagsData from "./data/user-dags.json";
import quizHistoryData from "./data/quiz-history.json";

// Types
type Page = "login" | "dashboard";
type DashboardTab = "dashboard" | "reading" | "quiz" | "suggestions" | "daily-challenge" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userDags, setUserDags] = useState<any>(userDagsData);
  const [quizHistory, setQuizHistory] = useState<any>(quizHistoryData);
  const [aiSuggestionsCache, setAiSuggestionsCache] = useState<Record<string, any>>({});

  const wipeAISuggestions = () => {
    setAiSuggestionsCache({});
  };

  const handleLogin = (email: string) => {
    setIsLoading(true);
    setUserEmail(email);
    wipeAISuggestions(); // Wipe cache on login/entry
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage("dashboard");
    }, 1500);
  };

  const handleQuizComplete = (email: string, quizResults: any) => {
    // Update Quiz History
    const newQuizHistory = { ...quizHistory };
    newQuizHistory[email] = { last_quiz: quizResults };
    setQuizHistory(newQuizHistory);

    // Update User DAG Mastery
    const newUserDags = { ...userDags };
    const userDag = newUserDags[email];
    
    if (userDag) {
      quizResults.questions.forEach((q: any) => {
        const topic = q.topic;
        if (userDag.graph_state[topic]) {
          const state = userDag.graph_state[topic];
          state.attempts += 1;
          
          if (q.error_type === "conceptual") state.conceptual_error_count += 1;
          if (q.error_type === "procedural") state.procedural_error_count += 1;
          if (q.error_type === "guess") state.guess_count += 1;
          
          // Bayesian-like update
          state.mastery = Number(Math.max(0, Math.min(1, state.mastery + q.weightage)).toFixed(3));
        }
      });
    }
    setUserDags(newUserDags);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-theme">
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {currentPage === "login" ? (
            <LoginPage key="login" onLogin={handleLogin} isLoading={isLoading} />
          ) : (
            <DashboardPage 
              key="dashboard" 
              userEmail={userEmail} 
              userDags={userDags}
              quizHistory={quizHistory}
              aiSuggestionsCache={aiSuggestionsCache}
              setAiSuggestionsCache={setAiSuggestionsCache}
              onQuizComplete={handleQuizComplete}
              onLogout={() => setCurrentPage("login")} 
            />
          )}
        </AnimatePresence>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function LoginPage({ onLogin, isLoading }: { onLogin: (email: string) => void; isLoading: boolean; key?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const demoEmails = ["aarav.beginner@vectrace.ai"];

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!demoEmails.includes(email)) {
      setError(`Please use one of the demo emails: ${demoEmails.join(", ")}`);
      return;
    }

    onLogin(email);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4"
          >
            <Brain className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">VECTRACE</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            Level up your knowledge <Sparkles className="w-4 h-4 text-primary" />
          </p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80 overflow-hidden">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-destructive/10 border-b border-destructive/20 p-3 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-destructive leading-tight">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full hover:bg-primary/5 hover:text-primary transition-colors">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full hover:bg-primary/5 hover:text-primary transition-colors">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className={cn("pl-10 py-6 focus-visible:ring-primary", error && "border-destructive focus-visible:ring-destructive")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 font-normal text-xs text-primary hover:text-primary/80">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 py-6 focus-visible:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
              Create an account
            </Button>
          </CardFooter>
        </Card>

        {/* Demo Credentials Section */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Demo Credentials (Click to fill)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 pb-6 px-6">
            <button 
              onClick={() => fillDemo("aarav.beginner@vectrace.ai", "1234")}
              className="text-left p-4 rounded-xl bg-background/50 border hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
            >
              <p className="text-xs font-bold text-primary mb-1">User 1 (Beginner)</p>
              <p className="text-[10px] text-muted-foreground truncate">aarav.beginner@vectrace.ai</p>
              <p className="text-[10px] text-muted-foreground">Pass: 1234</p>
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DashboardPage({ 
  userEmail, 
  userDags, 
  quizHistory, 
  aiSuggestionsCache,
  setAiSuggestionsCache,
  onQuizComplete, 
  onLogout 
}: { 
  userEmail: string; 
  userDags: any;
  quizHistory: any;
  aiSuggestionsCache: Record<string, any>;
  setAiSuggestionsCache: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onQuizComplete: (email: string, results: any) => void;
  onLogout: () => void; 
  key?: string 
}) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiData, setAiData] = useState<{
    focus_topics: any[];
    learning_path: any[];
  } | null>(null);

  const typedUserDags = userDags as any;
  const userData = typedUserDags[userEmail] || typedUserDags["aarav.beginner@vectrace.ai"] || { name: "Guest", graph_state: {} };
  const userName = userData.name || "Guest";
  const initials = userName.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

  const refreshAIData = async () => {
    setIsRefreshing(true);
    try {
      const data = await generateLearningPath(userData);
      if (data) {
        setAiData(data);
      }
    } catch (error) {
      console.error("Failed to refresh AI data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Automatic refresh disabled to save credits.
    // refreshAIData(); 
  }, [userEmail]); // Only refresh on user change if needed, or keep empty

  const focusTopics = (aiData as any)?.impact_analysis?.map((t: any) => ({
    title: t.topic.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    progress: Math.round(((userData.graph_state[t.topic]?.mastery || 0)) * 100),
    icon: (userData.graph_state[t.topic]?.mastery || 0) < 0.5 ? <Zap className="w-4 h-4 text-red-500" /> : <Target className="w-4 h-4 text-yellow-500" />,
    subtopics: userData.graph_state[t.topic]?.prerequisites || [],
    reasoning: t.reasoning
  })) || [
    { title: "Projectile Motion", progress: 65, icon: <Zap className="w-4 h-4 text-yellow-500" />, subtopics: ["Launch Angle", "Range", "Max Height"], reasoning: "Analyzing baseline..." },
    { title: "Relative Velocity", progress: 40, icon: <TrendingUp className="w-4 h-4 text-blue-500" />, subtopics: ["Frame of Reference", "Vector Addition"], reasoning: "Analyzing baseline..." },
    { title: "Uniform Acceleration", progress: 85, icon: <Target className="w-4 h-4 text-green-500" />, subtopics: ["Kinematic Equations", "Free Fall"], reasoning: "Analyzing baseline..." },
  ];

  const learningPathSteps = aiData?.learning_path || Object.entries(userDags[userEmail]?.graph_state || userDags["aarav.beginner@vectrace.ai"].graph_state)
    .map(([id, state], index) => ({
      id,
      title: id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      description: (state as any).mastery > 0.8 ? "Topic mastered. Moving to next concept." : "Focus area: Requires more practice.",
      status: (state as any).mastery > 0.8 ? "completed" as const : (state as any).mastery > 0.4 ? "current" as const : "locked" as const
    }))
    .sort((a, b) => {
      const stateA = (userDags[userEmail]?.graph_state as any)[a.id];
      const stateB = (userDags[userEmail]?.graph_state as any)[b.id];
      return (stateA?.prerequisites?.length || 0) - (stateB?.prerequisites?.length || 0);
    });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-background flex"
    >
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-md hidden md:flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">VECTRACE</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem 
            icon={<BookOpen className="w-4 h-4" />} 
            label="Reading Material" 
            active={activeTab === "reading"}
            onClick={() => setActiveTab("reading")}
          />
          <SidebarItem 
            icon={<Zap className="w-4 h-4" />} 
            label="Quiz" 
            active={activeTab === "quiz"}
            onClick={() => setActiveTab("quiz")}
          />
          <SidebarItem 
            icon={<Sparkles className="w-4 h-4" />} 
            label="AI Suggestions" 
            active={activeTab === "suggestions"} 
            onClick={() => setActiveTab("suggestions")}
          />
          <SidebarItem 
            icon={<ClipboardList className="w-4 h-4" />} 
            label="Daily Challenge" 
            active={activeTab === "daily-challenge"} 
            onClick={() => setActiveTab("daily-challenge")}
          />
          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">System</p>
            <SidebarItem 
              icon={<Settings className="w-4 h-4" />} 
              label="Admin Debug" 
              active={activeTab === "admin"}
              onClick={() => setActiveTab("admin")}
            />
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search topics, quizzes..." className="pl-10 bg-muted/50 border-none focus-visible:ring-primary/50" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Shop />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-4 pl-4 pr-2 py-1 rounded-full bg-muted/30 border border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-[10px] text-muted-foreground">Physics Enthusiast</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shadow-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 p-8 min-h-0">
          <div className="max-w-6xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" ? (
                <motion.div
                  key="dashboard-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Welcome Section */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Kinematics Dashboard</h2>
                      <p className="text-muted-foreground mt-1">Welcome back, {userEmail.split('@')[0]}! You're making great progress in Physics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 h-10 border-primary/20 hover:bg-primary/5"
                        onClick={refreshAIData}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                        AI Refresh
                      </Button>
                      <Card className="px-4 py-2 flex items-center gap-3 border-primary/20 bg-primary/5">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">Study Streak</p>
                          <p className="text-sm font-bold">12 Days</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Focus Topics */}
                    <div className="lg:col-span-1 space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Focus Topics
                      </h3>
                      <div className="space-y-4">
                        {focusTopics.map((topic, i) => (
                          <motion.div
                            key={topic.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors group">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                      {topic.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm">{topic.title}</h4>
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Physics • Kinematics</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="text-[10px]">{topic.progress}%</Badge>
                                </div>
                                <Progress value={topic.progress} className="h-1.5 mb-3" />
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {topic.subtopics.map(sub => (
                                    <Badge key={sub} variant="outline" className="text-[9px] font-normal py-0 px-1.5 bg-muted/30">
                                      {sub}
                                    </Badge>
                                  ))}
                                </div>
                                {topic.reasoning && (
                                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 space-y-2">
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                      <span className="font-bold text-primary not-italic">AI Strategy:</span> {topic.reasoning}
                                    </p>
                                    <div className="pt-2 border-t border-primary/10">
                                      <p className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Personalized Task</p>
                                      <p className="text-[10px] text-foreground leading-tight">
                                        {topic.progress < 50 
                                          ? `Review ${topic.subtopics[0]} fundamentals and solve 3 basic problems.` 
                                          : `Complete a challenge problem involving ${topic.subtopics[1] || topic.title}.`}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Learning Path */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Learning Path: Kinematics
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          40% Complete
                        </Badge>
                      </div>
                      
                      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <LearningPath steps={learningPathSteps} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === "reading" ? (
                <motion.div
                  key="reading-material-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ReadingMaterial />
                </motion.div>
              ) : activeTab === "quiz" ? (
                <motion.div
                  key="quiz-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <QuizSection 
                    onViewInsights={() => setActiveTab("suggestions")} 
                    onQuizComplete={(results) => onQuizComplete(userEmail, results)}
                  />
                </motion.div>
              ) : activeTab === "suggestions" ? (
                <motion.div
                  key="suggestions-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AISuggestions 
                    userEmail={userEmail} 
                    userDags={userDags} 
                    quizHistory={quizHistory} 
                    cache={aiSuggestionsCache}
                    onCacheUpdate={(report) => {
                      const userData = (quizHistory as any)[userEmail]?.last_quiz || (quizHistory as any)["aarav.beginner@vectrace.ai"].last_quiz;
                      setAiSuggestionsCache(prev => ({ ...prev, [userData.quiz_id]: report }));
                    }}
                  />
                </motion.div>
              ) : activeTab === "daily-challenge" ? (
                <motion.div
                  key="daily-challenge-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DailyChallenge 
                    masState={(() => {
                      const userData = (quizHistory as any)[userEmail]?.last_quiz || (quizHistory as any)["aarav.beginner@vectrace.ai"].last_quiz;
                      return userData ? aiSuggestionsCache[userData.quiz_id] : null;
                    })()}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="admin-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AdminDashboard 
                    userEmail={userEmail} 
                    userDags={userDags} 
                    quizHistory={quizHistory} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </motion.div>
  );
}

function SidebarItem({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      className={cn(
        "w-full justify-start gap-3 font-medium transition-all",
        active ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </Button>
  );
}
