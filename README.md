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

### 4. Multi-Agent AI Architecture
- **Suggest Agent**: Analyzes student telemetry to generate proactive and protective diagnostic reports.
- **Action Agent**: (In Development) Generates specific practice tasks and interactive exercises based on the Suggest Agent's findings.
- **Report Caching**: Optimized API usage with session-based caching to prevent redundant token consumption.

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
- [System Details & Agent Personas](./details.md)

## 🛠️ Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables (see `.env.example`).
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*VECTRACE - Precision in Learning, Mastery in Motion.*
