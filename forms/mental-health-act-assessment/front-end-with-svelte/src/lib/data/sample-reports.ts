import type {
	AssessmentData,
	CompletenessStatus,
	RecommendedSectionClass,
	UrgencyClass
} from '#lib/engine/types.js';
import { gradeMentalHealthActAssessment } from '#lib/engine/mha-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	personName: string;
	amhpName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	personIdentifier: string;
	personName: string;
	amhpName: string;
	completenessStatus: CompletenessStatus;
	recommendedSectionClass: RecommendedSectionClass;
	urgencyClass: UrgencyClass;
	flagCount: number;
	assessedDate: string;
}

/** Valid, fully-documented Section 2 (urgent). */
function validSection2(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessedAt: '2026-06-20T10:30',
		location: 'emergency-department',
		referralSource: 'Emergency department liaison team',
		reasonForAssessment: 'Acute psychosis, unable to consent to informal admission.'
	};
	d.identification = {
		personIdentifier: '943 476 5919',
		ageBand: 'adult',
		sex: 'female',
		firstLanguage: 'English'
	};
	d.professionals = {
		amhpName: 'A. Okafor',
		amhpApproved: 'yes',
		doctor1Name: 'Dr R. Singh',
		doctor1GmcNumber: '7654321',
		doctor1Section12Approved: 'yes',
		doctor1ExaminedAt: '2026-06-20T09:00',
		doctor2Name: 'Dr L. Chen',
		doctor2GmcNumber: '1234567',
		doctor2Section12Approved: 'no',
		doctor2ExaminedAt: '2026-06-20T10:00',
		priorAcquaintance: 'yes'
	};
	d.mentalDisorder = {
		mentalDisorderPresent: 'met',
		mentalDisorderEvidence: 'Paranoid delusions, thought disorder, no insight.'
	};
	d.risk = {
		riskToOwnHealth: 'met',
		riskToOwnSafety: 'met',
		riskToOthers: 'not-applicable',
		riskEvidence: 'Not eating or drinking; recent self-harm.',
		riskImminence: 'moderate'
	};
	d.leastRestrictive = {
		leastRestrictiveMet: 'met',
		alternativesConsidered: 'Informal admission declined; community team unable to keep safe.'
	};
	d.nearestRelative = {
		nearestRelativeIdentified: 'yes',
		nearestRelativeConsulted: 'yes',
		nearestRelativeObjection: 'no',
		consultationRecord: 'Sister consulted by phone; no objection.'
	};
	d.recommendation = {
		recommendedSection: '2',
		outcome: 'detain-under-section',
		bedIdentified: 'yes',
		conveyance: 'ambulance',
		clinicalLegalNote: 'Admission for assessment; review before day 28.'
	};
	return d;
}

/** Incomplete Section 3 — second doctor and treatment criterion outstanding (urgent). */
function incompleteSection3(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessedAt: '2026-06-22T14:00',
		location: 'hospital-ward',
		referralSource: 'Inpatient ward, informal admission breaking down',
		reasonForAssessment: 'Relapse of established schizophrenia; treatment refused.'
	};
	d.identification = {
		personIdentifier: '611 209 3344',
		ageBand: 'adult',
		sex: 'male',
		firstLanguage: 'Polish; interpreter required'
	};
	d.professionals = {
		amhpName: 'L. Mensah',
		amhpApproved: 'yes',
		doctor1Name: 'Dr F. Ahmed',
		doctor1GmcNumber: '5551234',
		doctor1Section12Approved: 'yes',
		doctor1ExaminedAt: '2026-06-22T11:00',
		doctor2Name: '',
		doctor2GmcNumber: '',
		doctor2Section12Approved: '',
		doctor2ExaminedAt: '',
		priorAcquaintance: 'no'
	};
	d.mentalDisorder = {
		mentalDisorderPresent: 'met',
		mentalDisorderEvidence: 'Long history of schizophrenia; acute relapse.'
	};
	d.risk = {
		riskToOwnHealth: 'met',
		riskToOwnSafety: 'not-met',
		riskToOthers: 'not-met',
		riskEvidence: 'Deteriorating self-care; stopped medication three weeks ago.',
		riskImminence: 'moderate'
	};
	d.leastRestrictive = {
		leastRestrictiveMet: 'met',
		alternativesConsidered: 'Community treatment attempted and failed.'
	};
	d.treatment = {
		appropriateTreatmentAvailable: '',
		treatmentPlanSummary: ''
	};
	d.nearestRelative = {
		nearestRelativeIdentified: 'yes',
		nearestRelativeConsulted: 'no',
		nearestRelativeObjection: 'unknown',
		consultationRecord: 'Nearest relative not yet reached.'
	};
	d.recommendation = {
		recommendedSection: '3',
		outcome: 'detain-under-section',
		bedIdentified: 'no',
		conveyance: '',
		clinicalLegalNote: 'Awaiting second recommendation and NR consultation.'
	};
	return d;
}

