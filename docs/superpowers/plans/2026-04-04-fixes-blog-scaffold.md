# Bug Fixes, Blog, and Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 5 bug fixes, scaffold 3 coming-soon pages, add a blog listing + post detail page with a reusable BlogCard component.

**Architecture:** No new patterns introduced. Blog uses the same `getCollection` / `getStaticPaths` approach as `services/[slug].astro`. BlogCard mirrors ClientCard. Coming-soon pages are minimal wrappers around the existing Header/Footer/BaseLayout.

**Tech Stack:** Astro 6, Tailwind CSS v4, Astro Content Layer API (`render()` from `astro:content`)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Edit | `src/components/Hero.astro` | Fix `max-w-9/10` and `duration-8000ms` |
| Edit | `src/components/ui/PricingCard.astro` | Fix `rounded-pill` → `rounded-brutal` |
| Edit | `src/components/ClosingCTA.astro` | Add layout gap and max-width |
| Edit | `src/content.config.ts` | Fix blog loader path |
| Edit | `src/content/blog/first-post.md` | Remove missing heroImage |
| Edit | `src/content/blog/second-post.md` | Remove missing heroImage |
| Edit | `src/content/blog/markdown-style-guide.md` | Remove missing heroImage |
| Create | `src/components/ui/BlogCard.astro` | Neo-brutal blog post card |
| Create | `src/pages/blog/index.astro` | Blog listing page |
| Create | `src/pages/blog/[slug].astro` | Blog post detail page |
| Create | `src/pages/about.astro` | Coming-soon scaffold |
| Create | `src/pages/services/index.astro` | Coming-soon scaffold |
| Create | `src/pages/contact.astro` | Coming-soon scaffold |

---

## Task 1: Apply bug fixes to Hero, PricingCard, and ClosingCTA

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/ui/PricingCard.astro`
- Modify: `src/components/ClosingCTA.astro`

- [ ] **Step 1: Fix Hero container max-width (line 22)**

In `src/components/Hero.astro`, change the outer flex container class from `max-w-9/10` to `max-w-7xl`:

```astro
<div
  class="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-20 md:flex-row md:gap-16 md:py-28 lg:py-32"
>
```

- [ ] **Step 2: Fix Hero scroll animation duration (line 62)**

In the same file, change `duration-8000ms` to `duration-[8000ms]` on the `<Image>`:

```astro
class="absolute inset-0 w-full h-[300%] max-h-none object-cover object-top transition-all duration-[8000ms] ease-linear group-hover:object-bottom"
```

- [ ] **Step 3: Fix PricingCard button border radius (lines 111 and 117)**

In `src/components/ui/PricingCard.astro`, replace `rounded-pill` with `rounded-brutal` on both CTA `<a>` tags. The monthly variant (line ~111):

```astro
<a
  href={ctaHref}
  class="inline-flex items-center justify-center rounded-brutal border-3 border-primary bg-primary px-8 py-3 font-display font-bold text-ink shadow-brutal transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover"
>
  {ctaText}
</a>
```

The lump sum variant (line ~117):

```astro
<a
  href={ctaHref}
  class="inline-flex items-center justify-center rounded-brutal border-3 border-primary bg-primary px-8 py-3 font-display font-bold text-surface shadow-brutal transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover"
>
  {ctaText}
</a>
```

- [ ] **Step 4: Fix ClosingCTA layout**

Replace the entire content of `src/components/ClosingCTA.astro` with:

```astro
---
import { getEntry } from "astro:content";
import Button from "./ui/Button.astro";

const ctaDoc = await getEntry("landingCTA", "cta");
if (!ctaDoc) throw new Error("Could not find CTA content");
const { eyebrow, headline, buttonText, buttonLink } = ctaDoc.data;
---

<section class="border-b-3 border-ink bg-surface" id="cta">
  <div class="mx-auto max-w-7xl px-6 py-20 md:py-28">
    <div class="flex max-w-3xl flex-col gap-6">
      <p class="font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
        {eyebrow}
      </p>
      <h2 class="font-display font-bold">{headline}</h2>
      <div>
        <Button href={buttonLink} size="lg">{buttonText}</Button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Commit bug fixes**

```bash
git add src/components/Hero.astro src/components/ui/PricingCard.astro src/components/ClosingCTA.astro
git commit -m "fix: hero max-width, animation duration, pricing button radius, CTA layout"
```

