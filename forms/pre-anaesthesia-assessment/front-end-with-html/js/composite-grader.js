import { applyAsaRules } from './asa-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { isHighRiskSurgery, maxAsa } from './types.js';

// Composite grader. Mirrors the SvelteKit `composite-grader.ts`,
// `mallampati-rules.ts`, `rcri-rules.ts`, `stopbang-rules.ts`, and
// `frailty-rules.ts` files. Pure functions; the public entry point is
// `calculateASA(data)` which returns the full GradingResult.

// ---------- Mallampati ----------

function applyMallampatiRules(data) {
  const mp = data.airway.mallampatiClass;
  if (!mp) return [];
  return [{
    ruleId: `R-MP-${mp}`,
    instrument: 'mallampati',
    grade: mp,
    category: 'airway',
    description: `Mallampati class ${mp}`
  }];
}

// ---------- RCRI (Lee 1999) ----------

const RCRI_COMPONENTS = [
  {
    id: 'R-RCRI-01',
    description: 'High-risk surgery (major or major-plus)',
    fires: (d) => isHighRiskSurgery(d.surgery.surgicalSeverity)
  },
  {
    id: 'R-RCRI-02',
    description: 'History of ischaemic heart disease',
    fires: (d) => d.cardiovascular.historyIhd === 'yes'
  },
  {
    id: 'R-RCRI-03',
    description: 'History of congestive heart failure',
    fires: (d) => d.cardiovascular.historyChf === 'yes'
  },
  {
    id: 'R-RCRI-04',
    description: 'History of cerebrovascular disease',
    fires: (d) => d.cardiovascular.historyStrokeTia === 'yes'
  },
  {
    id: 'R-RCRI-05',
    description: 'Insulin-requiring diabetes',
    fires: (d) => d.endocrine.diabetesOnInsulin === 'yes'
  },
  {
    id: 'R-RCRI-06',
    description: 'Pre-operative creatinine > 177 µmol/L',
    fires: (d) => (d.renalHepatic.creatinineUmolL ?? 0) > 177
  }
];

function applyRcriRules(data) {
  const firedRules = [];
  let score = 0;
  for (const c of RCRI_COMPONENTS) {
    if (c.fires(data)) {
      score += 1;
      firedRules.push({
        ruleId: c.id,
        instrument: 'rcri',
        grade: 'component',
        category: 'cardiovascular',
        description: c.description
      });
    }
  }
  return { score, firedRules };
}

// ---------- STOP-BANG (Chung 2008) ----------

const STOPBANG_ITEMS = [
  { id: 'R-SB-S', description: 'Loud snoring',           pick: (d) => d.airway.stopbangSnoring },
  { id: 'R-SB-T', description: 'Daytime tiredness',      pick: (d) => d.airway.stopbangTired },
  { id: 'R-SB-O', description: 'Observed apnoea',        pick: (d) => d.airway.stopbangObservedApnoea },
  { id: 'R-SB-P', description: 'Treated for hypertension', pick: (d) => d.airway.stopbangPressure },
  { id: 'R-SB-B', description: 'BMI > 35',               pick: (d) => d.airway.stopbangBmiGt35 },
  { id: 'R-SB-A', description: 'Age > 50',               pick: (d) => d.airway.stopbangAgeGt50 },
  { id: 'R-SB-N', description: 'Neck > 40 cm',           pick: (d) => d.airway.stopbangNeckGt40 },
  { id: 'R-SB-G', description: 'Male gender',            pick: (d) => d.airway.stopbangMale }
];

function applyStopBangRules(data) {
  const firedRules = [];
  let score = 0;
  for (const item of STOPBANG_ITEMS) {
    if (item.pick(data) === 'yes') {
      score += 1;
      firedRules.push({
        ruleId: item.id,
        instrument: 'stopbang',
        grade: 'component',
        category: 'airway',
        description: item.description
      });
    }
  }
  return { score, firedRules };
}

// ---------- Clinical Frailty Scale (Rockwood 2005) ----------

function applyFrailtyRules(data) {
  const cfs = data.functionalCapacity.clinicalFrailtyScale;
  if (cfs === null || cfs === undefined) return [];
  return [{
    ruleId: `R-CFS-${cfs}`,
    instrument: 'frailty',
    grade: String(cfs),
    category: 'functional',
    description: `Clinical Frailty Scale ${cfs}`
  }];
}

// ---------- Composite risk ----------

function computeCompositeRisk(asa, mallampati, rcri, stopbang, frailty, hasHighFlag) {
  if (asa === 'V' || asa === 'VI' || frailty === 9 || (asa === 'IV' && hasHighFlag)) {
    return 'critical';
  }
  if (
    asa === 'IV' ||
    asa === 'III' ||
    mallampati === 'III' ||
    mallampati === 'IV' ||
    rcri >= 2 ||
    stopbang >= 5 ||
    (frailty !== null && frailty >= 5)
  ) {
    return 'high';
  }
  if (
    asa === 'II' ||
    mallampati === 'II' ||
    rcri === 1 ||
    (stopbang >= 3 && stopbang <= 4) ||
    (frailty !== null && frailty >= 4)
  ) {
    return 'moderate';
  }
  return 'low';
}

/**
 * Public entry point. Returns the full GradingResult mirroring the
 * SvelteKit `calculateASA()` shape.
 */
function calculateASA(data) {
  const asaFired = applyAsaRules(data);
  const computedAsaGrade = asaFired.reduce(
    (acc, r) => maxAsa(acc, r.grade),
    'I'
  );

  const mallampatiFired = applyMallampatiRules(data);
  const { score: rcriScore, firedRules: rcriFired } = applyRcriRules(data);
  const { score: stopbangScore, firedRules: stopbangFired } = applyStopBangRules(data);
  const frailtyFired = applyFrailtyRules(data);
  const additionalFlags = detectAdditionalFlags
    ? detectAdditionalFlags(data)
    : [];

  const hasHighFlag = additionalFlags.some((f) => f.priority === 'high');
  const compositeRisk = computeCompositeRisk(
    computedAsaGrade,
    data.airway.mallampatiClass || '',
    rcriScore,
    stopbangScore,
    data.functionalCapacity.clinicalFrailtyScale,
    hasHighFlag
  );

  const asaEmergencySuffix =
    data.surgery.urgency === 'emergency' || data.surgery.urgency === 'immediate'
      ? 'E'
      : '';

  return {
    computedAsaGrade,
    finalAsaGrade: data.summary.finalAsaGrade || computedAsaGrade,
    asaEmergencySuffix,
    overrideReason: data.summary.overrideReason,
    mallampatiClass: data.airway.mallampatiClass,
    rcriScore,
    stopbangScore,
    frailtyScale: data.functionalCapacity.clinicalFrailtyScale,
    compositeRisk,
    firedRules: [
      ...asaFired,
      ...mallampatiFired,
      ...rcriFired,
      ...stopbangFired,
      ...frailtyFired
    ],
    additionalFlags
  };
}

export { applyMallampatiRules, applyRcriRules, applyStopBangRules, applyFrailtyRules, computeCompositeRisk, calculateASA };
