import type {
	FitNote,
	FitnessForWork,
	PeriodCompliance,
	Recommendation
} from '#lib/engine/types.js';
import { gradeFitNote } from '#lib/engine/grader.js';
import { createDefaultFitNote } from '#lib/stores/fitnote.svelte.js';

/** A sample fit note: an identifier and the full data the engine grades. */
export interface SampleFitNote {
	id: string;
	patientName: string;
	assessedDate: string;
	data: FitNote;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessmentDate: string;
	diagnosis: string;
	fitnessCategory: FitnessForWork;
	periodDays: number | null;
	periodCompliance: PeriodCompliance;
	recommendation: Recommendation;
	isValid: 'yes' | 'no';
	flagCount: number;
}

/** Mental-health phased return — "may be fit", review requested. */
function mentalHealthReview(): FitNote {
	const fn = createDefaultFitNote();
	fn.clinician = {
		name: 'Dr Helen Carter',
		profession: 'doctor',
		registrationBody: 'GMC',
		registrationNumber: '7654321',
		isPrivatePractice: 'no'
	};
	fn.medicalPractice = {
		name: 'Riverside Medical Centre',
		postalAddressAsFullText: '14 Riverside Walk, Bristol BS1 4ST',
		postcode: 'BS1 4ST',
		odsCode: '',
		setting: 'primary_care'
	};
	fn.patient = {
		name: 'Sam Robertson',
		birthDate: '1989-06-14',
		unitedKingdomNhsNumber: '943 476 5919',
		postalAddressAsFullText: '7 Park Crescent, Bristol BS8 2NB',
		postcode: 'BS8 2NB',
		employerName: 'Brunel Engineering Ltd',
		occupation: 'Project manager'
	};
	fn.assessmentDate = '2026-05-12';
	fn.assessmentMethod = 'in_person';
	fn.generalFitnessConsidered = 'yes';
	fn.diagnosisText = 'Work-related stress with mixed anxiety and depression';
	fn.diagnosisSnomedCode = '262188008';
	fn.diagnosisSnomedDisplay = 'Stress (finding)';
	fn.diagnosisCategory = 'mental_health';
	fn.conditionFirstRecordedDate = '2026-03-20';
	fn.fitnessForWork = 'may_be_fit';
	fn.adaptationPhasedReturn = 'yes';
	fn.adaptationAlteredHours = 'yes';
	fn.comments =
		'Recommend phased return over four weeks at 50% hours, gradually building to full hours. Avoid high-pressure deadlines for first month.';
	fn.periodType = 'duration';
	fn.periodDurationValue = 4;
	fn.periodDurationUnit = 'weeks';
	fn.willAssessAgain = 'yes';
	fn.plannedReviewDate = '2026-06-09';
	fn.issuedAt = '2026-05-12';
	fn.issuedVia = 'digital';
	fn.issueSetting = 'primary_care';
	return fn;
}

/** Phased return after knee surgery — issued on hospital discharge. */
function phasedReturnAfterSurgery(): FitNote {
	const fn = createDefaultFitNote();
	fn.clinician = {
		name: 'Lara Okonkwo',
		profession: 'physiotherapist',
		registrationBody: 'HCPC',
		registrationNumber: 'PH123456',
		isPrivatePractice: 'no'
	};
	fn.medicalPractice = {
		name: 'Manchester Royal Infirmary — Outpatient Physiotherapy',
		postalAddressAsFullText: 'Oxford Road, Manchester M13 9WL',
		postcode: 'M13 9WL',
		odsCode: '',
		setting: 'secondary_care_discharge'
	};
	fn.patient = {
		name: 'Mark Davies',
		birthDate: '1972-09-02',
		unitedKingdomNhsNumber: '485 777 3456',
		postalAddressAsFullText: '22 High Street, Stockport SK1 1QU',
		postcode: 'SK1 1QU',
		employerName: 'Northwest Logistics Ltd',
		occupation: 'Warehouse supervisor'
	};
	fn.assessmentDate = '2026-04-22';
	fn.assessmentMethod = 'in_person';
	fn.generalFitnessConsidered = 'yes';
	fn.diagnosisText = 'Left knee arthroscopy recovery — post-operative rehabilitation';
	fn.diagnosisSnomedCode = '736942007';
	fn.diagnosisSnomedDisplay = 'Arthroscopic surgery of knee';
	fn.diagnosisCategory = 'musculoskeletal';
	fn.conditionFirstRecordedDate = '2026-04-15';
	fn.fitnessForWork = 'may_be_fit';
	fn.adaptationPhasedReturn = 'yes';
	fn.comments =
		'Avoid lifting > 5 kg. Avoid prolonged standing. Desk-based supervision duties only for first three weeks.';
	fn.periodType = 'from_to';
	fn.periodFrom = '2026-04-22';
	fn.periodTo = '2026-05-13';
	fn.willAssessAgain = 'yes';
	fn.plannedReviewDate = '2026-05-13';
	fn.issuedAt = '2026-04-22';
	fn.issuedVia = 'printed_computer_generated';
	fn.issueSetting = 'secondary_care_discharge';
	return fn;
}

