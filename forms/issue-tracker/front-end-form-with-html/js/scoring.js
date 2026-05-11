// Issue Tracker — vanilla JavaScript port of the TypeScript scoring engine.
//
// Mirrors the Vitest-tested engine in
// ../../front-end-form-with-svelte/src/lib/engine/.
//
// Loaded as a classic <script> (no type="module") so the page works via
// file://. Exposes its API through the global `IssueTracker` namespace.

(function (global) {
'use strict';

const BAND_RANK = { low: 0, moderate: 1, high: 2, critical: 3 };
const BAND_BY_RANK = ['low', 'moderate', 'high', 'critical'];

function maxBand(...bands) {
  if (bands.length === 0) return 'low';
  let worst = 0;
  for (const b of bands) if (BAND_RANK[b] > worst) worst = BAND_RANK[b];
  return BAND_BY_RANK[worst];
}

const SEVERITY_LABELS = {
  1: 'minimal impact', 2: 'minor impact', 3: 'moderate impact',
  4: 'major impact', 5: 'catastrophic impact',
};

const HARM_LABELS = {
  0: 'no harm', 1: 'low harm', 2: 'moderate harm',
  3: 'severe harm', 4: 'fatal',
};

const FAILURE_DESCRIPTIONS = {
  A: 'catastrophic — multiple fatalities, loss of system',
  B: 'hazardous — large negative impact on safety or performance',
  C: 'major — significant reduction in safety margin or workload increase',
  D: 'minor — slight reduction in safety margin',
  E: 'no effect',
};

const FAILURE_BAND = { A: 'critical', B: 'high', C: 'moderate', D: 'low', E: 'low' };

const MOSCOW_LABELS = {
  1: 'must have', 2: 'should have', 3: 'could have', 4: "won't have",
};

function gradePriority(rank) {
  if (rank === null) return { band: 'low', firedRules: [] };
  let band;
  if (rank <= 1) band = 'critical';
  else if (rank === 2) band = 'high';
  else if (rank === 3) band = 'moderate';
  else band = 'low';
  return {
    band,
    firedRules: [{
      ruleId: `R-PRIORITY-${rank}`, instrument: 'priority',
      grade: String(rank), category: 'workflow',
      description: `Priority rank ${rank}.`, band,
    }],
  };
}

function gradeSeverity(sev) {
  if (sev === null) return { band: 'low', firedRules: [] };
  let band;
  if (sev >= 5) band = 'critical';
  else if (sev === 4) band = 'high';
  else if (sev === 3) band = 'moderate';
  else band = 'low';
  return {
    band,
    firedRules: [{
      ruleId: `R-SEVERITY-${sev}`, instrument: 'severity',
      grade: String(sev), category: 'impact',
      description: `Severity of impact ${sev} — ${SEVERITY_LABELS[sev]}.`, band,
    }],
  };
}

function gradeMagnitude(mag) {
  if (mag === null) return { band: 'low', firedRules: [] };
  let band;
  if (mag >= 9) band = 'critical';
  else if (mag >= 6) band = 'high';
  else if (mag >= 3) band = 'moderate';
  else band = 'low';
  return {
    band,
    firedRules: [{
      ruleId: `R-MAGNITUDE-${mag}`, instrument: 'magnitude',
      grade: String(mag), category: 'damage',
      description: `Magnitude of damage ${mag} on a 1-10 Richter-style scale.`, band,
    }],
  };
}

function gradeHarm(harm) {
  if (harm === null) return { band: 'low', firedRules: [] };
  let band;
  if (harm >= 3) band = 'critical';
  else if (harm === 2) band = 'high';
  else if (harm === 1) band = 'moderate';
  else band = 'low';
  return {
    band,
    firedRules: [{
      ruleId: `R-HARM-${harm}`, instrument: 'harm',
      grade: String(harm), category: 'patient-safety',
      description: `NHS LFPSE harm grade ${harm} — ${HARM_LABELS[harm]}.`, band,
    }],
  };
}

function gradeFailure(cond) {
  if (!cond) return { band: 'low', firedRules: [] };
  const band = FAILURE_BAND[cond];
  return {
    band,
    firedRules: [{
      ruleId: `R-FAILURE-${cond}`, instrument: 'failure',
      grade: cond, category: 'system-safety',
      description: `Failure condition ${cond} — ${FAILURE_DESCRIPTIONS[cond]}.`, band,
    }],
  };
}

function gradeMoscow(m) {
  if (m === null) return { band: 'low', firedRules: [] };
  let band;
  if (m === 1) band = 'high';
  else if (m === 2) band = 'moderate';
  else band = 'low';
  return {
    band,
    firedRules: [{
      ruleId: `R-MOSCOW-${m}`, instrument: 'moscow',
      grade: String(m), category: 'requirement',
      description: `MoSCoW classification ${m} — ${MOSCOW_LABELS[m]}.`, band,
    }],
  };
}

function gradeFrequency(f) {
  if (f === null) return { band: 'low', firedRules: [] };
  let band;
  if (f >= 75) band = 'critical';
  else if (f >= 25) band = 'high';
  else if (f >= 5) band = 'moderate';
  else band = 'low';
  const pct = Number.isInteger(f) ? `${f}%` : `${f.toFixed(2)}%`;
  return {
    band,
    firedRules: [{
      ruleId: `R-FREQUENCY-${Math.round(f)}`, instrument: 'frequency',
      grade: pct, category: 'reach',
      description: `Frequency of occurrence ${pct} of usage affected.`, band,
    }],
  };
}

const REGULATORY_CATEGORIES = new Set([
  'clinical-safety', 'data-protection', 'workplace-safety',
  'medical-device', 'regulatory',
]);

function computeFlags(data) {
  const out = [];
  const s = data.scores;
  if (s.scoreByHarmGrade === 4) {
    out.push({
      flagId: 'F-HARM-FATAL-001', category: 'harm-fatal', priority: 'high',
      description: 'NHS LFPSE harm grade 4 (fatal).',
      suggestedAction: 'Escalate to LFPSE; notify the trust patient-safety lead immediately.',
    });
  }
  if (s.scoreByFailureCondition === 'A') {
    out.push({
      flagId: 'F-FAILURE-A-001', category: 'failure-catastrophic', priority: 'high',
      description: 'FAA / EASA failure condition Level A (catastrophic).',
      suggestedAction: 'Trigger incident bridge; notify safety officer; consider system shutdown.',
    });
  }
  if (s.scoreBySeverityOfImpact === 5) {
    out.push({
      flagId: 'F-SEVERITY-5-001', category: 'severity-catastrophic', priority: 'high',
      description: 'Severity of impact 5 (catastrophic).',
      suggestedAction: 'Escalate to executive on-call; prepare customer communication.',
    });
  }
  if (s.scoreByMagnitudeOfDamage === 10) {
    out.push({
      flagId: 'F-MAGNITUDE-10-001', category: 'magnitude-total-destruction', priority: 'high',
      description: 'Magnitude of damage 10 (total destruction).',
      suggestedAction: 'Initiate disaster-recovery plan; preserve evidence for forensics.',
    });
  }
  if (s.scoreByFrequencyPercent !== null && s.scoreByFrequencyPercent >= 95) {
    out.push({
      flagId: 'F-FREQUENCY-95-001', category: 'frequency-universal', priority: 'high',
      description: `Frequency ${s.scoreByFrequencyPercent}% — effectively universal impact.`,
      suggestedAction: 'Treat as full outage; activate status page and on-call rotation.',
    });
  }
  if (s.scoreByMoscowRequirement === 1) {
    out.push({
      flagId: 'F-MOSCOW-MUST-001', category: 'requirement-mandatory', priority: 'medium',
      description: 'MoSCoW classification "must have".',
      suggestedAction: 'Hold release until resolved; do not defer.',
    });
  }
  if (
    REGULATORY_CATEGORIES.has(data.reporter.issueCategory) &&
    s.scoreByHarmGrade !== null && s.scoreByHarmGrade >= 2
  ) {
    out.push({
      flagId: 'F-REGULATORY-001', category: 'regulatory', priority: 'high',
      description: `Issue category "${data.reporter.issueCategory}" with harm ≥ 2 — regulatory reporting may apply.`,
      suggestedAction: 'Notify compliance / legal; prepare LFPSE / ICO / RIDDOR / MHRA report as appropriate.',
    });
  }
  return out;
}

function gradeIssue(data) {
  const s = data.scores;
  const priority = gradePriority(s.scoreByPriorityRank);
  const severity = gradeSeverity(s.scoreBySeverityOfImpact);
  const magnitude = gradeMagnitude(s.scoreByMagnitudeOfDamage);
  const harm = gradeHarm(s.scoreByHarmGrade);
  const failure = gradeFailure(s.scoreByFailureCondition);
  const moscow = gradeMoscow(s.scoreByMoscowRequirement);
  const frequency = gradeFrequency(s.scoreByFrequencyPercent);

  const compositeBand = maxBand(
    priority.band, severity.band, magnitude.band, harm.band,
    failure.band, moscow.band, frequency.band,
  );

  const firedRules = [
    ...priority.firedRules,
    ...severity.firedRules,
    ...magnitude.firedRules,
    ...harm.firedRules,
    ...failure.firedRules,
    ...moscow.firedRules,
    ...frequency.firedRules,
    {
      ruleId: `R-COMPOSITE-${compositeBand.toUpperCase()}`,
      instrument: 'composite', grade: compositeBand, category: 'composite',
      description: `Composite priority is ${compositeBand} — the worst band across all seven instruments.`,
      band: compositeBand,
    },
  ];

  return {
    ...s,
    compositePriority: compositeBand,
    firedRules,
    additionalFlags: computeFlags(data),
  };
}

global.IssueTracker = { gradeIssue, maxBand };

})(typeof window !== 'undefined' ? window : globalThis);
