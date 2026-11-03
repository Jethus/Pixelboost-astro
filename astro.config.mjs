// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync } from "node:fs";

// Sitemap <lastmod> for blog posts, from frontmatter (updatedDate, else
// pubDate). Only real content dates go in: a lastmod that changes every build
// teaches Google to ignore it, so non-blog pages get none.
const blogLastmod = Object.fromEntries(
  readdirSync("src/content/blog")
    .filter((f) => /^[^_].*\.mdx?$/.test(f))
    .map((f) => {
      const src = readFileSync(`src/content/blog/${f}`, "utf8");
      const date = (src.match(/^updatedDate:\s*"?(\d{4}-\d{2}-\d{2})/m) ??
        src.match(/^pubDate:\s*"?(\d{4}-\d{2}-\d{2})/m))?.[1];
      return [`/blog/${f.replace(/\.mdx?$/, "")}`, date];
    })
    .filter(([, date]) => date),
);
blogLastmod["/blog"] = Object.values(blogLastmod).sort().at(-1);

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
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, "") || "/";
        const date = blogLastmod[path];
        if (date) item.lastmod = new Date(date).toISOString();
        return item;
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    rustCompiler: true,
    queuedRendering: { enabled: true },
  },
});
