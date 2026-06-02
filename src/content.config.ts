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
    }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: () =>
    z.object({
      tab: z.string(),
      label: z.string(),
      order: z.number(),
    }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.string(),
      image: image(),
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
  services,
  portfolio,
};
