import type { AgileChecklist, Answer } from './types.js';
import { ALL_ITEMS } from '$lib/config/items.js';

function emptyAnswers(): Record<string, Answer> {
  const out: Record<string, Answer> = {};
  for (const item of ALL_ITEMS) {
    out[item.id] = '';
  }
  return out;
}

export function createEmptyChecklist(): AgileChecklist {
  return {
    respondent: {
      fullName: '',
      email: '',
      role: '',
      teamName: '',
      organisationName: '',
      yearsInAgile: null,
      assessmentDate: '',
      assessmentPeriod: '',
    },
    answers: emptyAnswers(),
    actionPlan: {
      topAction1: '',
      topAction2: '',
      topAction3: '',
      coachNotes: '',
      signedAt: '',
      overallNotes: '',
    },
  };
}
