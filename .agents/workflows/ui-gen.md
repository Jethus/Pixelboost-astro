---
description: UI generation
---

The "Lombiq Reference" Rule: Before generating any complex UI component, the agent must first consult the local docs-index.tsx map provided by the Lombiq skill.

v4 Strictness: The agent must strictly adhere to the Tailwind v4 curated "gotchas" list to avoid generating legacy v3 configuration files or deprecated class names. All theme customizations (colors, fonts, spacing for the local businesses) should be done using the new v4 CSS-variable approach in your main CSS file, rather than a JS config file, as per v4 best practices.
