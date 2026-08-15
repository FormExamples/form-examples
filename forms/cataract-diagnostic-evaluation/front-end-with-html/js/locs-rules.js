// LOCS III (Lens Opacities Classification System III) grading rules and the
// surgical-candidacy computation for the Cataract Diagnostic Evaluation.
//
// LOCS III is published by Chylack et al., Arch Ophthalmol 1993, and is a
// continuous four-subscale grading scale read against standard photographs.
// It does not itself define a severity band. The severity band computed here
// is this form's own operational simplification for surgical-candidacy
// triage — see ../../doc/locs-iii-grading.md.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.
// This is the vanilla-JS mirror of
// ../../front-end-with-svelte/src/lib/engine/locs-rules.ts — same rule IDs,
// same thresholds.

/** Coerce a possibly-empty numeric field to a number or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Build a fired-rule record in the shape the audit trail stores. */
function rule(ruleId, instrument, component, score, band, category, description) {
  return { ruleId, instrument, component, score, band, category, description };
}

/**
 * Age in whole years at the assessment date, or null when either date is
 * unknown. The assessment date is passed in rather than read from the clock
 * so the engine stays pure.
 */
function ageInYears(birthDate, assessmentDate) {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  const at = assessmentDate ? new Date(assessmentDate) : null;
  if (Number.isNaN(born.getTime()) || !at || Number.isNaN(at.getTime())) return null;
  let age = at.getFullYear() - born.getFullYear();
  const m = at.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < born.getDate())) age -= 1;
  return age;
}

/** Title-case a kebab-case value for display. */
function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Best-corrected visual acuity, LogMAR, at or better than 6/12. */
const LOGMAR_6_12 = 0.3;
/** Best-corrected visual acuity, LogMAR, at or worse than 6/18. */
const LOGMAR_6_18 = 0.48;

/** Severity-band order, worst last, for max-grade comparisons. */
const SEVERITY_ORDER = ['', 'mild', 'moderate', 'severe'];

/** Surgical-candidacy order, worst last, for max-grade comparisons. */
const CANDIDACY_ORDER = ['', 'not-indicated', 'consider', 'indicated', 'urgent-referral'];

/** Return whichever of two severity bands is worse. */
function worseSeverity(a, b) {
  return SEVERITY_ORDER.indexOf(b) > SEVERITY_ORDER.indexOf(a) ? b : a;
}

/** Return whichever of two surgical-candidacy bands is worse. */
function worseCandidacy(a, b) {
  return CANDIDACY_ORDER.indexOf(b) > CANDIDACY_ORDER.indexOf(a) ? b : a;
}

/**
 * Compute the LOCS III severity band for one eye from its four subscores.
 *
 * `severe`   if any of NO, NC, C, P >= 5.0
 * `moderate` if not severe and any of NO, NC, C, P is 3.0-4.9
 * `mild`     if all four (recorded) subscores are below 3.0
 * `''`       if no subscore is recorded
 */
function computeLocsIIISeverity(scores) {
  const values = [scores.no, scores.nc, scores.c, scores.p].filter((v) => v !== null);
  if (values.length === 0) return '';
  if (values.some((v) => v >= 5.0)) return 'severe';
  if (values.some((v) => v >= 3.0)) return 'moderate';
  return 'mild';
}

/** Extract one eye's four LOCS III subscores from the slit-lamp section. */
function eyeLocsScores(s, eye) {
  if (eye === 'right') {
    return {
      no: num(s.locsIiiNoRight),
      nc: num(s.locsIiiNcRight),
      c: num(s.locsIiiCRight),
      p: num(s.locsIiiPRight)
    };
  }
  return {
    no: num(s.locsIiiNoLeft),
    nc: num(s.locsIiiNcLeft),
    c: num(s.locsIiiCLeft),
    p: num(s.locsIiiPLeft)
  };
}

/** Compute the LOCS III severity band for both eyes, with an audit trail. */
function scoreLocsIII(data) {
  const firedRules = [];
  const right = eyeLocsScores(data.slitLamp, 'right');
  const left = eyeLocsScores(data.slitLamp, 'left');
  const severityRight = computeLocsIIISeverity(right);
  const severityLeft = computeLocsIIISeverity(left);

  if (severityRight) {
    firedRules.push(
      rule(
        `R-LOCS-SEVERITY-RIGHT-${severityRight.toUpperCase()}`,
        'locs-iii',
        'severity-right',
        null,
        severityRight,
        'slit-lamp',
        `Right eye LOCS III severity band is ${severityRight} (NO ${right.no ?? '–'}, NC ${right.nc ?? '–'}, C ${right.c ?? '–'}, P ${right.p ?? '–'}).`
      )
    );
  }
  if (severityLeft) {
    firedRules.push(
      rule(
        `R-LOCS-SEVERITY-LEFT-${severityLeft.toUpperCase()}`,
        'locs-iii',
        'severity-left',
        null,
        severityLeft,
        'slit-lamp',
        `Left eye LOCS III severity band is ${severityLeft} (NO ${left.no ?? '–'}, NC ${left.nc ?? '–'}, C ${left.c ?? '–'}, P ${left.p ?? '–'}).`
      )
    );
  }

  return { severityRight, severityLeft, firedRules };
}

