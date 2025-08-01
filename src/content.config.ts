import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  // Type-check frontmatter using a schema
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

const services = defineCollection({
  // Load Markdown files in the `src/content/services/` directory.

  schema: ({ image }) =>
    z.object({
      heading: z.string(),
      image: image(),
      order: z.number().optional(),
    }),
});

export const collections = { blog, services };
