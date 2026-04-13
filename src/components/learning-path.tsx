import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
}

interface LearningPathProps {
  steps: Step[];
}

export function LearningPath({ steps }: LearningPathProps) {
  return (
    <div className="relative py-8 px-4">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-muted -translate-x-1/2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-full bg-primary origin-top"
          style={{ 
            height: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%` 
          }}
        />
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative flex items-center gap-8",
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            )}
          >
            {/* Content Card */}
            <div className={cn(
              "w-1/2 p-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
              step.status === "current" ? "border-primary ring-1 ring-primary/20" : "border-border/50",
              step.status === "locked" && "opacity-60"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {index + 1}</span>
                {step.status === "current" && (
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <h4 className="font-bold text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              {step.status === "current" && (
                <Button variant="link" className="p-0 h-auto mt-2 text-primary text-xs group">
                  Continue Learning <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>

            {/* Node Icon */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={cn(
                  "w-10 h-10 rounded-full border-4 border-background flex items-center justify-center shadow-sm",
                  step.status === "completed" ? "bg-primary text-primary-foreground" : 
                  step.status === "current" ? "bg-background border-primary text-primary" : 
                  "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : 
                 step.status === "current" ? <Circle className="w-5 h-5 fill-primary" /> : 
                 <Lock className="w-4 h-4" />}
              </motion.div>
            </div>

            {/* Spacer for the other side */}
            <div className="w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
