# pixelboost.ca

**Live site:** https://pixelboost.ca

Custom website design and redesign for small businesses in Toronto and the Durham Region.

A static [Astro](https://astro.build) build served by a Cloudflare Worker. The Worker (`src/worker/`) serves the built assets, handles the contact form (`POST /contact`, Turnstile + Fastmail JMAP) and the free site-scan feature (`POST /api/audit`, Google PageSpeed Insights), and sets the Content-Security-Policy header at the edge.

## Commands

| Command                  | Action                                                 |
| :----------------------- | :----------------------------------------------------- |
| `npm install`            | Install dependencies                                   |
| `npm run dev`            | Start the dev server                                   |
| `npm run build`          | Build the production site to `./dist/`                 |
| `npm run preview`        | Preview the static build locally (no Worker routes)    |
| `npm run preview:worker` | Build and run the Cloudflare Worker via `wrangler dev` |
| `npm run deploy`         | Build and deploy to Cloudflare Workers                 |
| `node --test`            | Run the test suite in `tests/`                         |
| `npx astro check`        | Type-check `.astro` files                              |

Worker secrets required for deployment are documented in `wrangler.toml`.

## Content

Blog posts live in `src/content/blog/` (copy `_template.md` for a new post) and portfolio items in `src/content/portfolio/`. The blog collection is also editable through [Pages CMS](https://pagescms.org) (`.pages.yml`).

See `CLAUDE.md` for architecture details and conventions.
