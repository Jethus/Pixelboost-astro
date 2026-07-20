export const METRIC_LABELS = {
  perf: 'Speed',
  mobile: 'Mobile speed',
  seo: 'SEO basics',
  a11y: 'Accessibility',
};

// metric × band → verdict line. Speed/bad is special-cased to inject the LCP number.
export const VERDICT_LINES = {
  perf: {
    bad: 'Your site is slow on phones. People leave before it loads.',
    mid: 'A bit slow on phones. Shaving a second off load time keeps more visitors around.',
  },
  mobile: {
    bad: "Hard to use on a phone, and that's where most of your customers are.",
    mid: 'The mobile experience has rough edges. Worth tightening for phone visitors.',
  },
  seo: {
    bad: "Search engines struggle to read this site, so you're hard to find on Google.",
    mid: 'Search basics are mostly there, with a few gaps holding back your ranking.',
  },
  a11y: {
    bad: "Parts of the site are unusable for some visitors, and that's a legal risk in Ontario.",
    mid: 'A few accessibility gaps. Easy wins that widen who can use your site.',
  },
};

function bandFor(n) {
  return n < 65 ? 'bad' : n < 90 ? 'mid' : 'good';
}

function trackingCta(scores) {
  if (scores.tracking >= 100 && scores.trackingTools.length > 0) {
    return `You're running ${scores.trackingTools[0]}. Good, you can see where customers come from.`;
  }
  return 'No analytics detected. You’re flying blind on where customers come from.';
}

export function verdictFromScores(scores) {
  const metrics = ['perf', 'mobile', 'seo', 'a11y'];
  // Lowest score wins "worst"; ties resolve by metrics[] order.
  const worst = metrics.reduce((a, b) => (scores[b] < scores[a] ? b : a));
  const band = bandFor(scores[worst]);

  if (band === 'good') {
    return {
      text: `Strong scores. Biggest opportunity: ${METRIC_LABELS[worst]}.`,
      cta: trackingCta(scores),
    };
  }

  let text;
  if (worst === 'perf' && band === 'bad' && scores.lcp != null) {
    const secs = (scores.lcp / 1000).toFixed(1);
    text = `Loads in ${secs}s on mobile. Google wants under 2.5s. Visitors leave before it loads.`;
  } else {
    text = VERDICT_LINES[worst][band];
  }

  return { text, cta: trackingCta(scores) };
}
