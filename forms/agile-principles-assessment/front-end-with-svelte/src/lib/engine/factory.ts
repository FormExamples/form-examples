import type { AgileAssessment, PrincipleResponse } from './types.js';
import { TOTAL_PRINCIPLES } from '#lib/config/principles.js';

function emptyResponse(): PrincipleResponse {
  return { score: null, comment: '', weight: 1.0 };
}

export function createEmptyAssessment(): AgileAssessment {
  return {
    respondent: {
      isAnonymous: false,
      fullName: '',
      email: '',
      role: '',
      teamName: '',
      organisationName: '',
      yearsInAgile: null,
      assessmentDate: '',
      assessmentPeriod: '',
    },
    responses: Array.from({ length: TOTAL_PRINCIPLES }, emptyResponse),
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
