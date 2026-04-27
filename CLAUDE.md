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
| `career-data.js` | Historical career stats and medical history for key players |
| `player-headshots.js` | ESPN CDN headshot URL mapping (36 players) with fallback system |
| `team-logos.js` | CEBL team logo SVGs |
| `onboarding.js` | First-time user onboarding flow |
| `styles.css` | All styling |
| `CNAME` | Custom domain: hoopsintelligence.com |

## Data Architecture
There are distinct data categories — understand which file to edit:

- **Current team assignments** (where a player plays NOW) → `pipeline-data.js` (canadianPipeline array) and `data.js` (canadiansPro/importTargets)
- **CEBL game stats** (Elam Ending, Target Shot, Advanced Metrics) → `pipeline-data.js` — team field reflects the CEBL team the player was on during that season's games
- **Historical career stats** → `career-data.js` — career-by-season data, never needs team updates for past seasons
- **Scouting assessments** → `data.js` — fit ratings, salary estimates, scouting notes

**Important**: Elam/Target/Advanced data team assignments must match the player's actual CEBL team for the season the stats are from. Cross-reference with `career-data.js` to verify.

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
