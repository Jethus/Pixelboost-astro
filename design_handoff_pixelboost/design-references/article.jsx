/* global React, ReactDOM */

const Arrow = () => <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const RELATED = [
  { tag: "Accessibility", date: "Feb 18, 2025", title: "AODA, WCAG 2.1 AA — what an Ontario business actually has to do.", blurb: "Ignore the acronym soup. Here's the short version of your legal obligations and the practical steps to meet them." },
  { tag: "Build vs buy", date: "Mar 02, 2025", title: "Squarespace vs. custom: when does a template stop making sense?", blurb: "Templates are great until they're not. A frank look at the tipping point." },
  { tag: "Analytics", date: "Feb 04, 2025", title: "Plausible vs. Google Analytics: what you actually need to know.", blurb: "Privacy-friendly analytics that doesn't need a cookie banner. What you gain, what you lose." },
];

const TOC = [
  { id: "the-problem", label: "The three-second problem" },
  { id: "what-actually-slows-you-down", label: "What actually slows you down" },
  { id: "images", label: "1. Unoptimised images" },
  { id: "scripts", label: "2. Third-party scripts" },
  { id: "fonts", label: "3. Web fonts, loaded poorly" },
  { id: "hosting", label: "4. Cheap, slow hosting" },
  { id: "what-to-do", label: "What to do about it" },
  { id: "the-bottom-line", label: "The bottom line" },
];

function Nav() {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a href="Pixelboost Landing.html" className="brand">
          <span className="brand-dot"></span>
          <span>pixelboost</span>
        </a>
        <div className="nav-links">
          <a href="Pixelboost Landing.html#services">Services</a>
          <a href="Pixelboost Landing.html#how">Process</a>
          <a href="Pixelboost Landing.html#cases">Work</a>
          <a href="Pixelboost Landing.html#pricing">Pricing</a>
          <a href="blog.html" className="active">Journal</a>
          <a href="Pixelboost Landing.html#cta" className="btn btn-mint">Book a call <Arrow/></a>
        </div>
      </div>
    </nav>
  );
}

