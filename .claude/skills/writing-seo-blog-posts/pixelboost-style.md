# Pixelboost voice + blog frontmatter

Authoritative brand rules live in `CLAUDE.md` ("Brand: audience, voice, content"). This is the SEO-writing-relevant subset.

## Audience

Owners of small businesses in **Toronto and Durham Region (Ontario)** — non-technical, often on a slow/dated Wix or WordPress site. They care about customers and revenue, not web tech. Pixelboost is a **one-person studio** — voice is personal ("I build", "I'll tell you"), never corporate "we the agency".

## Voice

- Plain-spoken, direct, concrete. Address reader as **"you"**.
- **Lead with the business cost** ("3 leads a month you're losing to a loading spinner"), not the technology.
- Local specifics (Ontario, Toronto, Durham Region, AODA) where they add credibility — once, not stuffed.
- No hype, no jargon walls. Unavoidable technical term → explain in one plain sentence.
- Honest about trade-offs ("Wix/WordPress aren't inherently bad tools"; "sometimes a rebuild doesn't make sense, and I'll tell you that").
- Calm and reassuring, never alarmist.
- **Headlines: sentence case**, benefit-led, specific to a small-business worry. Not Title Case.
- **No emojis anywhere.** Use inline SVG icons if an icon is needed (rare in prose).

## Frontmatter (schema in `src/content.config.ts`)

```yaml
---
title: "Sentence-case, primary keyword near front (50–60 chars)"
description: "Compelling meta description, primary keyword once (150–160 chars)."
pubDate: 2026-06-02   # YYYY-MM-DD, unquoted or quoted both coerce to Date
draft: false          # true hides from index + getStaticPaths
# updatedDate: 2026-07-01   # optional
# heroImage: ./hero.png      # optional, image() — must exist if set
---
```

Only `title`, `description`, `pubDate` are required. `draft` defaults false. **No `readTime` field** — read-time is computed from body word count in `blog/index.astro`.

## Body structure

- **Start at `## H2`.** The frontmatter `title` is rendered as the page `<h1>` by `[slug].astro`. A markdown `# H1` duplicates it.
- Short paragraphs (2–3 sentences) for mobile dwell time.
- Use markdown tables, blockquotes, ordered/unordered lists, `code` — all are styled in `[slug].astro`.
- Close with a CTA to the free audit: `[start with a free audit](/#audit)`. The `#audit` and `#pricing` sections live on the homepage `/` only (not `/blog`), so link `/#audit` / `/#pricing` — `/blog#audit` is a dead anchor.

## Reference post

`src/content/blog/why-your-wix-wordpress-site-is-slow.md` is a model: ~40 lines, H2-only, conversational, local, honest, audit CTA. Match that register. Ignore the heavy TOC/table scaffold in `_template.md` — real posts are leaner.
