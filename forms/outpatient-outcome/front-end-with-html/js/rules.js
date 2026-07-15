// Four-domain rule catalogue for the Outpatient Outcome Composite Grade (OOCG).
//
// Ports the SvelteKit engine's grading utilities and the four domain graders:
//   - Clinical    (clinician-rated outcome classification)      CLIN-00N
//   - PROM        (EQ-5D-5L + GRC + PROMIS composite)           PROM-00N
//   - PREM        (NHS Friends & Family Test)                   PREM-00N
//   - Operational (NHS Attendance Outcome + wait-time vs target) OPS-00N
//
// Each domain grades A (best) through E (worst); '' means insufficient data.
// Rule IDs are stable and identical across every front-end and the back-end.
// Pure data + helpers; grader.js composes them into a GradingResult.
//
// Wrapped in an IIFE; published via `window.OutpatientOutcome`.

// ----------------------------------------------------------------------
// Grade utilities
// ----------------------------------------------------------------------

/** Map a domain grade letter to a numeric ordinal (A=0 best, E=4 worst). */
function gradeOrdinal(grade) {
  if (grade === '') return -1;
  return 'ABCDE'.indexOf(grade);
}

/** Return the worst (highest ordinal) domain grade from an array. */
function gradeMax(grades) {
  const valid = grades.filter((g) => g !== '');
  if (valid.length === 0) return '';
  return valid.reduce((worst, g) => (gradeOrdinal(g) > gradeOrdinal(worst) ? g : worst));
}

// ----------------------------------------------------------------------
// EQ-5D-5L helpers
// ----------------------------------------------------------------------

/**
 * Compute the net change in a single EQ-5D-5L dimension.
 * Negative = improvement (lower level = better); positive = worsening.
 * Returns null if either value is missing.
 */
function eq5dDimensionChange(before, after) {
  if (before === null || after === null) return null;
  return after - before;
}

/**
 * Count how many EQ-5D-5L dimensions (plus the VAS) improved, worsened,
 * stayed the same, or are missing.
 */
function eq5dSummary(prom) {
  const dims = [
    [prom.beforeMobility, prom.afterMobility],
    [prom.beforeSelfCare, prom.afterSelfCare],
    [prom.beforeUsualActivities, prom.afterUsualActivities],
    [prom.beforePainDiscomfort, prom.afterPainDiscomfort],
    [prom.beforeAnxietyDepression, prom.afterAnxietyDepression]
  ];

  let improved = 0;
  let worsened = 0;
  let unchanged = 0;
  let missing = 0;

  for (const [before, after] of dims) {
    const delta = eq5dDimensionChange(before, after);
    if (delta === null) {
      missing++;
    } else if (delta < 0) {
      improved++;
    } else if (delta > 0) {
      worsened++;
    } else {
      unchanged++;
    }
  }

  // VAS: higher = better health.
  const vasChange = eq5dDimensionChange(prom.beforeVas, prom.afterVas);
  if (vasChange === null) {
    missing++;
  } else if (vasChange > 0) {
    improved++;
  } else if (vasChange < 0) {
    worsened++;
  } else {
    unchanged++;
  }

  return { improved, worsened, unchanged, missing };
}

// ----------------------------------------------------------------------
// PROMIS Global Health v1.2 — linear T-score approximation
// ----------------------------------------------------------------------
//
// IMPORTANT: documented approximation only. The official scoring method uses
// item-response-theory calibration tables from the PROMIS Health Organisation.
// Production systems must use the official scoring software / tables from
// healthmeasures.net.

/** Global Physical Health T-score (items 3, 6, 9, 10). Null if incomplete. */
function promisGphTScore(p) {
  const { item3PhysicalHealth, item6FatigueFrequency, item9Pain, item10EverydayActivities } = p;
  if (
    item3PhysicalHealth == null ||
    item6FatigueFrequency == null ||
    item9Pain == null ||
    item10EverydayActivities == null
  ) {
    return null;
  }
  // Recode item9 (0=worst, 10=best) to a 1–5 equivalent: (10 - raw) / 2 + 1.
  const item9Recoded = (10 - item9Pain) / 2 + 1;
  // item6 is fatigue frequency: higher = worse; invert: 6 - raw.
  const item6Inverted = 6 - item6FatigueFrequency;
  const rawSum = item3PhysicalHealth + item6Inverted + item9Recoded + item10EverydayActivities;
  const tScore = 16.2 + ((rawSum - 4) / (20 - 4)) * (67.7 - 16.2);
  return Math.round(tScore * 10) / 10;
}

/** Global Mental Health T-score (items 1, 2, 4, 5, 7, 8). Null if incomplete. */
function promisMhTScore(p) {
  const {
    item1GeneralHealth,
    item2QualityOfLife,
    item4MentalHealth,
    item5Satisfaction,
    item7EmotionalProblems,
    item8SocialActivities
  } = p;
  if (
    item1GeneralHealth == null ||
    item2QualityOfLife == null ||
    item4MentalHealth == null ||
    item5Satisfaction == null ||
    item7EmotionalProblems == null ||
    item8SocialActivities == null
  ) {
    return null;
  }
  // item7: higher raw = more emotional problems = worse; invert.
  const item7Inverted = 6 - item7EmotionalProblems;
  const rawSum =
    item1GeneralHealth +
    item2QualityOfLife +
    item4MentalHealth +
    item5Satisfaction +
    item7Inverted +
    item8SocialActivities;
  const tScore = 21.2 + ((rawSum - 6) / (30 - 6)) * (67.6 - 21.2);
  return Math.round(tScore * 10) / 10;
}

