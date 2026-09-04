// Agile Consulting Scorecard for Hiring Help — pure scoring engine.
//
// JavaScript port of front-end-with-svelte/src/lib/engine/score-grader.ts
// (and the Loco back-end's scoring/{manifesto,principles}.rs), extracted
// from the inline <script> in index.html so it can be imported headless
// (bin/test-engines, bin/test-personas) as well as by the page.
//
// Sum-of-points: each `true` answer scores 1 (false and null score 0); the
// 0-16 total maps to a band (0-4 low, 5 borderline, 6-10 medium, 11-16
// high). Six readiness flags fire independently of the band. No DOM, no
// side effects.

// The 16 items, in scorecard order.
const ITEMS = [
  { key: 'm1', group: 'manifesto', heading: 'Manifesto 1 — Individuals and interactions',
    prompt: 'Every leader is in conversation with customers ≥ 1 hour per week, with weekly results radiated to stakeholders.' },
  { key: 'm2', group: 'manifesto', heading: 'Manifesto 2 — Working software',
    prompt: 'The team has launched a brand-new "hello world" program to production and discussed the experience.' },
  { key: 'm3', group: 'manifesto', heading: 'Manifesto 3 — Customer collaboration',
    prompt: 'The organization has bought copies of the customer\'s favourite book and shared with the team (org spend, not personal).' },
  { key: 'm4', group: 'manifesto', heading: 'Manifesto 4 — Responding to change',
    prompt: 'Every senior leader (BoD/CXO/VP/Dir) has read one agile change-management book and shared three takeaways.' },
  { key: 'p1', group: 'principles-a', heading: 'Principle 1 — Customer satisfaction',
    prompt: 'Every product lead measures customer Net Promoter Score (NPS).' },
  { key: 'p2', group: 'principles-a', heading: 'Principle 2 — Welcome changing requirements',
    prompt: 'The "hello world" program has been internationalized to ≥ 1 additional language using the user locale.' },
  { key: 'p3', group: 'principles-a', heading: 'Principle 3 — Deliver frequently',
    prompt: 'The internationalized "hello world" version has been launched to production and verified by a native speaker.' },
  { key: 'p4', group: 'principles-a', heading: 'Principle 4 — Business and developers together',
    prompt: 'Commitment is in place from every product / project / programme / practice lead.' },
  { key: 'p5', group: 'principles-b', heading: 'Principle 5 — Motivated individuals',
    prompt: 'A 3-amigos team (business + dev + test) has shipped a real new MVP within 30 days and on budget.' },
  { key: 'p6', group: 'principles-b', heading: 'Principle 6 — Face-to-face',
    prompt: 'Every product owner has committed to ≥ 50 % face-to-face time (or weekly-video equivalent for remote teams).' },
  { key: 'p7', group: 'principles-b', heading: 'Principle 7 — Working software is the primary measure',
    prompt: 'A new "fizz buzz" program has been created and shipped to production.' },
  { key: 'p8', group: 'principles-b', heading: 'Principle 8 — Sustainable pace',
    prompt: 'All staff have a sustaining budget for ≥ 1 year secured.' },
  { key: 'p9', group: 'principles-c', heading: 'Principle 9 — Technical excellence',
    prompt: 'Quality-attribute metrics are wired into pre-commit hooks and continuous integration.' },
  { key: 'p10', group: 'principles-c', heading: 'Principle 10 — Simplicity',
    prompt: 'Every product team has ≥ 2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC).' },
  { key: 'p11', group: 'principles-c', heading: 'Principle 11 — Self-organizing teams',
    prompt: 'A 5-point Likert "our team is self-organizing" averages "Agree" or better.' },
  { key: 'p12', group: 'principles-c', heading: 'Principle 12 — Reflection',
    prompt: 'Every leader has shared their previous 2 retrospectives with all stakeholders.' },
];

const MANIFESTO_KEYS = ['m1', 'm2', 'm3', 'm4'];
const PRINCIPLE_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'];

const RECOMMENDATION = {
  low:        "Don't hire agile help yet — focus on internal operations first.",
  borderline: "Borderline — do your agile homework first; revisit in ~3 months.",
  medium:     "Do your agile homework first; revisit the scorecard in ~3 months.",
  high:       "Likely ready — trial an engagement and review in ~3 months.",
};

