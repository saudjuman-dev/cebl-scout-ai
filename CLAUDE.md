# Hoops Intelligence — CEBL GM Scouting Platform

## What This Is
A static web app (vanilla JS, HTML, CSS) that serves as a scouting intelligence platform for CEBL (Canadian Elite Basketball League) General Managers, Head Coaches, and Presidents. Live at [hoopsintelligence.com](https://hoopsintelligence.com).

## Architecture
- **Static site** — no build system, no framework, no bundler. Plain JS/HTML/CSS served directly.
- **Hosting** — GitHub Pages with GitHub Actions CI/CD (auto-deploys on push to `main`).
- **Local dev** — `python3 -m http.server 3456` from the project root. Launch config in `.claude/launch.json`.
- **Auth** — Client-side session management via `localStorage`. Device fingerprinting for multi-device limits.
- **Payments** — Stripe checkout link integration (no server-side processing).

## File Structure
| File | Purpose |
|---|---|
| `index.html` | Single-page app shell, all tabs/views |
| `app.js` | Core application logic, tab switching, UI rendering, feature gating |
| `auth.js` | Auth system, session management, admin console, premium feature gating |
| `data.js` | CEBL scouting data: Canadian pros, NCAA prospects, import targets, team signings |
| `pipeline-data.js` | Canadian Pipeline Tracker (72 players worldwide), Elam Ending analytics, Target Shot analytics, Advanced Metrics |
| `career-data.js` | Historical career stats and medical history (32+ player profiles) |
| `cebl-records.js` | League records, awards, legends, timeline, trivia, stat leaders |
| `themes.js` | One-click team theme switcher (10 CEBL teams) |
| `cache-loader.js` | Runtime EuroBasket cache loader for player profile enrichment |
| `player-headshots.js` | ESPN CDN headshot URL mapping (36 players) with fallback system |
| `team-logos.js` | CEBL team logo SVGs |
| `onboarding.js` | First-time user onboarding flow |
| `styles.css` | All styling |
| `data/cache/*.json` | Pre-fetched EuroBasket player JSONs (113 players, build-time generated) |
| `tools/eurobasket-mcp/` | MCP server that scrapes EuroBasket.com for player data |
| `tools/cache-updater.js` | Build-time script: refreshes data/cache/ from EuroBasket |
| `tools/sync-from-cache.js` | Build-time script: reports cache vs static data alignment |
| `tools/scrapers/` | TypeScript scrapers for Wikipedia, NBA, G-League, EuroBasket public data |
| `tools/cebl-players.txt` | List of player names for cache-updater to fetch |
| `.mcp.json` | Claude Code MCP server config (registers eurobasket MCP for this project) |
| `CNAME` | Custom domain: hoopsintelligence.com |

## Data Architecture
There are distinct data categories — understand which file to edit:

- **Current team assignments** (where a player plays NOW) → `pipeline-data.js` (canadianPipeline array) and `data.js` (canadiansPro/importTargets)
- **CEBL game stats** (Elam Ending, Target Shot, Advanced Metrics) → `pipeline-data.js` — team field reflects the CEBL team the player was on during that season's games
- **Historical career stats** → `career-data.js` — career-by-season data, never needs team updates for past seasons
- **Scouting assessments** → `data.js` — fit ratings, salary estimates, scouting notes
- **EuroBasket-verified bio + winter overseas career** → `data/cache/{slug}.json` — fetched at runtime via `cache-loader.js` to enrich player modal

**Important**: Elam/Target/Advanced data team assignments must match the player's actual CEBL team for the season the stats are from. Cross-reference with `career-data.js` to verify.

## Data Sync Workflow (EuroBasket + scrapers)

This project includes a complete data tooling stack inherited from the BHB ProBally Generator:

### EuroBasket MCP Server (`tools/eurobasket-mcp/`)
A Model Context Protocol server that scrapes EuroBasket.com for player data. Registered in `.mcp.json` so Claude Code in this project can call:
- `eurobasket_login(email, password)` — open authenticated session
- `eurobasket_search(playerName)` — find a player's profile URL
- `eurobasket_player_profile(url)` — bio (height, weight, birthdate, college, etc.)
- `eurobasket_career_stats(url)` — full career stats (subscriber-only)
- `eurobasket_full_player(name, email, password)` — combined call

Requires `EUROBASKET_EMAIL` and `EUROBASKET_PASSWORD` env vars.

### Additional Scrapers (`tools/scrapers/`)
TypeScript scrapers for sources beyond EuroBasket:
- **scrapeWikipedia(name)** — Wikipedia bio + college stats
- **scrapeEuroBasketPublic(name)** — public EuroBasket data (no login)
- **scrapeGLeague(name)** — NBA G-League API
- **scrapeNBA(name)** — NBA Stats API
- **researchPlayer(name)** — Combines all sources into one ScrapedPlayer object

### Cache (`data/cache/*.json`)
113 pre-fetched player JSONs. The runtime `cache-loader.js` lazy-fetches them when a player modal opens, showing winter team, verified bio, and recent overseas seasons in a "EuroBasket Verified" block.

### Refresh Cycle
1. **Add players to track**: edit `tools/cebl-players.txt`
2. **Refresh cache**: `cd /Users/saudjuman/cebl-scout-tool && EUROBASKET_EMAIL=... EUROBASKET_PASSWORD=... node tools/cache-updater.js`
3. **Audit alignment**: `node tools/sync-from-cache.js` (report only — see matched/missing/orphan)
4. **Inspect one player**: `node tools/sync-from-cache.js --player "Sean East II"`
5. **Manually update** static `data.js` / `pipeline-data.js` / `career-data.js` from cache contents (the sync script intentionally does not auto-write — keep human review in the loop)

### Data Integrity & Public Launch Standards

**ZERO TOLERANCE FOR FABRICATED DATA.** This is a public-facing scouting tool used by GMs, coaches, and fans. Inaccurate data damages credibility and could be defamatory toward real public figures.

Before any commit:
- Run `node tools/audit-data.js` — must show 0 CRITICAL issues
- Run `node tools/cache-health.js` — must show 0 CRITICAL issues
- New career stats must include a verifiable source (CEBL.ca, EuroBasket, NCAA.com, team release)
- Medical history is the hardest case: only publicly-reported injuries (team announcement, ESPN/TSN, league press release). Never invent.
- Records (cebl-records.js): each entry must have a `_verified: true` flag and a `note` ending with the source

The audit scripts check:
1. Cache file slug matches its `fullName` (catches scraper mismatches)
2. No name typos / near-duplicates across files
3. No unrealistic stats (PPG > 35 etc.)
4. Cross-file team consistency
5. Round-number season stats (signal of fabrication)
6. Records with vague values like "1,400+"
7. Empty required fields

**If you add player data, source it. If you can't source it, leave the field empty — never invent.**

### Global Pros Database (FIBA-emphasis)

`global-pros.js` is the worldwide non-NBA pro database — auto-generated by `tools/extract-global-pros.js` from `data/cache/*.json`. Each entry has slug, name, position, height, weight, birthdate, birth city, nationality, college, current team, league code + readable league name, country, tier (Elite/Top/Mid/Development/College/CEBL), and `fibaEligible` flag. The Global Pros tab (GM mode) renders these with filters by tier, country, position, and FIBA-eligibility.

**Tier classification:**
- **Elite** — Champions League, EuroCup top, Turkey BSL
- **Top** — Germany BBL, France Pro A, Italy Serie A, Greece A1, Spain ACB
- **Mid** — France Pro B, Spain LEB, BNXT, Czech NBL, Mexico LNBP, etc.
- **Development** — NBA G League, USA pro, lower-tier US
- **College** — NCAA D1/D2/D3, NAIA
- **CEBL** — Canadian Elite Basketball League (summer)

**To grow the database:**
1. Add player names to `tools/cebl-players.txt`
2. Run `EUROBASKET_EMAIL=… EUROBASKET_PASSWORD=… node tools/cache-updater.js` to fetch their JSON
3. Run `node tools/extract-global-pros.js` to regenerate `global-pros.js`
4. Run `node tools/cache-health.js` to verify no name-mismatch bugs

The extraction script auto-skips NBA players (out of CEBL scope) and league codes that map to fibaEligible: false.

### Audience Modes (UX split: GM vs Fan)

The site has three views, toggled in the header:
- **Fan View** — Leaders, Records (all 5 sub-tabs), Pipeline, Elam, Target, Compare, Signings, Rosters
- **GM/Coach View** — Dashboard, Canadians Pro, NCAA, Imports, Signings, Team Stats, Rosters, Cap Tools, Advanced, Watchlist, Compare, Pipeline
- **All Tools** — Everything

Tabs are tagged with `mode-fan`, `mode-gm`, or both classes in `index.html`. CSS in `styles.css` filters via `body[data-audience-mode]`. Saved in `localStorage` as `hi_audience_mode`.

### Automated Data Refresh Pipeline

Two scheduled refresh paths (use either or both):

#### 1. GitHub Actions (recommended — no Mac needs to be on)
`.github/workflows/data-refresh.yml`

Runs every Sunday at 03:00 UTC + on-demand from the Actions tab. Does:
1. Refreshes existing player cache via `tools/cache-updater.js`
2. Optionally bulk-scrapes leagues via `tools/league-scraper.js` (set `SCRAPE_LEAGUES` secret to comma-separated league codes, or pass via workflow_dispatch input)
3. Regenerates `global-pros.js` via `tools/extract-global-pros.js`
4. Runs `tools/audit-data.js` and `tools/cache-health.js` (fails the run if critical issues)
5. Commits + pushes any data changes back to `main`
6. Uploads audit reports as workflow artifacts (30-day retention)

**Required secrets** (Settings → Secrets and variables → Actions):
- `EUROBASKET_EMAIL` — eurobasket.com subscriber email
- `EUROBASKET_PASSWORD` — eurobasket.com password
- `SCRAPE_LEAGUES` *(optional)* — e.g. `GER-1,FRA-1,ITA-1,BSL,ESP-1`

#### 2. Local launchd (macOS-native, runs on your Mac)
`tools/scheduling/com.hoopsintelligence.refresh.plist`

Same job as GitHub Actions but runs on your Mac on a weekly schedule. Install instructions are in the plist comments. Edit the email/password and the path placeholders before installing.

### Bulk League Scraping (`tools/league-scraper.js`)

Pulls every team in a EuroBasket league + every player on each team. Saves each as a JSON cache file. Includes:
- 2.5s rate limiting between requests
- Retry with exponential backoff on 429 / 5xx
- Resume support (skips files cached <30 days, unless `--force`)
- `--dry-run` mode (lists what would be scraped without fetching)
- Multi-league mode: `--leagues GER-1,FRA-1,BSL`

**Example**:
```bash
EUROBASKET_EMAIL=... EUROBASKET_PASSWORD=... \
  node tools/league-scraper.js --leagues GER-1,FRA-1,ITA-1
```

After scraping, run:
```bash
node tools/extract-global-pros.js   # regenerate global-pros.js
node tools/cache-health.js          # validate the new files
```

### Verification Metadata (every cache JSON)

Each `data/cache/{slug}.json` carries:
- `_lastVerified` — ISO timestamp of last successful scrape
- `_sources` — array of source domains (e.g. `["eurobasket.com"]`)
- `_dataConfidence` — `high` (full bio + career), `medium` (partial), or `low` (sparse)

The runtime UI surfaces this as a colored freshness pill in the player profile modal: green for high-confidence, yellow for medium, red for low. The label reads "Verified 2 days ago", "Verified 3 weeks ago", etc.

Backfill script: `node tools/backfill-verification.js` (idempotent — safe to re-run).

### Why Build-Time, Not Runtime?
The CEBL Scout site is static (GitHub Pages). EuroBasket can't be scraped from the browser (CORS + auth). So:
- Cache JSONs are committed to the repo as static assets
- The browser fetches them on-demand from `data/cache/`
- A nightly/weekly local cron (or manual invocation) refreshes them
- The `tools/daily-cache.sh` script in the source project can be adapted if you want automation

## Freemium Model
Controlled by `AUTH.PREMIUM_FEATURES` array in `auth.js:31`.

**Free tabs** (accessible to all users):
- Scouting Board (main roster data)
- Canadian Pipeline Tracker
- Elam Ending Analytics
- Target Shot Analytics
- Player Comparison Tool

**Premium tabs** ($14.99/mo or $149/yr):
- `cap-tools` — Salary Cap Tools
- `player-profile` — Detailed Player Profiles
- `medical-history` — Medical History
- `advanced` — Advanced Metrics
- `watchlist` — Watchlist

Feature gating: `AUTH.canAccessFeature(tabId)` checks if the tab ID is in the premium array. `AUTH.isPremium()` returns true for admin or paid users.

## Key Patterns

### Player Headshots
ESPN CDN pattern: `https://a.espncdn.com/i/headshots/nba/players/full/{espn_id}.png`
- Mapping in `player-headshots.js` → `PLAYER_HEADSHOTS` object
- `avatarContent(name)` in `app.js` wraps headshot with `onerror` fallback to initials
- `has-headshot` CSS class for overflow:hidden on circular containers
- Only NBA/former-NBA players have ESPN headshots. European-only players use initials fallback.

### Team Names
- Saskatchewan Rattlers rebranded to **Saskatoon Mamba** in February 2026
- Use "Saskatoon Mamba" for all current/2026 references
- Historical data (career-data.js) retains "Saskatchewan Rattlers" for past seasons
- Elam/Target/Advanced stats should use current team name to match team stats section

### Admin Access
- Login: obfuscated in `auth.js` (not plaintext, but client-side — not truly secure)
- Admin console: user management, stats dashboard, paid/blocked/flagged user controls
- Enter app in dev: `enterApp({name:'Test User', isAdmin:true, isPaid:true, user:'test@test.com'})`

## CEBL Context
- 10 teams across Canada (2026): Edmonton Stingers, Winnipeg Sea Bears, Calgary Surge, Saskatoon Mamba, Vancouver Bandits, Brampton Honey Badgers, Scarborough Shooting Stars, Niagara River Lions, Ottawa BlackJacks, Montreal Alliance
- Season runs May–August (summer league)
- Players often play winter seasons overseas (Europe, Australia, Asia) and CEBL in summer
- Unique rules: Elam Ending (target score format for game endings), Target (bonus scoring zone)
- Canadian Pipeline: tracks all 72 Canadian pros playing worldwide (NBA, G League, Europe, Australia, Asia, CEBL)

## Common Tasks

### Updating player teams
1. Web-verify the player's current team (cebl.ca, RealGM, Eurobasket, team sites)
2. Update `pipeline-data.js` canadianPipeline array for pipeline tracker
3. Update `data.js` canadiansPro/importTargets for scouting board
4. If the player appears in Elam/Target/Advanced data, update those team fields too
5. Cross-check `career-data.js` — only add new seasons, never modify historical entries

### Adding a new player
1. Add to `data.js` (canadiansPro for Canadians, importTargets for imports)
2. If Canadian pro playing abroad, also add to `pipeline-data.js` canadianPipeline
3. If they have an ESPN headshot, add to `player-headshots.js`
4. Career data can be added to `career-data.js` if detailed profile is needed

### Testing
- Start local server: use preview_start with "cebl-scout" config
- Enter app: `enterApp({name:'Test User', isAdmin:true, isPaid:true, user:'test@test.com'})`
- Check console for JS errors
- Verify headshots: count `.headshot-img` elements, check for broken ones
- Verify pipeline count: `canadianPipeline.length` (currently 72)