---

## Task 2: Fix blog collection path and strip missing hero images

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/blog/first-post.md`
- Modify: `src/content/blog/second-post.md`
- Modify: `src/content/blog/markdown-style-guide.md`

- [ ] **Step 1: Fix the blog loader base path**

In `src/content.config.ts`, change line 7:

```ts
loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
```

- [ ] **Step 2: Remove missing heroImage from first-post.md**

Replace the frontmatter of `src/content/blog/first-post.md`:

```md
---
title: 'First post'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 08 2022'
---
```

- [ ] **Step 3: Remove missing heroImage from second-post.md**

Replace the frontmatter of `src/content/blog/second-post.md`:

```md
---
title: 'Second post'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 15 2022'
---
```

- [ ] **Step 4: Remove missing heroImage from markdown-style-guide.md**

Replace the frontmatter of `src/content/blog/markdown-style-guide.md`:

```md
---
title: 'Markdown Style Guide'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.'
pubDate: 'Jun 19 2024'
---
```

Also remove the broken inline image from the body of that file. Find and remove this block (around line 41-42):

```md
### Output

![blog placeholder](../../assets/blog-placeholder-about.jpg)
```

Replace it with:

```md
### Output

*(Image example omitted)*
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/blog/
git commit -m "fix: correct blog collection path, remove missing heroImage references"
```

---

## Task 3: Create BlogCard component

**Files:**
- Create: `src/components/ui/BlogCard.astro`

- [ ] **Step 1: Create the file**

Create `src/components/ui/BlogCard.astro` with this content:

```astro
---
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
}

const { title, description, pubDate, slug } = Astro.props;

