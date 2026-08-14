// Display labels for the engine's enumerations.
//
// Kept out of grader.ts so the PDF builder, the routes, and the dashboard can
// import them without pulling in the whole scoring engine.

import type { DomainStatus, GateDecision, Readiness } from './types';

/** Display labels for the surgical readiness bands. */
export const READINESS_LABELS: Record<Readiness, string> = {
	'ready': 'Ready for surgery',
	'optimisation-in-progress': 'Optimisation in progress',
	'optimisation-required': 'Optimisation required',
	'defer-surgery': 'Defer surgery'
};

/** Display labels for the per-domain statuses. */
export const STATUS_LABELS: Record<DomainStatus, string> = {
	'optimised': 'Optimised',
	'in-progress': 'In progress',
	'action-required': 'Action required',
	'insufficient-time': 'Insufficient time',
	'not-applicable': 'Not applicable'
};

/** Display labels for the gate decision recorded at sign-off. */
export const GATE_DECISION_LABELS: Record<GateDecision, string> = {
	'proceed': 'Proceed as listed',
	'proceed-with-prehabilitation': 'Proceed with prehabilitation',
	'defer-and-optimise': 'Defer and optimise',
	'accept-unoptimised-risk': 'Accept unoptimised risk',
	'mdt-review': 'Refer to MDT review',
	'cancel': 'Cancel',
	'': 'Not recorded'
};
