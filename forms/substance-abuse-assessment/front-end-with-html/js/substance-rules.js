import { calculateAuditScore, calculateDastScore } from './utils.js';

// Declarative substance abuse grading rules. Each rule evaluates patient
// data and returns true if the condition is present. Grade scale:
//   1 = mild finding, 2 = moderate, 3 = significant, 4 = severe/critical.
//
// Mirrors `src/lib/engine/substance-rules.ts` from the SvelteKit reference.

const substanceRules = [
  // ─── AUDIT ALCOHOL SCREENING ──────────────────────────────────
  {
    id: 'AUDIT-001',
    category: 'Alcohol',
    description: 'AUDIT score low risk (0-7)',
    grade: 1,
    evaluate: function (d) {
      const s = calculateAuditScore(d.alcoholUseAudit);
      return s >= 1 && s <= 7;
    }
  },
  {
    id: 'AUDIT-002',
    category: 'Alcohol',
    description: 'AUDIT score hazardous (8-15)',
    grade: 2,
    evaluate: function (d) {
      const s = calculateAuditScore(d.alcoholUseAudit);
      return s >= 8 && s <= 15;
    }
  },
  {
    id: 'AUDIT-003',
    category: 'Alcohol',
    description: 'AUDIT score harmful (16-19)',
    grade: 3,
    evaluate: function (d) {
      const s = calculateAuditScore(d.alcoholUseAudit);
      return s >= 16 && s <= 19;
    }
  },
  {
    id: 'AUDIT-004',
    category: 'Alcohol',
    description: 'AUDIT score dependence likely (20-40)',
    grade: 4,
    evaluate: function (d) {
      const s = calculateAuditScore(d.alcoholUseAudit);
      return s >= 20;
    }
  },
  {
    id: 'AUDIT-005',
    category: 'Alcohol',
    description: 'Morning drinking (AUDIT Q6 elevated)',
    grade: 3,
    evaluate: function (d) { return d.alcoholUseAudit.auditQ6MorningDrinking >= 2; }
  },
  {
    id: 'AUDIT-006',
    category: 'Alcohol',
    description: 'Alcohol-related injury (AUDIT Q9 positive)',
    grade: 3,
    evaluate: function (d) { return d.alcoholUseAudit.auditQ9Injury >= 2; }
  },

  // ─── DAST-10 DRUG SCREENING ──────────────────────────────────
  {
    id: 'DAST-001',
    category: 'Drug',
    description: 'DAST score low level (1-2)',
    grade: 1,
    evaluate: function (d) {
      const s = calculateDastScore(d.drugUseDast);
      return s >= 1 && s <= 2;
    }
  },
  {
    id: 'DAST-002',
    category: 'Drug',
    description: 'DAST score moderate level (3-5)',
    grade: 2,
    evaluate: function (d) {
      const s = calculateDastScore(d.drugUseDast);
      return s >= 3 && s <= 5;
    }
  },
  {
    id: 'DAST-003',
    category: 'Drug',
    description: 'DAST score substantial level (6-8)',
    grade: 3,
    evaluate: function (d) {
      const s = calculateDastScore(d.drugUseDast);
      return s >= 6 && s <= 8;
    }
  },
  {
    id: 'DAST-004',
    category: 'Drug',
    description: 'DAST score severe level (9-10)',
    grade: 4,
    evaluate: function (d) {
      const s = calculateDastScore(d.drugUseDast);
      return s >= 9;
    }
  },
  {
    id: 'DAST-005',
    category: 'Drug',
    description: 'Poly-drug use',
    grade: 3,
    evaluate: function (d) { return d.drugUseDast.dastQ2PolyDrug === 'yes'; }
  },
  {
    id: 'DAST-006',
    category: 'Drug',
    description: 'Illegal activities to obtain drugs',
    grade: 3,
    evaluate: function (d) { return d.drugUseDast.dastQ8IllegalActivities === 'yes'; }
  },

  // ─── SUBSTANCE USE HISTORY ──────────────────────────────────
  {
    id: 'SUH-001',
    category: 'Substance History',
    description: 'Intravenous drug use',
    grade: 3,
    evaluate: function (d) { return d.substanceUseHistory.ivDrugUse === 'yes'; }
  },
  {
    id: 'SUH-002',
    category: 'Substance History',
    description: 'Needle sharing',
    grade: 4,
    evaluate: function (d) { return d.substanceUseHistory.needleSharing === 'yes'; }
  },
  {
    id: 'SUH-003',
    category: 'Substance History',
    description: 'Daily substance use',
    grade: 3,
    evaluate: function (d) { return d.substanceUseHistory.frequencyOfUse === 'daily'; }
  },
  {
    id: 'SUH-004',
    category: 'Substance History',
    description: 'Long-term use (>10 years)',
    grade: 2,
    evaluate: function (d) { return d.substanceUseHistory.durationOfUse === 'greater-10-years'; }
  },
  {
    id: 'SUH-005',
    category: 'Substance History',
    description: 'Actively using',
    grade: 2,
    evaluate: function (d) { return d.substanceUseHistory.currentUseStatus === 'actively-using'; }
  },

  // ─── WITHDRAWAL ──────────────────────────────────────────────
  {
    id: 'WD-001',
    category: 'Withdrawal',
    description: 'Currently in withdrawal',
    grade: 4,
    evaluate: function (d) { return d.withdrawalAssessment.currentlyInWithdrawal === 'yes'; }
  },
  {
    id: 'WD-002',
    category: 'Withdrawal',
    description: 'History of withdrawal seizures',
    grade: 4,
    evaluate: function (d) { return d.withdrawalAssessment.seizureHistory === 'yes'; }
  },
  {
    id: 'WD-003',
    category: 'Withdrawal',
    description: 'History of delirium tremens',
    grade: 4,
    evaluate: function (d) { return d.withdrawalAssessment.deliriumTremensHistory === 'yes'; }
  },
  {
    id: 'WD-004',
    category: 'Withdrawal',
    description: 'Hallucinations during withdrawal',
    grade: 4,
    evaluate: function (d) { return d.withdrawalAssessment.hallucinations === 'yes'; }
  },
  {
    id: 'WD-005',
    category: 'Withdrawal',
    description: 'Severe withdrawal symptoms',
    grade: 4,
    evaluate: function (d) { return d.withdrawalAssessment.withdrawalSeverity === 'severe'; }
  },

  // ─── MENTAL HEALTH ──────────────────────────────────────────
  {
    id: 'MH-001',
    category: 'Mental Health',
    description: 'Current suicidal ideation',
    grade: 4,
    evaluate: function (d) { return d.mentalHealthComorbidities.suicidalIdeationCurrent === 'yes'; }
  },
  {
    id: 'MH-002',
    category: 'Mental Health',
    description: 'Previous suicide attempts',
    grade: 3,
    evaluate: function (d) { return d.mentalHealthComorbidities.previousSuicideAttempts === 'yes'; }
  },
  {
    id: 'MH-003',
    category: 'Mental Health',
    description: 'Severe depression',
    grade: 3,
    evaluate: function (d) {
      return d.mentalHealthComorbidities.depression === 'yes' &&
        d.mentalHealthComorbidities.depressionSeverity === 'severe';
    }
  },
  {
    id: 'MH-004',
    category: 'Mental Health',
    description: 'Psychosis',
    grade: 3,
    evaluate: function (d) { return d.mentalHealthComorbidities.psychosis === 'yes'; }
  },
  {
    id: 'MH-005',
    category: 'Mental Health',
    description: 'Comorbid depression (mild/moderate)',
    grade: 2,
    evaluate: function (d) {
      return d.mentalHealthComorbidities.depression === 'yes' &&
        d.mentalHealthComorbidities.depressionSeverity !== 'severe' &&
        d.mentalHealthComorbidities.depressionSeverity !== '';
    }
  },
  {
    id: 'MH-006',
    category: 'Mental Health',
    description: 'PTSD',
    grade: 2,
    evaluate: function (d) { return d.mentalHealthComorbidities.ptsd === 'yes'; }
  },

  // ─── PHYSICAL HEALTH ────────────────────────────────────────
  {
    id: 'PH-001',
    category: 'Physical Health',
    description: 'Overdose history',
    grade: 4,
    evaluate: function (d) { return d.physicalHealthImpact.overdoseHistory === 'yes'; }
  },
  {
    id: 'PH-002',
    category: 'Physical Health',
    description: 'Liver cirrhosis',
    grade: 3,
    evaluate: function (d) {
      return d.physicalHealthImpact.liverDisease === 'yes' &&
        d.physicalHealthImpact.liverDiseaseType === 'cirrhosis';
    }
  },
  {
    id: 'PH-003',
    category: 'Physical Health',
    description: 'HIV positive',
    grade: 2,
    evaluate: function (d) { return d.physicalHealthImpact.hivStatus === 'positive'; }
  },
  {
    id: 'PH-004',
    category: 'Physical Health',
    description: 'Hepatitis C positive',
    grade: 2,
    evaluate: function (d) { return d.physicalHealthImpact.hepatitisC === 'yes'; }
  },

  // ─── SOCIAL & LEGAL ─────────────────────────────────────────
  {
    id: 'SL-001',
    category: 'Social',
    description: 'Homeless',
    grade: 3,
    evaluate: function (d) { return d.socialLegalImpact.housingStatus === 'homeless'; }
  },
  {
    id: 'SL-002',
    category: 'Social',
    description: 'Children safeguarding concerns',
    grade: 4,
    evaluate: function (d) { return d.socialLegalImpact.childrenSafeguardingConcerns === 'yes'; }
  },
  {
    id: 'SL-003',
    category: 'Social',
    description: 'Domestic violence involvement',
    grade: 3,
    evaluate: function (d) { return d.socialLegalImpact.domesticViolence === 'yes'; }
  },
  {
    id: 'SL-004',
    category: 'Social',
    description: 'No social support',
    grade: 2,
    evaluate: function (d) { return d.socialLegalImpact.socialSupport === 'none'; }
  }
];

export { substanceRules };