/**
 * Build a fresh, fully-blank scorecard in the shape the page exports
 * (exportJson) and gradeScorecard() consumes: every item `{ done: null,
 * evidence: '' }` (null = not yet attempted; false = explicit "no"; true =
 * explicit "yes"). `gradeScorecard(emptyScorecard())` scores 0 -> 'low'
 * with no flags (flags fire only on explicit false answers).
 */
function emptyScorecard() {
  const item = () => ({ done: null, evidence: '' });
  const manifesto = {}, principles = {};
  for (const k of MANIFESTO_KEYS) manifesto[k] = item();
  for (const k of PRINCIPLE_KEYS) principles[k] = item();
  return {
    organization: { organizationName: '', sector: '', sizeBand: '' },
    respondent: { respondentName: '', respondentEmail: '', role: '' },
    assessment: { assessmentDate: '', status: 'draft' },
    manifesto,
    principles,
    signoff: { override: '', overrideReason: '', signedBy: '' },
  };
}

function answerToPoints(a) { return a === true ? 1 : 0; }

function totalToBand(t) {
  if (t <= 4) return 'low';
  if (t === 5) return 'borderline';
  if (t <= 10) return 'medium';
  return 'high';
}

/** Readiness flags over the flat answers map { m1: true|false|null, … }. */
function computeFlags(answers) {
  const out = [];
  if (answers.m4 === false) out.push({ p: 'high',
    cat: 'no-senior-leadership-buyin',
    text: 'No senior leader has read an agile change-management book and shared takeaways.' });
  if (answers.m1 === false || answers.p1 === false) out.push({ p: 'high',
    cat: 'no-customer-contact',
    text: 'Customer-contact gap: leaders are not in regular conversation with customers, or NPS is not measured.' });
  if (answers.m2 === false && answers.p7 === false) out.push({ p: 'high',
    cat: 'no-working-software',
    text: 'Neither "hello world" nor "fizz buzz" has been launched to production.' });
  if (answers.p8 === false) out.push({ p: 'medium',
    cat: 'no-sustainable-budget',
    text: 'Less than 1 year of staff sustaining budget is secured.' });
  if (answers.p11 === false) out.push({ p: 'medium',
    cat: 'no-self-organization',
    text: 'Self-organization Likert average is below "Agree".' });
  if (answers.p12 === false) out.push({ p: 'medium',
    cat: 'no-reflection-culture',
    text: 'Leaders are not running or sharing retrospectives.' });
  return out;
}

/** Flatten a scorecard's manifesto + principles items into { key: done }. */
function answersOf(data) {
  const answers = {};
  for (const k of MANIFESTO_KEYS) answers[k] = data.manifesto && data.manifesto[k] ? data.manifesto[k].done : null;
  for (const k of PRINCIPLE_KEYS) answers[k] = data.principles && data.principles[k] ? data.principles[k].done : null;
  return answers;
}

/**
 * Composite grader over a scorecard (the exportJson shape).
 * @returns {{ scoreTotal: number, scoreBand: string, manifestoSubtotal: number,
 *   principlesSubtotal: number, recommendation: string,
 *   firedRules: { id: string, key: string, answer: boolean|null, points: number }[],
 *   additionalFlags: { p: string, cat: string, text: string }[] }}
 */
function gradeScorecard(data) {
  const answers = answersOf(data);
  const manifestoSubtotal = MANIFESTO_KEYS.reduce((s, k) => s + answerToPoints(answers[k]), 0);
  const principlesSubtotal = PRINCIPLE_KEYS.reduce((s, k) => s + answerToPoints(answers[k]), 0);
  const scoreTotal = manifestoSubtotal + principlesSubtotal;
  const scoreBand = totalToBand(scoreTotal);
  const firedRules = ITEMS.map((item) => ({
    id: 'R-' + item.key.toUpperCase(),
    key: item.key,
    answer: answers[item.key],
    points: answerToPoints(answers[item.key]),
  }));
  return {
    scoreTotal,
    scoreBand,
    manifestoSubtotal,
    principlesSubtotal,
    recommendation: RECOMMENDATION[scoreBand],
    firedRules,
    additionalFlags: computeFlags(answers),
  };
}

export {
  ITEMS, MANIFESTO_KEYS, PRINCIPLE_KEYS, RECOMMENDATION,
  emptyScorecard, answerToPoints, totalToBand, computeFlags, answersOf, gradeScorecard
};
