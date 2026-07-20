---
title: "Website speed test: how to check your site (free tools)"
description: "How to run a website speed test for free with PageSpeed Insights, GTmetrix, and Pingdom, what the scores mean, and which tool to trust, in plain English."
pubDate: 2026-06-02
updatedDate: 2026-07-20
draft: false
faq:
  - q: "How do I test my website speed for free?"
    a: "Paste your web address into Google's free PageSpeed Insights, then read the Mobile tab, that's where most visitors are and where sites are slowest. GTmetrix and Pingdom are good free alternatives. Or run the free audit on this site for a plain-English report instead of a raw score."
  - q: "What is a good website speed test score?"
    a: "On PageSpeed Insights, 90 to 100 is good, 50 to 89 needs improvement, and under 50 is a real problem costing you visitors. For load time itself, aim for under 2.5 seconds on mobile, under 4 seconds needs work, and over 4 seconds is losing you customers."
  - q: "Which website speed test tool is most accurate?"
    a: "PageSpeed Insights is the one that matters most, because it uses Google's own scoring and the Core Web Vitals that affect your search ranking. GTmetrix and Pingdom give a helpful second opinion and a clear waterfall of what's slow, but Google's tool is the ranking-relevant one."
  - q: "Why do different speed test tools give different scores?"
    a: "Each tool tests from a different location, connection speed, and simulated device, so the numbers rarely match exactly. Don't chase a single perfect score. Look for the pattern across tools, and prioritise the Mobile result in PageSpeed Insights, since that's what Google ranks on."
---

To run a website speed test for free, paste your web address into [Google's PageSpeed Insights](https://pagespeed.web.dev/), read the **Mobile** tab, and look at the Performance score: **90 or above is good, 50 to 89 needs work, and under 50 is losing you customers.** That takes about two minutes. Below, I'll walk through that tool and two solid alternatives, what each number actually means, and which one to trust when they disagree.

First, why bother. [Google's research is consistent](https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/): 53% of mobile visitors leave a page that takes longer than three seconds to load. People searching for a local business on their phone, in line, in the car, between errands, have almost no patience for a spinner. A speed test tells you, in a couple of minutes, whether that's quietly happening to you.

## The three free tools worth using

You don't need to pay for any of this. Three free tools cover it, and they answer slightly different questions:

| Tool | Best for | The catch |
| :--- | :--- | :--- |
| **[PageSpeed Insights](https://pagespeed.web.dev/)** | The one that matters, it uses Google's own scoring and the metrics that affect your ranking | The report looks intimidating if you don't know what to read |
| **[GTmetrix](https://gtmetrix.com/)** | A clear "waterfall" showing exactly what loaded slowly, image by image | Free tests default to a non-Canadian test location |
| **[Pingdom](https://tools.pingdom.com/)** | A simple, friendly score and load time if PSI feels like too much | Less detail than the other two |

If you only run one, run **PageSpeed Insights**, because it scores your site the same way Google does. The other two are useful second opinions when you want to see *what* is slow, not just *how* slow.

### How to read PageSpeed Insights (the two-minute version)

1. **Go to [PageSpeed Insights](https://pagespeed.web.dev/)** and paste in your website address.
2. **Read the Mobile tab, not Desktop.** Most of your visitors are on phones, and mobile is where sites are slowest, so it's the honest number.
3. **Look at the Performance score (0–100) and the LCP figure.** Performance under 50 on mobile is a real problem. LCP (the moment your main content appears) over 2.5 seconds means visitors are waiting too long.

Everything else on the page is detail. Those two numbers tell you whether you have a problem. (Not sure what the score is built from? Here's [what a Google Lighthouse score actually means](/blog/what-is-google-lighthouse-score).)

## What the numbers actually mean

Your speed test throws a lot of jargon at you, but it's measuring three separate things. Google groups them under [Core Web Vitals](https://web.dev/articles/vitals), and they directly affect your search ranking.

| What it measures | Plain meaning | Good target |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | How long until the main thing (your hero image or headline) appears | Under 2.5 seconds |
| **Interaction to Next Paint (INP)** | How quickly the page responds when someone taps or clicks | Under 200 milliseconds |
| **Cumulative Layout Shift (CLS)** | Whether the page jumps around while loading | Under 0.1 (almost no shifting) |

You don't need to memorize these. The takeaway is simple: **LCP under 2.5 seconds** is the headline number for "is my site fast enough," and Google treats it as a ranking signal. Clear it on mobile and you're in good shape. Miss it and you're losing visitors and ranking lower than you could be.

## How fast is fast, and how slow is too slow?

Here's a practical scale for your site loading on a mid-range phone:

- **Under 1 second:** Excellent. Visitors won't perceive any wait.
- **1 to 2.5 seconds:** Good. This is the target. Most people won't notice the load.
- **2.5 to 4 seconds:** Slow. A meaningful share of visitors leave before the page appears.
- **Over 4 seconds:** A problem. You're losing customers daily, and Google knows it.

For context: most Wix and WordPress sites on mobile land in the three to six second range. ([Here's why they slow down.](/blog/why-your-wix-wordpress-site-is-slow)) A [well-built custom site](/blog/custom-website-vs-template) should clear 2.5 seconds comfortably, often loading in under a second.

## When the tools disagree, trust this one

Run your site through all three and you'll get three different numbers. That's normal, not a bug: each tool tests from a different location, on a different simulated connection and device. Don't chase a single perfect score across all of them.

Instead, look for the pattern. If every tool says you're slow, you're slow. When they disagree on the exact figure, **let the Mobile result in PageSpeed Insights be the tiebreaker**, because that's the closest match to how Google actually judges your site for ranking. GTmetrix and Pingdom are there to show you *what* is dragging (usually a giant image or a pile of scripts), not to give you a grade to frame on the wall.

If you'd rather skip the three-tool juggling act, [run a free website audit](/free-website-audit) and it'll check your speed for you and send back a plain-English report, no score-decoding required.

## Why slow load times cost real money

This isn't just a number on a test. A slow site costs you in three concrete ways:

- **Lost visitors.** More than half of mobile users abandon a page that takes over three seconds. They never see your services, your phone number, or your booking form.
- **Lower Google ranking.** Since Core Web Vitals became a ranking factor, slow sites get pushed down in search, so fewer people find you at all.
- **Less trust.** A sluggish site reads as "this business isn't quite on top of things," even when you absolutely are.

Here's a rough sense of the cost. Say 200 people a month visit your site, and normally 5% get in touch, that's 10 leads. If 30% leave before your slow site loads, you're down to 7. That's three leads a month lost to a loading spinner, and over a year that's real revenue.

## What actually makes a site faster

The biggest single win for most small business sites is usually images: a homepage hero photo that's 4 MB instead of 200 KB can add several seconds on its own. After that, it's about cutting the scripts and platform overhead the page doesn't actually need.

On Wix and WordPress you can get modest gains, compress images, add caching, switch hosting, but you're fighting the platform's built-in weight. A custom-built static site sidesteps most of this by sending only what the page needs and nothing else. That's why the sites I build for Toronto and Durham Region businesses consistently load in under a second.

If your site is slow and you're tired of it costing you customers, [start with a free website audit](/free-website-audit). I'll tell you your exact load time, what's slowing it down, and whether a rebuild actually makes sense. Sometimes it doesn't, and I'll tell you that too.
