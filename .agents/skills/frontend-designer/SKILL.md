---
name: frontend-designer
description: Production-grade frontend component engineering, modern responsive styling with Tailwind CSS, micro-interactions, layout ergonomics, and visual polish.
---

# Frontend Designer Skill

Use this skill when implementing responsive UI components, structuring React/Next.js pages, writing Tailwind styling, and crafting polished layouts.

## Engineering Principles

1. **Mobile-First Responsive Layouts**:
   - Base classes target mobile viewports (375px+).
   - Use `sm:`, `md:`, `lg:`, `xl:` breakpoints for fluid layout expansion.
   - Prevent horizontal overflow (`overflow-x-hidden`, sensible max-widths `max-w-7xl mx-auto`).
2. **Component Ergonomics**:
   - Pure, composable component APIs with clear TypeScript props.
   - Separate data-fetching from visual presentation where appropriate.
   - Handle loading, empty, and error states natively in every card/table view.
3. **Color Palette & Contrast**:
   - Primary brand tones with balanced neutral slates (`slate-50` to `slate-900`).
   - Semantic status colors: Emerald (success), Amber (pending/warning), Rose (error), Blue (informational/action).
4. **Interaction Polish**:
   - Smooth transition timing (`transition duration-200 ease-in-out`).
   - Tactile button states (`hover:bg-`, `active:scale-95`, `disabled:opacity-50`).
