// Cohen-Mansfield Agitation Inventory (CMAI) item bank and the
// Neuropsychiatric Inventory (NPI) domain bank.
//
// CMAI is a 29-item observer-rated scale. Each item is rated 1-7 by the
// frequency with which the behaviour occurred in the past two weeks:
//   1 = Never … 7 = Several times an hour. Total range 29-203.
//
// NPI's 12 behavioural domains are each rated by frequency (1-4) and
// severity (1-3); domain score = frequency * severity (0-12). Total
// range 0-144.

export interface CMAIItem {
	/** cmai01 .. cmai29 (matches AssessmentData.behaviouralSymptoms.cmai key). */
	id: string;
	number: number;
	label: string;
}

export interface NPIDomain {
	/** Matches AssessmentData.behaviouralSymptoms.npi key. */
	key: string;
	label: string;
	description: string;
}

export interface ScaleOption {
	value: number;
	label: string;
}

/** CMAI item ids, `cmai01` through `cmai29`. */
export const CMAI_ITEM_IDS: string[] = Array.from({ length: 29 }, (_, i) =>
	`cmai${String(i + 1).padStart(2, '0')}`
);

/** NPI domain keys, in standard questionnaire order. */
export const NPI_DOMAIN_KEYS: string[] = [
	'delusions',
	'hallucinations',
	'agitationAggression',
	'depressionDysphoria',
	'anxiety',
	'elationEuphoria',
	'apathyIndifference',
	'disinhibition',
	'irritabilityLability',
	'motorDisturbance',
	'sleep',
	'appetiteEating'
];

export const cmaiScaleOptions: ScaleOption[] = [
	{ value: 1, label: '1 — Never' },
	{ value: 2, label: '2 — Less than once a week' },
	{ value: 3, label: '3 — Once or twice a week' },
	{ value: 4, label: '4 — Several times a week' },
	{ value: 5, label: '5 — Once or twice a day' },
	{ value: 6, label: '6 — Several times a day' },
	{ value: 7, label: '7 — Several times an hour' }
];

export const npiFrequencyOptions: ScaleOption[] = [
	{ value: 1, label: '1 — Occasionally (less than once per week)' },
	{ value: 2, label: '2 — Often (about once per week)' },
	{ value: 3, label: '3 — Frequently (several times per week, less than daily)' },
	{ value: 4, label: '4 — Very frequently (daily or continuously)' }
];

export const npiSeverityOptions: ScaleOption[] = [
	{ value: 1, label: '1 — Mild (noticeable but not distressing)' },
	{ value: 2, label: '2 — Moderate (distressing but redirectable)' },
	{ value: 3, label: '3 — Severe (distressing, not redirectable)' }
];

export const cmaiItems: CMAIItem[] = [
	{ id: 'cmai01', number: 1, label: 'Pacing or aimless wandering' },
	{ id: 'cmai02', number: 2, label: 'Inappropriate dress or disrobing' },
	{ id: 'cmai03', number: 3, label: 'Spitting (including at meals)' },
	{ id: 'cmai04', number: 4, label: 'Cursing or verbal aggression' },
	{ id: 'cmai05', number: 5, label: 'Constant unwarranted requests for attention or help' },
	{ id: 'cmai06', number: 6, label: 'Repetitive sentences or questions' },
	{ id: 'cmai07', number: 7, label: 'Hitting (including self)' },
	{ id: 'cmai08', number: 8, label: 'Kicking' },
	{ id: 'cmai09', number: 9, label: 'Grabbing onto people' },
	{ id: 'cmai10', number: 10, label: 'Pushing' },
	{ id: 'cmai11', number: 11, label: 'Throwing things' },
	{ id: 'cmai12', number: 12, label: 'Strange noises (weird laughter or crying)' },
	{ id: 'cmai13', number: 13, label: 'Screaming' },
	{ id: 'cmai14', number: 14, label: 'Biting' },
	{ id: 'cmai15', number: 15, label: 'Scratching' },
	{ id: 'cmai16', number: 16, label: 'Trying to get to a different place (e.g. out of the room)' },
	{ id: 'cmai17', number: 17, label: 'Intentional falling' },
	{ id: 'cmai18', number: 18, label: 'Complaining' },
	{ id: 'cmai19', number: 19, label: 'Negativism' },
	{ id: 'cmai20', number: 20, label: 'Eating or drinking inappropriate substances' },
	{ id: 'cmai21', number: 21, label: 'Hurting self or others' },
	{ id: 'cmai22', number: 22, label: 'Handling things inappropriately' },
	{ id: 'cmai23', number: 23, label: 'Hiding things' },
	{ id: 'cmai24', number: 24, label: 'Hoarding things' },
	{ id: 'cmai25', number: 25, label: 'Tearing things or destroying property' },
	{ id: 'cmai26', number: 26, label: 'Performing repetitive mannerisms' },
	{ id: 'cmai27', number: 27, label: 'Making verbal sexual advances' },
	{ id: 'cmai28', number: 28, label: 'Making physical sexual advances' },
	{ id: 'cmai29', number: 29, label: 'General restlessness' }
];

export const npiDomains: NPIDomain[] = [
	{ key: 'delusions', label: 'Delusions', description: 'Beliefs that are not true (e.g. that family members are stealing from them).' },
	{ key: 'hallucinations', label: 'Hallucinations', description: 'Seeing or hearing things that are not there.' },
	{ key: 'agitationAggression', label: 'Agitation / aggression', description: 'Resistive, verbally or physically aggressive behaviour.' },
	{ key: 'depressionDysphoria', label: 'Depression / dysphoria', description: 'Sadness, tearfulness, hopelessness.' },
	{ key: 'anxiety', label: 'Anxiety', description: 'Worry, nervousness, panic.' },
	{ key: 'elationEuphoria', label: 'Elation / euphoria', description: 'Inappropriately good mood or excessive cheerfulness.' },
	{ key: 'apathyIndifference', label: 'Apathy / indifference', description: 'Loss of interest, motivation, emotional response.' },
	{ key: 'disinhibition', label: 'Disinhibition', description: 'Acting impulsively without considering consequences.' },
	{ key: 'irritabilityLability', label: 'Irritability / lability', description: 'Easily annoyed, sudden mood changes, short temper.' },
	{ key: 'motorDisturbance', label: 'Aberrant motor disturbance', description: 'Repetitive activities without clear purpose (pacing, fidgeting).' },
	{ key: 'sleep', label: 'Sleep / night-time behaviour', description: 'Nighttime awakenings, getting up, wandering at night.' },
	{ key: 'appetiteEating', label: 'Appetite / eating change', description: 'Loss of appetite, weight change, food preference change.' }
];
