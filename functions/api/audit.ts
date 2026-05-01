interface Env {
  PSI_API_KEY: string;
}

interface AuditScores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

const TRACKING_DOMAINS = [
  'google-analytics.com',
  'googletagmanager.com',
  'hotjar.com',
  'plausible.io',
  'usefathom.com',
  'heap.io',
  'mixpanel.com',
  'segment.io',
  'segment.com',
];

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

function normalizeMobileMetric(value: number, good: number, poor: number): number {
  if (value <= good) return 100;
  if (value >= poor) return 0;
  return Math.round(100 * (1 - (value - good) / (poor - good)));
}

function deriveMobile(audits: Record<string, { numericValue?: number }>): number {
  const fcp = audits['first-contentful-paint']?.numericValue ?? 3000;
  const tbt = audits['total-blocking-time']?.numericValue ?? 600;
  const cls = audits['cumulative-layout-shift']?.numericValue ?? 0.25;

  const fcpScore = normalizeMobileMetric(fcp, 1800, 3000);
  const tbtScore = normalizeMobileMetric(tbt, 200, 600);
  const clsScore = normalizeMobileMetric(cls, 0.1, 0.25);

  return Math.round(fcpScore * 0.3 + tbtScore * 0.4 + clsScore * 0.3);
}

function deriveTracking(audits: Record<string, { details?: { items?: Array<{ entity?: string }> } }>): number {
  const items = audits['third-party-summary']?.details?.items ?? [];
  const found = items.some((item) => {
    const entity = (item.entity ?? '').toLowerCase();
    return TRACKING_DOMAINS.some((domain) => entity.includes(domain));
  });
  return found ? 100 : 0;
}

function psiScore(categories: Record<string, { score: number | null }>, key: string): number {
  return Math.round((categories[key]?.score ?? 0) * 100);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: 'Missing url param' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  let targetUrl: string;
  try {
    const u = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    new URL(u);
    targetUrl = u;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const psiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${env.PSI_API_KEY}`;

  let psiRes: Response;
  try {
    psiRes = await fetch(psiEndpoint);
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach PSI API' }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }

  if (!psiRes.ok) {
    return new Response(JSON.stringify({ error: `PSI API error: ${psiRes.status}` }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }

  const data = await psiRes.json() as {
    lighthouseResult: {
      categories: Record<string, { score: number | null }>;
      audits: Record<string, { numericValue?: number; details?: { items?: Array<{ entity?: string }> } }>;
    };
  };

  const { categories, audits } = data.lighthouseResult;

  const scores: AuditScores = {
    perf:     psiScore(categories, 'performance'),
    a11y:     psiScore(categories, 'accessibility'),
    seo:      psiScore(categories, 'seo'),
    mobile:   deriveMobile(audits),
    tracking: deriveTracking(audits),
  };

  return new Response(JSON.stringify(scores), {
    headers: JSON_HEADERS,
  });
};
