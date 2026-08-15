import type { AssessmentData, RiskLevel } from '#lib/engine/types.js';
import { calculateIntegumentaryGrade } from '#lib/engine/integumentary-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the tissue-viability dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	bradenScore: number;
	riskLevel: RiskLevel;
	woundFlag: boolean;
	urgentFlag: boolean;
	flagCount: number;
}

/** No-risk: ambulant, intact skin, high Braden total. */
function noRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1972-04-12', sex: 'male', weight: 80, height: 180, bmi: 24.7 };
	d.presentingSkinConcern = { ...d.presentingSkinConcern, chiefComplaint: 'Routine skin check', onset: 'chronic', itching: 'no', bleeding: 'no', discharge: 'no', pain: 'no' };
	d.skinInspection = { ...d.skinInspection, colour: 'normal', moisture: 'normal', integrity: 'intact', turgor: 'normal', temperature: 'normal' };
	d.bradenScale = { sensoryPerception: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, frictionShear: 3 };
	d.clinicalImpressionCarePlan = { ...d.clinicalImpressionCarePlan, clinicalImpression: 'Healthy skin; no pressure-ulcer risk.', clinicianName: 'Nurse A. Okafor' };
	return d;
}

/** Mild risk: some limitation across subscales, dry skin. */
function mildRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1958-09-30', sex: 'female', weight: 68, height: 160, bmi: 26.6 };
	d.presentingSkinConcern = { ...d.presentingSkinConcern, chiefComplaint: 'Dry, itchy lower legs', onset: 'subacute', duration: '4 weeks', location: 'Bilateral lower legs', itching: 'yes', bleeding: 'no', discharge: 'no', pain: 'no' };
	d.skinInspection = { ...d.skinInspection, colour: 'normal', moisture: 'dry', integrity: 'fragile', turgor: 'fair', temperature: 'normal', lesionTypes: ['fissure'] };
	d.bradenScale = { sensoryPerception: 3, moisture: 3, activity: 3, mobility: 3, nutrition: 3, frictionShear: 2 };
	d.clinicalImpressionCarePlan = { ...d.clinicalImpressionCarePlan, clinicalImpression: 'Asteatotic eczema; mild pressure-ulcer risk.', carePlan: 'Emollient regimen, skin-integrity monitoring.', clinicianName: 'Nurse A. Okafor' };
	return d;
}

/** Moderate risk: chairfast, occasionally moist, reduced nutrition. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1944-01-22', sex: 'female', weight: 58, height: 158, bmi: 23.2 };
	d.presentingSkinConcern = { ...d.presentingSkinConcern, chiefComplaint: 'Reddened skin over sacrum', onset: 'acute', duration: '5 days', location: 'Sacrum', pain: 'yes', painScore: 4, itching: 'no', bleeding: 'no', discharge: 'no' };
	d.skinInspection = { ...d.skinInspection, colour: 'flushed', moisture: 'moist', integrity: 'fragile', turgor: 'fair', temperature: 'normal' };
	d.woundAssessment = { ...d.woundAssessment, woundPresent: 'yes', woundLocation: 'Sacrum', woundStage: 'stage-i', tissueType: 'granulation', infectionSigns: 'no', moistureBalance: 'balanced', exudateAmount: 'minimal', woundOdour: 'none' };
	d.bradenScale = { sensoryPerception: 2, moisture: 3, activity: 2, mobility: 2, nutrition: 3, frictionShear: 2 };
	d.clinicalImpressionCarePlan = { ...d.clinicalImpressionCarePlan, clinicalImpression: 'Early (stage I) sacral pressure injury; moderate risk.', carePlan: 'Repositioning every 2 hours; pressure-relief cushion.', pressureReliefRequired: 'yes', clinicianName: 'Nurse A. Okafor' };
	return d;
}

/** Very high risk: bedfast, constantly moist, undernourished, stage IV wound. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1939-11-03', sex: 'male', weight: 54, height: 175, bmi: 17.6 };
	d.presentingSkinConcern = { ...d.presentingSkinConcern, chiefComplaint: 'Deep sacral wound with malodour', onset: 'chronic', duration: '3 months', location: 'Sacrum', pain: 'yes', painScore: 8, itching: 'no', bleeding: 'yes', discharge: 'yes' };
	d.skinInspection = { ...d.skinInspection, colour: 'pale', moisture: 'diaphoretic', integrity: 'open-lesions', turgor: 'tenting', temperature: 'cool', lesionTypes: ['ulcer'] };
	d.woundAssessment = { ...d.woundAssessment, woundPresent: 'yes', woundLocation: 'Sacrum', woundStage: 'stage-iv', woundLength: 7, woundWidth: 5, woundDepth: 3, tissueType: 'necrotic', infectionSigns: 'yes', moistureBalance: 'macerated', edgeCondition: 'undermined', exudateAmount: 'heavy', exudateType: 'purulent', woundOdour: 'foul' };
	d.bradenScale = { sensoryPerception: 1, moisture: 1, activity: 1, mobility: 2, nutrition: 2, frictionShear: 1 };
	d.photographyDocumentation = { ...d.photographyDocumentation, consentObtained: 'yes', photosTaken: 'yes', photos: [{ site: 'Sacrum', date: '2026-06-18', reference: 'IMG_0421' }] };
	d.clinicalImpressionCarePlan = { ...d.clinicalImpressionCarePlan, clinicalImpression: 'Infected stage IV sacral pressure injury; very high risk.', carePlan: 'Urgent tissue-viability review, debridement, antimicrobial review.', dressingRequired: 'yes', dressingType: 'Alginate + foam', pressureReliefRequired: 'yes', referralRequired: 'yes', referralDetails: 'Tissue-viability nurse + vascular', clinicianName: 'Nurse A. Okafor' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'IA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: noRisk() },
	{ id: 'IA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildRisk() },
	{ id: 'IA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateRisk() },
	{ id: 'IA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateIntegumentaryGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		bradenScore: g.bradenScore,
		riskLevel: g.riskLevel,
		woundFlag: s.data.woundAssessment.woundPresent === 'yes',
		urgentFlag: g.additionalFlags.some((f) => f.priority === 'urgent'),
		flagCount: g.additionalFlags.length
	};
});
