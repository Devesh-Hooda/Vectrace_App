# VECTRACE: AI-Driven Physics Learning Platform

VECTRACE is a sophisticated, multi-agent educational platform designed to provide diagnostic and adaptive learning experiences for Physics, specifically focusing on Kinematics. It leverages a dependency-aware knowledge graph and AI-driven insights to identify student weaknesses and provide personalized remediation paths.

## 🚀 Key Features

### 1. Dependency-Aware Knowledge Graph (DAG)
- **Structured Learning**: A hierarchical graph representing relationships between concepts like Vectors, Displacement, Velocity, and Acceleration.
- **Weakness Propagation**: Advanced logic that identifies how foundational gaps (e.g., Vector Addition) bottleneck advanced topics (e.g., Projectile Motion).
- **Interactive Visualization**: Real-time rendering of the knowledge state using D3.js in the Admin Dashboard.

### 2. Diagnostic Quiz Module
- **Signal-Based Assessment**: Questions are curated such that distractors correspond to specific diagnostic signals: **Conceptual Errors**, **Procedural Errors**, or **Guessing**.
- **Telemetry Capture**: Detailed tracking of student responses to feed the AI diagnostic engine.

### 3. Concept Mastery Model
- **Bayesian-lite Updates**: A rule-based system that updates mastery levels ($0.000$ to $1.000$) based on quiz performance and error types.
- **Diagnostic Weighting**: Different penalties for conceptual vs. procedural errors to accurately reflect the student's mental model.

### 4. Multi-Agent AI Architecture (MAS)
- **Agent 1: The Architect**: Strategically optimizes the learning journey using Weighted Graph Traversal to resolve foundational bottlenecks.
- **Agent 2: The Diagnostician**: Performs Signal Analysis on quiz telemetry to distinguish between conceptual gaps and procedural friction.
- **Agent 3: The Content Creator**: Generates 5 personalized, scaffolded practice tasks (3 Guided, 2 Challenge) based on the student's Zone of Proximal Development (ZPD).
- **Agent 4: The Motivator**: Tracks Mastery Velocity to provide protective framing and momentum-based engagement messages.
- **Collaborative Flow**: A sequential handover protocol where agents pipe insights to each other to build a 360-degree diagnostic report.
- **Daily Challenge System**: A dedicated practice environment hosting AI-generated curriculum for immediate remediation.
- **Quota Resilience**: Built-in fallback mechanisms to provide high-quality offline insights during API quota exhaustion.

### 5. Admin Dashboard
- **Real-time Telemetry**: Live view of student mastery, quiz history, and AI payloads.
- **Deliverable Proofs**: Dedicated section showcasing technical evidence for project milestones.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.0
- **UI Components**: shadcn/ui, Lucide React
- **Animations**: Framer Motion (motion/react)
- **Data Visualization**: D3.js
- **AI Engine**: Google Gemini API (@google/generative-ai)
- **State Management**: React Hooks with persistent session logic

## 📂 Project Structure

- `/src/components`: Reusable UI components and page sections.
- `/src/data`: Static data including the Knowledge DAG and Quiz Questions.
- `/src/services`: AI service integration (Gemini).
- `/deliverables`: Detailed documentation for project milestones.
- `details.md`: Technical deep-dive into system architecture and agent personas.

## 📖 Documentation

For more detailed information, please refer to:
- [Deliverable 1: Knowledge Graph](./deliverables/deliverable_1.md)
- [Deliverable 2: Diagnostic Quiz](./deliverables/deliverable_2.md)
- [Deliverable 3: Mastery Model](./deliverables/deliverable_3.md)
- [Deliverable 4: Adaptive Engine](./deliverables/deliverable_4.md)
- [Deliverable 5: Multi-Agent System](./deliverables/deliverable_5.md)
- [MAS Architecture & Flow](./Agent_flow.md)
- [System Details & Agent Personas](./details.md)

## 🛠️ Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables (see `.env.example`).
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*VECTRACE - Precision in Learning, Mastery in Motion.*
