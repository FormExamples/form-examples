import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
  { number: 1, title: 'Donor', shortTitle: 'Donor', section: 'donor' },
  { number: 2, title: 'Recipient (optional)', shortTitle: 'Recipient', section: 'recipient' },
  { number: 3, title: 'Pathway and ABO groups', shortTitle: 'Pathway & ABO', section: 'pathway' },
  { number: 4, title: 'Tests required', shortTitle: 'Tests', section: 'tests' },
  { number: 5, title: 'Requester', shortTitle: 'Requester', section: 'requester' },
  { number: 6, title: 'Sample collection', shortTitle: 'Sample', section: 'sample' },
  { number: 7, title: 'Laboratory use and submit', shortTitle: 'Laboratory', section: 'lab' }
];
