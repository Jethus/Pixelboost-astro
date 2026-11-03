---
title: "Is your website AODA compliant? How to check it yourself"
description: "Is your website AODA compliant? Here's how to check it yourself in about half an hour: one free scan, five hands-on tests, and what scanners can't catch."
pubDate: 2026-11-02
draft: false
faq:
  - q: "How do I know if my website is AODA compliant?"
    a: "Test it against WCAG 2.0 Level AA, the standard Ontario's AODA references. Start with a free automated scan to catch the machine-detectable problems, then check by hand: navigate with only your keyboard, zoom to 200%, fill in your forms, and check your images and videos. A scan on its own can't confirm compliance."
  - q: "Is there a free AODA compliance checker?"
    a: "There are free accessibility checkers, such as WebAIM's WAVE, Google Lighthouse, and the free Pixelboost site scan, but no tool can certify AODA compliance on its own. Automated checkers catch a portion of the problems. The rest, like whether your menu works by keyboard, need a person to test."
  - q: "Does a 100 accessibility score mean my site is AODA compliant?"
    a: "No. A 100 Lighthouse accessibility score means your page passed every automated check Lighthouse runs. That's a good sign, but many WCAG requirements can't be tested automatically, such as keyboard access, sensible image descriptions, and video captions. You still need to check those by hand."
  - q: "Do small businesses have to make their website AODA compliant?"
    a: "Only if you have 50 or more employees (or you're a public sector organization). Then your public website must meet WCAG 2.0 Level AA. Under 50 employees, there's no legal WCAG requirement for your site, but the same barriers still turn away real customers."
  - q: "How often should I check my website for accessibility?"
    a: "Check whenever you make a meaningful change, like a new page, a new form, a redesign, or a new plugin or booking widget, because that's when new barriers creep in. Ontario also recommends keeping a record of the issues you've fixed, which helps if you ever need to show your progress."
---

**The short answer:** you can't tell from a scan alone. The honest way to check whether your website is AODA compliant is a free automated scan for the problems a machine can spot, then about half an hour of hands-on tests for the ones it can't: keyboard, zoom, forms, images, and video.

Here's how to do both, in plain English, with nothing to install.

## First, know what you're checking against

Ontario's AODA points to an international standard called [WCAG 2.0 Level AA](https://www.ontario.ca/page/how-make-websites-accessible). If you have **50 or more employees** (or you're in the public sector), your public website must meet it. If you have fewer than 50, there's no legal WCAG requirement for your site, but every barrier below still costs you customers who can't book, call, or buy.

I've covered who the rules apply to, the reporting deadline, and the fines question in [AODA website requirements for Ontario small businesses](/blog/web-accessibility-small-business-ontario). This post is the practical half: how to find out where your site actually stands.

One thing worth knowing up front: there's no government certificate for an accessible website. Nobody from Ontario inspects your site and hands you a badge. Compliance is something you check, fix, and keep a record of yourself.

## Step 1: Run a free automated scan (5 minutes)

Start with a tool, because it catches the obvious problems in seconds. Any of these work:

