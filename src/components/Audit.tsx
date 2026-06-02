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
      className="section-card"
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
      }}
    >
      <div className="audit-shell">

        {/* Left column */}
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(60,203,138,0.15)', color: 'var(--color-mint-300)',
            fontWeight: 600, fontSize: '13px', letterSpacing: '0.04em',
            padding: '6px 14px', borderRadius: '9999px', marginBottom: '20px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-mint-500)', display: 'inline-block' }}></span>
            {eyebrow}
          </span>

          <h2 style={{ color: 'var(--color-paper)', margin: '0 0 16px 0' }}>
            {headline}
          </h2>

          <p style={{
            fontSize: 'clamp(16px, 1.35vw, 19px)',
            color: 'rgba(248,245,238,0.75)',
            lineHeight: 1.5, maxWidth: '56ch', margin: '0 0 28px 0', fontWeight: 500,
          }}>
            {body}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', margin: '20px 0 14px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="yourbusiness.ca"
              value={url}
              onChange={e => setUrl(e.target.value)}
              aria-label="Your website URL"
              style={{
                flex: 1, minWidth: '200px',
                fontFamily: 'inherit', fontSize: '15px',
                padding: '14px 18px',
                background: 'var(--color-paper)',
                border: '1.5px solid var(--color-ink)',
                borderRadius: '9999px',
                outline: 'none',
                color: 'var(--color-ink)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-mint-500)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-mint-100)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor = 'var(--color-ink)';      e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              type="submit"
              className="btn-interactive"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-mint-500)', color: 'var(--color-ink)',
                border: 0, borderRadius: '9999px', padding: '14px 22px',
                fontWeight: 600, fontSize: '14.5px', fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'} →
            </button>
          </form>

          <div style={{ margin: '0 0 0 2px' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-mint-300)', marginBottom: '4px' }}>Technical</span>
            <p style={{ fontSize: '12.5px', color: 'rgba(248,245,238,0.55)', fontStyle: 'italic', margin: 0 }}>{footnote}</p>
          </div>
        </div>

        {/* Right column — report card */}
        <div
          aria-live="polite"
          style={{
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Card header */}
          <div style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--color-line)',
            background: 'var(--color-paper-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500)',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0,1,2].map(i => <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-line-2)', display: 'block' }}/>)}
            </div>
            <div>Site report — {displayUrl} · {headerDate}</div>
          </div>

          {/* Metric rows */}
          <div style={{ padding: '10px 22px' }}>
            {rows.map(row => {
              const val = displayScores[row.key];
              const g = grade(scores[row.key]);
              return (
                <div key={row.key} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 1fr 60px',
                  alignItems: 'center', gap: '16px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--color-line)',
                  fontSize: '14px',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{row.label}</span>
                    <span style={{ color: 'var(--color-ink-500)', fontSize: '12.5px', fontWeight: 500 }}>{row.sub}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--color-line)', borderRadius: '4px', overflow: 'hidden' }}>
                    <span style={{
                      display: 'block', height: '100%', borderRadius: '4px',
                      background: BAR_COLOR[g],
                      width: showScores ? `${val}%` : '0%',
                      transition: 'width 0.12s linear',
                    }}/>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '17px', textAlign: 'right',
                    letterSpacing: '-0.02em',
                    color: showScores ? GRADE_COLOR[g] : 'var(--color-ink-400)',
                  }}>
                    {showScores ? val : '—'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card footer / verdict */}
          <div style={{
            padding: '16px 22px',
            background: 'var(--color-mint-50)',
            borderTop: '1px solid var(--color-line)',
          }}>
            <p style={{ fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              {state === 'done'
                ? <>{verdictDone} <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : state === 'error'
                    ? <span style={{ color: 'var(--color-red)' }}>Couldn't reach that URL — double-check it and try again.</span>
                    : <>Verdict → <strong>{verdictIdle}</strong></>
              }
            </p>
          </div>

          {/* Email capture — shown after scan */}
          {state === 'done' && (
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--color-line)',
              background: 'var(--color-paper)',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', margin: 0, lineHeight: 1.5 }}>
                {emailCopy}
              </p>
              <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@yourbusiness.ca"
                  aria-label="Your email address"
                  style={{
                    flex: 1, minWidth: '160px',
                    fontFamily: 'inherit', fontSize: '14px',
                    padding: '10px 16px',
                    background: 'var(--color-paper-2)',
                    border: '1.5px solid var(--color-line)',
                    borderRadius: '9999px',
                    outline: 'none',
                    color: 'var(--color-ink)',
                  }}
                />
                <button
                  type="submit"
                  className="btn-interactive"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: 'var(--color-mint-500)', color: 'var(--color-ink)',
                    border: 0, borderRadius: '9999px', padding: '10px 18px',
                    fontWeight: 600, fontSize: '13.5px', fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  Send my report →
                </button>
              </form>
              <a
                href="/contact"
                style={{
                  fontSize: '13px', color: 'var(--color-mint-700)',
                  fontWeight: 600, textDecoration: 'none',
                }}
              >
                {callCopy}
              </a>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .audit-shell {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: clamp(32px, 4vw, 64px);
          align-items: center;
          margin-top: 32px;
        }
        @media (max-width: 920px) {
          .audit-shell { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
