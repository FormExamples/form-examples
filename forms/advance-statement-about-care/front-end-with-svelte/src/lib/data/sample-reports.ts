import type { StatementData, CompletenessLevel } from '#lib/engine/types.js';
import { calculateCompleteness } from '#lib/engine/completeness-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample statement: an identifier and the full data the engine assesses. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: StatementData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	nhsNumber: string;
	assessedDate: string;
	completenessLevel: CompletenessLevel;
	completedCount: number;
	totalCount: number;
	witnessed: boolean;
	reviewDate: string;
	flagCount: number;
}

/** An incomplete statement: only a name entered, nothing else. */
function incomplete(): StatementData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		firstName: 'Sarah',
		lastName: 'Brown',
		nhsNumber: '167 293 8451'
	};
	return d;
}

/** A partial statement: core sections begun, required ones still missing. */
function partial(): StatementData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1948-01-22',
		nhsNumber: '384 615 7230',
		address: '14 Orchard Lane, Bristol',
		postcode: 'BS1 4ST'
	};
	d.statementContext = {
		...d.statementContext,
		reasonForStatement:
			'I want my family and care team to understand my wishes if I become unable to speak for myself.',
		whenStatementShouldApply: 'If I lose the capacity to make decisions about my own care.'
	};
	d.valuesBeliefs = {
		...d.valuesBeliefs,
		qualityOfLifePriorities: 'Being able to recognise and talk with my family matters most to me.'
	};
	d.carePreferences = { ...d.carePreferences, preferredPlaceOfCare: 'home' };
	return d;
}

/** A complete statement: all required sections filled, no witness/HCP yet. */
function complete(): StatementData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		nhsNumber: '721 938 4102',
		address: '8 Elm Court, Leicester',
		postcode: 'LE2 7QR',
		telephone: '0116 496 1182',
		gpName: 'Dr A. Shah',
		gpPractice: 'Highfields Surgery'
	};
	d.statementContext = {
		...d.statementContext,
		reasonForStatement: 'To set out my care wishes clearly while I am well enough to do so.',
		currentDiagnosis: 'Early-stage heart failure.',
		whenStatementShouldApply: 'If I am too unwell to express my preferences myself.'
	};
	d.valuesBeliefs = {
		...d.valuesBeliefs,
		qualityOfLifePriorities: 'Comfort, dignity, and being free from pain.',
		whatMakesLifeMeaningful: 'Time with my grandchildren and my faith.',
		religiousBeliefs: 'Hindu'
	};
	d.carePreferences = {
		...d.carePreferences,
		preferredPlaceOfCare: 'home',
		preferredPlaceOfDeath: 'hospice',
		personalComfortPreferences: 'I like the window open and gentle music playing.'
	};
	d.medicalTreatmentWishes = {
		...d.medicalTreatmentWishes,
		painManagementPreferences: 'Keep me comfortable, even if it makes me drowsy.',
		resuscitationWishes: 'I do not want aggressive resuscitation if I am dying.'
	};
	d.peopleImportantToMe = {
		...d.peopleImportantToMe,
		people: [
			{
				name: 'Anil Patel',
				relationship: 'Son',
				telephone: '07700 900123',
				email: 'anil@example.com',
				role: 'Main contact for care decisions'
			}
		]
	};
	d.signaturesWitnesses = {
		...d.signaturesWitnesses,
		patientSignature: 'Priya Patel',
		patientSignatureDate: '2026-02-10'
	};
	return d;
}

/** A verified statement: complete, witnessed, and acknowledged by an HCP. */
function verified(): StatementData {
	const d = complete();
	d.personalInformation = {
		...d.personalInformation,
		firstName: 'Jane',
		lastName: 'Smith',
		dateOfBirth: '1944-03-08',
		nhsNumber: '943 476 5919',
		address: '21 Riverside Walk, York',
		postcode: 'YO1 9QU'
	};
	d.signaturesWitnesses = {
		...d.signaturesWitnesses,
		patientSignature: 'Jane Smith',
		patientSignatureDate: '2026-01-15',
		witnessName: 'Robert Hall',
		witnessAddress: '23 Riverside Walk, York',
		witnessSignature: 'Robert Hall',
		witnessSignatureDate: '2026-01-15',
		reviewDate: '2027-01-15',
		healthcareProfessionalName: 'Dr E. Davies',
		healthcareProfessionalRole: 'GP',
		healthcareProfessionalSignature: 'E. Davies',
		healthcareProfessionalDate: '2026-01-16'
	};
	return d;
}

/** The sample statements, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AS-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-01-16', data: verified() },
	{ id: 'AS-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-02-10', data: complete() },
	{ id: 'AS-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-01-28', data: partial() },
	{ id: 'AS-2026-0004', patientName: 'Brown, Sarah', assessedDate: '2026-02-15', data: incomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const r = calculateCompleteness(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		nhsNumber: s.data.personalInformation.nhsNumber,
		assessedDate: s.assessedDate,
		completenessLevel: r.level,
		completedCount: r.completedCount,
		totalCount: r.totalCount,
		witnessed:
			s.data.signaturesWitnesses.witnessName.trim() !== '' &&
			s.data.signaturesWitnesses.witnessSignature.trim() !== '',
		reviewDate: s.data.signaturesWitnesses.reviewDate,
		flagCount: r.flaggedIssues.length
	};
});
