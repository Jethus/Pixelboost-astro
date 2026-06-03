// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://pixelboost.ca",
  integrations: [mdx(), sitemap(), react()],

  // Prism, not Shiki: Shiki emits inline styles per token, which violate
  // our strict CSP (security.csp). Prism uses classes — CSP-safe.
  markdown: { syntaxHighlight: "prism" },

  vite: {
    plugins: [tailwindcss()],
  },

  security: { csp: true },

  experimental: {
    rustCompiler: true,
    queuedRendering: { enabled: true },
  },

  adapter: cloudflare(),
});