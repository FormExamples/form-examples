import personasFile from './personas.json';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { gradeFitNote } from '#lib/engine/fit-note-grader.js';
import type { DashboardRow, FitNoteAssessment, FitNoteEngineState } from '#lib/engine/types.js';

/** A sample fit note: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  data: FitNoteAssessment;
}

// Synthetic placeholder identities, one per persona in
// examples/personas.json (same order and ids as the HTML front-end's
// js/data.js), so the offline sample data and the persona oracle agree.
const IDENTITIES: Array<[string, string, string]> = [
  ['Smith, Alice', 'Northern Rail', 'Dr A Shah'],
  ['Jones, Bob', 'City Council', 'Dr M Okafor'],
  ['Lee, Carol', 'Acme Logistics', 'Dr A Shah'],
  ['Brown, David', 'Greenfield School', 'Dr M Okafor'],
  ['Khan, Eva', 'Harbour Cafe', 'Dr A Shah'],
  ['Garcia, Frank', 'Metro Bank', 'Dr M Okafor'],
  ['Nguyen, Grace', 'Oakwood Care', 'Dr A Shah'],
  ['Patel, Hari', 'Brightside Retail', 'Dr M Okafor'],
  ['Evans, Isla', 'Tech Works Ltd', 'Dr A Shah'],
  ['Murphy, Jack', 'Riverside Farm', 'Dr M Okafor'],
  ['Wilson, Kate', 'County Hospital', 'Dr A Shah'],
  ['Taylor, Liam', 'Cityline Buses', 'Dr M Okafor']
];

/** Sample fit notes `FN001..FN012`, one per persona. */
export const sampleAssessments: SampleAssessment[] = personasFile.personas.map((p, i) => {
  const [employeeName, employerName, clinicianName] = IDENTITIES[i];
  return {
    id: `FN${String(i + 1).padStart(3, '0')}`,
    data: {
      ...createDefaultAssessment(),
      ...(p.state as Partial<FitNoteEngineState>),
      employeeName,
      employerName,
      clinicianName
    }
  };
});

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map(({ id, data }) => {
  const g = gradeFitNote(data);
  return {
    id,
    date: data.assessmentDate ?? '',
    employee: data.employeeName,
    employer: data.employerName,
    advice: data.fitnessAdvice,
    durationDays: g.durationDays,
    adjustments: g.adjustmentCount,
    approval: g.approvalStatus,
    flagCount: g.additionalFlags.length,
    flags: g.additionalFlags.map((f) => f.category).join(', '),
    clinician: data.clinicianName
  };
});