// ----------------------------------------------------------------------
// Date helpers
// ----------------------------------------------------------------------

/** Age in years from a date-of-birth ISO string. Null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Wait-time days between two ISO date strings. Null if invalid. */
function calcWaitDays(referralDate, appointmentDate) {
  if (!referralDate || !appointmentDate) return null;
  const ref = new Date(referralDate);
  const appt = new Date(appointmentDate);
  if (isNaN(ref.getTime()) || isNaN(appt.getTime())) return null;
  const diffMs = appt.getTime() - ref.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

// ----------------------------------------------------------------------
// Clinical domain — clinician-rated outcome classification
// ----------------------------------------------------------------------
//
// A = Resolved, B = Improved, C = Unchanged, D = Worsened, E = Died,
// '' = no classification entered.

function gradeClinical(data) {
  const cls = data.clinicalOutcome.outcomeClassification;
  const rules = [];
  let grade = '';

  switch (cls) {
    case 'resolved':
      grade = 'A';
      rules.push({ id: 'CLIN-001', domain: 'Clinical', description: 'Outcome classified as Resolved', grade: 'A' });
      break;
    case 'improved':
      grade = 'B';
      rules.push({ id: 'CLIN-002', domain: 'Clinical', description: 'Outcome classified as Improved', grade: 'B' });
      break;
    case 'unchanged':
      grade = 'C';
      rules.push({ id: 'CLIN-003', domain: 'Clinical', description: 'Outcome classified as Unchanged', grade: 'C' });
      break;
    case 'worsened':
      grade = 'D';
      rules.push({ id: 'CLIN-004', domain: 'Clinical', description: 'Outcome classified as Worsened', grade: 'D' });
      break;
    case 'died':
      grade = 'E';
      rules.push({ id: 'CLIN-005', domain: 'Clinical', description: 'Outcome classified as Died', grade: 'E' });
      break;
    default:
      grade = '';
      break;
  }

  return { grade, rules };
}

// ----------------------------------------------------------------------
// PROM domain — EQ-5D-5L + GRC + PROMIS composite
// ----------------------------------------------------------------------

/** Grade the EQ-5D-5L instrument (dimensions + VAS combined). */
function gradeEq5d(data) {
  const prom = data.promEq5d5l;
  const { improved, worsened, missing } = eq5dSummary(prom);
  const total = 6; // 5 dimensions + VAS
  if (missing === total) return 'missing';
  if (worsened > improved) return 'worsened';
  if (improved > worsened && improved > 0) return 'improved';
  return 'stable';
}

/** Grade the GRC instrument. */
function gradeGrc(data) {
  const grc = data.promGrc.globalRatingOfChange;
  if (grc === null) return 'missing';
  if (grc > 0) return 'improved';
  if (grc < 0) return 'worsened';
  return 'stable';
}

/** Grade the PROMIS Global Health instrument from the T-score approximation. */
function gradePromis(data) {
  const p = data.promPromis;
  const gph = promisGphTScore(p);
  const gmh = promisMhTScore(p);
  if (gph === null && gmh === null) return 'missing';

  const scores = [gph, gmh].filter((s) => s !== null);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avg >= 50) return 'improved';
  if (avg >= 35) return 'stable';
  return 'worsened';
}

/**
 * Grade the PROM domain from the three instruments.
 *   worsened >= 2   -> E
 *   worsened === 1  -> D
 *   improved >= 3   -> A
 *   improved >= 2   -> B
 *   otherwise       -> C
 *   all missing     -> ''
 */
function gradePROM(data) {
  const results = [
    { name: 'EQ-5D-5L', result: gradeEq5d(data) },
    { name: 'GRC', result: gradeGrc(data) },
    { name: 'PROMIS', result: gradePromis(data) }
  ];

  const rules = [];
  const nonMissing = results.filter((r) => r.result !== 'missing');

  if (nonMissing.length === 0) {
    return { grade: '', rules };
  }

  const improvedCount = nonMissing.filter((r) => r.result === 'improved').length;
  const worsenedCount = nonMissing.filter((r) => r.result === 'worsened').length;

  let grade;

  if (worsenedCount >= 2) {
    grade = 'E';
    rules.push({ id: 'PROM-005', domain: 'PROM', description: 'Multiple PROM instruments worsened', grade: 'E' });
  } else if (worsenedCount === 1) {
    grade = 'D';
    const worsened = nonMissing.find((r) => r.result === 'worsened');
    rules.push({ id: 'PROM-004', domain: 'PROM', description: `${worsened.name} shows worsening`, grade: 'D' });
  } else if (improvedCount >= 3) {
    grade = 'A';
    rules.push({ id: 'PROM-001', domain: 'PROM', description: 'All three PROM instruments improved', grade: 'A' });
  } else if (improvedCount >= 2) {
    grade = 'B';
    rules.push({ id: 'PROM-002', domain: 'PROM', description: 'Two or more PROM instruments improved', grade: 'B' });
  } else {
    grade = 'C';
    rules.push({ id: 'PROM-003', domain: 'PROM', description: 'PROM instruments stable (no significant improvement or worsening)', grade: 'C' });
  }

  return { grade, rules };
}

