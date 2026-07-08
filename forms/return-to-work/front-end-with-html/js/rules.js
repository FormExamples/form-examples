// Declarative restriction-rule catalogue for the Return to Work engine.
//
// Ported byte-for-byte from the Svelte engine
// (`src/lib/engine/restriction-rules.ts`). Each fired rule contributes a
// severity grade; the most severe fired rule sets the overall restriction
// priority (max-grade rule). Grade 1 = routine, 2 = standard, 3 = restricted,
// 4 = high-risk. Rule IDs (RST-NNN) are stable and identical across every
// front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.ReturnToWork`.

(function () {
'use strict';
window.ReturnToWork =
  window.ReturnToWork || {};
const NS = window.ReturnToWork;

/** Count the number of enumerated workplace adjustments that are active. */
function countAdjustments(data) {
  const a = data.adjustments;
  const flags = [
    a.alteredHours,
    a.amendedDuties,
    a.workplaceAdaptations,
    a.noHeavyLifting,
    a.noDriving,
    a.noOperatingMachinery,
    a.noWorkingAtHeight,
    a.noLoneWorking,
    a.noNightShifts,
    a.noPatientContact,
    a.sedentaryOnly
  ];
  let n = flags.filter(Boolean).length;
  if (a.noExposure.trim() !== '') n++;
  if (a.screenBreakFrequency.trim() !== '') n++;
  if (a.additionalAdjustments.trim() !== '') n++;
  return n;
}

/**
 * Declarative restriction rules. Each fired rule contributes a severity grade;
 * the most severe fired rule sets the overall restriction priority.
 */
const restrictionRules = [
  // ─── PHASED RETURN / LOW-RISK ADJUSTMENTS (grade 2 standard) ────
  {
    id: 'RST-001',
    system: 'Phased return',
    description: 'Phased return to work in place',
    grade: 2,
    evaluate: (d) => d.phasedReturn.applicable === 'yes'
  },
  {
    id: 'RST-002',
    system: 'Hours',
    description: 'Altered hours requested',
    grade: 2,
    evaluate: (d) => d.adjustments.alteredHours
  },
  {
    id: 'RST-003',
    system: 'Workstation',
    description: 'Screen-break / reduced screen time adjustment',
    grade: 2,
    evaluate: (d) => d.adjustments.screenBreakFrequency.trim() !== ''
  },

  // ─── MODERATE-RISK ADJUSTMENTS (grade 3 restricted) ────────────
  {
    id: 'RST-010',
    system: 'Manual handling',
    description: 'No heavy lifting',
    grade: 3,
    evaluate: (d) => d.adjustments.noHeavyLifting
  },
  {
    id: 'RST-011',
    system: 'Driving',
    description: 'No driving at work',
    grade: 3,
    evaluate: (d) => d.adjustments.noDriving
  },
  {
    id: 'RST-012',
    system: 'Hours',
    description: 'No night shifts',
    grade: 3,
    evaluate: (d) => d.adjustments.noNightShifts
  },
  {
    id: 'RST-013',
    system: 'Duties',
    description: 'Sedentary duties only',
    grade: 3,
    evaluate: (d) => d.adjustments.sedentaryOnly
  },
  {
    id: 'RST-014',
    system: 'Duties',
    description: 'Two or more adjustments combined',
    grade: 3,
    evaluate: (d) => countAdjustments(d) >= 2
  },

  // ─── HIGH-RISK ADJUSTMENTS — formal risk assessment (grade 4) ───
  {
    id: 'RST-020',
    system: 'Height',
    description: 'No working at height',
    grade: 4,
    evaluate: (d) => d.adjustments.noWorkingAtHeight
  },
  {
    id: 'RST-021',
    system: 'Machinery',
    description: 'No operating machinery',
    grade: 4,
    evaluate: (d) => d.adjustments.noOperatingMachinery
  },
  {
    id: 'RST-022',
    system: 'Lone working',
    description: 'No lone working',
    grade: 4,
    evaluate: (d) => d.adjustments.noLoneWorking
  },
  {
    id: 'RST-023',
    system: 'Patient contact',
    description: 'No patient contact',
    grade: 4,
    evaluate: (d) => d.adjustments.noPatientContact
  },
  {
    id: 'RST-024',
    system: 'Exposure',
    description: 'No exposure to specified hazard (chemical / allergen / temperature)',
    grade: 4,
    evaluate: (d) => d.adjustments.noExposure.trim() !== ''
  },
  {
    id: 'RST-025',
    system: 'Safety-critical',
    description: 'Safety-critical role with active restriction',
    grade: 4,
    evaluate: (d) => d.job.safetyCritical === 'yes' && countAdjustments(d) >= 1
  }
];

Object.assign(NS, {
  countAdjustments,
  restrictionRules
});
})();
