// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://pixelboost.ca",
  // Canonical URLs carry no trailing slash (/about, not /about/). Astro emits
  // about.html instead of about/index.html, canonical tags drop the slash, and
  // Cloudflare Assets (trailing_slash="remove" in wrangler.toml) 308s the slash
  // form to the bare path so Google consolidates on one URL.
  trailingSlash: "never",
  build: {
    inlineStylesheets: "auto",
  },
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    rustCompiler: true,
    queuedRendering: { enabled: true },
  },
});
