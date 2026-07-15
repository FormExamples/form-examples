  

  const VALID = new Set([
    'optimising', 'mature', 'developing', 'initial', 'ad-hoc', 'insufficient-data',
  ]);
  const HIGH = new Set(['optimising', 'mature']);

  function coerceMaturity(s) {
    return VALID.has(s) ? s : 'insufficient-data';
  }

  function quadrantFor(principles, behaviour) {
    if (principles === 'insufficient-data' || behaviour === 'insufficient-data') {
      return 'insufficient-data';
    }
    const pHigh = HIGH.has(principles);
    const bHigh = HIGH.has(behaviour);
    if (pHigh && bHigh) return 'healthy-adoption';
    if (pHigh && !bHigh) return 'aspirational-gap';
    if (!pHigh && bHigh) return 'cargo-cult';
    return 'pre-agile';
  }

  const QUADRANT_LABEL = {
    'healthy-adoption': 'Healthy adoption',
    'aspirational-gap': 'Aspirational gap',
    'cargo-cult': 'Cargo-cult agile',
    'pre-agile': 'Pre-agile / waterfall',
    'insufficient-data': 'Insufficient data',
  };

  const QUADRANT_DESC = {
    'healthy-adoption': 'Believes in agile and acts on it. Coaching focuses on the few weak spots.',
    'aspirational-gap': 'Says it values agility but the day-to-day reality is different. Most common failure mode.',
    'cargo-cult': 'Does the rituals but doesn\u2019t believe the principles. Address the why before adding more what.',
    'pre-agile': 'Honest about being non-agile. Decide whether agility is the right fit before investing.',
    'insufficient-data': 'At least one form has too few answers to classify the team.',
  };

  function readSisterCsv(text) {
    const rows = fallbackParseCsv(text);
    if (rows.length === 0) throw new Error('empty CSV');
    const headers = rows[0].map(function (h) { return h.trim(); });
    const idx = {};
    headers.forEach(function (h, i) { idx[h] = i; });
    ['team', 'organisation', 'maturity'].forEach(function (k) {
      if (!(k in idx)) throw new Error('missing required column: ' + k);
    });
    const dateIdx = idx['date'];
    const meanIdx = idx['meanScore'];
    const overallIdx = idx['overallPercent'];

    return rows.slice(1).map(function (row) {
      const team = (row[idx['team']] || '').trim();
      const organisation = (row[idx['organisation']] || '').trim();
      const date = dateIdx !== undefined ? (row[dateIdx] || '').trim() : '';
      const maturity = coerceMaturity((row[idx['maturity']] || '').trim());
      let score = null;
      let scoreDisplay = '\u2014';
      if (meanIdx !== undefined && row[meanIdx] !== undefined && row[meanIdx] !== '') {
        const n = Number(row[meanIdx]);
        if (Number.isFinite(n)) { score = n; scoreDisplay = n.toFixed(2); }
      } else if (overallIdx !== undefined && row[overallIdx] !== undefined && row[overallIdx] !== '') {
        const n = Number(row[overallIdx]);
        if (Number.isFinite(n)) { score = n; scoreDisplay = Math.round(n) + '%'; }
      }
      return { team: team, organisation: organisation, date: date, maturity: maturity,
        score: score, scoreDisplay: scoreDisplay };
    });
  }

  // Same parser as the existing js/app.js — duplicated as a fallback so
  // comparison.html can ship without loading app.js.
  function fallbackParseCsv(text) {
    const out = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 1; }
          else { inQuotes = false; }
        } else { field += c; }
      } else if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); out.push(row); row = []; field = ''; }
      else if (c === '\r') { /* ignore */ }
      else { field += c; }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); out.push(row); }
    return out.filter(function (r) { return r.length > 1 || (r.length === 1 && r[0] !== ''); });
  }

  function latestByTeam(rows) {
    const map = new Map();
    rows.forEach(function (r) {
      const key = r.team + '\x00' + r.organisation;
      const prior = map.get(key);
      if (!prior || prior.date.localeCompare(r.date) < 0) map.set(key, r);
    });
    return map;
  }

  function pairSubmissions(principlesRows, behaviourRows) {
    const p = latestByTeam(principlesRows);
    const b = latestByTeam(behaviourRows);
    const keys = new Set([].concat(Array.from(p.keys()), Array.from(b.keys())));
    const out = [];
    keys.forEach(function (key) {
      const pp = p.get(key) || null;
      const bb = b.get(key) || null;
      const sample = pp || bb;
      out.push({
        team: sample.team,
        organisation: sample.organisation,
        principles: pp,
        behaviour: bb,
        quadrant: pp && bb ? quadrantFor(pp.maturity, bb.maturity) : 'insufficient-data',
      });
    });
    out.sort(function (a, b) {
      return a.team.localeCompare(b.team) || a.organisation.localeCompare(b.organisation);
    });
    return out;
  }

  export const comparison = {
    coerceMaturity: coerceMaturity,
    quadrantFor: quadrantFor,
    QUADRANT_LABEL: QUADRANT_LABEL,
    QUADRANT_DESC: QUADRANT_DESC,
    readSisterCsv: readSisterCsv,
    pairSubmissions: pairSubmissions,
  };
