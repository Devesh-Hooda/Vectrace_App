# Multi-Agent System (MAS): Mathematical Basis & Context

This document explains the mathematical foundations, contextual logic, and safety guardrails for the VECTRACE Multi-Agent System.

---

## 1. Agent 1: The Architect (Revision & Pathing)
**Context**: Strategic long-term planning of the student's learning journey.

### Mathematical Basis: Weighted Graph Traversal
The Architect uses an **Objective Function** to identify the most critical nodes in the Knowledge DAG:
$$f(n) = (1 - M_n) \cdot \text{Count}(\text{Descendants}_n)$$
- $M_n$: Current mastery of node $n$.
- $\text{Count}(\text{Descendants}_n)$: The number of advanced topics that depend on node $n$.

**Logic**: A node with low mastery that blocks many other nodes is a "Critical Bottleneck." The Architect prioritizes these to maximize the total "Graph Stability."

### Safety Guardrails
- **Prerequisite Constraint**: $M_{\text{prereq}} \ge 0.4$. If any prerequisite falls below this threshold, the dependent node is strictly "Locked" to prevent cognitive overload.
- **Path Length Limit**: Maximum 5 steps to ensure the student doesn't feel overwhelmed.

---

## 2. Agent 2: The Diagnostician (Suggest Agent)
**Context**: Immediate tactical analysis of the student's latest performance.

### Mathematical Basis: Signal-to-Noise Analysis
The Diagnostician calculates the **Weighted Error Signal** ($S$):
$$S = \frac{\sum (w_i \cdot E_i)}{\sum w_i}$$
- $w_i$: The weightage (difficulty) of question $i$.
- $E_i$: Error indicator ($1$ if wrong, $0$ if correct).

**Logic**: By analyzing the distribution of $E_{\text{conceptual}}$ vs $E_{\text{procedural}}$, the agent determines if the student has a "Mental Model Gap" or a "Calculation Friction."

### Safety Guardrails
- **Domain Lockdown**: Strictly restricted to Physics diagnostics.
- **Non-Clinical**: Explicitly forbidden from making psychological or medical assessments.

---

## 3. Agent 3: The Content Creator (Action Agent)
**Context**: Generating personalized practice content.

### Mathematical Basis: Zone of Proximal Development (ZPD)
The agent sets the **Task Difficulty** ($D$) based on current mastery:
$$D = M_{\text{target}} + \sigma$$
- $\sigma$: A "Step-Up" constant (typically $0.1$) to ensure the task is challenging but achievable.

**Scaffolding Logic**:
- **Conceptual Error**: Uses "First Principles" scaffolding (visual aids, conceptual analogies).
- **Procedural Error**: Uses "Algorithmic" scaffolding (step-by-step calculation guides).

### Safety Guardrails
- **Constant Verification**: All physical constants (e.g., $g = 9.8 \, \text{m/s}^2$) must be verified against standard values.

---

## 4. Agent 4: The Motivator (Engagement Agent)
**Context**: Psychological support and momentum tracking.

### Mathematical Basis: Mastery Velocity ($V$)
The agent tracks the rate of change in mastery over time:
$$V = \frac{M_{\text{now}} - M_{\text{prev}}}{\Delta t}$$

**Momentum Logic**:
- $V > 0$: Amplify success and set "Stretch Goals."
- $V < 0$: Trigger "Protective Framing" to prevent frustration and highlight "Mastery Resilience."

### Safety Guardrails
- **Authenticity Filter**: Avoids "Toxic Positivity." Acknowledges the objective difficulty of the topic to maintain student trust.

---

## 5. Logging & Handover
Every agent interaction is logged with:
- `timestamp`: Execution time.
- `duration`: Latency in milliseconds.
- `payload`: The structured JSON output.
- `agent_id`: Version tracking for A/B testing.
