---
trigger: always_on
---

Strict Type-Safety: All .md and .mdx files must be governed by a Zod schema in the content.config.ts.

When to use MD vs MDX: \* Use .md for simple text and image content (e.g., basic blog posts or the services).

Use .mdx only when a client needs interactive components embedded directly inside their long-form text (e.g., rendering a <PricingCalculator /> halfway through a service description).
