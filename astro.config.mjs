// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://pixelboost.ca",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Lato",
      cssVariable: "--font-lato",
      options: {
        variants: [
          { weight: 700, style: "normal", src: ["./src/fonts/lato-v24-latin-700.woff2"] },
          { weight: 900, style: "normal", src: ["./src/fonts/lato-v24-latin-900.woff2"] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Noto Sans",
      cssVariable: "--font-noto-sans",
      options: {
        variants: [
          { weight: 400, style: "normal", src: ["./src/fonts/noto-sans-v39-latin-regular.woff2"] },
          { weight: 500, style: "normal", src: ["./src/fonts/noto-sans-v39-latin-500.woff2"] },
        ],
      },
    },
  ],
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  security: { csp: true },
  experimental: {
    rustCompiler: true,
    queuedRendering: { enabled: true },
  },
});
