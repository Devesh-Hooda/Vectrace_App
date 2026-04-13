import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  Info,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const kinematicsData = {
  "subject": "Physics",
  "domain": "Kinematics",
  "topics": [
    {
      "id": "vectors",
      "name": "Vectors",
      "subtopics": [
        { "id": "scalars_vs_vectors", "name": "Scalars vs Vectors" },
        { 
          "id": "vector_addition", 
          "name": "Vector Addition",
          "children": ["Triangle Law", "Parallelogram Law", "Resolution of Vectors"]
        },
        { "id": "unit_vectors", "name": "Unit Vectors" }
      ]
    },
    {
      "id": "position_displacement",
      "name": "Position & Displacement",
      "subtopics": [
        { "id": "position_vector", "name": "Position Vector" },
        { "id": "displacement", "name": "Displacement" },
        { "id": "distance_vs_displacement", "name": "Distance vs Displacement" }
      ]
    },
    {
      "id": "velocity",
      "name": "Velocity",
      "subtopics": [
        { "id": "average_velocity", "name": "Average Velocity" },
        { "id": "instantaneous_velocity", "name": "Instantaneous Velocity" },
        { "id": "speed_vs_velocity", "name": "Speed vs Velocity" }
      ]
    },
    {
      "id": "acceleration",
      "name": "Acceleration",
      "subtopics": [
        { "id": "average_acceleration", "name": "Average Acceleration" },
        { "id": "instantaneous_acceleration", "name": "Instantaneous Acceleration" },
        { "id": "uniform_acceleration", "name": "Uniform Acceleration" }
      ]
    },
    {
      "id": "equations_of_motion",
      "name": "Equations of Motion",
      "subtopics": [
        { "id": "eq1", "name": "v = u + at" },
        { "id": "eq2", "name": "s = ut + 1/2 at^2" },
        { "id": "eq3", "name": "v^2 = u^2 + 2as" },
        { "id": "applicability_conditions", "name": "Conditions for Validity" }
      ]
    },
    {
      "id": "motion_graphs",
      "name": "Graphs of Motion",
      "subtopics": [
        { "id": "position_time_graph", "name": "Position-Time Graph" },
        { "id": "velocity_time_graph", "name": "Velocity-Time Graph" },
        { "id": "acceleration_time_graph", "name": "Acceleration-Time Graph" },
        { "id": "graph_interpretation", "name": "Graph Interpretation" }
      ]
    },
    {
      "id": "projectile_motion",
      "name": "Projectile Motion",
      "subtopics": [
        { "id": "two_d_motion", "name": "2D Motion Decomposition" },
        { "id": "horizontal_motion", "name": "Horizontal Motion" },
        { "id": "vertical_motion", "name": "Vertical Motion" },
        { "id": "time_of_flight", "name": "Time of Flight" },
        { "id": "maximum_height", "name": "Maximum Height" },
        { "id": "range", "name": "Range of Projectile" },
        { "id": "trajectory", "name": "Trajectory Equation" }
      ]
    }
  ]
};

