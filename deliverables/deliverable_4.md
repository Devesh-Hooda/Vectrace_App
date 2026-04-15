# Deliverable 4: Adaptive Revision Recommendation Engine

## 1. Current Prototype & Functionalities
The **Adaptive Revision Recommendation Engine** is a scheduling module that transforms raw mastery data into a personalized learning journey.
- **Dynamic Sequencing**: Automatically reorders topics to build student confidence by starting with "Mastered" concepts before tackling "Weaknesses."
- **Daily Challenge Integration**: Directly feeds into the **Daily Challenge** tab, providing 5 targeted tasks (3 Guided, 2 Challenge) for the highest-impact topics.
- **Multi-Agent Coordination**: The engine works in tandem with the **Diagnostician Agent** to prioritize topics that have the highest impact on the overall graph mastery.

## 2. Alignment with Deliverable
The engine generates "Personalized Revision Pathways" by analyzing the student's unique mastery state:
- **Confidence-First Pathing**: A rule-based heuristic that places high-mastery topics at the start of the path to reduce cognitive load and anxiety.
- **Bottleneck Identification**: Prioritizes "Root" nodes in the DAG that are currently blocking progress in multiple "Leaf" nodes.
- **Reinforcement Loops**: Automatically schedules revision for "Medium Mastery" topics to prevent regression (the "forgetting curve").

## 3. Context & Significance
In traditional learning, students often don't know *what* to study next. They either repeat what they already know or jump into topics they aren't ready for. The Adaptive Engine removes this guesswork by providing a mathematically optimized sequence that maximizes the probability of successful learning.

## 4. Recommendation Logic (Example)
**Student State**:
- `vector_addition`: 0.35 (Weak)
- `displacement`: 0.85 (Mastered)
- `projectile_motion`: 0.20 (Weak)

**Generated Revision Pathway**:
1. **Reinforce**: `displacement` (Reason: Build momentum and confirm basic 1D motion understanding).
2. **Critical Fix**: `vector_addition` (Reason: Foundational bottleneck for all 2D motion).
3. **Advanced Practice**: `projectile_motion` (Reason: Only attempted after vector addition is stabilized).

## 5. Code Implementation (Prompt Logic)
The engine is powered by the `generateLearningPath` function in `src/services/geminiService.ts`.

```typescript
// Prompt Logic for Revision Pathway
const prompt = `
  ORDERING: The learning path MUST show "mastered" (higher mastery) topics FIRST, 
  followed by "unmastered" (lower mastery) topics. This builds confidence.
  
  TASK:
  1. Identify the 3 worst mastery topics (Focus Topics).
  2. Generate an optimized Learning Pathway (sequence of steps).
  3. The pathway should optimize the average mastery score.
`;
```

## 6. Future Implementations
- **Spaced Repetition Integration**: Using mastery decay rates to schedule revision exactly when a student is about to forget a concept.
- **Time-to-Mastery Estimates**: Predicting how many hours/quizzes are needed to reach 0.90 mastery based on current progress rates.
- **Interleaved Practice**: Mixing questions from different topics in the revision path to improve long-term retention.
