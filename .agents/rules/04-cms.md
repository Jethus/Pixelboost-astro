---
trigger: always_on
---

The Keystatic Rule: All content modeling must be done in keystatic.config.ts using @keystatic/core fields. This acts as the single source of truth for the client's editing UI. The agent must ensure that the Keystatic schema perfectly mirrors the Zod schema in src/content.config.ts so the Astro build never fails.