const TOPIC_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  "scalars_vs_vectors": {
    title: "Scalars vs Vectors",
    content: (
      <div className="space-y-8">
        <section className="space-y-3">
          <p className="leading-relaxed text-lg">In physics, we categorize physical quantities into two main types based on whether they possess direction or not. This distinction is fundamental because it determines how we add, subtract, and manipulate these quantities.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
              <h4 className="font-bold text-primary flex items-center gap-2 mb-3 text-xl">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Scalars
              </h4>
              <p className="text-sm leading-relaxed">Quantities that are fully described by a <strong>magnitude</strong> (numerical value) alone. They follow simple algebraic addition.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Mass", "Time", "Temp", "Speed", "Energy", "Work", "Charge"].map(ex => (
                  <Badge key={ex} variant="secondary" className="bg-background/50 font-normal">{ex}</Badge>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 shadow-sm">
              <h4 className="font-bold text-purple-600 flex items-center gap-2 mb-3 text-xl">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                Vectors
              </h4>
              <p className="text-sm leading-relaxed">Quantities that require both <strong>magnitude</strong> and <strong>direction</strong> for a complete description. They follow vector algebra.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Displacement", "Velocity", "Force", "Momentum", "Torque", "Electric Field"].map(ex => (
                  <Badge key={ex} variant="secondary" className="bg-background/50 font-normal">{ex}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-6 h-6 text-primary" />
            JEE Level Logic: Polar vs Axial Vectors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h5 className="font-bold text-sm">Polar Vectors</h5>
              <p className="text-sm text-muted-foreground">These have a starting point or a point of application. They represent translational motion. Examples: Displacement, Force.</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-sm">Axial Vectors (Pseudovectors)</h5>
              <p className="text-sm text-muted-foreground">These represent rotational effect and act along the axis of rotation. Examples: Angular velocity, Torque, Angular momentum.</p>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-muted/30 border-2 border-dashed border-muted flex gap-4">
          <Lightbulb className="w-6 h-6 text-yellow-600 shrink-0" />
          <div>
            <h5 className="font-bold text-sm mb-1">The Tensor Nuance</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some quantities like <strong>Pressure</strong> or <strong>Stress</strong> are neither scalars nor vectors in the strict sense. Pressure has a direction (always normal to the surface) but its direction is unique to the surface it acts on, not the quantity itself. These are often called <strong>Tensors</strong>.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            JEE Mains Concept Check
          </h4>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Question: Vector vs Scalar Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm italic">"A physical quantity has both magnitude and direction. Is it necessarily a vector?"</p>
              <div className="p-4 bg-background rounded-xl border space-y-2">
                <p className="text-sm font-bold text-primary">Logic & Explanation:</p>
                <p className="text-sm leading-relaxed">
                  No. For a quantity to be a vector, it <strong>must</strong> also obey the <strong>Laws of Vector Addition</strong>. 
                  <br /><br />
                  <strong>Example:</strong> Electric Current has magnitude and direction (from + to -), but it follows algebraic addition (Kirchhoff's Current Law: I₁ + I₂ = I₃). Thus, Current is a <strong>Scalar</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    )
  },
  "vector_addition": {
    title: "Vector Addition & Multiplication",
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <p className="leading-relaxed text-lg">Vector addition is the process of finding a single vector (Resultant) that produces the same effect as multiple vectors acting together. In JEE, we focus on the <strong>Analytical Method</strong> for precision.</p>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h4 className="font-bold text-primary text-xl">Analytical Method (Parallelogram Law)</h4>
              <p className="text-sm text-muted-foreground">If two vectors A and B act at an angle θ, the magnitude of the resultant R is:</p>
              <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <code className="text-2xl font-bold">R = √(A² + B² + 2AB cos θ)</code>
              </div>
              <p className="text-sm text-muted-foreground mt-4">The direction of R (angle α with vector A) is given by:</p>
              <div className="p-4 bg-muted/30 rounded-xl text-center border font-mono">
                tan α = (B sin θ) / (A + B cos θ)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-card text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Max Resultant (θ=0°)</p>
                <code className="text-sm">R_max = A + B</code>
              </div>
              <div className="p-4 rounded-xl border bg-card text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Min Resultant (θ=180°)</p>
                <code className="text-sm">R_min = |A - B|</code>
              </div>
              <div className="p-4 rounded-xl border bg-card text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Perpendicular (θ=90°)</p>
                <code className="text-sm">R = √(A² + B²)</code>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h4 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            JEE Implementation: Vector Products
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h5 className="font-bold text-primary">1. Dot Product (Scalar Product)</h5>
              <p className="text-sm text-muted-foreground">A · B = |A||B| cos θ. Result is a scalar.</p>
              <div className="space-y-2">
                <p className="text-xs font-bold">Applications:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Finding angle between vectors: cos θ = (A·B) / (|A||B|)</li>
                  <li>• Work done: W = F · d</li>
                  <li>• Projection of A on B: (A·B) / |B|</li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h5 className="font-bold text-purple-600">2. Cross Product (Vector Product)</h5>
              <p className="text-sm text-muted-foreground">A × B = |A||B| sin θ n̂. Result is a vector perpendicular to both.</p>
              <div className="space-y-2">
                <p className="text-xs font-bold">Applications:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Torque: τ = r × F</li>
                  <li>• Area of Parallelogram: |A × B|</li>
                  <li>• Area of Triangle: ½ |A × B|</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold">JEE Mains Solved Example</h4>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-6 space-y-4">
              <p className="text-sm font-bold">Question (JEE Mains):</p>
              <p className="text-sm italic">"If |A + B| = |A - B|, what is the angle between A and B?"</p>
              <div className="space-y-2">
                <p className="text-sm font-bold text-primary">Step-by-Step Implementation:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Square both sides: |A + B|² = |A - B|²</li>
                  <li>Expand: A² + B² + 2AB cos θ = A² + B² - 2AB cos θ</li>
                  <li>Simplify: 4AB cos θ = 0</li>
                  <li>Since A, B ≠ 0, cos θ = 0</li>
                  <li>θ = 90°</li>
                </ol>
                <p className="text-sm font-bold text-green-600 mt-2">Conclusion: The vectors are perpendicular.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    )
  },
  "unit_vectors": {
    title: "Unit Vectors & Direction Cosines",
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="leading-relaxed text-lg">Unit vectors are the "direction indicators" of physics. In JEE, we use them to represent vectors in 3D space and to find projections.</p>
          
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h4 className="font-bold text-xl">Direction Cosines (l, m, n)</h4>
            <p className="text-sm text-muted-foreground">If a vector A makes angles α, β, γ with X, Y, Z axes respectively:</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg border">l = cos α</div>
              <div className="p-3 bg-muted/30 rounded-lg border">m = cos β</div>
              <div className="p-3 bg-muted/30 rounded-lg border">n = cos γ</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center font-bold">
              l² + m² + n² = 1  (or cos²α + cos²β + cos²γ = 1)
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold">JEE Implementation Step: Finding a Vector</h4>
          <div className="p-6 rounded-2xl bg-muted/30 border space-y-3">
            <p className="text-sm font-bold">Task: Find a vector of magnitude 5 units in the direction of vector A = 3î + 4ĵ.</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Find magnitude of A: |A| = √(3² + 4²) = 5</li>
              <li>Find unit vector â: â = A / |A| = (3î + 4ĵ) / 5</li>
              <li>Multiply by desired magnitude: V = 5 * â = 3î + 4ĵ</li>
            </ol>
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex gap-4">
          <Info className="w-6 h-6 text-purple-600 shrink-0" />
          <div className="text-sm leading-relaxed">
            <strong>JEE Pro-Tip:</strong> If a vector makes equal angles with all three axes, then cos²α + cos²α + cos²α = 1 ⇒ 3cos²α = 1 ⇒ cos α = 1/√3. This is a common shortcut in 3D geometry problems.
          </div>
        </section>
      </div>
    )
  },
  "position_vector": {
    title: "Position Vector & Displacement in 3D",
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="leading-relaxed text-lg">In JEE Kinematics, we transition from 1D to 3D. The position of a particle is no longer a single number but a vector that evolves with time.</p>
          
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h4 className="font-bold text-xl">3D Position Vector</h4>
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
              <code className="text-2xl font-bold">r(t) = x(t)î + y(t)ĵ + z(t)k̂</code>
            </div>
            <p className="text-sm text-muted-foreground">The velocity vector is the derivative: <strong>v = dr/dt</strong>. The acceleration vector is: <strong>a = dv/dt</strong>.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold">Displacement as Change in Position</h4>
          <p className="text-sm leading-relaxed">If a particle moves from P₁(x₁, y₁, z₁) to P₂(x₂, y₂, z₂), the displacement vector is:</p>
          <div className="p-4 bg-muted/30 rounded-xl text-center border font-mono">
            Δr = (x₂-x₁)î + (y₂-y₁)ĵ + (z₂-z₁)k̂
          </div>
          <p className="text-sm font-bold mt-4">Magnitude (Shortest Distance):</p>
          <code className="text-sm">|Δr| = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]</code>
        </section>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold">JEE Mains Application: Average Velocity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm italic">"A particle moves from (2,3) to (5,7) in 2 seconds. Find its average velocity."</p>
            <div className="p-4 bg-background rounded-xl border space-y-2">
              <p className="text-sm font-bold text-primary">Solution:</p>
              <p className="text-sm leading-relaxed">
                1. Δr = (5-2)î + (7-3)ĵ = 3î + 4ĵ
                <br />
                2. V_avg = Δr / Δt = (3î + 4ĵ) / 2 = 1.5î + 2ĵ
                <br />
                3. |V_avg| = √(1.5² + 2²) = 2.5 m/s
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  "distance_vs_displacement": {
    title: "Distance vs Displacement: Calculus Approach",
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <p className="leading-relaxed text-lg">For JEE, the simple "straight line" definition isn't enough. We must understand how to calculate these using <strong>Calculus</strong> when velocity is a function of time.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h5 className="font-bold text-primary">Displacement (Vector)</h5>
              <p className="text-sm text-muted-foreground">The integral of velocity over time.</p>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <code className="text-lg font-bold">S = ∫ v dt</code>
              </div>
              <p className="text-xs italic">Note: This is the area under v-t graph (considering sign).</p>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h5 className="font-bold text-purple-600">Distance (Scalar)</h5>
              <p className="text-sm text-muted-foreground">The integral of speed (magnitude of velocity).</p>
              <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 text-center">
                <code className="text-lg font-bold">D = ∫ |v| dt</code>
              </div>
              <p className="text-xs italic">Note: This is the total area under v-t graph (all positive).</p>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-muted/30 border-2 border-dashed border-muted">
          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            JEE Critical Condition
          </h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Distance = |Displacement| <strong>ONLY</strong> if the particle does not reverse its direction (i.e., velocity never becomes zero and changes sign). If the particle reverses, Distance {">"} |Displacement|.
          </p>
        </section>

        <section className="space-y-4">
          <h4 className="text-xl font-bold">JEE Mains Challenge</h4>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6 space-y-4">
              <p className="text-sm font-bold">Question:</p>
              <p className="text-sm italic">"A particle moves in a circle of radius R. Find the ratio of distance to displacement after it completes 3/4th of a circle."</p>
              <div className="p-4 bg-background rounded-xl border space-y-3">
                <p className="text-sm font-bold text-primary">Logic:</p>
                <div className="space-y-2 text-sm">
                  <p>1. <strong>Distance:</strong> 3/4 of circumference = (3/4) * 2πR = 1.5πR</p>
                  <p>2. <strong>Displacement:</strong> Straight line between start and end. Using Pythagoras: √(R² + R²) = R√2</p>
                  <p>3. <strong>Ratio:</strong> (1.5πR) / (R√2) = 3π / (2√2)</p>
                </div>
                <p className="text-sm font-bold text-green-600">Key Takeaway: Always visualize the path for geometric problems.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    )
  }
};

