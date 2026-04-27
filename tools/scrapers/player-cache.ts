import fs from 'fs';
import path from 'path';
import type { ScrapedPlayer } from './scraper';

const CACHE_DIR = path.join(process.cwd(), 'src', 'data', 'cache');

const SUFFIX_TOKENS = new Set(['ii', 'iii', 'iv', 'jr', 'sr', 'v']);

/**
 * Convert a player name to the expected cache filename.
 * e.g. "Sean East II" -> "sean-east-ii.json"
 */
function toFileName(playerName: string): string {
  return (
    playerName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-') + '.json'
  );
}

/**
 * Split a player name into lowercase tokens, dropping empty/single-char parts.
 */
function tokenize(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .filter((p) => p.length > 1);
}

/**
 * Compute Levenshtein edit distance between two strings.
 * Used for typo-tolerant name matching.
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  const prev: number[] = new Array(n + 1);
  const curr: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

/**
 * Returns true if two name tokens should be considered a fuzzy match.
 * Accepts tokens within Levenshtein distance 2 (scaled by length) OR
 * where one is a prefix of the other and shares ≥ 4 chars.
 */
function tokenMatches(a: string, b: string): boolean {
  if (a === b) return true;
  const minLen = Math.min(a.length, b.length);
  if (minLen >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  // Allow 1 edit for short tokens (3-5 chars), 2 edits for longer
  const maxDist = minLen <= 5 ? 1 : 2;
  return editDistance(a, b) <= maxDist;
}

/**
 * Score a candidate cache file against a player name query.
 * Higher score = better match. Returns -1 if not a viable candidate.
 *
 * Requirements for a positive score:
 *   - Every meaningful query token must fuzzy-match some token in the filename.
 *   - Last name match is weighted most heavily.
 */
function scoreCandidate(queryTokens: string[], candidateSlug: string): number {
  const candTokens = tokenize(candidateSlug);
  if (candTokens.length === 0) return -1;

  // Drop suffixes when evaluating last-name alignment (but keep for token match)
  const queryCoreTokens = queryTokens.filter((t) => !SUFFIX_TOKENS.has(t));
  const candCoreTokens = candTokens.filter((t) => !SUFFIX_TOKENS.has(t));

  if (queryCoreTokens.length === 0 || candCoreTokens.length === 0) return -1;

  let score = 0;
  let matchedTokens = 0;

  for (const qt of queryCoreTokens) {
    let bestMatch = -1;
    for (const ct of candCoreTokens) {
      if (tokenMatches(qt, ct)) {
        const dist = editDistance(qt, ct);
        const tokenScore = dist === 0 ? 10 : dist === 1 ? 6 : 3;
        if (tokenScore > bestMatch) bestMatch = tokenScore;
      }
    }
    if (bestMatch < 0) return -1; // every query token must match something
    score += bestMatch;
    matchedTokens++;
  }

  // Heavily weight last-name agreement (last token excluding suffix)
  const qLast = queryCoreTokens[queryCoreTokens.length - 1];
  const cLast = candCoreTokens[candCoreTokens.length - 1];
  if (tokenMatches(qLast, cLast)) {
    const lastDist = editDistance(qLast, cLast);
    score += lastDist === 0 ? 20 : lastDist === 1 ? 10 : 4;
  } else {
    return -1; // last names must align (even if fuzzy)
  }

  // Penalize candidates with many unmatched extra tokens (prevents false positives)
  const extraTokens = Math.max(0, candCoreTokens.length - matchedTokens);
  score -= extraTokens * 2;

  return score;
}

/**
 * Read cached EuroBasket player data from the static JSON cache.
 * Files are stored as lowercase-hyphenated names in src/data/cache/.
 *
 * Matching strategy (in order):
 *   1. Exact filename match
 *   2. Strict loose match (all query tokens must be substrings of filename)
 *   3. Fuzzy match via Levenshtein — tolerates typos like "Noley" vs "Nolley"
 *
 * Returns the full ScrapedPlayer object or null if no reasonable match found.
 */
export function getCachedPlayer(playerName: string): ScrapedPlayer | null {
  try {
    // 1. Exact filename match
    const exactPath = path.join(CACHE_DIR, toFileName(playerName));
    if (fs.existsSync(exactPath)) {
      return JSON.parse(fs.readFileSync(exactPath, 'utf-8')) as ScrapedPlayer;
    }

    if (!fs.existsSync(CACHE_DIR)) return null;
    const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.json'));
    if (files.length === 0) return null;

    const queryTokens = tokenize(playerName);
    if (queryTokens.length === 0) return null;

    // 2. Strict loose match — all query tokens appear as substrings in filename
    const strictMatch = files.find((f) => {
      const base = f.replace('.json', '');
      return queryTokens.every((t) => base.includes(t));
    });
    if (strictMatch) {
      return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, strictMatch), 'utf-8')) as ScrapedPlayer;
    }

    // 3. Fuzzy match — score every file and pick the best, if above threshold
    let bestFile: string | null = null;
    let bestScore = -1;
    for (const f of files) {
      const score = scoreCandidate(queryTokens, f.replace('.json', ''));
      if (score > bestScore) {
        bestScore = score;
        bestFile = f;
      }
    }

    // Require a minimum score to avoid false positives.
    // Perfect 2-token match with last-name bonus ≈ 40; fuzzy typo match ≈ 20–30.
    // 18 is the floor for "confident enough to return".
    if (bestFile && bestScore >= 18) {
      return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, bestFile), 'utf-8')) as ScrapedPlayer;
    }

    return null;
  } catch {
    return null;
  }
}
