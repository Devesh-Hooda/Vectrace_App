# VECTRACE - AI-Powered Physics Learning Platform

VECTRACE is a specialized educational application designed to help students master Physics (specifically Kinematics and Vectors) through a data-driven, personalized learning experience.

## How to Use

1. **Login**: Use the demo credentials provided on the login page.
   - **Aarav (Beginner)**: `aarav.beginner@vectrace.ai` / `1234`
   - **Meera (Advanced)**: `meera.advanced@vectrace.ai` / `1234`
2. **Dashboard**: View your personalized **Learning Path**, which is dynamically generated based on your mastery of specific physics concepts.
3. **Reading Material**: Study deep-dive content on Vectors and Kinematics, featuring JEE-level logic and examples.
4. **Quiz**: Test your knowledge. Your performance (conceptual vs. procedural errors) is tracked in real-time.
5. **AI Suggestions**: Get personalized study recommendations based on your latest quiz performance.
6. **Action Plan**: Review a strategic breakdown of your error patterns and specific steps to improve.
7. **Admin Debug**: (For developers) Monitor the raw Knowledge DAG states and the JSON payloads being fed to the AI agents.

## System Architecture

The system operates on a **Knowledge DAG (Directed Acyclic Graph)** model:
- **Nodes**: Represent specific physics concepts (e.g., `unit_vectors`).
- **Edges**: Represent prerequisite relationships.
- **Mastery State**: Each node has a mastery weight (0.000 to 1.000) updated via Bayesian-style logic after quizzes.
- **Error Tracking**: The system distinguishes between **Conceptual Errors** (misunderstanding of laws) and **Procedural Errors** (calculation/math slips).

## Feature Mapping

| Feature | Description | Data Source |
|---------|-------------|-------------|
| Dynamic Learning Path | Hierarchical roadmap of topics | `user-dags.json` |
| AI Study Insights | Personalized remediation | `quiz-history.json` |
| Action Plan | Error pattern analysis | `quiz-history.json` |
| Admin Dashboard | Debugging & DAG visualization | `user-dags.json` |
| Reading Material | JEE-level educational content | Local static content |

## UI Design Integrity Directive (FOR AGENTS)

> **CRITICAL INSTRUCTION FOR FUTURE AGENTS:**
> The UI/UX of VECTRACE follows a strict "Modern Educational" aesthetic characterized by:
> - **Typography**: Inter for UI, JetBrains Mono for data.
> - **Color Palette**: Primary Blue (#3b82f6), Success Green (#22c55e), Destructive Red (#ef4444), and Warning Yellow (#eab308).
> - **Components**: Strict adherence to the current `shadcn/ui` implementation and `motion` (Framer Motion) animations.
> 
> **YOU ARE FORBIDDEN FROM:**
> 1. Changing the global CSS theme or Tailwind configuration.
> 2. Altering the layout structure (Sidebar navigation + Main content area).
> 3. Modifying the visual style of Cards, Badges, or Buttons.
> 
> **YOU ARE PERMITTED TO:**
> 1. Add new feature tabs following the existing pattern.
> 2. Modify internal logic, data structures, and AI payload generation.
> 3. Enhance content within existing components without breaking the visual design language.
