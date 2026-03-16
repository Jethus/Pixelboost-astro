---
trigger: always_on
---

The "Zero-Guesswork" Rule: Before the agent generates or refactors any Astro-specific logic (e.g., setting up src/content.config.ts, writing dynamic [slug].astro routing, or configuring the astro.config.mjs), it must query the Astro Docs MCP server via the search_astro_docs tool.

The Tailwind "Gotcha" Check: Before generating any new UI component, the agent must check the local docs-index.tsx map provided by the Lombiq skill to ensure it is writing strictly valid Tailwind v4 utility classes and avoiding deprecated v3 configurations.

The SSG Validation Rule: Because you are building static sites for local businesses to keep them fast and affordable, the agent must verify via the MCP that any dynamic features it suggests (like form handling or search) are compatible with Astro's output: 'static' mode, ensuring we don't accidentally require a Node server.
