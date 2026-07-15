// Declarative MEWS allocation table (Subbe et al., QJM 2001).
//
// Unlike a simple criteria-count instrument, MEWS maps each of five
// physiological parameters to a sub-score of 0-3 by a value-range table. Each
// entry below exposes a pure `score(data)` that returns the 0-3 sub-score for
// its parameter plus a `describe(point, value)` for the audit trail. The grader
// (`grader.js`) sums the five sub-scores into the aggregate (0-14), derives the
// risk band, and detects the single-parameter=3 trigger. Rows here mirror the
// `modified_early_warning_score_grade_rule` SQL table (rule_id, instrument,
// band, points, category, description).

/**
 * @typedef {import('./types.js').ObservationData} ObservationData
 *
 * @typedef {Object} MewsParameter
 * @property {string} id           - stable rule id prefix, e.g. R-SBP
 * @property {string} instrument   - grade_rule instrument enum
 * @property {string} label        - human label
 * @property {string} unit         - measurement unit ('' for AVPU)
 * @property {(d: ObservationData) => (number|null|'')} valueOf
 * @property {(d: ObservationData) => (0|1|2|3)} score
 * @property {(point: number, value: (number|null|'')) => string} describe
 */

/**
 * Systolic blood pressure sub-score (mmHg):
 *   <= 70 -> 3, 71-80 -> 2, 81-100 -> 1, 101-199 -> 0, >= 200 -> 2
 */
function scoreSystolicBloodPressure(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (v <= 70) return 3;
  if (v <= 80) return 2;
  if (v <= 100) return 1;
  if (v <= 199) return 0;
  return 2; // >= 200
}

/**
 * Heart-rate sub-score (beats/min):
 *   <= 40 -> 2, 41-50 -> 1, 51-100 -> 0, 101-110 -> 1, 111-129 -> 2, >= 130 -> 3
 */
function scoreHeartRate(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (v <= 40) return 2;
  if (v <= 50) return 1;
  if (v <= 100) return 0;
  if (v <= 110) return 1;
  if (v <= 129) return 2;
  return 3; // >= 130
}

/**
 * Respiratory-rate sub-score (breaths/min):
 *   < 9 -> 2, 9-14 -> 0, 15-20 -> 1, 21-29 -> 2, >= 30 -> 3
 */
function scoreRespiratoryRate(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (v < 9) return 2;
  if (v <= 14) return 0;
  if (v <= 20) return 1;
  if (v <= 29) return 2;
  return 3; // >= 30
}

/**
 * Temperature sub-score (degrees Celsius):
 *   < 35.0 -> 2, 35.0-38.4 -> 0, >= 38.5 -> 2
 */
function scoreTemperature(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (v < 35.0) return 2;
  if (v <= 38.4) return 0;
  return 2; // >= 38.5
}

/**
 * AVPU sub-score:
 *   alert -> 0, voice -> 1, pain -> 2, unresponsive -> 3
 */
function scoreAvpu(v) {
  switch (v) {
    case 'voice': return 1;
    case 'pain': return 2;
    case 'unresponsive': return 3;
    case 'alert':
    default: return 0;
  }
}

const avpuText = {
  alert: 'Alert',
  voice: 'responds to voice',
  pain: 'responds to pain',
  unresponsive: 'unresponsive'
};

/** @type {MewsParameter[]} */
const mewsParameters = [
  {
    id: 'R-SBP',
    instrument: 'systolic-blood-pressure',
    label: 'Systolic blood pressure',
    unit: 'mmHg',
    valueOf: (d) => d.bloodPressure.systolicBloodPressure,
    score: (d) => scoreSystolicBloodPressure(d.bloodPressure.systolicBloodPressure),
    describe: (point, value) =>
      value === null || value === ''
        ? 'Systolic blood pressure not recorded (0 points)'
        : `Systolic blood pressure ${value} mmHg scores ${point}`
  },
  {
    id: 'R-HR',
    instrument: 'heart-rate',
    label: 'Heart rate',
    unit: 'bpm',
    valueOf: (d) => d.heartRate.heartRate,
    score: (d) => scoreHeartRate(d.heartRate.heartRate),
    describe: (point, value) =>
      value === null || value === ''
        ? 'Heart rate not recorded (0 points)'
        : `Heart rate ${value} bpm scores ${point}`
  },
  {
    id: 'R-RR',
    instrument: 'respiratory-rate',
    label: 'Respiratory rate',
    unit: 'breaths/min',
    valueOf: (d) => d.respiratory.respiratoryRate,
    score: (d) => scoreRespiratoryRate(d.respiratory.respiratoryRate),
    describe: (point, value) =>
      value === null || value === ''
        ? 'Respiratory rate not recorded (0 points)'
        : `Respiratory rate ${value} breaths/min scores ${point}`
  },
  {
    id: 'R-TEMP',
    instrument: 'temperature',
    label: 'Temperature',
    unit: '°C',
    valueOf: (d) => d.temperature.temperature,
    score: (d) => scoreTemperature(d.temperature.temperature),
    describe: (point, value) =>
      value === null || value === ''
        ? 'Temperature not recorded (0 points)'
        : `Temperature ${value} °C scores ${point}`
  },
  {
    id: 'R-AVPU',
    instrument: 'avpu',
    label: 'Consciousness (AVPU)',
    unit: '',
    valueOf: (d) => d.consciousness.avpu,
    score: (d) => scoreAvpu(d.consciousness.avpu),
    describe: (point, value) =>
      value === '' || value === null
        ? 'Level of consciousness not recorded (0 points)'
        : `AVPU ${avpuText[value] || value} scores ${point}`
  }
];

export { scoreSystolicBloodPressure, scoreHeartRate, scoreRespiratoryRate, scoreTemperature, scoreAvpu, mewsParameters };