- **[The free Pixelboost site scan](/free-website-audit)** gives you an accessibility score alongside speed, mobile, and SEO, in plain English. No email required.
- **[WAVE](https://wave.webaim.org/)**, a free checker from WebAIM, marks problems directly on your page so you can see where they are.
- **Google Lighthouse**, built into Chrome, gives an accessibility score out of 100. (Here's [what a Lighthouse score actually means](/blog/what-is-google-lighthouse-score).)

Scan your homepage, your contact page, and whichever page brings in the most business, like your booking or services page. Problems are usually page-specific.

Don't be surprised if the scan finds something. When WebAIM tested the home pages of the top million websites in 2026, [95.9% had detectable accessibility failures](https://webaim.org/projects/million/). The most common by far was low-contrast text, on 83.9% of pages, followed by images with no description and form fields with no label.

## What a scan can't tell you

A clean scan is good news, but it isn't a compliance certificate. Automated tools can only check what a machine can measure.

The UK government's accessibility team tested this directly. They built a page with known barriers and ran a set of automated checkers on it. [The best tool found about 40% of the problems](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/), and nearly a third of the barriers weren't caught by any tool at all.

> A scan can tell you an image is missing a description. It can't tell you the description says "IMG_4032.jpg."

That's why Ontario's own guidance says to run an automated check **and then** review the site by hand. Which brings us to step 2.

## Step 2: Five checks you can do by hand (about 25 minutes)

You don't need to be technical for any of these. Do them on a laptop with your own site open.

### 1. Put the mouse away

Click in your browser's address bar, then press **Tab** over and over. Each press should move to the next link, button, or form field, and you should always be able to see where you are (an outline or highlight around the current item).

Can you open your menu? Reach your phone number? Fill in and submit your contact form, all without touching the mouse? If you get stuck, or the highlight vanishes, that's a failure. It's also one of the most common ones on menus and pop-ups, and scanners rarely catch it.

### 2. Zoom to 200%

Hold **Ctrl** (or **Cmd** on a Mac) and press **+** until your browser says 200%. Everything should still be readable and usable: no text cut off, nothing overlapping, no buttons pushed off the screen. Lots of visitors browse zoomed in every day, especially older customers.

### 3. Fill in your contact form wrong

Leave a required field empty and submit. Then check:

- Does every field have a visible label, not just grey placeholder text that disappears when you start typing?
- When something's wrong, does the error say *what* is wrong in words? "Please enter your phone number" passes. A field that only turns red doesn't, because colour alone isn't enough.

Your contact form is where a visitor turns into a lead. If it trips people up, it costs you business, whatever the law says.

### 4. Look at your images and their descriptions

Every meaningful image needs a short text description (called "alt text") that a screen reader can read aloud. The scan tells you which images are *missing* one. Your job is checking the ones that have one actually make sense. "Our team outside the Whitby shop" is useful. "banner-final-v2" isn't.

While you're at it, look for text baked into images, like a promo graphic with the details in the picture. A screen reader can't read that text unless it's also written out.

### 5. Check your video and documents

If you have pre-recorded video with speech, it needs captions. Auto-generated captions are a start, but read them through, because they get names and numbers wrong. (Live video captions are one of the two things Ontario exempts.)

Also check any PDFs you link to, like a menu, price list, or intake form. A PDF that's just a scanned picture of a page is unreadable to a screen reader. If it matters to your customers, put the information on a real page instead.

### Bonus: listen to your site

Ontario's guidance also suggests reviewing your site with assistive technology. You already have a screen reader: **Narrator** on Windows (Ctrl + Windows key + Enter) or **VoiceOver** on a Mac or iPhone. Listening to your homepage for two minutes tells you a lot about what a blind visitor experiences.

## What to do with what you find

Write it down. Ontario recommends [keeping a record of the accessibility issues you've resolved](https://www.ontario.ca/page/how-make-websites-accessible), and it's useful whether or not the law applies to you, because it shows you're making progress rather than ignoring the problem.

Then sort the list into two piles:

| You can probably fix it yourself | It usually needs a developer |
|---|---|
| Missing or meaningless image descriptions | A menu or pop-up that traps keyboard users |
| Captions on your own videos | Low contrast built into the site's colours |
| Scanned PDFs replaced with a real page | Form fields with no real labels |
| Vague link text like "click here" | Layouts that break at 200% zoom |

On Wix, Squarespace, or WordPress, the left column is mostly in your editor's settings. The right column usually lives in the template itself, which is why a toolbar or plugin sitting on top of your site can't fully fix it. The problem is underneath.

## When it's worth getting help

I led the design work on the website for the College (the Ontario College of Teachers) after it was served an AODA warning, and part of my job was catching accessibility issues through each round of remediation. So I've done this checking for real, against the standard the law references, not just read about it.

If your list is short, fix it and move on. If the right-hand column is long, or your site is old enough that every fix fights the template, that's usually the point where rebuilding to the standard costs less than patching. Every site I build is [designed to WCAG 2.1 AA from the start](/aoda-web-design), which covers the 2.0 AA standard the AODA references.

Not sure where to begin? [Run the free site scan](/free-website-audit) on your homepage first. It takes about a minute and gives you your accessibility score in plain English, alongside your speed and SEO. Then work through the five checks.
