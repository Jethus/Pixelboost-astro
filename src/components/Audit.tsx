import { useEffect, useRef, useState } from 'react';
import { verdictFromScores } from '../shared/verdict.js';

type AuditState = 'idle' | 'scanning' | 'done' | 'error';

// Error copy: the Worker 403s when Turnstile verification fails — that's a
// "reload and let the challenge rerun" problem, not a bad URL, so it gets its
// own message instead of blaming the URL the visitor typed.
const GENERIC_SCAN_ERROR = "Couldn't reach that URL. Double-check it and try again.";
const VERIFY_SCAN_ERROR = 'Cloudflare verification failed. Reload the page and try again.';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface FieldData {
  overall: 'FAST' | 'AVERAGE' | 'SLOW';
  lcpMs: number | null;
  lcpCategory: string | null;
  inpMs: number | null;
  clsCategory: string | null;
}

interface Scores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
  lcp: number | null;
  trackingTools: string[];
  field?: FieldData | null;
}

type MetricKey = 'perf' | 'mobile' | 'seo' | 'a11y' | 'tracking';

export interface AuditRow {
  key: MetricKey;
  label: string;
  sub: string;
}

export interface AuditContent {
  eyebrow: string;
  headline: string;
  /** Heading tag for the headline. Use "h1" on the standalone audit page,
   *  "h2" when the audit section sits under another page's <h1> (e.g. home). */
  headingLevel?: 'h1' | 'h2';
  body: string;
  footnote: string;
  verdictIdle: string;
  verdictDone: string;
  callCopy: string;
  rows: AuditRow[];
}

function grade(n: number): 'good' | 'mid' | 'bad' {
  return n >= 90 ? 'good' : n >= 65 ? 'mid' : 'bad';
}

