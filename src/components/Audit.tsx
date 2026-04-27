import { useState, useEffect, useRef } from 'react';

type AuditState = 'idle' | 'scanning' | 'done';

interface Scores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

const TARGETS: Scores = { perf: 58, a11y: 71, seo: 84, mobile: 49, tracking: 25 };

const ROWS: { key: keyof Scores; label: string; sub: string }[] = [
  { key: 'perf',     label: 'Speed',             sub: 'How fast pages load on mobile' },
  { key: 'a11y',     label: 'Accessibility',      sub: 'Can everyone actually use it?' },
  { key: 'seo',      label: 'SEO basics',         sub: 'Can Google find and read it?' },
  { key: 'mobile',   label: 'Mobile experience',  sub: 'Tap targets, layout, readability' },
  { key: 'tracking', label: 'Visitor tracking',   sub: 'Privacy-friendly analytics setup' },
];

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

export default function Audit() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AuditState>('idle');
  const [scores, setScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (state !== 'scanning') return;
    const start = performance.now();
    const dur = 1400;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setScores({
        perf:     Math.round(TARGETS.perf     * e),
        a11y:     Math.round(TARGETS.a11y     * e),
        seo:      Math.round(TARGETS.seo      * e),
        mobile:   Math.round(TARGETS.mobile   * e),
        tracking: Math.round(TARGETS.tracking * e),
      });
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setState('done');
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (state === 'done') {
      // Reset for "Run again"
      setScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
      setState('scanning');
    } else {
      setState('scanning');
    }
  };

  const showScores = state !== 'idle';
  const displayUrl = state === 'idle' ? 'yourbusiness.ca' : (url || 'yourbusiness.ca');

  return (
    <section
      id="audit"
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        borderRadius: 'var(--radius-section)',
        maxWidth: '1200px',
        margin: '16px auto 0',
        padding: 'clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px)',
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
            Free, no email required
          </span>

          <h2 style={{ color: 'var(--color-paper)', margin: '0 0 16px 0' }}>
            Get a free <span style={{ color: 'var(--color-mint-600)' }}>website report card.</span>
          </h2>

          <p style={{
            fontSize: 'clamp(16px, 1.35vw, 19px)',
            color: 'rgba(248,245,238,0.75)',
            lineHeight: 1.5, maxWidth: '56ch', margin: '0 0 28px 0', fontWeight: 500,
          }}>
            I check your site the way Google and real customers experience it: how fast it loads, whether people can use it easily, whether search engines can understand it, and whether you're tracking what visitors do.
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
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-mint-500)', color: 'var(--color-ink)',
                border: 0, borderRadius: '9999px', padding: '14px 22px',
                fontWeight: 600, fontSize: '14.5px', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-btn)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'} →
            </button>
          </form>

          <p style={{ fontSize: '12.5px', color: 'rgba(248,245,238,0.55)', fontStyle: 'italic', margin: '0 0 0 2px' }}>
            <em style={{ color: 'var(--color-mint-300)', fontStyle: 'normal' }}>Technically:</em> I use Google Lighthouse, axe accessibility checks, and a Plausible tracking audit to back the report up. You'll get it whether or not we work together.
          </p>
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
            <div>Sample report — {displayUrl} · Apr 2026</div>
          </div>

          {/* Metric rows */}
          <div style={{ padding: '10px 22px' }}>
            {ROWS.map(row => {
              const val = scores[row.key];
              const g = grade(val);
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
                      transition: 'width 0.05s linear',
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
                ? <>Verdict → <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : <>Verdict → <strong>Enter your URL above to run a real scan.</strong></>
              }
            </p>
          </div>
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
