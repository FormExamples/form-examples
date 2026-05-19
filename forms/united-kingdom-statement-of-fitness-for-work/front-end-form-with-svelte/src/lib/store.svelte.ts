/**
 * Runes-based wizard store for the UK fit note.
 *
 * Holds the current `FitNote` data and derives the grading result on
 * every mutation. Step components and the report panel bind to this
 * shared instance.
 */

import { emptyFitNote, type FitNote, type GradingResult } from './types.js';
import { gradeFitNote } from './grading/grader.js';

class FitNoteStore {
  data: FitNote = $state(emptyFitNote());
  result: GradingResult = $derived(gradeFitNote(this.data));

  load(fitNote: FitNote): void {
    this.data = fitNote;
  }

  reset(): void {
    this.data = emptyFitNote();
  }
}

export const store = new FitNoteStore();

export const TOTAL_STEPS = 10;

export const STEP_TITLES: readonly string[] = [
  'Issuer identification',
  'Patient identification',
  'Assessment',
  'Diagnosis',
  'Fitness for work',
  'Adaptations',
  'Comments',
  'Period',
  'Follow-up',
  'Sign-off',
];