/** Section 136 place-of-safety power (emergency), documentation complete. */
function section136(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessedAt: '2026-06-26T02:15',
		location: 'place-of-safety',
		referralSource: 'Police (s136 suite)',
		reasonForAssessment: 'Person found in a public place in acute distress.'
	};
	d.identification = {
		personIdentifier: '778 334 1090',
		ageBand: 'adolescent',
		sex: 'male',
		firstLanguage: 'English'
	};
	d.professionals = {
		amhpName: 'J. Hughes',
		amhpApproved: 'yes',
		doctor1Name: 'Dr P. Nowak',
		doctor1GmcNumber: '9998887',
		doctor1Section12Approved: 'yes',
		doctor1ExaminedAt: '2026-06-26T03:00',
		doctor2Name: '',
		doctor2GmcNumber: '',
		doctor2Section12Approved: '',
		doctor2ExaminedAt: '',
		priorAcquaintance: 'no'
	};
	d.mentalDisorder = {
		mentalDisorderPresent: 'met',
		mentalDisorderEvidence: 'Acute distress with possible psychosis; needs assessment.'
	};
	d.risk = {
		riskToOwnHealth: 'met',
		riskToOwnSafety: 'met',
		riskToOthers: 'not-applicable',
		riskEvidence: 'Found on a bridge; immediate risk to self.',
		riskImminence: 'imminent'
	};
	d.leastRestrictive = {
		leastRestrictiveMet: 'met',
		alternativesConsidered: 'Place of safety used to enable assessment.'
	};
	d.nearestRelative = {
		nearestRelativeIdentified: 'no',
		nearestRelativeConsulted: 'not-practicable',
		nearestRelativeObjection: 'unknown',
		consultationRecord: 'Identity being established.'
	};
	d.recommendation = {
		recommendedSection: '136',
		outcome: 'detain-under-section',
		bedIdentified: 'yes',
		conveyance: 'police',
		clinicalLegalNote: 'Held under s136 pending full MHA assessment.'
	};
	return d;
}

/** No detaining section — resolved informal-admission outcome (routine, valid). */
function noneInformal(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessedAt: '2026-06-27T11:00',
		location: 'community',
		referralSource: 'GP referral',
		reasonForAssessment: 'Low mood and self-neglect; capacity retained.'
	};
	d.identification = {
		personIdentifier: '120 998 4471',
		ageBand: 'older-adult',
		sex: 'female',
		firstLanguage: 'English'
	};
	d.professionals = {
		amhpName: 'A. Okafor',
		amhpApproved: 'yes',
		doctor1Name: 'Dr S. Patel',
		doctor1GmcNumber: '3332221',
		doctor1Section12Approved: 'yes',
		doctor1ExaminedAt: '2026-06-27T10:00',
		doctor2Name: '',
		doctor2GmcNumber: '',
		doctor2Section12Approved: '',
		doctor2ExaminedAt: '',
		priorAcquaintance: 'yes'
	};
	d.mentalDisorder = {
		mentalDisorderPresent: 'met',
		mentalDisorderEvidence: 'Depressive episode; agrees to admission.'
	};
	d.risk = {
		riskToOwnHealth: 'met',
		riskToOwnSafety: 'not-met',
		riskToOthers: 'not-applicable',
		riskEvidence: 'Self-neglect; no active suicidal ideation.',
		riskImminence: 'low'
	};
	d.leastRestrictive = {
		leastRestrictiveMet: 'met',
		alternativesConsidered: 'Person consents to informal admission — least restrictive option.'
	};
	d.nearestRelative = {
		nearestRelativeIdentified: 'yes',
		nearestRelativeConsulted: 'yes',
		nearestRelativeObjection: 'no',
		consultationRecord: 'Son involved; supportive of informal admission.'
	};
	d.recommendation = {
		recommendedSection: 'none',
		outcome: 'informal-admission',
		bedIdentified: 'yes',
		conveyance: 'self',
		clinicalLegalNote: 'Detention not required; informal admission agreed.'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'MHA-2026-0001',
		personName: 'Ellis, Margaret',
		amhpName: 'A. Okafor',
		assessedDate: '2026-06-20',
		data: validSection2()
	},
	{
		id: 'MHA-2026-0002',
		personName: 'Nowak, Piotr',
		amhpName: 'L. Mensah',
		assessedDate: '2026-06-22',
		data: incompleteSection3()
	},
	{
		id: 'MHA-2026-0003',
		personName: 'Okafor, Chidi',
		amhpName: 'J. Hughes',
		assessedDate: '2026-06-26',
		data: section136()
	},
	{
		id: 'MHA-2026-0004',
		personName: 'Fletcher, Rosemary',
		amhpName: 'A. Okafor',
		assessedDate: '2026-06-27',
		data: noneInformal()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeMentalHealthActAssessment(s.data);
	return {
		id: s.id,
		personIdentifier: s.data.identification.personIdentifier,
		personName: s.personName,
		amhpName: s.amhpName,
		completenessStatus: g.completenessStatus,
		recommendedSectionClass: g.recommendedSectionClass,
		urgencyClass: g.urgencyClass,
		flagCount: g.flaggedIssues.length,
		assessedDate: s.assessedDate
	};
});
