import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
  { number: 1, title: 'Patient', shortTitle: 'Patient', section: 'patient' },
  { number: 2, title: 'Referrer and report', shortTitle: 'Referrer', section: 'referrer' },
  { number: 3, title: 'Tests required', shortTitle: 'Tests', section: 'tests' },
  { number: 4, title: 'Clinical details', shortTitle: 'Clinical details', section: 'clinical' },
  { number: 5, title: 'Urgency and risk', shortTitle: 'Urgency & risk', section: 'urgency' },
  { number: 6, title: 'Requester and consent', shortTitle: 'Requester', section: 'requester' },
  { number: 7, title: 'Sample collection', shortTitle: 'Sample', section: 'sample' },
  { number: 8, title: 'Laboratory use and submit', shortTitle: 'Laboratory', section: 'lab' }
];
