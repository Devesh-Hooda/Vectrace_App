import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateLearningPath(userDag: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert Physics Learning Path Optimizer and Revision Scheduler. 
    Analyze the following Knowledge DAG (Directed Acyclic Graph) state for a student.
    
    DAG State:
    ${JSON.stringify(userDag.graph_state, null, 2)}
    
    TASK:
    1. Identify the 3 worst mastery topics (Focus Topics).
    2. Generate an optimized "Revision Pathway" (sequence of steps).
    3. DEPENDENCY AWARENESS: Do not suggest practicing a "Leaf" topic (e.g., Projectile Motion) if its "Prerequisites" (e.g., Vector Addition) have mastery < 0.4. Instead, prioritize the prerequisite.
    4. ORDERING: The learning path MUST show "mastered" (higher mastery) topics FIRST, followed by "unmastered" (lower mastery) topics. This builds confidence before addressing weaknesses.
    5. REINFORCEMENT: Include "reinforcement" steps for topics with medium mastery (0.5 - 0.7) to build stability.
    6. Each Focus Topic must have a "reasoning" field explaining why this path is optimal today (e.g., "Critical bottleneck for 2D motion", "Foundational gap detected", "Confidence booster").
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "focus_topics": [
        { "id": "topic_id", "title": "Topic Title", "mastery": 0.45, "reasoning": "Explanation...", "subtopics": ["Sub 1", "Sub 2"] }
      ],
      "learning_path": [
        { "id": "topic_id", "title": "Topic Title", "description": "AI generated description...", "status": "completed|current|locked" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON from markdown if necessary
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Error generating learning path:", error);
    return null;
  }
}

export async function generateAISuggestions(quizPayload: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are the "Suggest Agent" for a Physics Learning Platform.
    Analyze the following Current Quiz Payload which represents the student's latest performance.
    
    Quiz Payload:
    ${JSON.stringify(quizPayload, null, 2)}
    
    TONE & BOUNDARIES:
    - Use a "Proactive and Protective" tone. 
    - Proactive: Don't just list errors; suggest the very next step to fix them. (e.g., "Since you struggled with vector addition, try sketching the vectors on paper first.")
    - Protective: Frame weaknesses as "areas needing reinforcement" or "temporary hurdles" rather than failures. Ensure the student feels supported and encouraged. (e.g., "You've mastered the basics of displacement, which is a huge win! Now, let's just smooth out the calculation part.")
    - Boundaries: Stay strictly within the context of the provided Physics data. Do not give general life advice.
    - Engagement: Use encouraging language that invites the student to keep exploring.
    
    TASK:
    Prepare a brief, highly readable diagnostic report explaining the current state of the user's data.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "performance_summary": "A high-level overview of correct vs. incorrect responses...",
      "error_patterns": [
        { "topic": "Topic Name", "analysis": "Identification of recurring error types (e.g., conceptual vs procedural)..." }
      ],
      "immediate_priority": {
        "topic": "Topic Name",
        "reason": "Why this is the most critical topic requiring attention right now..."
      },
      "confidence_score": {
        "rating": "Qualitative assessment (e.g., High, Medium, Low)",
        "explanation": "Why this rating was given based on the data..."
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return null;
  }
}