function displayScore(key: keyof Scores, value: number, scores: Scores): string | number {
  if (key === 'tracking') {
    const count = scores.trackingTools.length;
    if (value > 0 && count > 0) {
      // Keep the column short: name the single tool, else just the count.
      // The verdict line below the scorecard names the primary tool in full.
      return count === 1 ? `Yes, ${scores.trackingTools[0]}` : `Yes, ${count} tools`;
    }
    return value > 0 ? 'Yes' : 'No';
  }
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Audit({
  eyebrow,
  headline,
  headingLevel = 'h2',
  body,
  footnote,
  verdictIdle,
  verdictDone,
  callCopy,
  rows,
}: AuditContent) {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [scannedEmail, setScannedEmail] = useState('');
  const emailInvalid = email.trim() !== '' && !EMAIL_RE.test(email.trim());
  const [state, setState] = useState<AuditState>('idle');
  const [scores, setScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0, lcp: null, trackingTools: [] });
  // Scores actually shown — count up from 0 to `scores` for a "results landing" feel.
  const [displayScores, setDisplayScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0, lcp: null, trackingTools: [] });
  const [scannedUrl, setScannedUrl] = useState('');
  const rafRef = useRef<number | null>(null);
  // Latest startScan, for the mount-scoped hero-handoff listener.
  const startScanRef = useRef<(rawUrl: string) => void>(() => {});

  // Invisible Turnstile: rendered once into the server-injected #audit-turnstile
  // element (which carries the edge-injected sitekey). Each scan calls execute()
  // and awaits a fresh token via the pending resolver, then resets the widget.
  const turnstileIdRef = useRef<string | null>(null);
  const tokenResolverRef = useRef<((token: string) => void) | null>(null);
  // In-form slot the #audit-turnstile element is moved into before the widget
  // renders, so an interactive challenge appears under the submit button
  // instead of orphaned at the end of the section.
  const turnstileSlotRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState(GENERIC_SCAN_ERROR);

  // Refs for CSSOM-driven dynamic styles (bar widths + score colors)
  const barFillRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const scoreNumRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Hero mini-form handoff: prefill the input AND start the scan (an explicit
  // hero submit is intent to scan). sessionStorage covers the not-yet-hydrated
  // case (client:visible hydrates during the hero's scroll); the custom event
  // covers hero submits after this island has already mounted. The ref keeps
  // the persistent event listener pointed at the latest startScan closure so
  // its scanning/email guards aren't stale.
  useEffect(() => {
    const takeHandoff = (value: string) => {
      sessionStorage.removeItem('pb_hero_url');
      if (!value) return;
      setUrl(value);
      startScanRef.current(value);
    };
    takeHandoff(sessionStorage.getItem('pb_hero_url') ?? '');
    const onPrefill = (e: Event) => takeHandoff((e as CustomEvent<string>).detail);
    window.addEventListener('pb:prefill-url', onPrefill);
    return () => window.removeEventListener('pb:prefill-url', onPrefill);
  }, []);

  // Render the invisible Turnstile widget as soon as its (async) API script
  // has landed. Returns the widget id, or null if it isn't renderable yet.
  const renderTurnstile = (): string | null => {
    if (turnstileIdRef.current !== null) return turnstileIdRef.current;
    const el = document.getElementById('audit-turnstile');
    const sitekey = el?.getAttribute('data-sitekey') ?? '';
    if (!el || !sitekey || !window.turnstile) return null;
    // Relocate the (static, edge-injected) element into the form before the
    // widget renders — moving it afterwards would reload the widget iframe.
    const slot = turnstileSlotRef.current;
    if (slot && el.parentElement !== slot) slot.appendChild(el);
    turnstileIdRef.current = window.turnstile.render(el, {
      sitekey,
      theme: 'dark',
      // `size: 'invisible'` is not a valid Turnstile param (the API throws on
      // it, so no token is ever issued and every scan 403s). The supported
      // invisible pattern: defer the challenge until execute() and keep the
      // widget hidden unless Turnstile needs a visible interaction.
      execution: 'execute',
      appearance: 'interaction-only',
      callback: (token: string) => {
        tokenResolverRef.current?.(token);
        tokenResolverRef.current = null;
      },
      'error-callback': () => {
        tokenResolverRef.current?.('');
        tokenResolverRef.current = null;
      },
    });
    return turnstileIdRef.current;
  };

  // Wait for the widget to become renderable. The script is async and the island
  // is client:visible, so the very first scan (especially the hero handoff, which
  // calls startScan on mount) can arrive before turnstile.js has executed — the
  // scan must wait for it rather than POST a token-less request the Worker 403s.
  const waitForTurnstile = (timeoutMs = 10000): Promise<string | null> => {
    const id = renderTurnstile();
    if (id !== null) return Promise.resolve(id);
    // No sitekey at all (e.g. `astro dev`, which has no Worker secret) → don't
    // stall the scan; go tokenless, as before.
    const sitekey = document.getElementById('audit-turnstile')?.getAttribute('data-sitekey');
    if (!sitekey) return Promise.resolve(null);
    return new Promise(resolve => {
      const started = Date.now();
      const poll = window.setInterval(() => {
        const ready = renderTurnstile();
        if (ready !== null || Date.now() - started > timeoutMs) {
          window.clearInterval(poll);
          resolve(ready);
        }
      }, 100);
    });
  };

  // Warm the widget up on mount so a scan started later doesn't pay the wait.
  useEffect(() => { void waitForTurnstile(); }, []);

  // Trigger the invisible challenge and resolve with a token. Falls back to an
  // empty string if Turnstile never loaded, so local dev still exercises the flow
  // (the Worker rejects the empty token, which is the correct prod behavior).
  const getTurnstileToken = async (): Promise<string> => {
    const id = await waitForTurnstile();
    if (!window.turnstile || id === null) return '';
    return new Promise<string>((resolve) => {
      tokenResolverRef.current = resolve;
      window.turnstile!.reset(id);
      window.turnstile!.execute(id);
      // Safety net: never hang the scan if the challenge stalls.
      window.setTimeout(() => {
        if (tokenResolverRef.current === resolve) {
          tokenResolverRef.current = null;
          resolve('');
        }
      }, 12000);
    });
  };

  // Count-up animation toward the real scores once a scan completes.
  useEffect(() => {
    if (state !== 'done') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayScores(scores);
      return;
    }

    const keys: MetricKey[] = ['perf', 'a11y', 'seo', 'mobile', 'tracking'];
    const duration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayScores(prev => {
        const next = { ...prev, lcp: scores.lcp, trackingTools: scores.trackingTools };
        keys.forEach(k => { next[k] = Math.round(scores[k] * eased); });
        return next;
      });
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

  const startScan = async (rawUrl: string) => {
    if (!rawUrl.trim() || emailInvalid || state === 'scanning') return;
    const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    setScannedUrl(normalized);
    setScannedEmail(email.trim());
    sessionStorage.setItem('pb_audit_url', normalized);
    if (email.trim()) sessionStorage.setItem('pb_audit_email', email.trim());
    setScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0, lcp: null, trackingTools: [] });
    setDisplayScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0, lcp: null, trackingTools: [] });
    setState('scanning');
    try {
      const turnstileToken = await getTurnstileToken();
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized, email: email.trim(), turnstileToken }),
      });
      if (!res.ok) {
        setErrorMsg(res.status === 403 ? VERIFY_SCAN_ERROR : GENERIC_SCAN_ERROR);
        setState('error');
        return;
      }
      const data: Scores = await res.json();
      setScores(data);
      setState('done');
    } catch {
      setErrorMsg(GENERIC_SCAN_ERROR);
      setState('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startScan(url);
  };
  startScanRef.current = startScan;

  const showScores = state === 'done';
  const verdict = state === 'done' ? verdictFromScores(scores) : null;
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

          {headingLevel === 'h1' ? (
            <h1 className="audit-headline">{headline}</h1>
          ) : (
            <h2 className="audit-headline">{headline}</h2>
          )}

          <p className="audit-body">
            {body}
          </p>

          <form onSubmit={handleSubmit} className="audit-form">
            <input
              type="text"
              id="audit-url"
              name="audit-url"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.ca"
              value={url}
              onChange={e => setUrl(e.target.value)}
              aria-label="Your website URL"
              className="audit-url-input"
            />
            <input
              type="email"
              id="audit-email"
              name="audit-email"
              autoComplete="email"
              placeholder="Email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Your email (optional)"
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? 'audit-email-error' : undefined}
              className="audit-url-input"
            />
            <button
              type="submit"
              className="btn-mint btn-on-dark btn-interactive audit-scan-btn"
            >
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'}
              <svg className="audit-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            {/* #audit-turnstile (static, outside the island) is moved in here
                before the widget renders; empty until then, and 0-height unless
                Turnstile needs a visible interaction. React never manages the
                moved node, so it's safe to reparent into this ref div. */}
            <div ref={turnstileSlotRef} className="audit-turnstile-slot" />
          </form>
          {emailInvalid && (
            <p id="audit-email-error" className="audit-email-error" role="alert">That email doesn't look right. Check it, or leave it blank.</p>
          )}

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
            <div>Site report · {displayUrl} · {headerDate}</div>
          </div>

          {/* Metric rows */}
          <div className="audit-rows-wrap">
            {rows.map((row, i) => {
              const val = displayScores[row.key];
              return (
                <div key={row.key} className="audit-row">
                  <div>
                    <span className="audit-row-label">{row.label}</span>
                    <span className="audit-row-sub">{row.sub}</span>
                  </div>
                  <div className="audit-bar-track">
                    {state === 'scanning'
                      ? <span style={{
                          display: 'block',
                          height: '100%',
                          width: '50%',
                          background: 'linear-gradient(90deg, transparent, var(--color-mint-500), transparent)',
                          borderRadius: '4px',
                          animation: `audit-sweep 1.4s ease-in-out ${i * 0.22}s infinite`,
                          animationFillMode: 'both',
                        }} />
                      : <span ref={el => { barFillRefs.current[row.key] = el; }} className="audit-bar-fill" />
                    }
                  </div>
                  <div
                    ref={el => { scoreNumRefs.current[row.key] = el; }}
                    className="audit-score-num"
                  >
                    {state === 'scanning'
                      ? <span aria-hidden="true" style={{
                          display: 'inline-block',
                          width: '18px',
                          height: '18px',
                          border: '2.5px solid #d4cfc6',
                          borderTopColor: 'var(--color-mint-600)',
                          borderRadius: '50%',
                          animation: 'audit-spin 0.7s linear infinite',
                          verticalAlign: 'middle',
                        }} />
                      : showScores ? displayScore(row.key, val, scores) : '·'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card footer / verdict */}
          <div className="audit-verdict">
            <p className="audit-verdict-text">
              {state === 'done' && verdict
                ? <>{verdict.text} <strong className="audit-verdict-strong">{verdict.cta}</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : state === 'error'
                    ? <span className="audit-error-msg">{errorMsg}</span>
                    : <>Verdict <svg className="audit-verdict-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> <strong>{verdictIdle}</strong></>
              }
            </p>
            {state === 'done' && scores.field && (
              <p className="audit-field-line">
                <span className="audit-field-tag" data-cat={scores.field.overall}>Real visitors</span>
                {scores.field.lcpMs != null
                  ? <>Actual load for people on this site: <strong>{(scores.field.lcpMs / 1000).toFixed(1)}s</strong> (Google's 28-day data).</>
                  : <>Real-user data from Google's 28-day field record: <strong>{scores.field.overall.toLowerCase()}</strong>.</>}
              </p>
            )}
          </div>

          {/* Delivery confirmation / nudge — shown after scan */}
          {state === 'done' && (
            <div className="audit-email-section">
              {scannedEmail
                ? <p className="audit-email-copy">Full report sent to <strong>{scannedEmail}</strong>.</p>
                : <p className="audit-email-copy">Want this report and my top 3 fixes in your inbox? Add your email above and run it again.</p>}
              <a href="/contact" className="audit-call-link">{callCopy}</a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
