// Sample assessment data for the DTAC dashboard.
//
// One row per persona in examples/personas.json (outcome, counts and flag ids
// copied from each persona's `expected` grade, verified by bin/test-personas),
// so the offline sample data and the persona oracle cannot disagree. The
// dashboard falls back to these rows when the back end is offline.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: 'D001',
    date: '2026-09-01',
    assessment: 'all-met',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'meets',
    mandatoryMet: 34,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: [],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D002',
    date: '2026-09-01',
    assessment: 'not-a-medical-device-meets',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'meets',
    mandatoryMet: 33,
    mandatoryTotal: 33,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: [],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D003',
    date: '2026-09-01',
    assessment: 'conditional-partial-dpia',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'conditional',
    mandatoryMet: 33,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: [],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D004',
    date: '2026-09-01',
    assessment: 'advisory-not-met-still-meets',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'meets',
    mandatoryMet: 34,
    mandatoryTotal: 34,
    advisoryMet: 7,
    advisoryTotal: 13,
    flags: [],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D005',
    date: '2026-09-01',
    assessment: 'does-not-meet-security',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'does-not-meet',
    mandatoryMet: 32,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: ['F-PENTEST-001', 'F-MFA-001'],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D006',
    date: '2026-09-01',
    assessment: 'does-not-meet-clinical-safety',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'does-not-meet',
    mandatoryMet: 31,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: ['F-CSO-001', 'F-DCB0129-001', 'F-MEDDEV-001'],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D007',
    date: '2026-09-01',
    assessment: 'does-not-meet-accessibility',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'does-not-meet',
    mandatoryMet: 32,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: ['F-WCAG-001', 'F-A11Y-STATEMENT-001'],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D008',
    date: '2026-09-01',
    assessment: 'incomplete-blank',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'incomplete',
    mandatoryMet: 0,
    mandatoryTotal: 34,
    advisoryMet: 0,
    advisoryTotal: 13,
    flags: ['F-INCOMPLETE-001'],
    assessor: 'Alex Assessor'
  },
  {
    id: 'D009',
    date: '2026-09-01',
    assessment: 'incomplete-one-unanswered',
    supplier: 'Example Health Ltd',
    product: 'Example Care App',
    outcome: 'incomplete',
    mandatoryMet: 33,
    mandatoryTotal: 34,
    advisoryMet: 13,
    advisoryTotal: 13,
    flags: ['F-INCOMPLETE-001'],
    assessor: 'Alex Assessor'
  }
];

export { sampleAssessments };