function Article() {
  return (
    <article className="article">
      <div className="wrap">
        <div className="article-layout">
          <div>
            <header className="article-header">
              <div className="crumbs">
                <a href="Pixelboost Landing.html">Pixelboost</a>
                <span>/</span>
                <a href="blog.html">Journal</a>
                <span>/</span>
                <span>Performance</span>
              </div>
              <h1>Why your website loads slow — and why it's quietly losing you customers.</h1>
              <p className="lead">A one-second delay in page load can drop conversions by 7%. Here's a plain-English breakdown of what actually slows a small business site down, and the handful of things worth fixing first.</p>
              <div className="article-byline">
                <span className="av">M</span>
                <span className="who">Matt Tanguay</span>
                <span className="dot">·</span>
                <time dateTime="2025-03-14">March 14, 2025</time>
                <span className="dot">·</span>
                <span>6 min read</span>
              </div>
            </header>

            <div className="article-body">
              <p>Your website is probably too slow. I don't mean that as a roast — I mean it as a statistical likelihood. The median small-business website in 2025 takes <strong>4.2 seconds</strong> to become usable on a mid-range phone, and every second past the first one loses you customers who will never tell you they left.</p>
              <p>Good news: the problem is almost always the same four things, and you don't need a developer to understand them.</p>

              <h2 id="the-problem">The three-second problem</h2>
              <p>Google has been saying this for a decade and the data has only gotten more aggressive. If your site takes longer than three seconds to load on a phone, <strong>53% of visitors will bounce</strong> — meaning they'll close the tab before a single pixel of your carefully written copy lands.</p>
              <p>That number doesn't care how good your business is. It doesn't care that you've been serving the best pizza in town since 1994. It's a reflex, the same way you'd hang up on a phone call that took three seconds of silence before the other person said hello.</p>

              <blockquote>"Fast is a feature. Slow is a bug you've shipped to production and are paying for every day."</blockquote>

              <h2 id="what-actually-slows-you-down">What actually slows you down</h2>
              <p>In my experience rebuilding maybe three dozen small-business websites, slowness almost always comes from one of four places. Here they are, in rough order of how much damage each one does.</p>

              <h3 id="images">1. Unoptimised images</h3>
              <p>This is the villain 80% of the time. You take a nice photo on your phone — it's 4,032 pixels wide and weighs 8 megabytes. You drop it into Squarespace or WordPress. It displays at 800 pixels wide on screen but the browser still downloads all 8 megabytes. On a phone on a slow connection, that's your visitor's whole data budget for a coffee shop homepage.</p>
              <p>The fix: images should be sized to what's actually shown, and served in modern formats (WebP, AVIF). On most sites I redo, <strong>image optimisation alone cuts load time in half.</strong></p>

              <figure>
                <div className="placeholder"><span>Fig. 01 — Network waterfall, before / after</span></div>
                <figcaption>Waterfall chart showing a 4.8s load dropping to 0.9s after image optimisation only.</figcaption>
              </figure>

              <h3 id="scripts">2. Third-party scripts</h3>
              <p>Every "helpful" widget you embed — a live chat pop-up, a cookie banner, a Facebook pixel, an Instagram feed, a review carousel — is code you didn't write, hosted on someone else's server, that runs before your visitor can read anything.</p>
              <p>A typical small-business Squarespace or WordPress site, by the time you've installed a few apps, is running <strong>12 to 20 third-party scripts</strong>. Each one is a separate download, a separate possible point of failure, and a separate little privacy tracker you might have just made yourself legally responsible for.</p>

              <div className="article-callout">
                <span className="label">Rule of thumb</span>
                <p>If a third-party widget doesn't directly generate revenue or prove compliance, delete it. The fewer things running on your site, the faster and more reliable it is.</p>
              </div>

              <h3 id="fonts">3. Web fonts, loaded poorly</h3>
              <p>Custom fonts are part of what makes a site feel like it belongs to a real brand. But when they're loaded without care, the browser waits for the font to download before showing <em>any</em> text — and on a slow phone that can be a full second of staring at a white screen.</p>
              <p>The fix is technical but one-and-done: self-host your fonts, preload the ones used above the fold, and use <code>font-display: swap</code> so text shows immediately in a system font while the custom font loads in the background. A good developer does this in about fifteen minutes.</p>

              <h3 id="hosting">4. Cheap, slow hosting</h3>
              <p>A $3/month shared-hosting plan is sharing a single server with 300 other websites, some of which are getting DDoSed and some of which are running WordPress with 47 plugins last updated in 2018. Your site waits its turn.</p>
              <p>For a simple brochure site, a static host (Netlify, Cloudflare Pages, Vercel's hobby tier) is usually <strong>free and dramatically faster</strong>. For something with a CMS, a modern managed host in the $20–$40/month range is worth it. Shared hosting in 2025 is a false economy.</p>

              <h2 id="what-to-do">What to do about it</h2>
              <p>If you want to check your own site in five minutes, go to <a href="https://pagespeed.web.dev" rel="noopener">pagespeed.web.dev</a>, paste your URL, and look at the mobile score. If you're under 70, you have work to do. Under 50, your site is actively costing you money every day.</p>
              <p>The fixes in order of impact:</p>
              <ol>
                <li><strong>Compress and resize your images.</strong> Every image on your site should be no bigger than it needs to be. Free tool: <a href="https://squoosh.app" rel="noopener">squoosh.app</a>.</li>
                <li><strong>Audit your third-party scripts.</strong> Remove anything that isn't pulling its weight.</li>
                <li><strong>Fix your fonts.</strong> Self-host, preload, swap.</li>
                <li><strong>Consider your hosting.</strong> If you're on shared, move.</li>
              </ol>

              <h2 id="the-bottom-line">The bottom line</h2>
              <p>Speed is the most undervalued investment a small-business website can make. It's not sexy — nobody is going to visit your site and say "wow, this loaded in 800 milliseconds." But they will convert more, stay longer, and remember you as professional. And Google will rank you higher for it.</p>
              <p>If you want me to take a look at your site and tell you what would move the needle, it takes about twenty minutes and I won't charge you for it. <a href="Pixelboost Landing.html#cta">Book a call</a>.</p>

              <div className="article-callout" style={{ marginTop: 40 }}>
                <span className="label">Want help?</span>
                <p>Pixelboost rebuilds small-business websites that load in under a second, meet accessibility standards, and don't need a subscription to five different plugins. <a href="Pixelboost Landing.html#cta">Book a free call →</a></p>
              </div>

              <div className="article-footer">
                <div className="article-share">
                  <span>Share:</span>
                  <a href="#">Copy link</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">Twitter</a>
                  <a href="mailto:?subject=Why%20your%20website%20loads%20slow">Email</a>
                </div>
                <div className="article-author">
                  <div className="av">M</div>
                  <div>
                    <h4>Matt Tanguay — Pixelboost</h4>
                    <p>I build websites for small businesses across Ontario and the Maritimes. If you've read this far you already know what I think about slow sites.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="toc">
            <div className="label">On this page</div>
            <ul>
              {TOC.map(t => <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>)}
            </ul>
            <div className="reading-time">6 min read</div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function Related() {
  return (
    <section className="related">
      <div className="wrap">
        <h2>Keep reading</h2>
        <div className="related-grid">
          {RELATED.map((p, i) => (
            <a href="article.html" className="post" key={i}>
              <div className="post-meta">
                <span className="tag">{p.tag}</span>
                <span>{p.date}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <span className="read"><span>Read</span> <Arrow/></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <div className="foot-brand">
          <div className="brand"><span className="brand-dot"></span><span>pixelboost</span></div>
          <p>Websites that actually work, for small businesses across Ontario and the Maritimes.</p>
        </div>
        <div className="foot-col">
          <span className="foot-head">Company</span>
          <a href="Pixelboost Landing.html#services">Services</a>
          <a href="Pixelboost Landing.html#cases">Work</a>
          <a href="Pixelboost Landing.html#pricing">Pricing</a>
          <a href="blog.html">Journal</a>
        </div>
        <div className="foot-col">
          <span className="foot-head">Contact</span>
          <a href="mailto:hi@pixelboost.ca">hi@pixelboost.ca</a>
          <a href="tel:+16135550123">(613) 555-0123</a>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© 2025 Pixelboost. Built the hard way.</span>
        <span>Ottawa, ON</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Nav/>
      <Article/>
      <Related/>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
