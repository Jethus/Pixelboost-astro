import { useEffect, useRef, useState } from 'react';

type AuditState = 'idle' | 'scanning' | 'done' | 'error';

interface Scores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

export interface AuditRow {
  key: keyof Scores;
  label: string;
  sub: string;
}

export interface AuditContent {
  eyebrow: string;
  headline: string;
  body: string;
  footnote: string;
  verdictIdle: string;
  verdictDone: string;
  emailCopy: string;
  callCopy: string;
  rows: AuditRow[];
}

function grade(n: number): 'good' | 'mid' | 'bad' {
  return n >= 90 ? 'good' : n >= 65 ? 'mid' : 'bad';
}

function displayScore(key: keyof Scores, value: number): string | number {
  if (key === 'tracking') return value > 0 ? 'Yes' : 'No';
  return value;
}

const GRADE_COLOR = {
  good: 'var(--color-mint-600)',
  mid:  'var(--color-yellow)',
  bad:  'var(--color-red)',
};

const BAR_COLOR = {
  good: 'var(--color-mint-500)',
  mid:  'var(--color-yellow)',
  bad:  'var(--color-red)',
};

export default function Audit({
  eyebrow,
  headline,
  body,
  footnote,
  verdictIdle,
  verdictDone,
  emailCopy,
  callCopy,
  rows,
}: AuditContent) {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AuditState>('idle');
  const [scores, setScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
  // Scores actually shown — count up from 0 to `scores` for a "results landing" feel.
  const [displayScores, setDisplayScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
  const [scannedUrl, setScannedUrl] = useState('');
  const rafRef = useRef<number | null>(null);

  // Refs for CSSOM-driven dynamic styles (bar widths + score colors)
  const barFillRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const scoreNumRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Count-up animation toward the real scores once a scan completes.
  useEffect(() => {
    if (state !== 'done') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayScores(scores);
      return;
    }

    const keys: (keyof Scores)[] = ['perf', 'a11y', 'seo', 'mobile', 'tracking'];
    const duration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayScores(
        keys.reduce((acc, k) => {
          acc[k] = Math.round(scores[k] * eased);
          return acc;
        }, {} as Scores),
      );
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplayScores(scores);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [state, scores]);

  // CSSOM updates for dynamic bar widths and score colors.
  // These are genuinely data-driven (score value + grade) so we use element.style
  // inside a useEffect rather than static style attributes.
  useEffect(() => {
    const showScores = state === 'done';
    rows.forEach(row => {
      const val = displayScores[row.key];
      const g = grade(scores[row.key]);

      const barEl = barFillRefs.current[row.key];
      if (barEl) {
        barEl.style.width = showScores ? `${val}%` : '0%';
        barEl.style.background = BAR_COLOR[g];
      }

      const numEl = scoreNumRefs.current[row.key];
      if (numEl) {
        numEl.style.color = showScores ? GRADE_COLOR[g] : 'var(--color-ink-400)';
      }
    });
  }, [displayScores, state, scores, rows]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === 'scanning') return;
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    setScannedUrl(normalized);
    setScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
    setDisplayScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
    setState('scanning');
    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(normalized)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Scores = await res.json();
      setScores(data);
      setState('done');
    } catch {
      setState('error');
    }
  };

  const showScores = state === 'done';
  const displayUrl = state === 'idle' ? 'yourbusiness.ca' : (scannedUrl || url || 'yourbusiness.ca');
  const headerDate = (() => {
    const now = new Date();
    return now.toLocaleString('en-CA', { month: 'short', year: 'numeric' });
  })();

  return (
    <section
      id="audit"
      className="section-card audit-section"
    >
      <div className="audit-shell">

        {/* Left column */}
        <div>
          <span className="audit-eyebrow eyebrow-chip">
            <span className="eyebrow-dot"></span>
            {eyebrow}
          </span>

          <h2 className="audit-headline">
            {headline}
          </h2>

          <p className="audit-body">
            {body}
          </p>

          <form onSubmit={handleSubmit} className="audit-form">
            <input
              type="text"
              placeholder="yourbusiness.ca"
              value={url}
              onChange={e => setUrl(e.target.value)}
              aria-label="Your website URL"
              className="audit-url-input"
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-mint-500)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-mint-100)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor = 'var(--color-ink)';      e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              type="submit"
              className="btn-mint btn-on-dark btn-interactive audit-scan-btn"
            >
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'}
              <svg className="audit-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>

          <div className="audit-footnote-wrap">
            <span className="audit-footnote-label">Technical</span>
            <p className="audit-footnote-text">{footnote}</p>
          </div>
        </div>

        {/* Right column — report card */}
        <div
          aria-live="polite"
          className="audit-card"
        >
          {/* Card header */}
          <div className="audit-card-header">
            <div className="audit-mac-dots">
              {[0,1,2].map(i => <span key={i} className="audit-mac-dot"/>)}
            </div>
            <div>Site report — {displayUrl} · {headerDate}</div>
          </div>

          {/* Metric rows */}
          <div className="audit-rows-wrap">
            {rows.map(row => {
              const val = displayScores[row.key];
              return (
                <div key={row.key} className="audit-row">
                  <div>
                    <span className="audit-row-label">{row.label}</span>
                    <span className="audit-row-sub">{row.sub}</span>
                  </div>
                  <div className="audit-bar-track">
                    <span
                      ref={el => { barFillRefs.current[row.key] = el; }}
                      className="audit-bar-fill"
                    />
                  </div>
                  <div
                    ref={el => { scoreNumRefs.current[row.key] = el; }}
                    className="audit-score-num"
                  >
                    {showScores ? displayScore(row.key, val) : '—'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card footer / verdict */}
          <div className="audit-verdict">
            <p className="audit-verdict-text">
              {state === 'done'
                ? <>{verdictDone} <strong className="audit-verdict-strong">5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : state === 'error'
                    ? <span className="audit-error-msg">Couldn't reach that URL — double-check it and try again.</span>
                    : <>Verdict <svg className="audit-verdict-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> <strong>{verdictIdle}</strong></>
              }
            </p>
          </div>

          {/* Email capture — shown after scan */}
          {state === 'done' && (
            <div className="audit-email-section">
              <p className="audit-email-copy">
                {emailCopy}
              </p>
              <form className="audit-email-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@yourbusiness.ca"
                  aria-label="Your email address"
                  className="audit-email-input"
                />
                <button
                  type="submit"
                  className="btn-interactive audit-email-btn"
                >
                  Send my report
                  <svg className="audit-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </form>
              <a
                href="/contact"
                className="audit-call-link"
              >
                {callCopy}
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