/** Whether best-corrected acuity in either eye is worse than 6/12 (LogMAR > 0.30). */
function acuityWorseThan6_12(a) {
  const right = num(a.bestCorrectedVaLogmarRight);
  const left = num(a.bestCorrectedVaLogmarLeft);
  return (right !== null && right > LOGMAR_6_12) || (left !== null && left > LOGMAR_6_12);
}

/** Whether best-corrected acuity in either eye is worse than 6/18 (LogMAR >= 0.48). */
function acuityWorseThan6_18(a) {
  const right = num(a.bestCorrectedVaLogmarRight);
  const left = num(a.bestCorrectedVaLogmarLeft);
  return (right !== null && right >= LOGMAR_6_18) || (left !== null && left >= LOGMAR_6_18);
}

/** Whether best-corrected acuity is recorded and 6/12 or better in both eyes. */
function acuity6_12OrBetterBothEyes(a) {
  const right = num(a.bestCorrectedVaLogmarRight);
  const left = num(a.bestCorrectedVaLogmarLeft);
  return right !== null && left !== null && right <= LOGMAR_6_12 && left <= LOGMAR_6_12;
}

/**
 * Compute the surgical-candidacy recommendation from LOCS III severity,
 * best-corrected visual acuity, and glare testing. Evaluated as a max-grade
 * accumulation: later, worse findings always override earlier, milder ones.
 * Safety-flag-driven `urgent-referral` is applied by the caller
 * (composite-grader.js), which knows about the fired safety flags.
 */
function computeSurgicalCandidacy(severityRight, severityLeft, acuity, glare) {
  const firedRules = [];
  let candidacy = 'not-indicated';

  const moderateEye = severityRight === 'moderate' || severityLeft === 'moderate';
  const severeEye = severityRight === 'severe' || severityLeft === 'severe';
  const worse6_12 = acuityWorseThan6_12(acuity);
  const worse6_18 = acuityWorseThan6_18(acuity);
  const glareSevere = glare.glareFunctionalImpact === 'severe';

  if (moderateEye) {
    candidacy = worseCandidacy(candidacy, 'consider');
    firedRules.push(
      rule('R-CANDIDACY-MODERATE-LOCS', 'composite', 'severity', null, 'consider', 'surgical candidacy',
        'A moderate LOCS III severity band is present in at least one eye.')
    );
  }
  if (worse6_12) {
    candidacy = worseCandidacy(candidacy, 'consider');
    firedRules.push(
      rule('R-CANDIDACY-ACUITY-6-12', 'acuity', 'best-corrected', null, 'consider', 'surgical candidacy',
        'Best-corrected visual acuity is worse than 6/12 in at least one eye.')
    );
  }
  if (severeEye) {
    candidacy = worseCandidacy(candidacy, 'indicated');
    firedRules.push(
      rule('R-CANDIDACY-SEVERE-LOCS', 'composite', 'severity', null, 'indicated', 'surgical candidacy',
        'A severe LOCS III severity band is present in at least one eye.')
    );
  }
  if (worse6_18) {
    candidacy = worseCandidacy(candidacy, 'indicated');
    firedRules.push(
      rule('R-CANDIDACY-ACUITY-6-18', 'acuity', 'best-corrected', null, 'indicated', 'surgical candidacy',
        'Best-corrected visual acuity is worse than 6/18 in at least one eye.')
    );
  }
  if (glareSevere) {
    candidacy = worseCandidacy(candidacy, 'indicated');
    firedRules.push(
      rule('R-CANDIDACY-GLARE-SEVERE', 'glare', 'functional-impact', null, 'indicated', 'surgical candidacy',
        'Glare testing shows a severe functional impact, an independent indication for surgery.')
    );
  }

  return { candidacy, firedRules };
}

/** Functional/quality-of-life composite score, 0-12, or null if unanswered. */
function computeFunctionalImpactScore(data) {
  const reading = num(data.functional.functionalDifficultyReading);
  const driving = num(data.functional.functionalDifficultyDriving);
  const daily = num(data.functional.functionalDifficultyDailyActivities);
  if (reading === null && driving === null && daily === null) return null;
  return (reading ?? 0) + (driving ?? 0) + (daily ?? 0);
}

export {
  LOGMAR_6_12,
  LOGMAR_6_18,
  SEVERITY_ORDER,
  CANDIDACY_ORDER,
  worseSeverity,
  worseCandidacy,
  computeLocsIIISeverity,
  eyeLocsScores,
  scoreLocsIII,
  acuityWorseThan6_12,
  acuityWorseThan6_18,
  acuity6_12OrBetterBothEyes,
  computeSurgicalCandidacy,
  computeFunctionalImpactScore,
  ageInYears,
  titleCase,
  num,
  rule
};
