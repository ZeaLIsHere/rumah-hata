---
name: graphify
description: Creating architectural diagrams, sequence diagrams, user flows, and ERDs using Mermaid syntax compatible with GitHub and documentation.
---

# Graphify Skill

Use this skill when asked to create diagrams, visualize software architecture, chart database relationships, or map user journeys using Mermaid syntax.

## Supported Types & Rules

1. **Architecture & Flowcharts (`flowchart TD` or `graph TD`)**:
   - Prefer top-down (`TD`) layout for narrower visual profiles.
   - Use subgraphs to group tiers (Client Tier, Edge Gateway, Application Core, Database & Cache).
   - Label edges with protocol or payload context: `A -->|HTTPS / REST| B`.
2. **Entity-Relationship Diagrams (`erDiagram`)**:
   - Define exact table names, primary keys (`PK`), foreign keys (`FK`), and attribute types.
   - Use standard cardinality symbols: `||--o{`, `}|--||`.
3. **Sequence Diagrams (`sequenceDiagram`)**:
   - Explicit participant names.
   - Use solid lines (`->>`) for synchronous calls and dashed (`-->>`) for responses.
4. **Formatting Constraints**:
   - Do NOT include inline HTML tags or hex colors in diagrams.
   - Do NOT use `%%{init}%%` directives; allow editor theme engine to handle styles.
