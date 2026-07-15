import { eq5dSummary } from './rules.js';

// Flagged-issue detection for the Outpatient Outcome (OOCG) engine.
//
// Pure function returning flagged issues derived from the assessment data and
// the Clinical + PREM domain grades. Flag IDs and priority codes are stable and
// identical across every front-end and the back-end.
//
//   critical — safety-critical, immediate action required
//   high     — important for clinical follow-up
//   medium   — warrants review / further action
//   low      — data quality or minor operational concern

/**
 * Detect flagged issues.
 *
 * @param {object} data - the assessment data model
 * @param {string} clinicalGrade - the Clinical domain grade A–E ('' if none)
 * @param {string} premGrade - the PREM domain grade A–E ('' if none)
 * @returns {object[]} flagged issues, sorted critical > high > medium > low
 */
function detectFlaggedIssues(data, clinicalGrade, premGrade) {
  const flags = [];

  // ─── Critical: DNA or provider-cancelled ────────────────
  const outcome = data.operationalEfficiency.nhsAttendanceOutcome;
  if (outcome === 'patient_dna') {
    flags.push({
      id: 'FLAG-OPS-001',
      category: 'Operational',
      message: 'Patient Did Not Attend (DNA) — review and follow up required',
      priority: 'critical'
    });
  }
  if (outcome === 'provider_cancelled') {
    flags.push({
      id: 'FLAG-OPS-002',
      category: 'Operational',
      message: 'Appointment cancelled by provider — rebooking required',
      priority: 'critical'
    });
  }

  // ─── High: Clinical worsened or died ────────────────────
  const cls = data.clinicalOutcome.outcomeClassification;
  if (clinicalGrade === 'D') {
    flags.push({
      id: 'FLAG-CLIN-001',
      category: 'Clinical',
      message: `Clinical outcome: ${cls} — patient condition worsened`,
      priority: 'high'
    });
  }
  if (clinicalGrade === 'E') {
    flags.push({
      id: 'FLAG-CLIN-002',
      category: 'Clinical',
      message: 'Clinical outcome: Died — escalation and documentation required',
      priority: 'high'
    });
  }

  // ─── Medium: FFT Poor or Very Poor ──────────────────────
  if (premGrade === 'D') {
    flags.push({
      id: 'FLAG-PREM-001',
      category: 'Experience',
      message: 'Friends & Family Test: Poor — patient experience concern',
      priority: 'medium'
    });
  }
  if (premGrade === 'E') {
    flags.push({
      id: 'FLAG-PREM-002',
      category: 'Experience',
      message: 'Friends & Family Test: Very Poor — patient experience concern',
      priority: 'medium'
    });
  }

  // ─── Medium: Any PROM instrument worsened ───────────────
  const eq5d = eq5dSummary(data.promEq5d5l);
  if (eq5d.worsened > 0) {
    flags.push({
      id: 'FLAG-PROM-001',
      category: 'PROM',
      message: `EQ-5D-5L: ${eq5d.worsened} dimension(s) worsened since last assessment`,
      priority: 'medium'
    });
  }

  const grc = data.promGrc.globalRatingOfChange;
  if (grc !== null && grc < 0) {
    flags.push({
      id: 'FLAG-PROM-002',
      category: 'PROM',
      message: `Global Rating of Change: ${grc} (worsened)`,
      priority: 'medium'
    });
  }

  // ─── Low/Medium: Wait time vs target ────────────────────
  const { waitTimeDays, serviceTargetDays } = data.operationalEfficiency;
  if (waitTimeDays !== null && serviceTargetDays !== null && serviceTargetDays > 0) {
    const ratio = waitTimeDays / serviceTargetDays;
    if (ratio > 1.5) {
      flags.push({
        id: 'FLAG-OPS-003',
        category: 'Operational',
        message: `Wait time (${waitTimeDays}d) exceeded 1.5× service target (${serviceTargetDays}d)`,
        priority: 'medium'
      });
    } else if (ratio > 1) {
      flags.push({
        id: 'FLAG-OPS-004',
        category: 'Operational',
        message: `Wait time (${waitTimeDays}d) exceeded service target (${serviceTargetDays}d)`,
        priority: 'low'
      });
    }
  }

  // ─── Low: Missing-data quality flags ────────────────────
  const allEq5dNull =
    data.promEq5d5l.afterMobility === null &&
    data.promEq5d5l.afterSelfCare === null &&
    data.promEq5d5l.afterUsualActivities === null &&
    data.promEq5d5l.afterPainDiscomfort === null &&
    data.promEq5d5l.afterAnxietyDepression === null;

  if (allEq5dNull) {
    flags.push({
      id: 'FLAG-DQ-001',
      category: 'Data Quality',
      message: 'EQ-5D-5L after-treatment responses not recorded',
      priority: 'low'
    });
  }

  if (grc === null) {
    flags.push({
      id: 'FLAG-DQ-002',
      category: 'Data Quality',
      message: 'Global Rating of Change (GRC) not recorded',
      priority: 'low'
    });
  }

  if (!data.premFft.fftResponse || data.premFft.fftResponse === 'dont_know') {
    flags.push({
      id: 'FLAG-DQ-003',
      category: 'Data Quality',
      message: data.premFft.fftResponse === 'dont_know'
        ? "FFT response: Don't Know — cannot determine PREM grade"
        : 'Friends & Family Test (FFT) response not recorded',
      priority: 'low'
    });
  }

  if (!outcome) {
    flags.push({
      id: 'FLAG-DQ-004',
      category: 'Data Quality',
      message: 'NHS Attendance Outcome code not recorded',
      priority: 'low'
    });
  }

  // Sort: critical > high > medium > low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