/** Long COVID — long-term absence, automatic disability, driving restriction. */
function longTermCovid(): FitNote {
	const fn = createDefaultFitNote();
	fn.clinician = {
		name: 'Dr Priya Shah',
		profession: 'doctor',
		registrationBody: 'GMC',
		registrationNumber: '4456789',
		isPrivatePractice: 'no'
	};
	fn.medicalPractice = {
		name: 'Long COVID Clinic — King’s College Hospital',
		postalAddressAsFullText: 'Denmark Hill, London SE5 9RS',
		postcode: 'SE5 9RS',
		odsCode: '',
		setting: 'secondary_care_discharge'
	};
	fn.patient = {
		name: 'Joanne Atkins',
		birthDate: '1968-11-30',
		unitedKingdomNhsNumber: '912 334 5601',
		postalAddressAsFullText: '54 Camberwell Grove, London SE5 8JA',
		postcode: 'SE5 8JA',
		employerName: 'Lambeth Council',
		occupation: 'Social worker'
	};
	fn.assessmentDate = '2026-04-30';
	fn.assessmentMethod = 'video_call';
	fn.generalFitnessConsidered = 'yes';
	fn.diagnosisText =
		'Post-COVID-19 syndrome (long COVID) with persistent fatigue, breathlessness, and cognitive impairment.';
	fn.diagnosisSnomedCode = '1119302008';
	fn.diagnosisSnomedDisplay = 'Post-acute COVID-19';
	fn.diagnosisCategory = 'respiratory';
	fn.conditionFirstRecordedDate = '2025-08-01';
	fn.isAutomaticDisability = 'yes';
	fn.fitnessForWork = 'not_fit';
	fn.comments =
		'Patient remains unable to work due to severe post-exertional malaise. Recommend referral to Access to Work. Recommend that patient should not drive while symptomatic.';
	fn.periodType = 'duration';
	fn.periodDurationValue = 8;
	fn.periodDurationUnit = 'months';
	fn.willAssessAgain = 'yes';
	fn.plannedReviewDate = '2026-12-01';
	fn.issuedAt = '2026-04-30';
	fn.issuedVia = 'digital';
	fn.issueSetting = 'secondary_care_discharge';
	return fn;
}

/** Acute back injury — "not fit", short compliant period, standard advice. */
function acuteBackInjury(): FitNote {
	const fn = createDefaultFitNote();
	fn.clinician = {
		name: 'Dr Adam Lewis',
		profession: 'doctor',
		registrationBody: 'GMC',
		registrationNumber: '5551234',
		isPrivatePractice: 'no'
	};
	fn.medicalPractice = {
		name: 'Elm Park Surgery',
		postalAddressAsFullText: '3 Elm Park Road, Leeds LS6 1AA',
		postcode: 'LS6 1AA',
		odsCode: '',
		setting: 'primary_care'
	};
	fn.patient = {
		name: 'Grace Bennett',
		birthDate: '1995-02-18',
		unitedKingdomNhsNumber: '770 112 8845',
		postalAddressAsFullText: '19 Hyde Park Terrace, Leeds LS6 1BJ',
		postcode: 'LS6 1BJ',
		employerName: 'Yorkshire Retail Group',
		occupation: 'Sales assistant'
	};
	fn.assessmentDate = '2026-05-02';
	fn.assessmentMethod = 'in_person';
	fn.generalFitnessConsidered = 'yes';
	fn.diagnosisText = 'Acute mechanical lower back pain following a fall';
	fn.diagnosisCategory = 'musculoskeletal';
	fn.conditionFirstRecordedDate = '2026-05-01';
	fn.fitnessForWork = 'not_fit';
	fn.periodType = 'duration';
	fn.periodDurationValue = 2;
	fn.periodDurationUnit = 'weeks';
	fn.issuedAt = '2026-05-02';
	fn.issuedVia = 'digital';
	fn.issueSetting = 'primary_care';
	return fn;
}

/** The sample fit notes, keyed by stable id (used to seed the wizard). */
export const sampleFitNotes: SampleFitNote[] = [
	{
		id: 'FN-2026-0001',
		patientName: 'Robertson, Sam',
		assessedDate: '2026-05-12',
		data: mentalHealthReview()
	},
	{
		id: 'FN-2026-0002',
		patientName: 'Davies, Mark',
		assessedDate: '2026-04-22',
		data: phasedReturnAfterSurgery()
	},
	{
		id: 'FN-2026-0003',
		patientName: 'Atkins, Joanne',
		assessedDate: '2026-04-30',
		data: longTermCovid()
	},
	{
		id: 'FN-2026-0004',
		patientName: 'Bennett, Grace',
		assessedDate: '2026-05-02',
		data: acuteBackInjury()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleFitNoteRows: DashboardRow[] = sampleFitNotes.map((s) => {
	const g = gradeFitNote(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessmentDate: s.data.assessmentDate,
		diagnosis: s.data.diagnosisText,
		fitnessCategory: g.fitnessCategory,
		periodDays: g.periodDays,
		periodCompliance: g.periodCompliance,
		recommendation: g.recommendation,
		isValid: g.isValid,
		flagCount: g.safetyFlags.length
	};
});
