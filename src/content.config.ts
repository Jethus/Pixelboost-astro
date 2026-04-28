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

const landingHero = defineCollection({
  loader: glob({ pattern: "hero.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    description: z.string(),
    cta1Text: z.string(),
    cta1Link: z.string(),
    cta2Text: z.string(),
    cta2Link: z.string(),
  }),
});

const landingWhatWeOffer = defineCollection({
  loader: glob({ pattern: "what-we-offer.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
  }),
});

const landingPortfolio = defineCollection({
  loader: glob({ pattern: "portfolio.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
  }),
});

const landingComparison = defineCollection({
  loader: glob({ pattern: "comparison.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    description: z.string(),
    rows: z.array(
      z.object({
        feature: z.string(),
        diy: z.string(),
        ours: z.string(),
      })
    ),
  }),
});

const landingPricing = defineCollection({
  loader: glob({ pattern: "pricing.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    plans: z.array(
      z.object({
        variant: z.string(),
        title: z.string(),
        descriptor: z.string(),
        price: z.string(),
        priceNote: z.string(),
        features: z.array(
          z.object({
            text: z.string(),
            included: z.boolean().default(true),
          })
        ),
      })
    ),
  }),
});

const landingCTA = defineCollection({
  loader: glob({ pattern: "cta.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    buttonText: z.string(),
    buttonLink: z.string(),
  }),
});

const landingProblem = defineCollection({
  loader: glob({ pattern: "problem.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
    cards: z.array(z.object({
      title: z.string(),
      body: z.string(),
    })),
  }),
});

const landingAudit = defineCollection({
  loader: glob({ pattern: "audit.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    footnote: z.string(),
    verdictIdle: z.string(),
    verdictDone: z.string(),
    emailCopy: z.string(),
    callCopy: z.string(),
    rows: z.array(z.object({
      key: z.enum(['perf', 'a11y', 'seo', 'mobile', 'tracking']),
      label: z.string(),
      sub: z.string(),
    })),
  }),
});

const landingFeatures = defineCollection({
  loader: glob({ pattern: "features.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
    pillars: z.array(z.object({
      title: z.string(),
      pitch: z.string(),
      proof: z.string(),
    })),
  }),
});

const landingFaq = defineCollection({
  loader: glob({ pattern: "faq.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    questions: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })),
  }),
});

export const collections = {
  blog,
  services,
  portfolio,
  landingHero,
  landingWhatWeOffer,
  landingPortfolio,
  landingComparison,
  landingPricing,
  landingCTA,
  landingProblem,
  landingAudit,
  landingFeatures,
  landingFaq,
};
