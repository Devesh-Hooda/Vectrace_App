# VECTRACE: Multi-Agent System (MAS) Architecture

VECTRACE utilizes a sophisticated Multi-Agent System powered by Gemini 2.0 Flash to provide a personalized, data-driven learning experience for Physics students. The system follows a "Sense-Analyze-Act" loop where specialized agents collaborate to optimize the student's learning trajectory.

## 🤖 The Agent Ensemble

### 1. Agent 1: The Architect (Strategic Planning)
*   **Mathematical Basis**: Weighted Graph Traversal & Mastery Optimization.
*   **Role**: Analyzes the entire Knowledge DAG (Directed Acyclic Graph).
*   **Objective**: Identifies high-impact bottlenecks where resolving a weak prerequisite will "unlock" the most dependent topics.
*   **Output**: A sequenced Learning Path that balances "Confidence Boosters" (mastered topics) with "Growth Targets" (weak topics).

### 2. Agent 2: The Diagnostician (Tactical Analysis)
*   **Mathematical Basis**: Signal Analysis & Error Categorization.
*   **Role**: Analyzes recent quiz performance data.
*   **Objective**: Separates "Conceptual Gaps" (mental model errors) from "Procedural Friction" (calculation/step errors).
*   **Output**: A structured diagnostic report with an "Immediate Priority" focus area.

### 3. Agent 3: The Content Creator (Execution)
*   **Mathematical Basis**: Scaffolding Complexity Scaling (Zone of Proximal Development).
*   **Role**: Generates personalized practice content.
*   **Objective**: Creates 5 targeted tasks (3 Guided Examples, 2 Challenge Problems) tailored to the specific error signals detected by the Diagnostician.
*   **Output**: Markdown-formatted practice problems with expert hints.

### 4. Agent 4: The Motivator (Engagement)
*   **Mathematical Basis**: Mastery Velocity & Momentum Tracking.
*   **Role**: Frames progress and maintains engagement.
*   **Objective**: Calculates "Mastery Velocity" (rate of improvement) and provides proactive, protective framing to prevent frustration.
*   **Output**: Personalized encouragement messages and milestone alerts.

## 🔄 The Collaborative Flow

1.  **Data Ingestion**: The system pulls the latest `graph_state` (DAG) and `quiz_history`.
2.  **Diagnostic Trigger**: When a user requests a refresh, **Agent 2** performs a deep dive into recent errors.
3.  **Content Handover**: **Agent 2** passes the "Immediate Priority" and "Error Signal" to **Agent 3**.
4.  **Task Generation**: **Agent 3** generates the **Daily Challenge** curriculum.
5.  **Engagement Layer**: **Agent 4** reviews the performance summary and frames the entire report with a motivational layer.
6.  **UI Rendering**: The results are cached and displayed across the **AI Suggestions** (Analysis) and **Daily Challenge** (Practice) tabs.

## 🛡️ Reliability & Fallbacks

To ensure a seamless experience even during high API traffic or quota exhaustion, VECTRACE implements a **Graceful Degradation** strategy:
*   **Quota Mode**: If the Gemini API returns a 429 (Resource Exhausted) error, the system automatically switches to a high-fidelity **Fallback Diagnostic Report**.
*   **Offline Insights**: Users are notified when the system is in "Offline Mode," ensuring they always have actionable tasks to work on.
