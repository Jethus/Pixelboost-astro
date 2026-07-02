---
title: "How to make your website faster: a plain-English checklist"
description: "Slow website? Here's a plain-English checklist to make it faster: compress images, cut script bloat, lazy-load, and pick the right host. No jargon, real fixes."
pubDate: 2026-07-02
draft: false
faq:
  - q: "How can I make my website load faster for free?"
    a: "Start with images: compress and convert them to WebP, which is 25 to 34% smaller than JPEG. Then remove plugins, trackers, and pop-ups you don't need, and turn on lazy-loading so off-screen images don't load until someone scrolls to them. These three cost nothing and fix most slow sites."
  - q: "Why is my website so slow to load?"
    a: "Usually it's large unoptimized images uploaded straight from a phone, too many scripts from plugins and third-party widgets, or slow hosting. Images are the single biggest culprit on most sites, they're the most-requested asset and use the most bandwidth. Run a free speed test to see which applies to yours."
  - q: "Does website speed actually affect Google rankings?"
    a: "Yes. Google uses page speed as a ranking signal, and when two sites are otherwise evenly matched, the faster one wins. Speed also affects whether visitors stay: 53% of mobile users leave a page that takes longer than three seconds to load."
  - q: "Should I hire someone or fix my slow website myself?"
    a: "You can DIY a lot of this, working through the checklist with an AI assistant and optimizing piece by piece. But it takes time and iterations. If your site is badly bloated, or built on a platform fighting you, it's often faster and cheaper to bring in someone experienced."
---

If your website feels slow, the good news is that most of what's slowing it down is fixable, and you can spot a lot of it yourself. This is a plain-English checklist for making your website faster, whether you built it yourself, hired someone, or spun one up with an AI tool and never looked under the hood.

You don't need to be technical to work through this. You just need to know what to look for.

## Why a fast website is worth the effort

Two reasons, and neither is about tech for its own sake.

First, Google cares. Plenty of SEO people will tell you speed doesn't matter. It does. Google indexes on it, and when your site is neck-and-neck with a competitor on everything else, Google picks the one with the better speed and user experience. Speed is the tiebreaker you control.

Second, your customers care more than you think. [Google's research](https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/) found that 53% of mobile visitors leave a page if it takes longer than three seconds to load, while the average mobile page still takes around 19 seconds to load on a 3G connection. That gap is a huge amount of potential customers and sales bleeding out before anyone sees what you offer.

Here's the checklist.

## Compress your images (this is usually the biggest win)

Images are almost always the number one culprit. According to [web.dev](https://web.dev/articles/lazy-loading-images), images are the most-requested asset type on most websites and use more bandwidth than anything else. So this is where to start.

The problem is simple: most people don't optimize their images at all. Modern phones shoot enormous photos, a Google Pixel 8 Pro takes shots that are roughly 4 to 8MB each, and people upload them straight to their website. Now imagine a customer loading an image-heavy page of those on mobile data. It's a bad experience, and they won't wait.

The fix is to convert your images to **WebP**, a modern format built for the web. Google's own study found [WebP files are 25 to 34% smaller than JPEG](https://developers.google.com/speed/webp/docs/webp_study) at the same quality. Converting is easy, there are plenty of free tools that do it (a good open-source option is [Mazanoke](https://github.com/civilblur/mazanoke)).

If you want to push further, newer formats like **AVIF** compress even smaller, just know that browser support isn't as universal, so test before you commit.

## Cut down your script weight

Every script your page loads is more work the browser has to do before someone can use your site, and script bloat can drag a site to a crawl.

WordPress is probably the worst offender. Every plugin you add is a bundle of JavaScript from who knows where, doing who knows what. It's worth actually reviewing what's on your site and what each thing does.

While you're at it, ask some honest questions:

- Do you really need an AI chatbot on the site?
- Do you need three pop-ups pressuring the visitor, or would one do?
- Are there tracking scripts or widgets you added once and forgot?

All of it adds to how long before your page is actually usable, and every extra second is a customer who might bounce first. Cloudflare has a good primer on [minifying and reducing script weight](https://www.cloudflare.com/learning/performance/speed-up-a-website/) if you want to go deeper.

## Turn on lazy-loading

Lazy-loading is a simple win. Say you have 100 images on a page. You can either load all 100 up front and make the visitor wait, or you can load just the handful that are visible when they land ("above the fold") and defer the rest until they scroll down and are about to see them.

[web.dev](https://web.dev/articles/lazy-loading-images) describes this as deferring off-screen images until they're near the viewport. Less to download up front means a faster first impression, which is the one that counts.

## Don't load five fonts

This one is about design and speed. As a rule, you want two main fonts, a primary and a secondary, with maybe a third for accents. Any more than that and you're making every visitor download extra font files just to show one sentence in a different typeface. It rarely looks better, and it always costs you load time.

## Host your site somewhere fast

Where your website lives matters as much as anything above. A good host with a large global network means visitors get your site quickly no matter where they're coming from, this is what a [content delivery network (CDN)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) does.

I use [Cloudflare](https://www.cloudflare.com/) for everything, its network is excellent and there are no surprise bandwidth bills. Netlify and Vercel are also solid, just keep an eye on their bandwidth fees if your traffic grows.

## A note on page builders

If you're on a page builder, know that they carry bloat by design. They're built to work for any business and any layout, so there's a lot of general-purpose code loaded whether you use it or not. They've improved over the years, but you have to be diligent to get a fast site out of one.

The honest truth: 99% of the time, a page builder will be slower than a custom-built site, especially now that tools like [Astro](https://astro.build/) can ship a fast static site with almost nothing extra to slow it down. It's what I build with, and it's why those sites load the way they do.

## Can you do this yourself?

Yes, a lot of it. You can work through this list with an AI assistant and slowly optimize your site piece by piece. It just takes time, energy, and a few iterations to get right.

But if your site is hurting badly, it's often better to bring in someone with experience so you end up with a final product that actually attracts and works for your customers, rather than a half-optimized site you've been fighting for weeks.

## See what's slowing your site down

Not sure which of these apply to you? [Run a free website audit](/free-website-audit). It checks your speed, along with your mobile experience, SEO, and accessibility, and gives you a plain-English report of what's costing you. From there we're happy to connect and walk you through exactly what's slowing your site down, and how we'd fix it.

If you want more background first, here's [how long a website should take to load](/blog/how-long-should-a-website-take-to-load), [why Wix and WordPress sites get slow](/blog/why-your-wix-wordpress-site-is-slow), and [what your Google Lighthouse score actually means](/blog/what-is-google-lighthouse-score).
