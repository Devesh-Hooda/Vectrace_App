# Deliverable 5: Multi-Agent Diagnostic System (MAS)

## 1. Proposed Architecture
The **Multi-Agent Diagnostic System (MAS)** is a collaborative AI framework where specialized agents work in sequence to provide a 360-degree learning experience. Instead of a single "monolithic" AI, the MAS breaks down the problem into Strategy, Tactics, Execution, and Engagement.

### Agent Workflow Diagram
`[Knowledge DAG]` -> **Agent 1 (Architect)** -> `[Learning Path]` -> **Agent 2 (Diagnostician)** -> `[Systemic Diagnostic]` -> **Agent 3 (Content Creator)** -> `[Daily Challenge Tasks]`

---

## 2. Agent Specifications

### Agent 1: The Architect (Revision & Pathing Agent)
- **Context**: Long-term strategic planning.
- **Input**: Full Knowledge DAG state (Mastery levels, prerequisites, attempts).
- **Output**: `RevisionPathway` (A prioritized sequence of topics).
- **Role**: Analyzes the entire graph to find bottlenecks and confidence-building entry points.
- **Logic**: "Mastered topics first, then foundational bottlenecks, then advanced symptoms."

### Agent 2: The Diagnostician (Suggest Agent)
- **Context**: Immediate tactical analysis of the latest performance.
- **Input**: `QuizPayload` (Answers, Error Types, Weights, Time-on-Task).
- **Output**: `DiagnosticReport` (Identification of Conceptual vs. Procedural gaps).
- **Role**: Explains *why* the student failed specific questions in the current session.
- **Logic**: "If error_type is conceptual, flag for mental model rebuild. If procedural, flag for calculation practice."

### Agent 3: The Content Creator (Action Agent)
- **Context**: Practical execution and exercise generation.
- **Input**: Output from Agent 1 (Target Topic) + Output from Agent 2 (Specific Error Pattern).
- **Output**: `DailyChallenge` (5 targeted tasks: 3 Guided Examples, 2 Challenge Problems).
- **Role**: Generates the "Next Step" curriculum tailored to the specific error detected.
- **Example**: "Since you made a procedural error in Vector Addition, here are 3 guided examples on component decomposition and 2 challenge problems on relative motion."

### Agent 4: The Motivator (Engagement Agent)
- **Context**: Psychological support and student retention.
- **Input**: Mastery trends + Diagnostic Report + Confidence Score.
- **Output**: `ProtectiveFeedback` (Encouraging messages and milestones).
- **Role**: Ensures the student remains engaged and doesn't feel overwhelmed by "Red" nodes in the DAG.
- **Logic**: "Celebrate the 0.02 mastery gain in Displacement to soften the blow of the 0.05 loss in Projectile Motion."

---

## 3. Enhanced Payload Types (Derived from Quiz)
To power this MAS, we propose adding the following telemetry points to the quiz payload:

1. **Hesitation Index (Time-on-Task)**:
   - *Data*: Seconds spent on a question vs. average.
   - *Insight*: Long time + Correct = "Low Fluency". Short time + Wrong = "Impulsive/Guessing".
2. **Distractor Affinity**:
   - *Data*: Which specific incorrect option was chosen.
   - *Insight*: Choosing "Option A (Linear Sum)" in a vector problem confirms a specific 1D-thinking misconception.
3. **Confidence Self-Report**:
   - *Data*: Student's rating (1-5) of their answer confidence.
   - *Insight*: High Confidence + Wrong Answer = "Deep Misconception" (High priority for Agent 2).

---

## 4. Implementation Roadmap
1. **Phase 1 (Completed)**: Agent 1 (Pathing) and Agent 2 (Suggest) are operational.
2. **Phase 2 (Completed)**: Implement Agent 3 (Action) to generate dynamic markdown-based practice sheets.
3. **Phase 3 (Completed)**: Implement the "Agent Handover" protocol where Agent 2's output is explicitly piped into Agent 3's prompt.
4. **Phase 4 (Completed)**: Add the Engagement Agent (Agent 4) to the UI for real-time "Protective" coaching and momentum tracking.
5. **Phase 5 (Future)**: Real-time collaborative canvas for Agent 3's sketching tasks.
