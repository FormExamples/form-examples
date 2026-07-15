// Rules for the Emergency Department Triage Note.
//
// Two rule families, both pure:
//
//   1. NEWS2 per-parameter scoring (RCP 2017 allocation, Scale 1 default) —
//      respiratory rate, SpO2, supplemental oxygen (+2), systolic blood
//      pressure, pulse, consciousness (ACVPU), and temperature. Each maps a
//      measured value to a 0-3 subscore (oxygen is 0 or 2). The grader
//      (`grader.js`) sums these into a supporting NEWS2 aggregate.
//
//   2. Manchester Triage System (MTS) general discriminators — each maps a
//      recorded finding to a MINIMUM MTS priority level (1 = most urgent).
//      This is a CLASSIFICATION, not an additive score: the grader selects the
//      most urgent level any discriminator forces.
//
// The band tables here mirror the SQL `..._grade_rule` instrument rows.

/**
 * @typedef {import('./types.js').Acvpu} Acvpu
 * @typedef {import('./types.js').AirOrOxygen} AirOrOxygen
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredDiscriminator} FiredDiscriminator
 */

// Wrapped in an IIFE; published via window.EmergencyDepartmentTriageNote.

// ─── NEWS2 per-parameter scoring (Scale 1 default) ──────────────────

/**
 * Respiration rate (breaths/min).
 *   <=8 -> 3 | 9-11 -> 1 | 12-20 -> 0 | 21-24 -> 2 | >=25 -> 3
 * @param {number | null} rr
 * @returns {0|1|2|3|null}
 */
function scoreRespiratoryRate(rr) {
  if (rr === null || rr === undefined || Number.isNaN(rr)) return null;
  if (rr <= 8) return 3;
  if (rr <= 11) return 1;
  if (rr <= 20) return 0;
  if (rr <= 24) return 2;
  return 3;
}

/**
 * Oxygen saturation (%), Scale 1: <=91 -> 3 | 92-93 -> 2 | 94-95 -> 1 | >=96 -> 0
 * @param {number | null} spo2
 * @returns {0|1|2|3|null}
 */
function scoreSpo2(spo2) {
  if (spo2 === null || spo2 === undefined || Number.isNaN(spo2)) return null;
  if (spo2 <= 91) return 3;
  if (spo2 <= 93) return 2;
  if (spo2 <= 95) return 1;
  return 0;
}

/**
 * Supplemental-oxygen weighting: 2 on oxygen, otherwise 0.
 * @param {AirOrOxygen} onOxygen
 * @returns {0|2}
 */
function scoreOxygen(onOxygen) {
  return onOxygen === 'oxygen' ? 2 : 0;
}

/**
 * Systolic blood pressure (mmHg).
 *   <=90 -> 3 | 91-100 -> 2 | 101-110 -> 1 | 111-219 -> 0 | >=220 -> 3
 * @param {number | null} sbp
 * @returns {0|1|2|3|null}
 */
function scoreBloodPressure(sbp) {
  if (sbp === null || sbp === undefined || Number.isNaN(sbp)) return null;
  if (sbp <= 90) return 3;
  if (sbp <= 100) return 2;
  if (sbp <= 110) return 1;
  if (sbp <= 219) return 0;
  return 3;
}

/**
 * Pulse (beats/min).
 *   <=40 -> 3 | 41-50 -> 1 | 51-90 -> 0 | 91-110 -> 1 | 111-130 -> 2 | >=131 -> 3
 * @param {number | null} pulse
 * @returns {0|1|2|3|null}
 */
function scorePulse(pulse) {
  if (pulse === null || pulse === undefined || Number.isNaN(pulse)) return null;
  if (pulse <= 40) return 3;
  if (pulse <= 50) return 1;
  if (pulse <= 90) return 0;
  if (pulse <= 110) return 1;
  if (pulse <= 130) return 2;
  return 3;
}

/**
 * Consciousness (ACVPU): A (alert) -> 0; any of C/V/P/U -> 3.
 * @param {Acvpu} acvpu
 * @returns {0|3|null}
 */
function scoreConsciousness(acvpu) {
  if (acvpu === '' || acvpu === null || acvpu === undefined) return null;
  return acvpu === 'A' ? 0 : 3;
}

/**
 * Temperature (degrees Celsius).
 *   <=35.0 -> 3 | 35.1-36.0 -> 1 | 36.1-38.0 -> 0 | 38.1-39.0 -> 1 | >=39.1 -> 2
 * @param {number | null} temp
 * @returns {0|1|2|3|null}
 */
function scoreTemperature(temp) {
  if (temp === null || temp === undefined || Number.isNaN(temp)) return null;
  if (temp <= 35.0) return 3;
  if (temp <= 36.0) return 1;
  if (temp <= 38.0) return 0;
  if (temp <= 39.0) return 1;
  return 2;
}

// ─── Manchester Triage System discriminators ────────────────────────
//
// Each entry maps a boolean discriminator flag to the MINIMUM MTS level it
// forces. `field` is the property on `data.discriminators`. The grader also
// evaluates derived discriminators from the vital signs and pain score
// (ACVPU U/V/P, SpO2, pain bands) — see `deriveDiscriminators`.

/**
 * Discriminator-flag definitions, ordered most-urgent-first.
 * @type {{ id: string, field: string, level: 1|2|3, category: string, description: string }[]}
 */
const DISCRIMINATOR_FLAGS = [
  { id: 'D-AIRWAY-THREAT',        field: 'airwayThreat',        level: 1, category: 'airway',        description: 'Threatened or compromised airway' },
  { id: 'D-BREATHING-INADEQUATE', field: 'breathingInadequate', level: 1, category: 'breathing',     description: 'Severely inadequate breathing / respiratory failure' },
  { id: 'D-CIRCULATION-SHOCK',    field: 'circulationShock',    level: 1, category: 'circulation',    description: 'Shock or circulatory compromise' },
  { id: 'D-HAEMORRHAGE-MAJOR',    field: 'haemorrhageMajor',    level: 1, category: 'circulation',    description: 'Major or catastrophic haemorrhage' },
  { id: 'D-SEIZURE-ACTIVE',       field: 'seizureActive',       level: 1, category: 'disability',     description: 'Active seizure' },
  { id: 'D-CONSCIOUSNESS-REDUCED',field: 'consciousnessReduced',level: 2, category: 'disability',     description: 'Reduced consciousness (responds to voice or pain)' },
  { id: 'D-FOCAL-NEUROLOGY',      field: 'focalNeurology',      level: 2, category: 'disability',     description: 'Acute focal neurological deficit' },
  { id: 'D-STROKE-FEATURES',      field: 'strokeFeatures',      level: 2, category: 'disability',     description: 'Features suggestive of acute stroke (time-critical)' },
  { id: 'D-CHEST-PAIN-CARDIAC',   field: 'chestPainCardiac',    level: 2, category: 'circulation',    description: 'Chest pain of possible cardiac origin (time-critical)' },
  { id: 'D-SEPSIS-FEATURES',      field: 'sepsisFeatures',      level: 2, category: 'temperature',    description: 'Features suggestive of sepsis (sepsis screen)' },
  { id: 'D-PAEDIATRIC-RED-FLAG',  field: 'paediatricRedFlag',   level: 2, category: 'disability',     description: 'Paediatric red flag (time-critical)' }
];

export { scoreRespiratoryRate, scoreSpo2, scoreOxygen, scoreBloodPressure, scorePulse, scoreConsciousness, scoreTemperature, DISCRIMINATOR_FLAGS };
