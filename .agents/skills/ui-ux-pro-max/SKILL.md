---
name: ui-ux-pro-max
description: High-level UI/UX design heuristics, accessibility (WCAG 2.2 AA), interaction design, design system tokens, usability audit, and user testing methodology.
---

# UI/UX Pro Max Skill

Use this skill when auditing, designing, or polishing user interfaces, ensuring accessibility compliance (WCAG 2.2 AA), formulating usability testing protocols (SUS), and structuring design tokens.

## Core Rules

1. **Accessibility (WCAG 2.2 AA Strict)**:
   - Contrast ratio: Minimum 4.5:1 for normal text, 3:1 for large text (>= 18pt / 14pt bold).
   - Interactive focus states: Visible `:focus-visible` with minimum 2px offset.
   - Screen reader support: Explicit `aria-label`, `aria-expanded`, `aria-live` for dynamic regions, semantic HTML (`<main>`, `<nav>`, `<article>`, `<header>`).
   - Keyboard navigability: All interactive controls accessible via `Tab`, `Enter`, and `Space`. Skip-to-content link required.
2. **Design Tokens & Visual Rhythm**:
   - Spacing: Strict 4px/8px scale (`p-2`, `p-4`, `p-6`, `p-8`).
   - Typography scale: Clear visual hierarchy from `text-xs` to `text-3xl`.
   - Micro-feedback: Skeleton loading for async data, explicit empty states, and toast confirmation for state mutations.
3. **Usability Evaluation (SUS Framework)**:
   - 10-item System Usability Scale instrument (Brooke, 1996).
   - Task completion rate and time-on-task measurement.
   - Usability score benchmarks: >= 68 (Average), >= 80.3 (Grade A / Excellent).