// ----------------------------------------------------------------------
// PREM domain — NHS Friends & Family Test
// ----------------------------------------------------------------------
//
// extremely_likely -> A, likely -> B, neither -> C, unlikely -> D,
// extremely_unlikely -> E, dont_know / '' -> '' (data-quality flag).

function gradePREM(data) {
  const fft = data.premFft.fftResponse;
  const rules = [];
  let grade = '';

  switch (fft) {
    case 'extremely_likely':
      grade = 'A';
      rules.push({ id: 'PREM-001', domain: 'PREM', description: 'FFT response: Extremely Likely (Very Good)', grade: 'A' });
      break;
    case 'likely':
      grade = 'B';
      rules.push({ id: 'PREM-002', domain: 'PREM', description: 'FFT response: Likely (Good)', grade: 'B' });
      break;
    case 'neither':
      grade = 'C';
      rules.push({ id: 'PREM-003', domain: 'PREM', description: 'FFT response: Neither good nor poor', grade: 'C' });
      break;
    case 'unlikely':
      grade = 'D';
      rules.push({ id: 'PREM-004', domain: 'PREM', description: 'FFT response: Unlikely (Poor)', grade: 'D' });
      break;
    case 'extremely_unlikely':
      grade = 'E';
      rules.push({ id: 'PREM-005', domain: 'PREM', description: 'FFT response: Extremely Unlikely (Very Poor)', grade: 'E' });
      break;
    default:
      grade = '';
      break;
  }

  return { grade, rules };
}

// ----------------------------------------------------------------------
// Operational domain — NHS Attendance Outcome + wait-time vs target
// ----------------------------------------------------------------------
//
// A = Attended AND wait <= target
// B = Attended AND wait <= 1.5x target (or attended, no wait data)
// C = Attended AND wait > 1.5x target
// D = Patient cancelled or rebooked
// E = DNA or provider-cancelled
// '' = missing attendance outcome code

function gradeOperational(data) {
  const { nhsAttendanceOutcome, waitTimeDays, serviceTargetDays } = data.operationalEfficiency;
  const rules = [];

  if (!nhsAttendanceOutcome) {
    return { grade: '', rules };
  }

  const dnaOrProviderCancelled =
    nhsAttendanceOutcome === 'patient_dna' || nhsAttendanceOutcome === 'provider_cancelled';
  const patientCancelled = nhsAttendanceOutcome === 'patient_cancelled';
  const attended = [
    'attended_discharged',
    'attended_follow_up',
    'attended_pifu',
    'attended_onward_referral'
  ].includes(nhsAttendanceOutcome);

  if (dnaOrProviderCancelled) {
    rules.push({
      id: 'OPS-004',
      domain: 'Operational',
      description: `Appointment outcome: ${nhsAttendanceOutcome === 'patient_dna' ? 'Did Not Attend' : 'Provider Cancelled'}`,
      grade: 'E'
    });
    return { grade: 'E', rules };
  }

  if (patientCancelled) {
    rules.push({ id: 'OPS-003', domain: 'Operational', description: 'Appointment cancelled or rebooked by patient', grade: 'D' });
    return { grade: 'D', rules };
  }

  if (attended) {
    if (waitTimeDays !== null && serviceTargetDays !== null && serviceTargetDays > 0) {
      const ratio = waitTimeDays / serviceTargetDays;
      if (ratio <= 1) {
        rules.push({ id: 'OPS-001', domain: 'Operational', description: `Attended within target (${waitTimeDays}d ≤ ${serviceTargetDays}d target)`, grade: 'A' });
        return { grade: 'A', rules };
      } else if (ratio <= 1.5) {
        rules.push({ id: 'OPS-002A', domain: 'Operational', description: `Attended within 1.5× target (${waitTimeDays}d vs ${serviceTargetDays}d target)`, grade: 'B' });
        return { grade: 'B', rules };
      } else {
        rules.push({ id: 'OPS-002B', domain: 'Operational', description: `Attended but wait exceeded 1.5× target (${waitTimeDays}d vs ${serviceTargetDays}d target)`, grade: 'C' });
        return { grade: 'C', rules };
      }
    } else {
      rules.push({ id: 'OPS-001B', domain: 'Operational', description: 'Attended; wait-time or target not recorded (assumed within range)', grade: 'B' });
      return { grade: 'B', rules };
    }
  }

  return { grade: '', rules };
}

export { gradeOrdinal, gradeMax, eq5dDimensionChange, eq5dSummary, promisGphTScore, promisMhTScore, calculateAge, calcWaitDays, gradeClinical, gradePROM, gradePREM, gradeOperational };
