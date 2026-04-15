import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * AGENT 1: THE ARCHITECT (Revision & Pathing)
 * Mathematical Basis: Weighted Graph Traversal & Mastery Optimization.
 * Objective: Maximize Graph Stability by resolving high-impact bottlenecks.
 */
export async function generateLearningPath(userDag: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are AGENT 1: THE ARCHITECT. Your role is Strategic Planning.
    
    MATHEMATICAL CONTEXT:
    - You are optimizing a Directed Acyclic Graph (DAG) where nodes have Mastery (M) ∈ [0, 1].
    - Objective Function: Identify nodes where (1 - M) * Count(Dependents) is maximized.
    - Constraint: Prerequisite Stability. If M(prereq) < 0.4, the dependent node is "Blocked".
    
    INPUT DATA (DAG State):
    ${JSON.stringify(userDag.graph_state, null, 2)}
    
    TASK:
    1. Calculate the "Impact Score" for each weak topic (Mastery < 0.7).
    2. Sequence a "Revision Pathway" that starts with 1 Mastered topic (Confidence Booster) followed by 2 High-Impact weak topics.
    3. Ensure no "Blocked" topics are suggested for active practice.
    
    SAFETY GUARDRAILS:
    - Only suggest topics present in the provided DAG.
    - Do not suggest more than 5 steps in a single pathway.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "agent_id": "architect_v2",
      "impact_analysis": [
        { "topic": "id", "score": 0.85, "reasoning": "High dependent count..." }
      ],
      "learning_path": [
        { "id": "topic_id", "title": "Topic Title", "description": "...", "status": "completed|current|locked" }
      ]
    }
  `;

  return executeAgentTask("Architect", prompt, model);
}

/**
 * AGENT 2: THE DIAGNOSTICIAN (Suggest Agent)
 * Mathematical Basis: Signal Analysis & Error Categorization.
 * Objective: Identify the "Signal" (Conceptual vs Procedural) in the latest performance.
 */
export async function generateAISuggestions(quizPayload: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are AGENT 2: THE DIAGNOSTICIAN. Your role is Tactical Analysis.
    
    MATHEMATICAL CONTEXT:
    - Analyze Error Distribution: E_conceptual vs E_procedural.
    - Weightage Analysis: Calculate the weighted error rate per topic.
    - Confidence Delta: Compare performance against expected mastery.
    
    INPUT DATA (Quiz Payload):
    ${JSON.stringify(quizPayload, null, 2)}
    
    TASK:
    1. Identify recurring "Error Signals".
    2. Determine the "Immediate Priority" based on the highest weighted error.
    3. Provide a "Proactive & Protective" diagnostic report.
    
    SAFETY GUARDRAILS:
    - Stay strictly within Physics diagnostics.
    - Do not diagnose medical or psychological conditions.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "agent_id": "diagnostician_v3",
      "performance_summary": "A 1-sentence high-level summary.",
      "structured_analysis": {
        "conceptual_gaps": [
          { "topic": "...", "insight": "Brief technical explanation of the mental model gap." }
        ],
        "procedural_friction": [
          { "topic": "...", "insight": "Brief technical explanation of the calculation/step error." }
        ],
        "actionable_steps": [
          { "step": "...", "benefit": "Why this helps." }
        ]
      },
      "immediate_priority": { "topic": "...", "reason": "..." },
      "confidence_score": { "rating": "High|Medium|Low", "explanation": "..." }
    }
  `;

  return executeAgentTask("Diagnostician", prompt, model);
}

/**
 * AGENT 3: THE CONTENT CREATOR (Action Agent)
 * Mathematical Basis: Scaffolding Complexity Scaling.
 * Objective: Generate targeted practice tasks based on specific error signals.
 */
export async function generateActionTasks(targetTopic: string, errorSignal: string, mastery: number) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are AGENT 3: THE CONTENT CREATOR. Your role is Execution.
    
    MATHEMATICAL CONTEXT:
    - Scaffolding Level: Set difficulty D = Mastery + 0.1 (Zone of Proximal Development).
    - Error Correction: If signal is "conceptual", use "First Principles" scaffolding. If "procedural", use "Step-by-Step" scaffolding.
    
    CONTEXT:
    - Target Topic: ${targetTopic}
    - Detected Error Signal: ${errorSignal}
    - Current Mastery: ${mastery}
    
    TASK:
    1. Generate 5 personalized practice tasks.
    2. Tasks 1-3: "Guided Examples" with the solution hidden/explained.
    3. Tasks 4-5: "Challenge Problems" slightly above current mastery.
    
    SAFETY GUARDRAILS:
    - Ensure all physics constants (g = 9.8 m/s²) are accurate.
    - Do not generate content outside of the target topic.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "agent_id": "creator_v3",
      "tasks": [
        { "type": "guided|challenge", "title": "Brief Title", "content": "Markdown text...", "hint": "..." }
      ]
    }
  `;

  return executeAgentTask("ContentCreator", prompt, model);
}

/**
 * AGENT 4: THE MOTIVATOR (Engagement Agent)
 * Mathematical Basis: Mastery Velocity & Momentum Tracking.
 * Objective: Maintain student engagement through positive reinforcement of progress.
 */
export async function generateEngagementMessage(masteryTrend: number[], latestReport: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are AGENT 4: THE MOTIVATOR. Your role is Engagement.
    
    MATHEMATICAL CONTEXT:
    - Mastery Velocity (V): Calculate (M_now - M_prev).
    - Momentum: If V > 0, amplify success. If V < 0, provide "Protective" framing.
    
    CONTEXT:
    - Mastery Trend: ${masteryTrend.join(" -> ")}
    - Latest Diagnostic: ${latestReport}
    
    TASK:
    1. Generate a "Protective & Proactive" encouragement message.
    2. Highlight one specific "Win" (even a small mastery gain).
    3. Frame the "Immediate Priority" as an exciting next milestone.
    
    SAFETY GUARDRAILS:
    - Avoid toxic positivity; acknowledge the difficulty of the subject.
    - Stay encouraging but professional.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "agent_id": "motivator_v2",
      "message": "...",
      "milestone_alert": "..."
    }
  `;

  return executeAgentTask("Motivator", prompt, model);
}

/**
 * SHARED AGENT EXECUTION LOGIC
 * Includes Logging and Handover validation.
 */
async function executeAgentTask(agentName: string, prompt: string, model: any) {
  const startTime = Date.now();
  console.log(`[MAS LOG] Initializing ${agentName} Agent...`);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    const payload = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    const duration = Date.now() - startTime;

    console.log(`[MAS LOG] ${agentName} Agent completed in ${duration}ms.`);
    console.log(`[MAS LOG] Payload:`, payload);

    return payload;
  } catch (error: any) {
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      console.error(`[MAS LOG] ${agentName} Agent: Quota Exhausted (429).`);
      return { error: "QUOTA_EXHAUSTED", agent: agentName };
    }
    console.error(`[MAS LOG] ${agentName} Agent failed:`, error);
    return null;
  }
}
