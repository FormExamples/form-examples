import type { AssessmentData, VAGrade } from '#lib/engine/types.js';
import { calculateVisualAcuityGrade } from '#lib/engine/va-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { iopStatusLabel } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	vaGrade: VAGrade;
	affectedEye: string;
	primaryCondition: string;
	iopStatus: string;
	flagCount: number;
}

/** Normal: routine examination, healthy eyes, good corrected acuity. */
function normalAcuity(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1972-04-12',
		sex: 'male'
	};
	d.chiefComplaint = {
		...d.chiefComplaint,
		primaryConcern: 'Routine eye examination',
		affectedEye: 'both',
		onsetType: 'gradual',
		painPresent: 'no'
	};
	d.visualAcuity = {
		...d.visualAcuity,
		distanceVaRightCorrected: '6/6',
		distanceVaLeftCorrected: '6/6'
	};
	d.anteriorSegment = { ...d.anteriorSegment, iopRight: 15, iopLeft: 16, iopMethod: 'goldmann' };
	return d;
}

/** Mild: early cataract, slightly reduced corrected acuity, raised IOP. */
function mildImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female'
	};
	d.chiefComplaint = {
		...d.chiefComplaint,
		primaryConcern: 'Gradual blurring of vision, glare at night',
		affectedEye: 'right',
		onsetType: 'gradual',
		painPresent: 'no'
	};
	d.visualAcuity = {
		...d.visualAcuity,
		distanceVaRightCorrected: '6/12',
		distanceVaLeftCorrected: '6/9'
	};
	d.anteriorSegment = {
		...d.anteriorSegment,
		lensNormal: 'no',
		lensDetails: 'Nuclear sclerotic cataract, right eye',
		iopRight: 24,
		iopLeft: 22,
		iopMethod: 'goldmann'
	};
	d.currentMedications = {
		...d.currentMedications,
		eyeDrops: [{ name: 'Latanoprost', dose: '0.005%', frequency: 'Once nightly' }]
	};
	return d;
}

/** Moderate: proliferative diabetic retinopathy with maculopathy. */
function moderateImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1951-01-22',
		sex: 'female'
	};
	d.chiefComplaint = {
		...d.chiefComplaint,
		primaryConcern: 'Diabetic retinopathy review, blurred central vision',
		affectedEye: 'both',
		onsetType: 'gradual',
		painPresent: 'no'
	};
	d.visualAcuity = {
		...d.visualAcuity,
		distanceVaRightCorrected: '6/24',
		distanceVaLeftCorrected: '6/36'
	};
	d.anteriorSegment = { ...d.anteriorSegment, iopRight: 18, iopLeft: 19, iopMethod: 'tonopen' };
	d.posteriorSegment = {
		...d.posteriorSegment,
		fundusNormal: 'no',
		fundusDetails: 'Dot-blot haemorrhages, neovascularisation',
		maculaNormal: 'no',
		maculaDetails: 'Clinically significant macular oedema',
		retinalVesselsNormal: 'no',
		retinalVesselsDetails: 'Venous beading'
	};
	d.systemicConditions = {
		...d.systemicConditions,
		diabetes: 'yes',
		diabetesType: 'type2',
		diabetesControl: 'poorly-controlled',
		diabeticRetinopathy: 'yes',
		diabeticRetinopathyStage: 'proliferative'
	};
	d.functionalImpact = {
		...d.functionalImpact,
		readingAbility: 'severe-difficulty',
		drivingStatus: 'ceased-driving'
	};
	return d;
}

/** Severe / blindness: retinal detachment with RAPD and sudden vision loss. */
function severeImpairment(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1948-11-03',
		sex: 'male'
	};
	d.chiefComplaint = {
		...d.chiefComplaint,
		primaryConcern: 'Sudden flashes, floaters and a dark curtain in vision',
		affectedEye: 'right',
		onsetType: 'sudden',
		durationValue: '2',
		durationUnit: 'days',
		painPresent: 'no'
	};
	d.visualAcuity = {
		...d.visualAcuity,
		distanceVaRightCorrected: '3/60',
		distanceVaLeftCorrected: '6/9'
	};
	d.anteriorSegment = { ...d.anteriorSegment, iopRight: 12, iopLeft: 15, iopMethod: 'goldmann' };
	d.posteriorSegment = {
		...d.posteriorSegment,
		fundusNormal: 'no',
		fundusDetails: 'Superotemporal retinal detachment with horseshoe tear',
		vitreousNormal: 'no',
		vitreousDetails: 'Posterior vitreous detachment with pigment'
	};
	d.visualFieldPupils = {
		...d.visualFieldPupils,
		visualFieldResultRight: 'abnormal',
		rapdPresent: 'yes',
		rapdEye: 'right'
	};
	d.functionalImpact = {
		...d.functionalImpact,
		readingAbility: 'severe-difficulty',
		fallsRisk: 'yes',
		drivingStatus: 'ceased-driving'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: normalAcuity() },
	{ id: 'OA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildImpairment() },
	{ id: 'OA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateImpairment() },
	{ id: 'OA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeImpairment() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { vaGrade } = calculateVisualAcuityGrade(s.data);
	const flags = detectAdditionalFlags(s.data);
	const maxIop = Math.max(s.data.anteriorSegment.iopRight ?? 0, s.data.anteriorSegment.iopLeft ?? 0);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		vaGrade,
		affectedEye: s.data.chiefComplaint.affectedEye || '—',
		primaryCondition: s.data.chiefComplaint.primaryConcern || '—',
		iopStatus: maxIop > 0 ? iopStatusLabel(maxIop) : 'Not measured',
		flagCount: flags.length
	};
});
