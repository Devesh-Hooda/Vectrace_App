# Deliverable 2: Diagnostic Quiz Module

## 1. Current Prototype & Functionalities
The **Diagnostic Quiz Module** is an interactive assessment engine designed to go beyond simple "right/wrong" scoring.
- **Dynamic Question Engine**: Shuffles questions and options to prevent rote memorization.
- **Timed Assessment**: Implements a 20-minute countdown to simulate exam pressure and detect "guessing" under time constraints.
- **Real-time Feedback**: Provides immediate scoring and accuracy metrics upon completion.
- **Telemetry Capture**: Every answer choice is mapped to a specific diagnostic signal, which is then passed to the AI Suggest Agent.

## 2. Alignment with Deliverable
The module features a "curated set of physics questions" where each distractor (incorrect option) is intentionally designed to capture a specific diagnostic signal:
- **Conceptual Error**: Options that reflect a fundamental misunderstanding of the physics principle (e.g., confusing distance with displacement).
- **Procedural Error**: Options that reflect a calculation or step-based mistake despite understanding the concept (e.g., adding magnitudes instead of using the Pythagorean theorem for perpendicular vectors).
- **Guessing**: Options that are mathematically plausible but physically irrelevant, or "none of the above" choices used to detect low-confidence responses.

## 3. Context & Significance
Standard quizzes only tell a teacher *that* a student is failing. The Diagnostic Quiz Module tells the teacher *why*. By categorizing errors at the source, the system can differentiate between a student who needs a calculator (procedural) and a student who needs a new mental model (conceptual).

## 4. Diagnostic Signal Mapping (Example)
**Question**: "Two perpendicular vectors of magnitudes 3 and 4 units are added. What is the magnitude of the resultant?"

| Option | Value | Signal Type | Logic |
| :--- | :--- | :--- | :--- |
| A | 7 | **Conceptual Error** | Student is adding magnitudes linearly, ignoring vector direction. |
| B | 5 | **Correct** | Student correctly applied the Pythagorean theorem. |
| C | 1 | **Procedural Error** | Student subtracted instead of adding (likely a sign error). |
| D | 12 | **Guess** | Student multiplied the numbers, showing no clear strategy. |

## 5. Future Implementations
- **Adaptive Difficulty**: Dynamically adjusting the next question's difficulty based on the diagnostic signal of the previous answer.
- **Confidence Self-Reporting**: Asking students to rate their confidence (1-5) for each answer to better distinguish between "lucky guesses" and "confident misconceptions."
- **Multi-Step Diagnostics**: Breaking down complex problems into sub-steps to pinpoint exactly where the procedural error occurred.
