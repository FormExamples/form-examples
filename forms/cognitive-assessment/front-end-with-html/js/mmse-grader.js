import { mmseDomains } from './mmse-rules.js';
import { mmseCategory } from './types.js';

// MMSE grader. Pure functions: take an `AssessmentData` object and return
// the total MMSE score (0-30), category label, and per-item fired rules.
//
// Mirrors the SvelteKit `mmse-grader.ts` reference. Items the patient has
// not answered (null) contribute 0 to the total but are not listed in
// firedRules. Items scored 0 (incorrect) likewise are not listed.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CognitiveAssessment.

/**
 * Pure function: calculates the MMSE score from patient assessment data.
 * Returns the total score (0-30), its category label, and fired rules
 * for each item that scored 1 (correct).
 *
 * @param {AssessmentData} data
 * @returns {{ mmseScore: number, mmseCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateMMSE(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  /** @type {{ domainIndex: number, score: 0 | 1 | null }[]} */
  const allScores = [];

  // Orientation - Time (5 items, indices 0..4)
  const ot = data.orientationScores;
  allScores.push(
    { domainIndex: 0, score: ot.year },
    { domainIndex: 1, score: ot.season },
    { domainIndex: 2, score: ot.date },
    { domainIndex: 3, score: ot.day },
    { domainIndex: 4, score: ot.month }
  );

  // Orientation - Place (5 items, indices 5..9)
  allScores.push(
    { domainIndex: 5, score: ot.country },
    { domainIndex: 6, score: ot.county },
    { domainIndex: 7, score: ot.town },
    { domainIndex: 8, score: ot.hospital },
    { domainIndex: 9, score: ot.floor }
  );

  // Registration (3 items, indices 10..12)
  const reg = data.registrationScores;
  allScores.push(
    { domainIndex: 10, score: reg.object1 },
    { domainIndex: 11, score: reg.object2 },
    { domainIndex: 12, score: reg.object3 }
  );

  // Attention & Calculation (5 items, indices 13..17)
  const att = data.attentionScores;
  allScores.push(
    { domainIndex: 13, score: att.serial1 },
    { domainIndex: 14, score: att.serial2 },
    { domainIndex: 15, score: att.serial3 },
    { domainIndex: 16, score: att.serial4 },
    { domainIndex: 17, score: att.serial5 }
  );

  // Recall (3 items, indices 18..20)
  const rec = data.recallScores;
  allScores.push(
    { domainIndex: 18, score: rec.object1 },
    { domainIndex: 19, score: rec.object2 },
    { domainIndex: 20, score: rec.object3 }
  );

  // Language - uses repetitionCommands (mirrors Svelte engine), indices 21..28
  const lang = data.repetitionCommands;
  allScores.push(
    { domainIndex: 21, score: lang.naming1 },
    { domainIndex: 22, score: lang.naming2 },
    { domainIndex: 23, score: lang.repetition },
    { domainIndex: 24, score: lang.command1 },
    { domainIndex: 25, score: lang.command2 },
    { domainIndex: 26, score: lang.command3 },
    { domainIndex: 27, score: lang.reading },
    { domainIndex: 28, score: lang.writing }
  );

  // Visuospatial (1 item, index 29)
  const vis = data.visuospatialScores;
  allScores.push({ domainIndex: 29, score: vis.copying });

  let mmseScore = 0;

  for (const { domainIndex, score } of allScores) {
    if (score !== null && score > 0) {
      const def = mmseDomains[domainIndex];
      firedRules.push({
        id: def.id,
        domain: def.domain,
        description: def.item,
        score
      });
      mmseScore += score;
    }
  }

  const mmseCategoryLabel = mmseCategory(mmseScore);

  return { mmseScore, mmseCategoryLabel, firedRules };
}

/**
 * Sum points scored by domain (high-level grouping for the report).
 * @param {AssessmentData} data
 * @returns {{ domain: string, scored: number, max: number }[]}
 */
function domainBreakdown(data) {
  const sumItems = (obj) =>
    Object.values(obj).reduce((s, v) => s + (v === 1 ? 1 : 0), 0);

  const ot = data.orientationScores;
  const orientationScored = [
    ot.year, ot.season, ot.date, ot.day, ot.month,
    ot.country, ot.county, ot.town, ot.hospital, ot.floor
  ].reduce((s, v) => s + (v === 1 ? 1 : 0), 0);

  const lang = data.repetitionCommands;
  const languageScored = [
    lang.naming1, lang.naming2, lang.repetition,
    lang.command1, lang.command2, lang.command3,
    lang.reading, lang.writing
  ].reduce((s, v) => s + (v === 1 ? 1 : 0), 0);

  return [
    { domain: 'Orientation', scored: orientationScored, max: 10 },
    { domain: 'Registration', scored: sumItems(data.registrationScores), max: 3 },
    { domain: 'Attention & Calculation', scored: sumItems(data.attentionScores), max: 5 },
    { domain: 'Recall', scored: sumItems(data.recallScores), max: 3 },
    { domain: 'Language', scored: languageScored, max: 8 },
    { domain: 'Visuospatial', scored: sumItems(data.visuospatialScores), max: 1 }
  ];
}

export { calculateMMSE, domainBreakdown };
