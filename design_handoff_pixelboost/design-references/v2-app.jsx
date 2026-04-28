/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

const Arrow = () => <span className="arrow">→</span>;

// minimal line icons (no emoji). 22px, stroke 1.5, currentColor.
const _ico = (children) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const PIcon = {
  // pillars (what you get)
  bolt:   () => _ico(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),
  access: () => _ico(<><circle cx="12" cy="4" r="1.6"/><path d="M5 8h14"/><path d="M12 8v5"/><path d="M9 21l3-8 3 8"/></>),
  chart:  () => _ico(<><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></>),
  wrench: () => _ico(<><path d="M14.7 6.3a4 4 0 1 0 5.66 5.66l-1.42-1.41a2 2 0 0 1-2.83-2.83L14.7 6.3z"/><path d="M14.7 6.3 4 17l3 3 10.7-10.7"/></>),
  // problem (what's wrong)
  clock:  () => _ico(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  eyeOff: () => _ico(<><path d="M3 3l18 18"/><path d="M10.6 6.1A10 10 0 0 1 22 12a10 10 0 0 1-3.1 4.4"/><path d="M6.1 6.1A10 10 0 0 0 2 12a10 10 0 0 0 13 5.7"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>),
  alert:  () => _ico(<><circle cx="12" cy="12" r="9"/><path d="M12 8v4.5"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/></>),
  lock:   () => _ico(<><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>),
};

// ---------- nav ----------
function Nav() {
  return (
    <nav className="nav">
      <a href="#" className="brand">
        <span className="brand-dot"></span>
        <span>pixelboost</span>
      </a>
      <div className="nav-links">
        <a href="#problem">Why it matters</a>
        <a href="#audit">Free audit</a>
        <a href="#work">Work</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
        <a href="#audit" className="btn mint">Score my site →</a>
      </div>
    </nav>
  );
}

// ---------- hero ----------
function Hero() {
  return (
    <section className="section hero">
      <div className="hero-inner">
        <div>
          <span className="eyebrow"><span className="dot"></span> Booking 2 projects for summer 2026</span>
          <h1>Websites that <span className="high">actually work</span> for your small business.</h1>
          <p className="lede">I build fast, accessible, trackable websites for Canadian small businesses — then stick around as your web developer for updates, fixes, and improvements. No site-builder bloat, no surprise invoices.</p>
          <div className="ctas">
            <a href="#audit" className="btn mint lg">Score my site<Arrow/></a>
            <a href="#work" className="btn secondary lg" style={{whiteSpace:'nowrap'}}>See recent work</a>
          </div>
          <p className="hero-foot"><em>Free report card. No email required. Takes 30 seconds.</em></p>
          <div className="proof">
            <div className="stack"><div>O</div><div>R</div><div>C</div></div>
            <span>Trusted by 20+ local businesses across Ontario &amp; the Maritimes</span>
          </div>
        </div>

        <div className="visual" aria-hidden="true">
          <div className="v-head">
            <div className="v-dots"><span></span><span></span><span></span></div>
            <div className="v-url">innatridgechristian.ca</div>
          </div>
          <div className="v-body">
            <div className="v-score">
              <span className="v-score-num">97</span>
              <span className="v-score-label">Google<br/>performance</span>
            </div>
            <div className="v-score-sub">Up from 54 on the old Squarespace site.</div>
            <div className="v-rows">
              <div className="v-row"><span>Speed</span><div className="v-bar"><span style={{width:'96%'}}></span></div><span className="good">97</span></div>
              <div className="v-row"><span>Accessibility</span><div className="v-bar"><span style={{width:'100%'}}></span></div><span className="good">100</span></div>
              <div className="v-row"><span>SEO</span><div className="v-bar"><span style={{width:'100%'}}></span></div><span className="good">100</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- problem ----------
function Problem() {
  const items = [
    { Icon: PIcon.clock,  t: 'Your site loads slowly.', p: 'Every extra second on mobile loses about 1 in 5 visitors. They leave before they ever see your menu, hours, or services.' },
    { Icon: PIcon.eyeOff, t: "You can't see who's visiting.", p: 'No analytics, or Google Analytics that nobody understands. You\'re running your business blind.' },
    { Icon: PIcon.alert,  t: "Some customers can't use it.", p: 'Older customers, mobile users, anyone with a disability — small accessibility issues turn into "this site is broken" moments.' },
    { Icon: PIcon.lock,   t: "It's a pain to update.", p: 'Hours changed? New service? You either pay your old developer to come back, or wrestle with a builder you don\'t like opening.' },
  ];
  return (
    <section className="section cream" id="problem">
      <div style={{maxWidth:'780px'}}>
        <span className="eyebrow"><span className="dot"></span> Why it matters</span>
        <h2>Your current site might be quietly <span className="high">costing you leads.</span></h2>
        <p className="lede">Most small-business websites have problems the owner can't see — but their customers feel them every day. Here's where it usually shows up:</p>
      </div>
      <div className="problem-grid">
        {items.map((it, i) => {
          const Ico = it.Icon;
          return (
            <div key={i} className="problem-card">
              <div className="problem-icon"><Ico/></div>
              <h3>{it.t}</h3>
              <p>{it.p}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- audit / report card ----------
function Audit() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState('idle'); // idle | scanning | done
  const [scores, setScores] = useState({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });

  useEffect(() => {
    if (state !== 'scanning') return;
    const target = { perf: 58, a11y: 71, seo: 84, mobile: 49, tracking: 25 };
    const start = performance.now();
    const dur = 1400;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setScores({
        perf: Math.round(target.perf * e),
        a11y: Math.round(target.a11y * e),
        seo: Math.round(target.seo * e),
        mobile: Math.round(target.mobile * e),
        tracking: Math.round(target.tracking * e),
      });
      if (p < 1) raf = requestAnimationFrame(tick);
      else setState('done');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setState('scanning');
  };

  const grade = (n) => n >= 90 ? 'good' : n >= 65 ? 'mid' : 'bad';
  const showScores = state !== 'idle';

  const rows = [
    { label: 'Speed', sub: 'How fast pages load on mobile', val: scores.perf },
    { label: 'Accessibility', sub: 'Can everyone actually use it?', val: scores.a11y },
    { label: 'SEO basics', sub: 'Can Google find and read it?', val: scores.seo },
    { label: 'Mobile experience', sub: 'Tap targets, layout, readability', val: scores.mobile },
    { label: 'Visitor tracking', sub: 'Privacy-friendly analytics setup', val: scores.tracking },
  ];

  return (
    <section className="section dark" id="audit">
      <div className="audit-shell">
        <div>
          <span className="eyebrow" style={{background:'rgba(60,203,138,0.15)', color:'var(--mint-300)'}}><span className="dot"></span> Free, no email required</span>
          <h2 style={{color:'var(--paper)'}}>Get a free <span className="high">website report card.</span></h2>
          <p className="lede">I check your site the way Google and real customers experience it: how fast it loads, whether people can use it easily, whether search engines can understand it, and whether you're tracking what visitors do. You get a plain-English report card and the three fixes I'd start with.</p>
          <form className="audit-form" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="yourbusiness.ca"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Your website URL"
            />
            <button type="submit" className="btn mint">
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'}
              <Arrow/>
            </button>
          </form>
          <p className="audit-note">
            <em>Technically:</em> I use Google Lighthouse, axe accessibility checks, and a Plausible tracking audit to back the report up. You'll get it whether or not we work together.
          </p>
        </div>

        <div className="report" aria-live="polite">
          <div className="report-head">
            <div className="dot-row"><span></span><span></span><span></span></div>
            <div>{state === 'idle' ? 'Sample report — yourbusiness.ca' : url || 'yourbusiness.ca'} · Apr 2026</div>
          </div>
          <div className="report-rows">
            {rows.map((r, i) => (
              <div key={i} className="rrow">
                <div>
                  <span className="metric">{r.label}</span>
                  <span className="sub">{r.sub}</span>
                </div>
                <div className={`bar ${grade(r.val)}`}><span style={{width: showScores ? `${r.val}%` : '0%'}}></span></div>
                <div className={`score-val ${grade(r.val)}`}>{showScores ? r.val : '—'}</div>
              </div>
            ))}
          </div>
          <div className="report-foot">
            <div className="verdict">
              {state === 'done'
                ? <>Verdict → <strong>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? <>Scanning your site…</>
                  : <>Verdict → <strong>Enter your URL above to run a real scan.</strong></>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- offer (4 pillars) ----------
function Offer() {
  const pillars = [
    {
      Icon: PIcon.bolt,
      title: 'Fast on mobile.',
      pitch: 'Your site should load quickly on phones, even on slow connections.',
      proof: <><em>Technically:</em> I target 95+ Google Lighthouse performance scores on real devices.</>,
    },
    {
      Icon: PIcon.access,
      title: 'Accessible by default.',
      pitch: 'Your site should work for every customer — older folks, mobile users, anyone with a disability.',
      proof: <><em>Technically:</em> WCAG 2.1 AA, AODA-aligned, tested with axe and real assistive tech.</>,
    },
    {
      Icon: PIcon.chart,
      title: 'Tracked with simple analytics.',
      pitch: 'You should know which pages bring in leads — without cookie banners or creepy tracking.',
      proof: <><em>Technically:</em> Privacy-friendly Plausible analytics. GDPR/PIPEDA-compliant. No banner needed.</>,
    },
    {
      Icon: PIcon.wrench,
      title: 'Maintained after launch.',
      pitch: "After launch, I'm still your developer. Hours changed, new service, copy fix? Send it.",
      proof: <><em>Technically:</em> Included in the monthly plan. Same-week turnaround for small changes.</>,
    },
  ];
  return (
    <section className="section">
      <div style={{maxWidth:'780px'}}>
        <span className="eyebrow"><span className="dot"></span> What you actually get</span>
        <h2>Every site is built on the same <span className="high">four pillars.</span></h2>
        <p className="lede">No template. No subscription you'll forget about. Just a clean site built around what your customers need to do next.</p>
      </div>
      <div className="pillars-grid">
        {pillars.map((p, i) => {
          const Ico = p.Icon;
          return (
            <div key={i} className="pillar">
              <div className="pillar-icon"><Ico/></div>
              <h3>{p.title}</h3>
              <p className="pitch">{p.pitch}</p>
              <p className="proof-line">{p.proof}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- work / before-after ----------
function Work() {
  const work = [
    {
      client: 'Inn at Ridge', tag: 'Inn at Ridge · Hospitality',
      summary: '14-room inn in Niagara. Replaced a slow Squarespace site with a custom booking-focused build.',
      stats: [
        { label: 'Lighthouse', before: '54', after: '97', tone: 'score' },
        { label: 'Load time', before: '4.8s', after: '1.1s', tone: 'time' },
        { label: 'Tracking', before: 'None', after: 'Plausible', tone: 'text' },
      ],
      kpi: '1.4× more direct bookings in Q1',
    },
    {
      client: 'Ontario Community Theatres', tag: 'OCT · Arts non-profit',
      summary: 'Provincial directory rebuilt with full accessibility and a member portal. Used by 80+ theatres.',
      stats: [
        { label: 'Lighthouse', before: '62', after: '100', tone: 'score' },
        { label: 'Accessibility', before: 'Fail', after: 'WCAG AA', tone: 'text' },
        { label: 'Tracking', before: 'GA3', after: 'Plausible', tone: 'text' },
      ],
      kpi: 'AODA-compliant · audited Mar 2026',
    },
    {
      client: 'Crescendo Music School', tag: 'Crescendo · Education',
      summary: 'Family-run music school in Ottawa. Sign-ups happen on the homepage now, not over email.',
      stats: [
        { label: 'Lighthouse', before: '48', after: '96', tone: 'score' },
        { label: 'Load time', before: '6.2s', after: '0.9s', tone: 'time' },
        { label: 'Tracking', before: 'None', after: 'Plausible', tone: 'text' },
      ],
      kpi: '38 sign-ups in launch week',
    },
  ];
  return (
    <section className="section mint-bg" id="work">
      <div style={{maxWidth:'780px'}}>
        <span className="eyebrow" style={{background:'var(--paper)'}}><span className="dot"></span> Recent work</span>
        <h2>Real Canadian small businesses, <span className="high">real before-and-after.</span></h2>
        <p className="lede">Every project gets a Google Lighthouse score before and after. The numbers are how I keep myself honest.</p>
      </div>
      <div className="work-grid">
        {work.map((w, i) => (
          <div key={i} className="work-card">
            <div className="vis"><span>{w.tag}</span></div>
            <h3>{w.client}</h3>
            <p>{w.summary}</p>
            <div className="ba-table">
              {w.stats.map((s, j) => (
                <div key={j} className="ba-row-v2">
                  <span className="ba-label">{s.label}</span>
                  <span className="ba-before">{s.before}</span>
                  <span className="ba-arrow-v2">→</span>
                  <span className="ba-after">{s.after}</span>
                </div>
              ))}
            </div>
            <div className="ba-kpi">{w.kpi}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- pricing ----------
function Pricing() {
  return (
    <section className="section" id="pricing">
      <div style={{maxWidth:'780px'}}>
        <span className="eyebrow"><span className="dot"></span> Pricing</span>
        <h2>Two ways to work together. <span className="high">No surprise invoices.</span></h2>
        <p className="lede">Pick the monthly plan if you want a partner. Pick the flat rate if you'd rather pay once and own it outright. Both include the same build quality.</p>
      </div>
      <div className="price-grid">
        <div className="price-card featured">
          <span className="badge">Most chosen</span>
          <h3 className="name">Pixelboost monthly</h3>
          <p className="blurb">Custom site + ongoing care, all-in.</p>
          <div className="price">$200<small> / month</small></div>
          <ul>
            <li>Custom design + build (3–4 weeks)</li>
            <li>Hosting, SSL, domain setup</li>
            <li>Plausible analytics installed</li>
            <li>Ongoing updates &amp; small changes</li>
            <li>Quarterly performance check-ins</li>
            <li>Cancel anytime, take your site with you</li>
          </ul>
          <a href="#audit" className="btn mint">Start with a free audit<Arrow/></a>
        </div>
        <div className="price-card">
          <h3 className="name">Build &amp; hand-off</h3>
          <p className="blurb">One-time build, you take it from there.</p>
          <div className="price">$4,800<small> flat</small></div>
          <ul>
            <li>Same custom design + build</li>
            <li>Plausible installed and explained</li>
            <li>Documented and handed off cleanly</li>
            <li>30 days of post-launch fixes</li>
            <li>You own the code and content outright</li>
            <li>Optional: add monthly support later</li>
          </ul>
          <a href="#audit" className="btn">Talk it through<Arrow/></a>
        </div>
      </div>
      <div className="price-foot">
        <strong>You own the site.</strong> After 12 months, you can keep me on monthly, switch to a lighter care plan, or take the site with you to another developer. Either way, the code, content, and domain are yours.
      </div>
    </section>
  );
}

// ---------- faq ----------
function FAQ() {
  const qs = [
    { q: 'How long does a project take?', a: 'About 3–4 weeks from kickoff for most small-business sites. Larger projects with more pages, custom integrations, or content I have to write run 5–6 weeks. I only take on two projects at a time so timelines are honest.' },
    { q: "What's included in the $200/month plan?", a: 'The full custom build, hosting, domain setup, SSL, analytics installed, and ongoing updates — copy changes, new pages, fixing things, swapping photos. Anything that takes me less than an hour or two is just included. Big new features get quoted separately so there are no surprises.' },
    { q: 'Am I locked into a contract?', a: 'No. The monthly plan is month-to-month, cancel anytime. If you leave, I help you migrate the site to wherever you want — you own the code and the content.' },
    { q: 'Who owns the website?', a: 'You do, on both plans. The code, the design, the content, the domain, the analytics — all yours. I don\'t hold anything hostage.' },
    { q: 'What if I already have a site?', a: 'Then we start with a free audit (above). About a third of the time, the right answer is "your site is mostly fine, here are 3 small fixes." If a rebuild does make sense, we go from there.' },
    { q: 'Do you only work with Ontario businesses?', a: 'No, just Canadian. I work with clients across Ontario and the Maritimes mostly, but anywhere in Canada is fine. Time zones matter more than borders.' },
    { q: 'Why do you keep mentioning "Lighthouse" and "Plausible"?', a: 'Lighthouse is Google\'s free tool that grades website speed, accessibility, and SEO — it\'s the industry standard, and I use it as honest proof that the site is actually good. Plausible is privacy-friendly analytics: visitor counts and traffic sources without cookie banners or selling data. You\'ll see the dashboards, not me.' },
  ];
  return (
    <section className="section cream" id="faq">
      <div style={{maxWidth:'780px'}}>
        <span className="eyebrow"><span className="dot"></span> FAQ</span>
        <h2>Reasonable questions, plain answers.</h2>
      </div>
      <div className="faq-list">
        {qs.map((f, i) => (
          <details key={i} className="faq-item" open={i === 0}>
            <summary className="faq-q">{f.q}</summary>
            <div className="a">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---------- final cta ----------
function FinalCTA() {
  return (
    <section className="section final-cta" id="cta">
      <h2>Want to know what your site actually scores?</h2>
      <p className="lede">Free audit, no email required, no sales pitch attached. You'll get a plain-English report card and the three fixes I'd start with — whether or not we end up working together.</p>
      <div className="ctas">
        <a href="#audit" className="btn mint lg">Get my free report card<Arrow/></a>
        <a href="mailto:hi@pixelboost.ca" className="btn secondary lg" style={{borderColor:'var(--paper)', color:'var(--paper)'}}>Or just email me</a>
      </div>
    </section>
  );
}

// ---------- footer ----------
function Foot() {
  return (
    <>
      <footer className="foot">
        <div className="brand-col">
          <div className="brand"><span className="brand-dot"></span><span>pixelboost</span></div>
          <p>A one-person web studio in Ontario, building fast, accessible custom websites for Canadian small businesses since 2022.</p>
        </div>
        <div>
          <h4>Pixelboost</h4>
          <a href="#problem">Why it matters</a>
          <a href="#audit">Free audit</a>
          <a href="#work">Recent work</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href="mailto:hi@pixelboost.ca">hi@pixelboost.ca</a>
          <a href="#">Read the journal</a>
          <a href="#">@pixelboost on Bluesky</a>
        </div>
      </footer>
      <div className="foot-bottom">
        <span>© 2026 Pixelboost · Made in Ontario, Canada 🍁</span>
        <span>Built on this site. Lighthouse 100/100/100/100.</span>
      </div>
    </>
  );
}

// ---------- app ----------
function App() {
  return (
    <div className="page">
      <div style={{maxWidth:'1200px', margin:'0 auto'}}>
        <Nav/>
      </div>
      <Hero/>
      <Problem/>
      <Audit/>
      <Offer/>
      <Work/>
      <Pricing/>
      <FAQ/>
      <FinalCTA/>
      <Foot/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
