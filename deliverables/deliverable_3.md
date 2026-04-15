# Deliverable 3: Concept Mastery Model

## 1. Current Prototype & Functionalities
The **Concept Mastery Model** is a rule-based engine that dynamically calculates a student's proficiency level across the Knowledge DAG.
- **Real-time Updates**: Mastery levels are recalculated immediately after each quiz submission.
- **Diagnostic Weighting**: The model differentiates between types of errors, applying different mathematical weights to the mastery score based on the diagnostic signal (Conceptual, Procedural, or Guess).
- **Telemetry Integration**: The model tracks not just the score, but the *nature* of the student's interaction (attempts, error counts).

## 2. Mathematical Basis
The system utilizes a **Bayesian-lite Update Model** to ensure that mastery reflects a stable trend rather than a single lucky or unlucky response.

### The Mastery Formula
$$M_{new} = \text{clamp}(0, 1, M_{old} + \Delta)$$

Where:
- **$M$**: Mastery level ($0.000$ to $1.000$).
- **$\Delta$**: The update delta (weightage) derived from the diagnostic signal.
- **$\text{clamp}$**: A function ensuring the value stays within the $[0, 1]$ range.

### Diagnostic Weights ($\Delta$)
| Signal Type | Delta ($\Delta$) | Rationale |
| :--- | :--- | :--- |
| **Correct** | $+0.020$ | Rewards consistent performance with steady growth. |
| **Conceptual Error** | $-0.035$ | High penalty; indicates a fundamental flaw in the mental model. |
| **Procedural Error** | $-0.015$ | Low penalty; indicates a "slip" rather than a lack of understanding. |
| **Guess** | $-0.025$ | Moderate penalty; discourages low-confidence behavior. |

## 3. Code Implementation
The core logic resides in `src/App.tsx` within the `handleQuizComplete` function.

```typescript
// src/App.tsx - Mastery Update Logic

quizResults.questions.forEach((q: any) => {
  const topic = q.topic;
  if (userDag.graph_state[topic]) {
    const state = userDag.graph_state[topic];
    state.attempts += 1;
    
    // Increment specific error telemetry
    if (q.error_type === "conceptual") state.conceptual_error_count += 1;
    if (q.error_type === "procedural") state.procedural_error_count += 1;
    if (q.error_type === "guess") state.guess_count += 1;
    
    // Bayesian-lite update formula
    // q.weightage is the Delta (Δ) defined in the quiz-questions.json
    state.mastery = Number(
      Math.max(0, Math.min(1, state.mastery + q.weightage)).toFixed(3)
    );
  }
});
```

## 4. Propagation of Conceptual Weakness
The model propagates weakness through the **Dependency Chain** defined in the Knowledge DAG.

### Logic Flow:
1. **Detection**: If a node's mastery $M < 0.4$, it is flagged as a "Critical Weakness."
2. **Recursive Check**: The system identifies all child nodes where `prerequisites` include the flagged node.
3. **Blocking Signal**: Even if a child node has a high mastery score, the system treats it as "Unstable" or "Blocked" because its foundation is compromised.
4. **AI Prioritization**: The Suggest Agent uses this propagation to override simple score-based sorting. It will prioritize a 0.3 mastery "Root" node over a 0.1 mastery "Leaf" node because fixing the root is the only way to stabilize the leaf.

## 5. Future Implementations
- **Mastery Volatility Tracking**: Calculating the standard deviation of mastery updates to detect "inconsistent" learners.
- **Time-Decay Function**: Implementing $M_{t} = M_{0} \cdot e^{-kt}$ to model the forgetting curve of concepts not practiced recently.
- **Back-Propagation**: Allowing high mastery in advanced nodes to "pull up" the mastery of prerequisites (e.g., mastering Projectile Motion implies a retrospective mastery of Vector Addition).
