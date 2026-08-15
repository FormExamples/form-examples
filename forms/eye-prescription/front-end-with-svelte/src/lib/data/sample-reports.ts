import type { EyePrescription, Complexity } from '#lib/engine/types.js';
import { classify } from '#lib/engine/composite.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample prescription: an identifier and the full data the engine classifies. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	issueDate: string;
	data: EyePrescription;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	issueDate: string;
	expiryDate: string;
	complexity: Exclude<Complexity, ''>;
	lensType: string;
	prismFlag: boolean;
	referralFlag: boolean;
	flagCount: number;
}

/** A simple prescription: low myopia, no astigmatism, single vision. */
function simpleCase(): EyePrescription {
	const d = createDefaultAssessment();
	d.prescriber = { ...d.prescriber, name: 'Sarah Okafor', gocRegistrationNumber: '01-23456', role: 'optometrist', practiceName: 'High Street Opticians' };
	d.patient = { ...d.patient, name: 'James Carter', birthDate: '1995-03-14', sex: 'male' };
	d.examination = { ...d.examination, examinationDate: '2026-05-10', issueDate: '2026-05-10', expiryDate: '2028-05-10', reasonForSightTest: 'routine' };
	d.rightEye = { ...d.rightEye, sphereDiopters: -1.5, cylinderDiopters: -0.25, axisDegrees: 90 };
	d.leftEye = { ...d.leftEye, sphereDiopters: -1.25, cylinderDiopters: 0, axisDegrees: 90 };
	d.lensRecommendation = { ...d.lensRecommendation, lensType: 'single-vision-distance', material: 'cr-39' };
	return d;
}

/** A moderate prescription: presbyopia with addition, varifocal lenses. */
function moderateCase(): EyePrescription {
	const d = createDefaultAssessment();
	d.prescriber = { ...d.prescriber, name: 'Daniel Roy', gocRegistrationNumber: '01-34567', role: 'optometrist', practiceName: 'City Eyecare' };
	d.patient = { ...d.patient, name: 'Patricia Lewis', birthDate: '1962-11-02', sex: 'female' };
	d.examination = { ...d.examination, examinationDate: '2026-05-12', issueDate: '2026-05-12', expiryDate: '2027-05-12', reasonForSightTest: 'symptoms' };
	d.rightEye = { ...d.rightEye, sphereDiopters: 1.75, cylinderDiopters: -0.75, axisDegrees: 180, additionDiopters: 2.0 };
	d.leftEye = { ...d.leftEye, sphereDiopters: 2.0, cylinderDiopters: -0.5, axisDegrees: 175, additionDiopters: 2.0 };
	d.lensRecommendation = { ...d.lensRecommendation, lensType: 'varifocal', material: 'high-index-1.67', coatingAntiReflective: true };
	return d;
}

/** A complex prescription: high myopia with high astigmatism and prism. */
function complexCase(): EyePrescription {
	const d = createDefaultAssessment();
	d.prescriber = { ...d.prescriber, name: 'Aisha Khan', gocRegistrationNumber: '01-45678', role: 'optometrist', practiceName: 'Vision Specialists' };
	d.patient = { ...d.patient, name: 'Robert Hughes', birthDate: '1978-02-28', sex: 'male' };
	d.examination = { ...d.examination, examinationDate: '2026-05-15', issueDate: '2026-05-15', expiryDate: '2028-05-15', reasonForSightTest: 'follow-up' };
	d.rightEye = { ...d.rightEye, sphereDiopters: -7.5, cylinderDiopters: -2.75, axisDegrees: 90, additionDiopters: 2.0, prismHorizontalDiopters: 1.0, baseHorizontal: 'in' };
	d.leftEye = { ...d.leftEye, sphereDiopters: -2.0, cylinderDiopters: -0.5, axisDegrees: 180, additionDiopters: 2.0 };
	d.lensRecommendation = { ...d.lensRecommendation, lensType: 'varifocal', material: 'high-index-1.74', aspheric: true, coatingAntiReflective: true };
	return d;
}

/** A complex prescription with ocular pathology and ophthalmology referral. */
function referralCase(): EyePrescription {
	const d = createDefaultAssessment();
	d.prescriber = { ...d.prescriber, name: 'Marcus Bell', gocRegistrationNumber: '01-56789', role: 'optometrist', practiceName: 'Parkside Optometry' };
	d.patient = { ...d.patient, name: 'Eleanor Page', birthDate: '1949-07-19', sex: 'female' };
	d.examination = { ...d.examination, examinationDate: '2026-05-18', issueDate: '2026-05-18', expiryDate: '2027-05-18', reasonForSightTest: 'after-pathology' };
	d.rightEye = { ...d.rightEye, sphereDiopters: 6.25, cylinderDiopters: -1.0, axisDegrees: 85, additionDiopters: 2.5 };
	d.leftEye = { ...d.leftEye, sphereDiopters: 3.0, cylinderDiopters: -0.75, axisDegrees: 95, additionDiopters: 2.5 };
	d.lensRecommendation = { ...d.lensRecommendation, lensType: 'bifocal', material: 'high-index-1.67' };
	d.ocularHealth = { ...d.ocularHealth, pathologyFlag: true, referOphthalmology: true, referralReason: 'Suspected early cataract — right eye' };
	return d;
}

/** The sample prescriptions, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EP-2026-0001', patientName: 'Carter, James', issueDate: '2026-05-10', data: simpleCase() },
	{ id: 'EP-2026-0002', patientName: 'Lewis, Patricia', issueDate: '2026-05-12', data: moderateCase() },
	{ id: 'EP-2026-0003', patientName: 'Hughes, Robert', issueDate: '2026-05-15', data: complexCase() },
	{ id: 'EP-2026-0004', patientName: 'Page, Eleanor', issueDate: '2026-05-18', data: referralCase() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const r = classify(s.data);
	const effective = (s.data.grade.overrideComplexity || r.complexity) as Exclude<Complexity, ''>;
	return {
		id: s.id,
		patientName: s.patientName,
		issueDate: s.issueDate,
		expiryDate: s.data.examination.expiryDate,
		complexity: effective,
		lensType: s.data.lensRecommendation.lensType,
		prismFlag: r.prismPresent,
		referralFlag: s.data.ocularHealth.referOphthalmology || s.data.ocularHealth.pathologyFlag,
		flagCount: r.additionalFlags.length
	};
});
