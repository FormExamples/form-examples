import { aldreteRules, aldreteScore, padssScore } from './rules.js';

// PACU / Modified Aldrete grader. Pure functions: take a `PacuRecord` object,
// map each of the five Aldrete parameter answers to a 0/1/2 sub-score, sum the
// total (0-10), and derive the readiness band. The optional PADSS total is
// summed independently when the case is ambulatory and all five criteria are
// supplied.
//
// Grading algorithm (spec §4):
//   activityScore         = { all-four:2, two:1, none:0 }[activity]
//   respirationScore      = { deep-cough:2, limited:1, apnoeic:0 }[respiration]
//   circulationScore      = { within-20:2, within-50:1, over-50:0 }[circulation]
//   consciousnessScore    = { awake:2, arousable:1, unresponsive:0 }[consciousness]
//   oxygenSaturationScore = { room-air:2, needs-o2:1, low-on-o2:0 }[oxygenSaturation]
//   aldreteTotal  = sum of the five sub-scores (0..10)
//   readinessBand = (aldreteTotal >= 9 && oxygenSaturationScore === 2)
//                 ? 'discharge-ready' : 'not-ready'
//
// Discharge-readiness is GATED on oxygen saturation: a total of 9 achieved with
// oxygenSaturationScore < 2 stays 'not-ready', because an oxygenation deficit is
// the highest-risk parameter. A missing parameter contributes 0 for that
// parameter; `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').PacuRecord} PacuRecord
 * @typedef {import('./types.js').ReadinessBand} ReadinessBand
 * @typedef {import('./types.js').FiredParameter} FiredParameter
 */

/**
 * Evaluate the five Aldrete parameter rules and collect them as audit rows,
 * each carrying the 0/1/2 points it contributed.
 * @param {PacuRecord} data
 * @returns {FiredParameter[]}
 */
function evaluateParameters(data) {
  /** @type {FiredParameter[]} */
  const fired = [];
  for (const rule of aldreteRules) {
    try {
      const value = rule.get(data);
      const points = aldreteScore(rule.parameter, value);
      fired.push({
        id: rule.id,
        parameter: rule.parameter,
        points,
        category: rule.category,
        description: rule.description
      });
    } catch (e) {
      console.warn(`Aldrete rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the optional PADSS total. Returns `{ total: null, streetFit: null }`
 * unless the case is ambulatory AND all five criteria are supplied.
 * @param {PacuRecord} data
 * @returns {{ total: number | null, streetFit: boolean | null }}
 */
function calculatePadss(data) {
  if (data.identification.ambulatoryCase !== 'yes') {
    return { total: null, streetFit: null };
  }
  const p = data.padss;
  const parts = [
    padssScore('padssVitalSigns', p.padssVitalSigns),
    padssScore('padssAmbulation', p.padssAmbulation),
    padssScore('padssNauseaVomiting', p.padssNauseaVomiting),
    padssScore('padssPain', p.padssPain),
    padssScore('padssSurgicalBleeding', p.padssSurgicalBleeding)
  ];
  if (parts.some((s) => s === null)) {
    return { total: null, streetFit: null };
  }
  const total = parts.reduce((a, b) => a + b, 0);
  return { total, streetFit: total >= 9 };
}

/**
 * Compute the full PACU grade for the supplied record.
 * @param {PacuRecord} data
 * @returns {{ activityScore:0|1|2, respirationScore:0|1|2, circulationScore:0|1|2,
 *             consciousnessScore:0|1|2, oxygenSaturationScore:0|1|2,
 *             aldreteTotal:number, readinessBand:ReadinessBand,
 *             padssTotal:(number|null), padssStreetFit:(boolean|null),
 *             firedParameters:FiredParameter[] }}
 */
function calculatePacuGrade(data) {
  const firedParameters = evaluateParameters(data);
  const scoreOf = (parameter) =>
    firedParameters.find((f) => f.parameter === parameter)?.points ?? 0;

  const activityScore = scoreOf('activity');
  const respirationScore = scoreOf('respiration');
  const circulationScore = scoreOf('circulation');
  const consciousnessScore = scoreOf('consciousness');
  const oxygenSaturationScore = scoreOf('oxygenSaturation');

  const aldreteTotal =
    activityScore + respirationScore + circulationScore +
    consciousnessScore + oxygenSaturationScore;

  /** @type {ReadinessBand} */
  const readinessBand =
    (aldreteTotal >= 9 && oxygenSaturationScore === 2)
      ? 'discharge-ready' : 'not-ready';

  const { total: padssTotal, streetFit: padssStreetFit } = calculatePadss(data);

  // Record the derived readiness-band decision as a `band` audit row.
  firedParameters.push({
    id: 'R-BAND-01',
    parameter: 'band',
    points: 0,
    category: 'readiness-band',
    description:
      readinessBand === 'discharge-ready'
        ? `Aldrete ${aldreteTotal}/10 with SpO2 parameter met — discharge-ready`
        : (aldreteTotal >= 9
            ? `Aldrete ${aldreteTotal}/10 but oxygen-saturation parameter below 2 — not ready`
            : `Aldrete ${aldreteTotal}/10 below the discharge threshold — not ready`)
  });

  // When PADSS was scored, record it as an audit row too.
  if (padssTotal !== null) {
    firedParameters.push({
      id: 'R-PADSS-01',
      parameter: 'padss',
      points: padssTotal,
      category: 'padss-total',
      description:
        padssStreetFit
          ? `PADSS ${padssTotal}/10 — street-fit for discharge home`
          : `PADSS ${padssTotal}/10 — not yet street-fit`
    });
  }

  return {
    activityScore,
    respirationScore,
    circulationScore,
    consciousnessScore,
    oxygenSaturationScore,
    aldreteTotal,
    readinessBand,
    padssTotal,
    padssStreetFit,
    firedParameters
  };
}

export { evaluateParameters, calculatePadss, calculatePacuGrade };
