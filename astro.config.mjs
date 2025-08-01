// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://crescendostage.com",
  integrations: [mdx(), sitemap()],
  vite: {
    resolve: { alias: { "@styles": "/src/sass/foundation/_index.scss" } },
  },
});
