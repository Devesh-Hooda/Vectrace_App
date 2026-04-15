# Knowledge DAG: Technical Details & Graph Properties

This document outlines the underlying structure and properties of the Knowledge Directed Acyclic Graph (DAG) used in VECTRACE.

## 1. Graph Structure
The system represents Physics concepts as a **Directed Acyclic Graph (DAG)**.
- **Nodes**: Represent individual learning objectives (e.g., `vector_addition`, `projectile_motion`).
- **Edges**: Represent prerequisite relationships. An edge from Node A to Node B implies that A must be understood before B can be effectively mastered.

## 2. Node Properties
Each node in the `graph_state` contains the following telemetry:

| Property | Type | Description |
| :--- | :--- | :--- |
| `mastery` | `number` | A float (0.000 to 1.000) representing the student's proficiency. |
| `attempts` | `number` | Total number of times the student has interacted with this topic. |
| `conceptual_error_count` | `number` | Errors caused by a lack of understanding of the core principle. |
| `procedural_error_count` | `number` | Errors caused by calculation mistakes or incorrect steps despite understanding the concept. |
| `guess_count` | `number` | Instances where the student likely guessed (detected via response time or pattern). |
| `prerequisites` | `string[]` | A list of node IDs that are required to be mastered before this node. |

## 3. Propagation of Weakness
Weakness in the DAG propagates through the **Dependency Chain**:

### A. Structural Blocking (The Bottleneck Effect)
If a "Root Node" (e.g., `vector_addition`) has low mastery, the system identifies it as a **Critical Bottleneck**. Because advanced nodes (e.g., `projectile_motion`) depend on it, the student's ability to gain mastery in the dependent nodes is capped or significantly slowed.

### B. AI-Driven Remediation
The Agentic AI analyzes the DAG to find these bottlenecks. Instead of just suggesting the lowest mastery score, it looks for the **lowest mastery score with the highest number of dependents**.
- **Example**: If `displacement` (0.3) and `time_of_flight` (0.2) are both weak, the AI will prioritize `displacement` because it is a prerequisite for `velocity`, `acceleration`, and `projectile_motion`.

### C. Error Type Propagation
- **Conceptual Weakness**: Propagates as a "Hard Block." If a student doesn't understand the concept of a vector, they cannot perform any 2D kinematics.
- **Procedural Weakness**: Propagates as "Friction." The student understands the physics but fails the math, leading to high attempts with low mastery gain in all dependent nodes.

## 4. Mastery Update Logic (Bayesian-lite)
Mastery is updated using a weighted delta:
`New Mastery = Max(0, Min(1, Current Mastery + (Result * Weightage)))`
- **Correct Answer**: Positive delta based on question difficulty.
- **Incorrect Answer**: Negative delta, weighted by the `error_type`. Conceptual errors result in a larger mastery drop than procedural ones.

## 5. Multi-Agent System (MAS) Architecture
The system utilizes a collaborative **Multi-Agent System (MAS)** where specialized agents work in sequence to provide a 360-degree learning experience.

### A. Agent Handover Protocol
1. **Agent 1: The Architect (Revision & Pathing)**
   - **Role**: Strategic planner.
   - **Input**: Full Knowledge DAG state.
   - **Output**: Optimized Revision Pathway (Sequence of topics).
   - **Mathematics**: Weighted Graph Traversal ($f(n) = (1-M) \cdot \text{Descendants}$).

2. **Agent 2: The Diagnostician (Suggest Agent)**
   - **Role**: Tactical analyst.
   - **Input**: Latest Quiz Payload.
   - **Output**: Diagnostic Report (Conceptual vs. Procedural gaps).
   - **Mathematics**: Signal-to-Noise Analysis ($S = \Sigma(w \cdot E) / \Sigma w$).

3. **Agent 3: The Content Creator (Action Agent)**
   - **Role**: Practical execution.
   - **Input**: Output from Agent 1 (Target Topic) + Output from Agent 2 (Error Pattern).
   - **Output**: Personalized Practice Tasks (Scaffolded exercises).
   - **Mathematics**: Zone of Proximal Development ($D = Mastery + 0.1$).

4. **Agent 4: The Motivator (Engagement Agent)**
   - **Role**: Psychological support.
   - **Input**: Mastery trends + Diagnostic Report.
   - **Output**: Protective Feedback and momentum-based engagement messages.
   - **Mathematics**: Mastery Velocity ($V = \Delta M / \Delta t$).

## 6. Enhanced Telemetry Payloads
To power the MAS, the system utilizes advanced telemetry derived from student interactions:

- **Hesitation Index (Time-on-Task)**: Tracks the time spent per question compared to global averages to detect "Low Fluency" or "Impulsive Guessing."
- **Distractor Affinity**: Maps specific incorrect answer choices to deep-seated mental model misconceptions (e.g., 1D vs. 2D vector thinking).
- **Confidence Delta**: Calculates the gap between a student's self-reported confidence and their actual accuracy to identify "Overconfident Misconceptions."

## 7. Agent Persona & Tone Control
To maximize student engagement and psychological safety, the Suggest Agent is governed by a specific **Tone & Boundary Framework**:

- **Proactive Guidance**: The agent is instructed not only to identify gaps but to provide immediate, actionable "next steps" (e.g., suggesting a specific sketching technique for vector visualization).
- **Protective Framing**: Weaknesses are framed as "areas for reinforcement" or "temporary hurdles." This prevents the "failure stigma" and encourages a growth mindset by highlighting mastered prerequisites alongside current challenges.
- **Contextual Boundaries**: The agent is restricted to Physics-specific diagnostics, ensuring it remains a focused educational tool rather than a general-purpose chatbot.

## 7. Optimization & Session Management
To ensure performance efficiency and minimize API costs, the system implements the following:

- **Report Caching**: AI-generated diagnostic reports are cached at the application level using the `quiz_id` as a unique key. If a student revisits the Suggestions tab for the same quiz, the report is served instantly from the cache.
- **Session-Based Wiping**: The cache is cleared upon every new login/session entry (`wipeAISuggestions`). This ensures that the demo environment remains fresh for each user while maintaining high performance during an active study session.
