# Deliverable 1: Dependency-Aware Knowledge Graph

## 1. Current Prototype & Functionalities
The current prototype features a fully functional **Directed Acyclic Graph (DAG)** that serves as the backbone of the student's knowledge state. 
- **Visualizer**: A D3.js-powered interactive graph in the Admin Dashboard that renders concepts hierarchically.
- **Node Telemetry**: Each concept (node) tracks mastery, attempts, and specific error types (conceptual vs. procedural).
- **Prerequisite Mapping**: Concepts are linked via `prerequisites` arrays, defining a strict learning order (e.g., `vector_addition` -> `displacement`).

## 2. Alignment with Deliverable
This prototype directly fulfills the requirement for a "structured graph representing relationships between physics concepts."
- **Concept Coverage**: Includes foundational vectors, 1D kinematics (displacement, velocity, acceleration), and 2D kinematics (projectile motion).
- **Dependency Awareness**: The system uses the graph structure to calculate "Before" and "After" states, ensuring that mastery updates respect the hierarchy.

## 3. Context & Significance
In Physics education, knowledge is cumulative. A "Dependency-Aware" approach is critical because it prevents students from attempting advanced problems (like calculating the Range of a projectile) when they have foundational gaps in prerequisite math (like resolving vector components). This deliverable transforms the learning experience from a linear list of topics into a logical, structured journey.

## 4. Propagation of Weakness (System Logic)
The system implements **Structural Propagation**. Weakness in a "Root" node creates a bottleneck for all "Leaf" nodes.

### Code Logic & Implementation
The propagation logic is implemented through a **Recursive Dependency Analysis** (currently utilized by the AI Suggest Agent and the Admin Dashboard):

1. **Graph Traversal**: The system parses the `graph_state` and identifies nodes with a "Mastery Deficit" (Mastery < 0.4).
2. **Dependency Mapping**: For each deficit node, the system performs a depth-first search (DFS) to find all child nodes that list it as a prerequisite.
3. **Blocking Signal**: If a parent node has low mastery, the system applies a "Blocking Signal" to all descendants. In the code, this is handled by the `Suggest Agent` which prioritizes the "Root of the Weakness" over the "Symptoms" (the dependent nodes).
4. **Mastery Update Weights**: When a student fails a question in a dependent node (e.g., `projectile_motion`), the system checks the mastery of its prerequisites. If prerequisites are weak, the negative weightage is increased, reflecting that the error is likely a "Propagated Weakness" from a foundational gap.

### Example: The Vector Bottleneck
1. **Root Node**: `vector_addition` (Mastery: 0.25)
2. **Dependent Node**: `projectile_motion` (Mastery: 0.12)
3. **Propagation**: Even if the student correctly identifies the physics formulas for projectile motion, they will consistently fail the final calculation because they cannot resolve the initial velocity vector into its `x` and `y` components. 
4. **System Response**: The AI Suggestion engine detects this propagation and redirects the student to `vector_addition` reinforcement, even if the student was specifically practicing `projectile_motion`.

## 5. Future Implementations
- **Cross-Domain Dependencies**: Integrating mathematical prerequisites (e.g., Trigonometry, Calculus) into the Physics DAG.
- **Dynamic Prerequisite Discovery**: Using machine learning to identify hidden dependencies based on student error patterns across thousands of users.
- **Mastery Decay**: Implementing a "forgetting curve" where mastery in parent nodes slowly decays if child nodes are not practiced, requiring periodic reinforcement.