export function ReadingMaterial() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);

  const filteredTopics = kinematicsData.topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.subtopics.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedContent = selectedSubtopicId ? TOPIC_CONTENT[selectedSubtopicId] : null;

  if (selectedSubtopicId && selectedContent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedSubtopicId(null)}
          className="gap-2 hover:bg-primary/5 hover:text-primary -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </Button>

        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="h-2 w-full bg-primary" />
          <CardHeader className="pb-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Kinematics</Badge>
              <Badge variant="secondary">Study Guide</Badge>
            </div>
            <CardTitle className="text-4xl font-black tracking-tight">{selectedContent.title}</CardTitle>
            <CardDescription className="text-lg">Master the core concepts with detailed explanations and examples.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12 prose prose-slate dark:prose-invert max-w-none">
            {selectedContent.content}
          </CardContent>
          <CardFooter className="bg-muted/20 p-8 flex justify-between items-center border-t">
            <p className="text-xs text-muted-foreground italic">Last updated: April 2024 • Physics Core Curriculum</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSubtopicId(null)}>Close</Button>
              <Button size="sm" className="gap-2">
                Mark as Read
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reading Material</h2>
          <p className="text-muted-foreground mt-1">Comprehensive study guides for {kinematicsData.domain}.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search topics..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation for Topics */}
        <Card className="lg:col-span-1 border-border/50 h-fit sticky top-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)] px-4 pb-4">
              <div className="space-y-1">
                {kinematicsData.topics.map((topic) => (
                  <a 
                    key={topic.id} 
                    href={`#${topic.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-primary/5 hover:text-primary transition-colors group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    {topic.name}
                  </a>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <Accordion type="multiple" className="space-y-4">
            {filteredTopics.map((topic) => (
              <AccordionItem 
                key={topic.id} 
                value={topic.id} 
                id={topic.id}
                className="border rounded-xl bg-card px-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline py-6 group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{topic.subtopics.length} subtopics</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {topic.subtopics.map((sub) => (
                      <Card 
                        key={sub.id} 
                        className={cn(
                          "border-border/50 hover:border-primary/30 transition-colors group cursor-pointer",
                          !TOPIC_CONTENT[sub.id] && "opacity-60 cursor-not-allowed"
                        )}
                        onClick={() => TOPIC_CONTENT[sub.id] && setSelectedSubtopicId(sub.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{sub.name}</h4>
                              {'children' in sub && sub.children && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {sub.children.map((child: string) => (
                                    <Badge key={child} variant="outline" className="text-[9px] font-normal py-0 px-1.5">
                                      {child}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {!TOPIC_CONTENT[sub.id] && (
                                <p className="text-[10px] text-muted-foreground mt-2">Coming soon...</p>
                              )}
                            </div>
                            <div className="p-1.5 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredTopics.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No topics found</h3>
              <p className="text-muted-foreground">Try adjusting your search query.</p>
              <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear search</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

