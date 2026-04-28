# Design Spec: Bug Fixes, Blog, and Scaffolded Pages
**Date:** 2026-04-04

---

## 1. Bug Fixes

Five targeted fixes to existing code. No new patterns introduced.

### 1a. Hero animation class syntax
- **File:** `src/components/Hero.astro:62`
- **Change:** `duration-8000ms` → `duration-[8000ms]`
- **Why:** Tailwind v4 requires arbitrary values in brackets. Without this the image scroll animation compiles to nothing.

### 1b. Hero container max-width
- **File:** `src/components/Hero.astro:22`
- **Change:** `max-w-9/10` → `max-w-7xl`
- **Why:** All other sections use `max-w-7xl` (1280px fixed). `max-w-9/10` (90vw) diverges at large viewports, making the hero wider than the rest of the page.

### 1c. PricingCard button border radius
- **File:** `src/components/ui/PricingCard.astro:111` and `:117`
- **Change:** `rounded-pill` → `rounded-brutal` on both inline CTA `<a>` tags
- **Why:** Every other button (the `Button` component) uses `rounded-brutal`. `rounded-pill` is a one-off that breaks visual consistency.

### 1d. ClosingCTA layout
- **File:** `src/components/ClosingCTA.astro`
- **Change:** Add `flex flex-col gap-6` to the inner container, constrain content to `max-w-3xl`, add `mb-2` on eyebrow, `mb-6` spacing before button.
- **Why:** Currently the three elements (eyebrow, headline, button) stack with no gap and no width constraint, making it look unfinished compared to other sections.

### 1e. Blog collection path
- **File:** `src/content.config.ts:7`
- **Change:** `base: "./src/data/blog"` → `base: "./src/content/blog"`
- **Why:** Blog markdown files live in `src/content/blog/` but the loader points to `src/data/blog/` — blog content never loads.

---

## 2. Scaffolded "Coming Soon" Pages

Three pages that are linked from the Header and Footer but currently 404. Each gets the same treatment: `BaseLayout` + `Header` + centered coming-soon block + `Footer`. No real content yet.

**Pages to create:**
- `src/pages/about.astro`
- `src/pages/services/index.astro`
- `src/pages/contact.astro`

**Layout pattern for each:**
```
<BaseLayout title="About Us">       ← page-specific title
  <Header />
  <main class="min-h-[60vh] flex items-center justify-center ...">
    <div class="text-center max-w-lg">
      <p class="eyebrow ...">Coming Soon</p>
      <h1>Page Name</h1>
      <p class="text-ink/70 ...">We're working on this page.</p>
      <Button href="/" variant="secondary">Back to Home</Button>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

Background: `bg-surface`. Consistent eyebrow/headline typographic treatment matching other pages.

---

## 3. Blog

### 3a. Content config fix
Already covered in fix 1e above. Once the path is corrected, `getCollection("blog")` returns posts.

### 3b. `BlogCard` UI component
**File:** `src/components/ui/BlogCard.astro`

A new card following the same neo-brutal pattern as `ClientCard`:
- `rounded-brutal border-3 border-ink bg-surface shadow-brutal`
- Hover: `translate-x-0.5 translate-y-0.5 shadow-brutal-hover`
- Content: tag/date line (eyebrow style, `text-ink/50`, `fs-xs`), title (`h2`, `font-bold`), description excerpt (`text-ink/70`, clamped to 3 lines), "Read post →" arrow link (same as ClientCard's "Read case study" style)

**Props:**
```ts
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
}
```

Date is formatted as `"MMM D, YYYY"` using `toLocaleDateString('en-CA', { ... })`.

### 3c. Blog listing page
**File:** `src/pages/blog/index.astro`

```
BaseLayout (title: "Blog")
  Header
  <main>
    <!-- Section header -->
    <section class="border-b-3 border-ink bg-surface">
      eyebrow: "Insights"
      h1: "Our Blog"
    </section>
    <!-- Post grid -->
    <section class="bg-primary-light border-b-3 border-ink">
      responsive grid: 1 col → md:2 col → lg:3 col
      posts sorted by pubDate desc
      each rendered as BlogCard
    </section>
  </main>
  Footer
```

If no posts, show a "No posts yet" message in the grid area.

### 3d. Blog post page
**File:** `src/pages/blog/[slug].astro`

Uses `getStaticPaths()` + `getCollection("blog")` mirroring the `services/[slug].astro` pattern.

Layout:
```
BaseLayout (title: post.data.title, description: post.data.description)
  Header
  <main>
    <!-- Post header section -->
    <section class="border-b-3 border-ink bg-primary-light">
      eyebrow: formatted pubDate
      <h1>: post.data.title
      <p>: post.data.description
    </section>
    <!-- Prose content -->
    <section class="bg-surface">
      <article class="max-w-prose mx-auto px-6 py-20">
        <Content /> (rendered markdown)
      </article>
    </section>
    <!-- Back link -->
    ← Back to Blog (same back-link style as services/[slug].astro)
  </main>
  Footer
```

The rendered `<Content />` body uses native browser prose defaults — no custom Tailwind prose plugin needed for a scaffold.

---

## File Checklist

| Action | File |
|--------|------|
| Edit | `src/components/Hero.astro` |
| Edit | `src/components/ui/PricingCard.astro` |
| Edit | `src/components/ClosingCTA.astro` |
| Edit | `src/content.config.ts` |
| Create | `src/components/ui/BlogCard.astro` |
| Create | `src/pages/blog/index.astro` |
| Create | `src/pages/blog/[slug].astro` |
| Create | `src/pages/about.astro` |
| Create | `src/pages/services/index.astro` |
| Create | `src/pages/contact.astro` |
