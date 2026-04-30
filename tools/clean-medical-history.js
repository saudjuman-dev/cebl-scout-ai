#!/usr/bin/env node
/**
 * Clean fabricated medical history entries.
 *
 * Only keeps entries that are PUBLICLY REPORTED & VERIFIED. Right now:
 *   - Jamal Murray: Left ACL tear, April 2021 (missed entire 2021-22 season)
 *   - Brandon Clarke: Right Achilles tear, March 2023
 *
 * Everything else gets wiped to an empty array so the modal shows
 * "No publicly recorded injuries on file."
 *
 * Re-run only if you've added new fabricated data and want to wipe again.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'career-data.js');

const VERIFIED = {
  'Jamal Murray': [
    { date: '2021-04', injury: 'Left ACL tear', severity: 'Major', gamesOut: 100, note: 'Source: ESPN, Apr 2021. Missed entire 2021-22 NBA season. Verified public injury.' }
  ],
  'Brandon Clarke': [
    { date: '2023-03', injury: 'Right Achilles tear', severity: 'Major', gamesOut: 50, note: 'Source: Memphis Grizzlies, Mar 2023. Season-ending injury. Verified public injury.' }
  ]
};

const text = fs.readFileSync(FILE, 'utf-8');

// Strategy: walk player entries; for each, replace medicalHistory: [...] with empty
// or with the VERIFIED entry if the player matches.
let result = text;
let cleared = 0;
let kept = 0;

// Match player blocks: "Name": { ... medicalHistory: [ ... ] ... }
// Easier: regex over `"PlayerName": {` then find the closing of medicalHistory
const playerRegex = /"([A-Z][^"]+)":\s*\{([\s\S]*?)medicalHistory:\s*\[([\s\S]*?)\]/g;
result = result.replace(playerRegex, (match, name, before, medicalBody) => {
  if (VERIFIED[name]) {
    const verified = VERIFIED[name];
    const formatted = verified.map(v =>
      `      { date: "${v.date}", injury: "${v.injury}", severity: "${v.severity}", gamesOut: ${v.gamesOut}, note: "${v.note}" }`
    ).join(',\n');
    kept++;
    return `"${name}": {${before}medicalHistory: [\n${formatted}\n    ]`;
  } else {
    cleared++;
    return `"${name}": {${before}medicalHistory: []`;
  }
});

fs.writeFileSync(FILE, result);
console.log(`✅ Wiped ${cleared} fabricated medical-history blocks`);
console.log(`✅ Preserved ${kept} verified medical entries (Jamal Murray ACL, Brandon Clarke Achilles)`);
console.log(`\nFile: ${FILE}`);
