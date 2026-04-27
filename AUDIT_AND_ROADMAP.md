# Hoops Intelligence — Audit & Roadmap
**Date:** April 27, 2026
**Stakeholders:** (1) CEBL GMs/Head Coaches, (2) CEBL Fans

---

## 🔍 CURRENT STATE AUDIT

### Tabs (14 total)
**Free:** Dashboard · Canadians Pro · NCAA Canadians · Imports · Signings · Team Stats · Pipeline · Elam · Target · Compare
**Premium:** Cap Tools · Advanced · Watchlist · Player Profile (modal) · Medical History

### Data Volume
| File | Records |
|---|---|
| `data.js` | 253 player records (Canadians, NCAA, Imports, Signings, Targets) |
| `pipeline-data.js` | 72 Canadians worldwide + Elam/Target/Advanced stats |
| `career-data.js` | 15 player career profiles + 10 team season summaries |

### What's Strong ✅
- Solid structural foundation, gated freemium model works
- Canadian Pipeline (72 players worldwide) is a unique, valuable dataset
- Cap Tools properly model CEBL roster rules
- Player Compare is functional with percentile bars
- Recent data accuracy push corrected ~10 player-team mismatches
- Team logos, headshots (64 ESPN images), team colors all integrated
- Three CEBL-unique analytics views: Elam, Target, Advanced

### Critical Gaps for **GMs/Coaches** ❌
1. **No game logs / recent form** — can't see how a player has trended
2. **Tables not sortable** — can't sort by PPG, age, salary, etc.
3. **Scouting notes are 1-line** — need strengths/weaknesses, role fit, system fit
4. **No availability windows** — when is this overseas player free for CEBL summer?
5. **No team-by-team roster pages** — to see full 2025 + 2026 rosters per team
6. **No export/PDF** — can't share scouting reports
7. **Salary data is estimate-only** — needs market comps and confidence
8. **Agent fields mostly empty** — limits practical use
9. **No global search** — must navigate to right tab to find a player
10. **No saved scouting notes** — watchlist exists but no notes attached

### Critical Gaps for **Fans** ❌
1. **Player profiles are 100% premium** — fans see nothing
2. **No stat leaderboards** — who led the CEBL in PPG/RPG/APG/3P%?
3. **No CEBL records book** — single-game, season, career records
4. **No schedule** — when does the 2026 season start, who plays who?
5. **No hometown map** — visual of Canadian basketball coast-to-coast
6. **Elam Ending explainer is one sentence** — biggest CEBL differentiator buried
7. **No team rosters page** — fans want to see their team's roster
8. **No "fun facts" / trivia** — no shareability
9. **No recent news / press** — feels static
10. **Mobile experience untested** — fans live on phones

### Data Quality
- 5 of 72 pipeline players still need bio verification
- Many Canadian Pro entries lack 2025-26 winter season stats
- Career data only covers 15 players (top names)
- NCAA prospects list is short (claims 168, file has fewer)
- Several "TBD"/"Free Agent" placeholders in data

---

## 🛣️ ROADMAP

### Phase 1: Make the Product **Awesome** (autonomous, in progress)
Goal: Lift both GM and fan experience to "wow" level without any new infrastructure.

1. **Stat Leaderboards Tab** — League-wide leaders in every category. Massive fan + GM value.
2. **CEBL Records Book** — Single-game / season / career records. Fan-magnet.
3. **Sortable Tables** — Click any column header to sort. Universal UX win.
4. **Free Player Profiles** — Basic profile free for fans, advanced/medical stay premium.
5. **Hometown Map** — Interactive map of every Canadian pro worldwide. Storytelling.
6. **Elam Ending Deep Dive** — Rich educational content, history, examples, charts.
7. **2026 Schedule View** — Once known, embedded; placeholder for now.
8. **Team Roster Pages** — Click any of 10 teams → full 2025 + 2026 roster card view.
9. **Global Search** — Cmd-K style search across all players/teams.
10. **Trivia / Fun Facts** — Sprinkled throughout for shareability.
11. **Career Data Expansion** — From 15 → 30+ players (top of pipeline).
12. **Mobile audit** — Verify and polish on small screens.

### Phase 2: Reliability & Recency (next session, with you)
- Web-verify all 253 player teams (you click verify on flagged ones)
- Pull live winter-league stats from RealGM/Eurobasket as static snapshots
- Fill agent fields where public
- Standardize salary tier data with confidence rating
- Add data freshness timestamps per player

### Phase 3: GM Power Tools
- Game logs / recent form charts
- Scouting report builder (rich text + tags + share link)
- PDF export per player
- Side-by-side roster comparison (build vs. opponent)
- Availability windows (winter contract end dates)
- Free-agent watchlist with notification placeholder

### Phase 4: Fan Engagement
- News feed (manual posts + RSS hookup)
- Fan-vote polls (best Canadian, best signing, etc.)
- "On This Day in CEBL History"
- Social share cards (auto-generate per player)
- Push notification opt-in (signing alerts)
- Glossary: every CEBL-unique term explained

### Phase 5: Live Data (long term)
- Build a tiny Cloudflare Worker / Vercel function to scrape stats nightly
- Live game scores during season
- Real-time signings ticker
- Webhook from CEBL feed if available

---

## 🚀 EXECUTION ORDER (autonomous, while you're away)

I'll commit and push after each chunk so you can review on your phone:

1. ✅ Sortable tables (Canadians, NCAA, Imports)
2. ✅ Stat Leaderboards tab (free)
3. ✅ CEBL Records Book tab (free)
4. ✅ Free player profiles (basic info, with premium upsell)
5. ✅ Elam Ending deep dive (rich content)
6. ✅ Hometown map (Canadians worldwide)
7. ✅ Team roster pages
8. ✅ Global search (Cmd-K)
9. ✅ Trivia / fun facts integration
10. ✅ Career data expansion

Each item gets its own commit with a clear message. You can review individual changes from your phone via GitHub or by asking me here.
