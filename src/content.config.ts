import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  // Type-check frontmatter using a schema
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
      // Optional FAQ: renders a visible FAQ section AND emits FAQPage JSON-LD
      // (single source of truth — schema and visible Q&A never drift).
      faq: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .optional(),
      // Opt a post into the live audit tool, rendered under the title. For posts that
      // rank on tool intent ("test my website speed"), where prose alone earns
      // impressions but no clicks. Off by default — it loads the React island.
      scanTool: z.boolean().default(false),
    }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      tags: z.string(),
      image: image(),
      imageMobile: image().optional(),
      url: z.string().optional(),
      outcome: z.string().optional(),
      location: z.string().optional(),
      summary: z.string().optional(),
      stats: z.array(z.object({
        label:  z.string(),
        before: z.string(),
        after:  z.string(),
      })).optional(),
      kpi: z.string().optional(),
    }),
});

export const collections = {
  blog,
  portfolio,
};
