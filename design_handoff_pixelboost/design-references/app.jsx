/* global React, ReactDOM */
const { useState, useEffect } = React;

// ---------- icons ----------
const Icon = {
  check: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  x: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  arrow: (p) => (
    <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  plus: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  shield: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  bolt: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  maple: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l1 4 3-2-1 4 4-1-2 3 4 1-4 1 2 3-4-1 1 4-3-2-1 4-1-4-3 2 1-4-4 1 2-3-4-1 4-1-2-3 4 1-1-4 3 2z"/></svg>
  ),
};

// ---------- nav ----------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#" className="brand">
          <span className="brand-dot"></span>
          <span>pixelboost</span>
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#how">Process</a>
          <a href="#cases">Work</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#cta" className="btn btn-mint">Book a call <Icon.arrow/></a>
        </div>
      </div>
    </nav>
  );
}

// ---------- hero ----------
const HERO_VARIANTS = {
  inhouse: {
    head: <>Your in-house web<br/>developer, for the<br/>price of a <em>phone bill.</em></>,
    sub: "Pixelboost is a one-person studio in Canada building fast, accessible custom websites for local businesses — without the bloat of site builders or the bill from a big agency.",
  },
  custom: {
    head: <>A custom website<br/>that <em>actually fits</em><br/>your business.</>,
    sub: "No drag-and-drop sameness. No \u201Cyour-business-here\u201D templates. A website built by hand to match how your customers actually find you, from $200 a month.",
  },
  fast: {
    head: <>Fast websites<br/>that show up <em>first</em><br/>and load <em>instantly.</em></>,
    sub: "Sites that load in under a second, work for everyone, and tell you what's actually happening — without the noise of Google Analytics. Built for Canadian small businesses.",
  },
};

