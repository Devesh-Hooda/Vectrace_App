# Aarav (Beginner) Profile - Baseline Assumptions & Parameter Changes

This file tracks the changes made to the baseline assumptions and parameters for the Aarav profile to ensure a realistic beginner experience.

## Baseline Assumptions (Initial State)
- **User Type**: Beginner student.
- **Engagement**: Low total hours on the platform.
- **Knowledge State**: Fragmented understanding of Kinematics.
- **Error Patterns**: High conceptual error rate in foundational topics (Vectors, Displacement).

## Parameter Changes (April 13, 2026)

### 1. Mastery Levels (Knowledge DAG)
- **Vector Addition**: Reduced from ~0.31 to **0.25**. Reflects a student who has just started and is struggling with the geometric interpretation.
- **Displacement/Velocity**: Adjusted to **0.30** and **0.28** respectively.
- **Advanced Topics (Projectile Motion, Range)**: Set to near-zero or baseline (**0.10 - 0.15**) as a beginner would likely not have reached these with any proficiency.

### 2. Engagement Metrics
- **Attempts**: Reduced total attempts across all nodes to reflect "less hours on the app". Most nodes now have **1-2 attempts** instead of 5-6.
- **Error Counts**: Reset to reflect a shorter history.

### 3. Quiz History
- **Total Quizzes**: Reduced to **1 recent quiz** instead of a long history.
- **Performance**: The last quiz shows a mix of "Conceptual Errors" and "Guesses", consistent with a beginner profile.

## Pedagogical Strategy
- **Learning Path**: Reordered to show "Mastered" (or higher mastery) topics first to build confidence before presenting "Unmastered" (weakness) topics.
- **Focus**: Prioritize foundational vector math before moving to 2D kinematics.

### 4. Progress Update (April 15, 2026)

- **Mastery Growth**: Foundational topics (Vector Addition, Displacement, Velocity) increased by **~0.10** each.
- **Quiz Performance**: Added `qz_002` showing **100% accuracy** on basic problems, moving the profile from "Fragmented" to "Emerging Mastery".
- **Engagement**: Total attempts on foundational nodes increased to **4**, reflecting active practice.

## Pedagogical Strategy (Updated)
- **Next Phase**: Introduce more complex 2D motion (Unit Vectors, Projectile Motion) as foundational confidence is now established.
- **AI Suggestions**: Should now focus on bridging the gap between 1D and 2D kinematics.

## Documentation Changes
- Updated `src/data/user-dags.json` and `src/data/quiz-history.json` to reflect the above progress.
- Verified that the Multi-Agent System (MAS) correctly identifies the new mastery state.
