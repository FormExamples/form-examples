import { DHI_ITEMS } from './types.js';

// Audio-Vestibular Assessment scoring rules.
//
// Two independent instruments are computed:
//
//   1) WHO pure-tone audiometry hearing-loss grade, derived from the
//      better-ear four-frequency average (0.5 + 1 + 2 + 4 kHz) / 4.
//      Cutoffs (better-ear PTA, dB HL):
//        <  20 -> normal
//        20-34 -> mild
//        35-49 -> moderate
//        50-64 -> moderately-severe
//        65-79 -> severe
//        >=80  -> profound
//
//   2) Dizziness Handicap Inventory (DHI), 25 items scored
//      Yes = 4, Sometimes = 2, No = 0; total range 0-100.
//      Cutoffs (DHI total):
//        0-16  -> no handicap
//        18-36 -> mild
//        38-52 -> moderate
//        >=54  -> severe
//
// The grader walks per-frequency rules to record which thresholds were
// supplied; this function module is the rule registry, with each rule
// being a per-frequency / per-ear measurement extractor.

/** Calculate a four-frequency PTA from {hz500, hz1000, hz2000, hz4000}. */
function calculatePtaFromThresholds(thr) {
  if (!thr) return null;
  const vs = [thr.hz500, thr.hz1000, thr.hz2000, thr.hz4000]
    .filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (vs.length === 0) return null;
  const sum = vs.reduce((a, b) => a + b, 0);
  return Math.round((sum / vs.length) * 10) / 10;
}

/** Classify a numeric better-ear PTA into a WHO hearing-loss grade. */
function classifyHearingLossGrade(pta) {
  if (pta === null || pta === undefined || Number.isNaN(pta)) return 'unknown';
  if (pta < 20) return 'normal';
  if (pta < 35) return 'mild';
  if (pta < 50) return 'moderate';
  if (pta < 65) return 'moderately-severe';
  if (pta < 80) return 'severe';
  return 'profound';
}

/** Friendly label for a hearing-loss grade. */
function hearingLossGradeLabel(grade) {
  switch (grade) {
    case 'normal':              return 'Normal hearing';
    case 'mild':                return 'Mild hearing loss';
    case 'moderate':            return 'Moderate hearing loss';
    case 'moderately-severe':   return 'Moderately severe hearing loss';
    case 'severe':              return 'Severe hearing loss';
    case 'profound':            return 'Profound hearing loss';
    default:                    return 'Not assessed';
  }
}

function hearingLossGradeClass(grade) {
  switch (grade) {
    case 'normal':              return 'grade-normal';
    case 'mild':                return 'grade-mild';
    case 'moderate':            return 'grade-moderate';
    case 'moderately-severe':   return 'grade-moderately-severe';
    case 'severe':              return 'grade-severe';
    case 'profound':            return 'grade-profound';
    default:                    return 'grade-unknown';
  }
}

/** Score one DHI answer ('yes' = 4, 'sometimes' = 2, 'no' = 0, '' = 0). */
function dhiAnswerScore(answer) {
  if (answer === 'yes') return 4;
  if (answer === 'sometimes') return 2;
  return 0;
}

/** Classify a numeric DHI total (0-100). */
function classifyDhiHandicap(total) {
  if (total <= 16) return 'no-handicap';
  if (total <= 36) return 'mild';
  if (total <= 52) return 'moderate';
  return 'severe';
}

function dhiHandicapLabel(level) {
  switch (level) {
    case 'no-handicap': return 'No handicap';
    case 'mild':        return 'Mild handicap';
    case 'moderate':    return 'Moderate handicap';
    case 'severe':      return 'Severe handicap';
    default:            return '';
  }
}

function dhiHandicapClass(level) {
  switch (level) {
    case 'no-handicap': return 'dhi-no-handicap';
    case 'mild':        return 'dhi-mild';
    case 'moderate':    return 'dhi-moderate';
    case 'severe':      return 'dhi-severe';
    default:            return '';
  }
}

export { calculatePtaFromThresholds, classifyHearingLossGrade, hearingLossGradeLabel, hearingLossGradeClass, dhiAnswerScore, classifyDhiHandicap, dhiHandicapLabel, dhiHandicapClass };
