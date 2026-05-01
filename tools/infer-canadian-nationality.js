#!/usr/bin/env node
/**
 * Infer Canadian nationality from birth city for cache files where the
 * EuroBasket page doesn't have an explicit "is Canadian basketball player"
 * sentence.
 *
 * Conservative heuristic: only set nationality=Canadian if birthCity
 * unambiguously matches a Canadian city/province.
 */
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');

// Cities that are unambiguously Canadian (no major US namesake).
// "London" is excluded because of London UK collision.
const CANADIAN_CITIES = new Set([
  'Toronto', 'Mississauga', 'Brampton', 'Markham', 'Vaughan', 'Richmond Hill',
  'Burlington', 'Oakville', 'Kitchener', 'Waterloo', 'Cambridge',
  'Ottawa', 'Hamilton', 'Windsor', 'Sudbury', 'Thunder Bay',
  'Montreal', 'Montréal', 'Laval', 'Longueuil', 'Quebec City', 'Québec',
  'Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Coquitlam', 'Langley',
  'Victoria', 'Kelowna', 'Abbotsford', 'Saanich',
  'Calgary', 'Edmonton', 'Lethbridge', 'Red Deer',
  'Winnipeg', 'Saskatoon', 'Regina',
  'Halifax', 'Dartmouth', 'Sydney',
  'St. Catharines', 'Niagara Falls', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
  'Scarborough', 'Etobicoke', 'North York',
  'Newmarket', 'Aurora',
  'Fredericton', 'Saint John', 'Moncton',
  "St. John's", 'Charlottetown',
  'Yellowknife', 'Whitehorse'
]);

// Province codes / names appearing after city name
const PROVINCE_RE = /\b(?:ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU|Ontario|Quebec|British Columbia|Alberta|Manitoba|Saskatchewan|Nova Scotia|New Brunswick|Newfoundland)\b/i;

const dryRun = process.argv.includes('--dry-run');

const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
let updated = 0, skipped = 0, ambiguous = 0;

for (const f of files) {
  const fp = path.join(CACHE_DIR, f);
  let d;
  try { d = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { continue; }
  if (d.nationality) { skipped++; continue; }
  const city = (d.birthCity || '').trim();
  if (!city) { skipped++; continue; }

  // Strict match: city is in our unambiguous Canadian list, OR city contains a province code
  const cityName = city.split(',')[0].trim();
  const hasProvince = PROVINCE_RE.test(city);
  const knownCanadianCity = CANADIAN_CITIES.has(cityName);

  if (knownCanadianCity || hasProvince) {
    if (!dryRun) {
      d.nationality = 'Canadian';
      d._inferredNationality = true;   // mark how we know
      fs.writeFileSync(fp, JSON.stringify(d, null, 2));
    }
    console.log(`  ✅ ${d.fullName || f}  ←  ${city} ${hasProvince ? '(province)' : '(known city)'}`);
    updated++;
  } else {
    ambiguous++;
  }
}

console.log(`\n📊 Inference results:`);
console.log(`   ✅ Marked Canadian: ${updated}${dryRun ? ' (dry-run, no writes)' : ''}`);
console.log(`   ⏭️  Already had nationality: ${skipped}`);
console.log(`   🤔 Ambiguous (no clear Canadian city): ${ambiguous}`);
