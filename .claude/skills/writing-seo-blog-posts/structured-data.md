# Structured data (JSON-LD) for blog posts

## Current state — read this first

`src/layouts/BaseLayout.astro` emits **one** JSON-LD block: a site-wide `LocalBusiness`. There is **no per-post `BlogPosting` and no `FAQPage`** anywhere. `src/pages/blog/[slug].astro` passes only `title` and `description` to BaseLayout.

**Consequence:** writing an FAQ in markdown produces normal text, NOT FAQ rich results. Don't promise FAQ/Article rich snippets unless you add the schema below.

> Note: Google deprecated FAQ rich results for most sites (2023) — `FAQPage` schema rarely shows stars/accordions in SERPs anymore. It still helps AI engines and some Bing surfaces parse Q&A. Add it for AEO, not for guaranteed Google rich results.

## Adding BlogPosting + optional FAQPage

If a post should emit `Article`/`BlogPosting` (recommended for SEO) or `FAQPage` (optional, AEO), add JSON-LD in `[slug].astro`. CSP is enabled (`security: { csp: true }`); Astro's CSP allows `set:html` JSON-LD via hashing during the build — verify with `npm run build` + `npm run preview`, not `dev`.

Sketch (place in the frontmatter script of `[slug].astro`, render before `</BaseLayout>` content or via a slot/`is:inline` script):

```astro
---
// ...existing getStaticPaths/props...
const { post } = Astro.props;

const blogPostingLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "description": post.data.description,
  "datePublished": post.data.pubDate.toISOString(),
  ...(post.data.updatedDate && { "dateModified": post.data.updatedDate.toISOString() }),
  "author": { "@type": "Person", "name": "Josh Del Vecchio" },
  "publisher": { "@type": "Organization", "name": "Pixelboost", "url": "https://pixelboost.ca" },
  "mainEntityOfPage": new URL(`/blog/${post.id}`, Astro.site).href,
};

// Optional: only if the post has an FAQ. Hand-author the Q&A array to match the post.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "…?", "acceptedAnswer": { "@type": "Answer", "text": "…" } },
  ],
};
---
<script type="application/ld+json" set:html={JSON.stringify(blogPostingLd)} is:inline />
```

`Astro.site` requires `site:` set in `astro.config.mjs` — confirm it exists, else use `Astro.url`.

## Verify

- `npm run build` succeeds and the JSON-LD `<script>` survives CSP.
- Validate output with Google Rich Results Test / Schema.org validator on the built HTML.
- The `FAQPage` Q&A array must match the visible FAQ on the page exactly (mismatched = spam signal).