const formattedDate = pubDate.toLocaleDateString("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
---

<article class="group flex flex-col rounded-brutal border-3 border-ink bg-surface shadow-brutal transition-all duration-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover">
  <div class="flex flex-1 flex-col gap-4 p-6">
    <p class="font-display font-bold uppercase tracking-[0.2em] text-ink/50 fs-xs">
      {formattedDate}
    </p>
    <h2 class="font-display font-bold leading-tight">{title}</h2>
    <p class="flex-1 leading-relaxed text-ink/70 line-clamp-3">{description}</p>
    <a
      href={`/blog/${slug}`}
      class="inline-flex items-center font-display font-bold uppercase tracking-widest text-ink transition-colors duration-200 hover:text-primary fs-xs"
    >
      Read post
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="ml-2 h-4 w-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        />
      </svg>
    </a>
  </div>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/BlogCard.astro
git commit -m "feat: add BlogCard component"
```

---

## Task 4: Create blog listing page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create the file**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
import BlogCard from "../../components/ui/BlogCard.astro";

const posts = (await getCollection("blog")).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<BaseLayout
  title="Blog"
  description="Insights and articles from the Pixelboost team."
>
  <Header />
  <main>
    <section class="border-b-3 border-ink bg-surface">
      <div class="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p class="mb-2 font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
          Insights
        </p>
        <h1 class="font-display font-bold">Our Blog</h1>
      </div>
    </section>

    <section class="border-b-3 border-ink bg-primary-light">
      <div class="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {posts.length === 0 ? (
          <p class="text-center text-ink/60">No posts yet. Check back soon.</p>
        ) : (
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                title={post.data.title}
                description={post.data.description}
                pubDate={post.data.pubDate}
                slug={post.id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog listing page"
```

---

## Task 5: Create blog post detail page

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create the file**

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const formattedDate = post.data.pubDate.toLocaleDateString("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <Header />
  <main>
    <section class="border-b-3 border-ink bg-primary-light">
      <div class="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p class="mb-4 font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
          {formattedDate}
        </p>
        <h1 class="mb-6 max-w-3xl font-display font-bold leading-tight">
          {post.data.title}
        </h1>
        <p class="max-w-2xl leading-relaxed text-ink/70">
          {post.data.description}
        </p>
      </div>
    </section>

    <section class="border-b-3 border-ink bg-surface">
      <div class="mx-auto max-w-prose px-6 py-20">
        <article class="post-body">
          <Content />
        </article>
        <div class="mt-16">
          <a
            href="/blog"
            class="inline-block rounded-brutal border-3 border-ink bg-primary-light px-8 py-3 font-display font-bold uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
          >
            &larr; Back to Blog
          </a>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>

<style>
  /* Basic prose styles for rendered markdown — no typography plugin needed */
  .post-body :global(h1),
  .post-body :global(h2),
  .post-body :global(h3),
  .post-body :global(h4) {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .post-body :global(p) {
    margin-bottom: 1.25rem;
    line-height: 1.75;
  }

  .post-body :global(ul),
  .post-body :global(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }

  .post-body :global(li) {
    margin-bottom: 0.35rem;
  }

  .post-body :global(ul) {
    list-style-type: disc;
  }

  .post-body :global(ol) {
    list-style-type: decimal;
  }

  .post-body :global(blockquote) {
    border-left: 3px solid var(--color-primary);
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: oklch(0.35 0.02 250);
  }

  .post-body :global(code) {
    background: var(--color-primary-light);
    border: 1px solid var(--color-ink);
    border-radius: 4px;
    padding: 0.1em 0.4em;
    font-size: 0.9em;
  }

  .post-body :global(pre) {
    background: var(--color-ink);
    color: var(--color-surface);
    border-radius: var(--radius-brutal);
    padding: 1.25rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
  }

  .post-body :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.875em;
  }

  .post-body :global(a) {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  .post-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.25rem;
  }

  .post-body :global(th),
  .post-body :global(td) {
    border: 2px solid var(--color-ink);
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  .post-body :global(th) {
    background: var(--color-primary-light);
    font-weight: 700;
  }

  .post-body :global(hr) {
    border: none;
    border-top: 3px solid var(--color-ink);
    margin: 2rem 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add blog post detail page"
```

---

## Task 6: Scaffold coming-soon pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/services/index.astro`
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create about.astro**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Button from "../components/ui/Button.astro";
---

<BaseLayout title="About Us">
  <Header />
  <main class="border-b-3 border-ink bg-surface">
    <div class="mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-28">
      <div class="flex max-w-lg flex-col gap-6">
        <p class="font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
          Coming Soon
        </p>
        <h1 class="font-display font-bold">About Us</h1>
        <p class="leading-relaxed text-ink/70">
          We're working on this page. In the meantime, feel free to get in touch.
        </p>
        <div>
          <Button href="/" variant="secondary">Back to Home</Button>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Create services/index.astro**

Create `src/pages/services/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
import Button from "../../components/ui/Button.astro";
---

<BaseLayout title="Services">
  <Header />
  <main class="border-b-3 border-ink bg-surface">
    <div class="mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-28">
      <div class="flex max-w-lg flex-col gap-6">
        <p class="font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
          Coming Soon
        </p>
        <h1 class="font-display font-bold">Services</h1>
        <p class="leading-relaxed text-ink/70">
          We're working on this page. In the meantime, explore our services below.
        </p>
        <div>
          <Button href="/#services" variant="secondary">View Services</Button>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Create contact.astro**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Button from "../components/ui/Button.astro";
---

<BaseLayout title="Contact Us">
  <Header />
  <main class="border-b-3 border-ink bg-surface">
    <div class="mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-28">
      <div class="flex max-w-lg flex-col gap-6">
        <p class="font-display font-bold uppercase tracking-[0.2em] text-accent fs-xs">
          Coming Soon
        </p>
        <h1 class="font-display font-bold">Contact Us</h1>
        <p class="leading-relaxed text-ink/70">
          We're working on this page. For now, reach us at{" "}
          <a href="mailto:hello@pixelboost.ca" class="text-primary underline">
            hello@pixelboost.ca
          </a>.
        </p>
        <div>
          <Button href="/" variant="secondary">Back to Home</Button>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/services/index.astro src/pages/contact.astro
git commit -m "feat: scaffold coming-soon pages for about, services, contact"
```

---

## Task 7: Verify build

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build completes with no errors. You should see output routes for `/`, `/blog`, `/blog/first-post`, `/blog/second-post`, `/blog/markdown-style-guide`, `/about`, `/services`, `/contact`, and all service detail pages.

- [ ] **Step 2: Preview and spot-check**

```bash
npm run preview
```

Manually verify:
- Home page hero image scrolls on hover (animation active)
- `/blog` shows 3 cards in a grid
- `/blog/markdown-style-guide` renders headings, code blocks, tables correctly
- `/about`, `/services`, `/contact` show coming-soon layout
- Header nav links no longer 404
- Pricing cards have square-corner (brutal) buttons
- ClosingCTA section has breathing room between eyebrow, headline, and button
