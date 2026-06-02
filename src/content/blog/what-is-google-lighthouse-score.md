---
title: "What is a Google Lighthouse score, and what does yours mean?"
description: "Google grades every website on speed, accessibility, SEO, and best practices. Here's what those scores actually mean for your business, in plain English."
pubDate: 2026-05-01
draft: false
faq:
  - q: "What is a good Google Lighthouse score?"
    a: "90 to 100 is the target for all four categories. For Performance specifically, 90+ means visitors won't notice the load, 50 to 89 is noticeable, and below 50 is costing you customers. A perfect 100 is hard to reach and not necessary."
  - q: "Does a Lighthouse score affect Google ranking?"
    a: "Not directly — the lab score itself isn't a ranking factor. But it's built from the same speed and usability signals Google does use (Core Web Vitals from real visitors). A low Lighthouse score usually means a slow real-world site, which Google does push down."
  - q: "Why is my Lighthouse score so low?"
    a: "Usually the platform. Wix, WordPress themes, and stacked plugins, chatbots, and sliders add weight that drags the score down. Most Wix and WordPress sites land at 40 to 65 on mobile. A custom-built site sends only what the page needs and clears 90+."
  - q: "How do I check my Lighthouse score for free?"
    a: "Paste your URL into Google's free PageSpeed Insights tool and read the Mobile tab — that's where most of your visitors are and where sites are slowest. Or use the free audit on this site for a plain-English report on what's failing."
---

If you've ever run your website through a speed checker or used an audit tool, you've probably seen scores like "Performance: 43" or "Accessibility: 78." Maybe you noticed they were lower than you'd like. Maybe you had no idea what they meant.

Lighthouse is a free tool built by Google that grades every website on four things. Here's what each score actually means — and why it matters for your business.

## What Lighthouse is

Lighthouse is Google's own website grading tool. It simulates loading your site on a mid-range phone on a typical mobile connection, then scores what it finds. The scores run from 0 to 100, and they feed directly into how Google evaluates your site for search ranking.

That second part matters. Google doesn't just check whether your site exists — it checks whether it's any good to use. Lighthouse is the tool it uses to make that judgment.

You can run it yourself for free at [PageSpeed Insights](https://pagespeed.web.dev/) — just paste your URL.

## The four scores

### Performance (Speed)

This measures how fast your site loads for a real person on a real phone. It looks at things like:

- How long before something visible appears on screen
- How long before the page is actually usable (not just visible)
- Whether the layout jumps around while things load (annoying, and penalized)

**What the numbers mean:**
- **90–100:** Fast. Visitors won't notice the load time.
- **50–89:** Noticeable. Some visitors will wait, some won't.
- **Below 50:** Slow. A meaningful percentage of your visitors are leaving before they see your content.

Most Wix and WordPress sites score 40–65 on mobile. A well-built custom site should be 90+. (Here's [why Wix and WordPress sites are slow](/blog/why-your-wix-wordpress-site-is-slow) in the first place.)

### Accessibility

This measures whether your site works for everyone — not just people on a fast phone with perfect vision. It checks things like:

- Whether images have text descriptions (for screen readers)
- Whether text has enough contrast to be readable
- Whether buttons and links are large enough to tap on a phone
- Whether forms are labelled properly

**Why it matters for your business:** Accessibility problems don't just affect a small edge case. They affect older visitors, people on low-end phones, anyone with a vision or motor difficulty. In Ontario, the AODA (Accessibility for Ontarians with Disabilities Act) also sets legal requirements for websites — something most small business owners don't know about until it's a problem. ([Here's what AODA means for your website](/blog/web-accessibility-small-business-ontario).)

**What the numbers mean:**
- **90–100:** Solid. Most users can navigate your site without friction.
- **70–89:** Issues exist that are affecting some visitors.
- **Below 70:** Real people are being blocked from using your site.

### SEO

This checks whether Google can actually read and understand your site. It's not about keywords — it's about the technical basics:

- Does the page have a proper title and description?
- Are links descriptive (not just "click here")?
- Is the page indexed and crawlable?
- Does it have a proper viewport tag so it works on mobile?

A low SEO score doesn't mean your content is bad — it means Google might be struggling to read it at all, regardless of how good the content is.

**What the numbers mean:**
- **90–100:** Google can read your site cleanly.
- **Below 80:** There are technical barriers between your site and search rankings.

### Best Practices

This is a catch-all for security and code quality — whether the site uses HTTPS, whether images are the right format, whether there are obvious security issues. For most small business sites, this score is either high or has a few specific fixable issues.

## What to do with your scores

If your Performance score is below 70, that's the most urgent thing. Slow sites lose customers every day.

If your Accessibility score is below 80, you're likely blocking real visitors — and depending on your business size, there may be legal exposure under AODA.

If your SEO score is below 90, fix it — many of the issues are straightforward and the impact on rankings is direct.

Want to know your scores without running the tool yourself? The free audit at the top of this page checks all of this and sends you a plain-English report on what's working, what's broken, and what I'd fix first.