function Hero({ variant }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS.inhouse;
  return (
    <header className="hero">
      <div className="hero-grain"></div>
      <div className="wrap hero-inner">
        <div>
          <div className="hero-tagline">
            <span className="pill">CA</span>
            <span>Built in Ontario · serving Canadian small business</span>
          </div>
          <h1 className="h-display">{v.head}</h1>
          <p className="hero-sub">{v.sub}</p>
          <div className="hero-ctas">
            <a href="#pricing" className="btn btn-primary">See pricing <Icon.arrow/></a>
            <a href="#cases" className="btn btn-ghost">See past work</a>
          </div>
          <div className="hero-trust">
            <span><Icon.bolt/> Loads in &lt; 1 second</span>
            <span><Icon.shield/> WCAG accessibility</span>
            <span><Icon.maple/> Real human in your timezone</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-card browser">
            <div className="chrome">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              <span className="url">https://your-bakery.ca</span>
            </div>
            <div className="body">
              <div className="hc-headline">A best-of-bread<br/>neighbourhood<br/>croissant.</div>
              <div className="hc-line"></div>
              <div className="hc-line s2"></div>
              <div className="hc-line s3"></div>
              <div className="hc-cta">Order pickup →</div>
            </div>
          </div>
          <div className="score">
            <div className="score-head">
              <span>Lighthouse</span>
              <span className="live">live</span>
            </div>
            <div className="score-rows">
              <div className="score-row">
                <span className="label">Performance</span>
                <span className="num">99</span>
                <div className="score-bar"><i style={{"--w":"99%"}}/></div>
              </div>
              <div className="score-row">
                <span className="label">Accessibility</span>
                <span className="num">100</span>
                <div className="score-bar"><i style={{"--w":"100%", animationDelay: ".2s"}}/></div>
              </div>
              <div className="score-row">
                <span className="label">SEO</span>
                <span className="num">98</span>
                <div className="score-bar"><i style={{"--w":"98%", animationDelay: ".4s"}}/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- services (refined: original dark-card layout, new type) ----------
const SERVICES = [
  { n: "01", tag: "Design",    t: "Custom design",         b: "Made for your business — not pulled from a $79 template. Every page is drawn around how your customers actually find you and what you want them to do." },
  { n: "02", tag: "Build",     t: "Hand-coded",            b: "Written from scratch — not assembled in a drag-and-drop tool. That's why your site loads instantly and never breaks because a plugin pushed an update." },
  { n: "03", tag: "Speed",     t: "Performance",           b: "Sites that load in under a second on coffee-shop wifi. Google ranks fast sites higher, and customers don't bounce when nothing happens for three seconds." },
  { n: "04", tag: "A11y",      t: "Accessibility, built-in", b: "Readable type, keyboard nav, real alt text — so every customer can use your site, including the 1 in 5 Canadians with a disability." },
  { n: "05", tag: "Data",      t: "Honest analytics",      b: "Plausible, included. See where your traffic comes from in plain English — no creepy tracking pixels, no cookie banners, no hour-long Google Analytics setup." },
  { n: "06", tag: "Care",      t: "Local + ongoing",       b: "I'm a real person in Ontario. Email me with a change and it gets done — usually same-day. No tickets. No outsourced support teams." },
];

function Services() {
  return (
    <section id="services" className="section services">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">What I do</span>
            <h2 className="h-section">Six things I do well<br/>so you don't have to think<br/>about your website.</h2>
          </div>
          <p className="sub">Every project gets all of the below. No tiers, no upsells, no &ldquo;premium&rdquo; checkboxes.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map(s => (
            <article key={s.n} className="svc-card">
              <h3>{s.t}</h3>
              <p>{s.b}</p>
              <div className="meta">
                <span>{s.tag}</span>
                <span className="num">— {s.n}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- how it works (4 cards, mono timeline, Step N) ----------
const STEPS = [
  { n: "Step 1", t: <>We <em>talk</em></>,   b: "A 30-minute call. You tell me about your business and what's frustrating about your current site. No slides, no pitch deck.", when: "Day 0",     dur: "30 min" },
  { n: "Step 2", t: <>I <em>draft</em></>,   b: "A one-page plan: what we'll build, what it'll look like, what it costs. You say yes, tweak, or walk away.",                  when: "Day 1–3",  dur: "2–3 days" },
  { n: "Step 3", t: <>I <em>build</em></>,   b: "You see progress weekly. Real screens in your browser on your domain — not Figma mockups that look good but feel weird.",     when: "Day 4–21", dur: "~3 weeks" },
  { n: "Step 4", t: <>We <em>launch</em></>, b: "Site goes live. Plausible is hooked up. You get a 10-minute walkthrough, then you can email me anytime for changes.",         when: "Day 21+",  dur: "Forever" },
];

function HowItWorks() {
  return (
    <section id="how" className="section how">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">The process</span>
            <h2 className="h-section">First call to live site<br/>in about three weeks.</h2>
          </div>
          <p className="sub">No 50-page proposals. No three-month discovery phase. A clear path from the call to a website you're proud to send people to.</p>
        </div>
        <div className="how-grid">
          {STEPS.map((s, i) => (
            <article className="how-card" key={i}>
              <div className="step-num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.b}</p>
              <div className="timeline">
                <span className="when">{s.when}</span>
                <span>{s.dur}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- case studies (stats only on real data) ----------
const CASES = [
  {
    tag: "Education",
    label: "ONTARIO COLLEGE OF TEACHERS",
    title: "Stage of accreditation portal",
    blurb: "Replaced a clunky multi-page form with a single guided flow. Applicants now finish in one sitting instead of three.",
    stats: [["100", "Lighthouse a11y"], ["AA", "WCAG"], ["1 sitting", "down from 3"]],
    ph: "education · placeholder",
  },
  {
    tag: "Hospitality",
    label: "RURAL ONTARIO",
    title: "Inn at Ridge Christian",
    blurb: "Booking-first redesign for a small-town inn. Calendar that doesn't make people give up, and a homepage that finally photographs the place properly.",
    stats: [["1.4×", "Bookings YoY"], ["0.6s", "Load time"], ["97", "Lighthouse perf"]],
    ph: "hospitality · placeholder",
  },
  {
    tag: "Performance",
    label: "TORONTO STAGE COMPANY",
    title: "Crescendo Stage",
    blurb: "A site that finally matches the production values of the shows. Show pages, ticketing, and a press kit that doesn't live in Dropbox.",
    note: "Show pages · Ticketing · Press kit",
    ph: "performance · placeholder",
  },
  {
    tag: "Industrial",
    label: "WAREHOUSING + LOGISTICS",
    title: "Sussex Industries",
    blurb: "An industrial site that doesn't look like it was made in 2007. Quote requests actually arrive in their inbox now, and the navigation makes sense to a buyer.",
    note: "Quote flow · Service pages · Contact rebuild",
    ph: "industrial · placeholder",
  },
];

function Cases() {
  return (
    <section id="cases" className="section cases">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">Past work</span>
            <h2 className="h-section">A few sites I've<br/>shipped recently.</h2>
          </div>
          <p className="sub">Education, hospitality, theatre, industrial — different worlds, same approach: fast, accessible, no fluff.</p>
        </div>
        <div className="case-grid">
          {CASES.map((c, i) => (
            <article className="case" key={i}>
              <div className="case-thumb">
                <div className="ph">{c.ph}</div>
              </div>
              <div className="case-meta">
                <div className="row">
                  <span>{c.label}</span>
                  <span className="badge">{c.tag}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
                {c.stats ? (
                  <div className="stats">
                    {c.stats.map(([v, k], j) => (
                      <div key={j} className="stat">
                        <div className="v">{v}</div>
                        <div className="k">{k}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="case-note">{c.note}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- explainer (3 horizontal cards) ----------
function Explain() {
  return (
    <section className="section explain">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow on-dark">The boring-but-important bit</span>
            <h2 className="h-section">Three words you've<br/>seen on invoices —<br/>in <em style={{ fontStyle: "italic", color: "var(--mint-300)" }}>plain English.</em></h2>
          </div>
          <p className="sub">If your last developer used these words and you nodded politely, this section is for you.</p>
        </div>

        <div className="explain-grid">
          <article className="explain-card">
            <span className="label"><Icon.bolt/> Speed</span>
            <h3>"Lighthouse 95+" means your site loads <em>before</em> someone gets bored.</h3>
            <div className="body">
              <p>Lighthouse is Google's free tool — it grades every site from 0 to 100 on speed, accessibility, and SEO. Site builders typically score 50–70 because they pile on plugins.</p>
              <p><strong>What you get:</strong> I won't ship below 95. The score is on the receipt — and Google ranks fast sites higher, so this is also free SEO.</p>
            </div>
            <div className="footer-tag">Lighthouse 95+ guaranteed</div>
          </article>

          <article className="explain-card">
            <span className="label"><Icon.shield/> Accessibility</span>
            <h3>"WCAG AA" means your site works for <em>everyone</em>, not just sighted, mouse-using folks.</h3>
            <div className="body">
              <p>An international standard: readable colours, keyboard navigation, screen-reader friendly, real alt text. 1 in 5 Canadians has a disability — and in Ontario, it's the law for some businesses (AODA).</p>
              <p><strong>What you get:</strong> Built in from day one, not a "phase two" bolt-on that nobody actually does.</p>
            </div>
            <div className="footer-tag">WCAG 2.1 AA · AODA-aware</div>
          </article>

          <article className="explain-card">
            <span className="label">Data · Plausible</span>
            <h3>"Plausible" is Google Analytics, <em>minus</em> the creep factor.</h3>
            <div className="body">
              <p>One simple dashboard. No cookie banner, no tracking visitors across the internet, no PhD required to read it. Where people came from, which pages they read, what they clicked.</p>
              <p><strong>What you get:</strong> Hooked up on launch day, included in your subscription, yours forever.</p>
            </div>
            <div className="footer-tag">No cookies · No banners</div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------- compare ----------
const COMPARE_ROWS = [
  { f: "Truly custom design",                    us: "yes", builder: "no",  agency: "yes" },
  { f: "Loads in under a second",                us: "yes", builder: "no",  agency: "no"  },
  { f: "Accessibility built in (WCAG AA)",       us: "yes", builder: "no",  agency: "no"  },
  { f: "Privacy-first analytics included",       us: "yes", builder: "no",  agency: "no"  },
  { f: "One person — not a project manager",     us: "yes", builder: "no",  agency: "no"  },
  { f: "Same-day copy & content edits",          us: "yes", builder: "no",  agency: "no"  },
  { f: "Fixed monthly price, no surprise bills", us: "yes", builder: "yes", agency: "no"  },
  { f: "You own everything when you leave",      us: "yes", builder: "no",  agency: "no"  },
];
const COMPARE_NOTES = { yes: "Yes", no: "No" };

function Compare() {
  return (
    <section id="compare" className="section compare">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">How I compare</span>
            <h2 className="h-section">vs. the site<br/>builder. vs. the<br/>big agency.</h2>
          </div>
          <p className="sub">Most small businesses pick between two bad options. Here's the honest middle.</p>
        </div>

        <div className="compare-card">
          <div className="compare-col head">
            <div className="compare-h">Feature</div>
            <div className="compare-sub">What you actually want</div>
            <div className="feature-list">
              {COMPARE_ROWS.map((r, i) => <div className="ftr" key={i}>{r.f}</div>)}
            </div>
          </div>

          <div className="compare-col us">
            <div className="compare-h">Pixelboost</div>
            <div className="compare-sub">$200/mo · 1 yr</div>
            {COMPARE_ROWS.map((r, i) => (
              <div key={i} className={`compare-row ${r.us}`}>
                <span className="lbl-mobile">{r.f}</span>
                <span className="icon">{r.us === "yes" ? <Icon.check/> : <Icon.x/>}</span>
                <span>{COMPARE_NOTES[r.us]}</span>
              </div>
            ))}
          </div>

          <div className="compare-col">
            <div className="compare-h">Site builders</div>
            <div className="compare-sub">$20–60/mo</div>
            {COMPARE_ROWS.map((r, i) => (
              <div key={i} className={`compare-row ${r.builder}`}>
                <span className="lbl-mobile">{r.f}</span>
                <span className="icon">{r.builder === "yes" ? <Icon.check/> : <Icon.x/>}</span>
                <span>{COMPARE_NOTES[r.builder]}</span>
              </div>
            ))}
          </div>

          <div className="compare-col">
            <div className="compare-h">Big agencies</div>
            <div className="compare-sub">$15k+ upfront</div>
            {COMPARE_ROWS.map((r, i) => (
              <div key={i} className={`compare-row ${r.agency}`}>
                <span className="lbl-mobile">{r.f}</span>
                <span className="icon">{r.agency === "yes" ? <Icon.check/> : <Icon.x/>}</span>
                <span>{COMPARE_NOTES[r.agency]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- pricing ----------
function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">Pricing</span>
            <h2 className="h-section">One price.<br/>No surprise invoices.</h2>
          </div>
          <p className="sub">Both plans include design, build, hosting, accessibility, and analytics. Pick monthly if you want me on retainer.</p>
        </div>
        <div className="price-grid">
          <article className="price-card featured">
            <div className="pc-head">
              <div>
                <h3 className="name">Subscription</h3>
                <p className="sub">Your in-house developer for a year. Build + ongoing changes.</p>
              </div>
              <span className="badge">Recommended</span>
            </div>
            <div className="price-amount" style={{ color: "var(--mint-100)" }}>
              <sup>CA$</sup>200<span className="per">/ month · 12 mo contract</span>
            </div>
            <ul className="price-features">
              <li><span className="ck"><Icon.check/></span>Custom-designed website, built from scratch</li>
              <li><span className="ck"><Icon.check/></span>Email me anytime for changes — usually same-day</li>
              <li><span className="ck"><Icon.check/></span>Fast hosting, SSL, domain setup, all included</li>
              <li><span className="ck"><Icon.check/></span>Plausible analytics dashboard, yours to keep</li>
              <li><span className="ck"><Icon.check/></span>Lighthouse 95+ on launch, monitored monthly</li>
              <li><span className="ck"><Icon.check/></span>You own all the code &amp; design at end of term</li>
            </ul>
            <a href="#cta" className="btn btn-mint" style={{ alignSelf: "flex-start" }}>Start subscription <Icon.arrow/></a>
            <div className="fineprint">$2,400 CA total · cancel after the year, or roll month-to-month</div>
          </article>

          <article className="price-card">
            <div className="pc-head">
              <div>
                <h3 className="name">Flat rate</h3>
                <p className="sub">One-time build, you take it from there.</p>
              </div>
              <span className="badge">One &amp; done</span>
            </div>
            <div className="price-amount">
              from <sup>CA$</sup>3,000<span className="per">one-time</span>
            </div>
            <ul className="price-features">
              <li><span className="ck"><Icon.check/></span>Custom-designed website, built from scratch</li>
              <li><span className="ck"><Icon.check/></span>Lighthouse 95+, WCAG AA accessibility</li>
              <li><span className="ck"><Icon.check/></span>Plausible analytics set up on launch</li>
              <li><span className="ck"><Icon.check/></span>30 days of post-launch fixes included</li>
              <li><span className="x"><Icon.x/></span>Ongoing changes after 30 days are billed hourly</li>
              <li><span className="x"><Icon.x/></span>Hosting handled by you (I'll help set it up)</li>
            </ul>
            <a href="#cta" className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>Get a quote <Icon.arrow/></a>
            <div className="fineprint">Final price quoted after our first call · pay in two halves</div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------- faq ----------
const FAQS = [
  ["Why a year-long contract?", "Because building a great site takes a few weeks, but a great site keeps getting better. Most agencies hand over a frozen file and disappear. The contract covers the build plus 11 months of ongoing changes — copy, new pages, seasonal updates — without surprise bills."],
  ["What if I'm not technical at all?", "Perfect. You don't have to learn anything. You email me what you want changed (\u201Cadd Tuesday hours\u201D, \u201Cnew menu\u201D, \u201Cphoto of the new location\u201D) and I do it. Most things are done same-day."],
  ["Do I own the site if I leave?", "Yes. At the end of the contract you get the code, the design files, and full handover docs. Plausible analytics is yours forever. No lock-in."],
  ["What does \u201CLighthouse 95+\u201D actually mean?", "It's Google's free tool that grades sites 0–100 on speed, accessibility, and SEO. Site builders typically score 50–70 because they pile on plugins. I won't ship a site below 95, and I send you the score."],
  ["Where is my site hosted?", "On Cloudflare, which is fast, secure, and included. No GoDaddy, no Bluehost, no nasty cPanel logins."],
  ["Do you do e-commerce / Shopify?", "Small online stores, yes — usually with Stripe Checkout for simplicity. For big catalogues with thousands of SKUs, Shopify is the better tool and I'll honestly tell you so."],
];

function FAQ() {
  return (
    <section id="faq" className="section faq">
      <div className="wrap faq-grid">
        <div>
          <span className="eyebrow">FAQ</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Questions I get<br/>on every call.</h2>
          <p className="lede" style={{ marginTop: 18 }}>
            Don't see yours? Email <a href="mailto:hi@pixelboost.ca" style={{ color: "var(--mint-600)", textDecoration: "underline" }}>hi@pixelboost.ca</a> — I respond within a day.
          </p>
        </div>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <details key={i} className="faq-item" {...(i === 0 ? { open: true } : {})}>
              <summary>
                <span>{q}</span>
                <span className="plus"><Icon.plus/></span>
              </summary>
              <div className="answer">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- final CTA ----------
function FinalCTA() {
  const [url, setUrl] = useState("");
  const [scored, setScored] = useState(null);
  const score = (e) => {
    e.preventDefault();
    if (!url) return;
    const seed = [...url].reduce((s, c) => s + c.charCodeAt(0), 0);
    setScored({
      perf: 40 + (seed % 35),
      a11y: 55 + (seed % 30),
      seo:  60 + (seed % 25),
      load: (1.8 + ((seed % 20) / 10)).toFixed(1),
    });
  };
  return (
    <section id="cta" className="section final">
      <div className="wrap final-inner">
        <div>
          <h2>Let's see if we're<br/>a fit.</h2>
          <p>
            A 30-minute, no-pitch call. You tell me about your business; I'll tell you honestly whether I can help — or point you somewhere better if not.
          </p>
          <div className="ctas">
            <a href="mailto:hi@pixelboost.ca" className="btn btn-primary">Book a call <Icon.arrow/></a>
            <a href="mailto:hi@pixelboost.ca" className="btn btn-ghost">Email instead</a>
          </div>
        </div>
        <div className="analyzer">
          <div className="a-head">
            <span>Or — score your current site</span>
            <span style={{ color: "var(--mint-200)" }}>free</span>
          </div>
          <form className="a-input" onSubmit={score}>
            <input type="text" placeholder="your-business.ca" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Your website URL"/>
            <button type="submit">Run</button>
          </form>
          <div className="a-results">
            <div className="a-stat"><div className="v">{scored ? scored.perf : "—"}</div><span>Performance</span></div>
            <div className="a-stat"><div className="v">{scored ? scored.a11y : "—"}</div><span>Accessibility</span></div>
            <div className="a-stat"><div className="v">{scored ? scored.seo : "—"}</div><span>SEO</span></div>
            <div className="a-stat"><div className="v">{scored ? scored.load + "s" : "—"}</div><span>Load time</span></div>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(248,245,238,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {scored ? "Demo result · I'll send a real Lighthouse PDF after our call" : "Synthetic preview · real audit on first call"}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- blog ----------
const POSTS = [
  {
    tag: "Field notes",
    date: "Apr 2026",
    title: "Why your Squarespace site loads in 4 seconds (and what it's costing you)",
    blurb: "A look under the hood of three real Canadian small-business sites — and why every one of them lost about half their visitors before the page even appeared.",
    read: "8 min read",
    visual: "performance · case",
    featured: true,
  },
  {
    tag: "Plain English",
    date: "Mar 2026",
    title: "AODA, in 200 words",
    blurb: "What Ontario's accessibility law actually requires of small businesses — without the legalese.",
    read: "3 min read",
    visual: "accessibility",
  },
  {
    tag: "Process",
    date: "Feb 2026",
    title: "What three weeks really looks like",
    blurb: "A day-by-day diary of building a real client site from kickoff call to launch.",
    read: "6 min read",
    visual: "process",
  },
];

function Blog() {
  return (
    <section id="journal" className="section blog">
      <div className="wrap">
        <div className="section-head">
          <div className="left">
            <span className="eyebrow">Journal</span>
            <h2 className="h-section">Notes from<br/>the workshop.</h2>
          </div>
          <p className="sub">Short, plain-English pieces on what makes a website actually work for a small business — and what doesn't. Updated when I have something useful to say.</p>
        </div>
        <div className="blog-grid">
          {POSTS.map((p, i) => (
            <a href="#" className={`post${p.featured ? " featured" : ""}`} key={i}>
              {p.featured && <div className="visual"><span>{p.visual}</span></div>}
              <div className="post-meta">
                <span className="tag">{p.tag}</span>
                <span>{p.date}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <span className="read"><span>{p.read}</span> <Icon.arrow/></span>
            </a>
          ))}
        </div>
        <div className="blog-foot">
          <span>Updated when I have something useful to say · RSS available</span>
          <a href="#" className="btn btn-ghost" style={{ height: 36, padding: "8px 16px", fontSize: 13 }}>Read the journal <Icon.arrow/></a>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="brand-block">
            <a href="#" className="brand"><span className="brand-dot"></span><span>pixelboost</span></a>
            <p>A one-person studio in Ontario, Canada. Building fast, accessible custom websites for local businesses since 2022.</p>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#how">Process</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#cases">Past work</a></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#compare">Compare</a></li>
              <li><a href="#cta">Audit your site</a></li>
              <li><a href="mailto:hi@pixelboost.ca">Email</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>hi@pixelboost.ca</li>
              <li>Ontario, Canada · ET</li>
              <li>Mon–Fri, 9–5</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Pixelboost · made in canada 🍁</span>
          <span>Lighthouse 100 · WCAG AA · No tracking</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- App ----------
function App() {
  const defaults = window.usePixelboostTweaks();
  useEffect(() => {
    document.documentElement.dataset.density = defaults.tw.density;
    document.documentElement.style.setProperty("--accent", defaults.tw.accent);
  }, [defaults.tw.density, defaults.tw.accent]);

  return (
    <>
      <Nav/>
      <Hero variant={defaults.tw.heroVariant}/>
      <Services/>
      <HowItWorks/>
      <Cases/>
      <Explain/>
      <Compare/>
      <Pricing/>
      <FAQ/>
      <FinalCTA/>
      <Blog/>
      <Footer/>
      <window.PixelboostTweaks tw={defaults.tw} setTw={defaults.setTw}/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
