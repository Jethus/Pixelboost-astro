/* global React, ReactDOM */
const { useState } = React;

// shared icon (inline, small)
const Arrow = () => <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const POSTS = [
  {
    slug: "why-your-website-loads-slow",
    tag: "Performance",
    date: "Mar 14, 2025",
    read: "6 min read",
    title: "Why your website loads slow — and why it's quietly losing you customers.",
    blurb: "A one-second delay in page load can drop conversions by 7%. Here's a plain-English breakdown of what actually slows a small business site down, and the handful of things worth fixing first.",
    visual: "Fig. 01 — Waterfall",
    featured: true,
  },
  {
    slug: "squarespace-vs-custom",
    tag: "Build vs buy",
    date: "Mar 02, 2025",
    read: "8 min read",
    title: "Squarespace vs. custom: when does a template stop making sense?",
    blurb: "Templates are great until they're not. A frank look at the tipping point — and how to know if you're past it.",
  },
  {
    slug: "aoda-plain-english",
    tag: "Accessibility",
    date: "Feb 18, 2025",
    read: "5 min read",
    title: "AODA, WCAG 2.1 AA — what an Ontario business actually has to do.",
    blurb: "Ignore the acronym soup. Here's the short version of your legal obligations and the practical steps to meet them.",
  },
  {
    slug: "plausible-vs-ga",
    tag: "Analytics",
    date: "Feb 04, 2025",
    read: "4 min read",
    title: "Plausible vs. Google Analytics: what you actually need to know.",
    blurb: "Privacy-friendly analytics that doesn't need a cookie banner. What you gain, what you lose.",
  },
  {
    slug: "local-seo-2025",
    tag: "SEO",
    date: "Jan 22, 2025",
    read: "7 min read",
    title: "Local SEO in 2025: a five-step checklist for a single-location business.",
    blurb: "The boring fundamentals still win. A step-by-step you can run through in an afternoon.",
  },
  {
    slug: "copy-that-converts",
    tag: "Copywriting",
    date: "Jan 10, 2025",
    read: "6 min read",
    title: "The homepage copy formula that converts for small services businesses.",
    blurb: "Three sentences, in this order. Everything else is decoration.",
  },
  {
    slug: "hidden-costs-free-site",
    tag: "Build vs buy",
    date: "Dec 28, 2024",
    read: "5 min read",
    title: "The hidden costs of a \"free\" website builder, itemized.",
    blurb: "Add it all up over three years. The math is rarely in your favour.",
  },
  {
    slug: "fonts-that-load-fast",
    tag: "Performance",
    date: "Dec 14, 2024",
    read: "4 min read",
    title: "Fonts that load fast without looking like a Word document.",
    blurb: "System fonts, variable fonts, self-hosting. Pick two.",
  },
];

const CATEGORIES = ["All", "Performance", "Accessibility", "SEO", "Build vs buy", "Copywriting", "Analytics"];

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

function Hero() {
  return (
    <header className="b-hero">
      <div className="wrap">
        <div className="crumbs">
          <a href="Pixelboost Landing.html">Pixelboost</a>
          <span>/</span>
          <span>Journal</span>
        </div>
        <h1>Plain-English writing on <em>making websites that work</em>.</h1>
        <p>Short, practical pieces on performance, accessibility, SEO, and what it actually takes to build a website that earns its keep. Written for small-business owners who'd rather skip the jargon.</p>
      </div>
    </header>
  );
}

function Featured({ post }) {
  return (
    <a href={`article.html`} className="b-feature" style={{ textDecoration: "none" }}>
      <div className="vis"><span>{post.visual}</span></div>
      <div>
        <div className="meta">
          <span>{post.tag}</span>
          <span>{post.date}</span>
          <span>{post.read}</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.blurb}</p>
        <span className="cta">Read the piece <Arrow/></span>
      </div>
    </a>
  );
}

function List({ posts }) {
  return (
    <div className="b-list">
      {posts.map((p, i) => (
        <a href="article.html" className="b-row" key={i}>
          <div className="meta">
            <span className="tag">{p.tag}</span>
            <span>{p.date}</span>
            <span>{p.read}</span>
          </div>
          <div className="body">
            <h3>{p.title}</h3>
            <p>{p.blurb}</p>
          </div>
          <div className="read">Read <Arrow/></div>
        </a>
      ))}
    </div>
  );
}

function App() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const featured = POSTS.find(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);
  const filtered = rest.filter(p => (
    (cat === "All" || p.tag === cat) &&
    (q === "" || (p.title + p.blurb).toLowerCase().includes(q.toLowerCase()))
  ));
  return (
    <>
      <Nav/>
      <Hero/>
      <section className="section" style={{ paddingTop: "clamp(40px, 5vw, 64px)" }}>
        <div className="wrap">
          {featured && <Featured post={featured}/>}

          <div className="b-toolbar">
            <div className="b-tabs">
              {CATEGORIES.map(c => (
                <button key={c} className={c === cat ? "active" : ""} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <label className="b-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search articles…" value={q} onChange={e => setQ(e.target.value)}/>
            </label>
          </div>

          {filtered.length > 0 ? <List posts={filtered}/> : (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-500)", fontSize: 15 }}>
              No articles match that filter. <button onClick={() => { setCat("All"); setQ(""); }} style={{ background: "none", border: 0, color: "var(--mint-600)", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>Clear</button>
            </div>
          )}

          <div className="blog-foot" style={{ marginTop: 40 }}>
            <span>{rest.length + 1} articles · Updated when there's something worth saying · <a href="#" style={{ color: "var(--mint-600)", textDecoration: "underline" }}>RSS</a></span>
            <a href="Pixelboost Landing.html#cta" className="btn btn-dark" style={{ height: 36, padding: "8px 16px", fontSize: 13 }}>Book a call <Arrow/></a>
          </div>
        </div>
      </section>

      {/* simple footer */}
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
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
