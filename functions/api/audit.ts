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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Placeholder — PSI fetch added in Task 3
  return new Response(JSON.stringify({ targetUrl }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
