import type {
	AppropriatenessBand,
	BiopsyRequestData,
	BleedingRiskBand,
	TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: BiopsyRequestData;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	biopsySite: string;
	indication: string;
	appropriatenessBand: AppropriatenessBand;
	bleedingRiskBand: BleedingRiskBand;
	triageTier: TriageTier;
	twoWeekWaitEligible: boolean;
	completenessPercent: number;
	flagCount: number;
}

/** A complete, appropriate, low-risk routine request. */
function routineSkin(): BiopsyRequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr H Iqbal', clinicianRole: 'dermatologist', registrationBody: 'GMC', siteName: 'Dermatology clinic', referralDate: '2026-05-04' };
	d.patient = { ...d.patient, firstName: 'Amara', lastName: 'Okafor', dateOfBirth: '1979-02-11', nhsNumber: '401 234 5678', bodyMassIndex: 26.4 };
	d.procedure = { ...d.procedure, biopsySite: 'skin', biopsyMethod: 'punch', laterality: 'left', setting: 'outpatient' };
	d.indication = { ...d.indication, primaryIndication: 'characterise-lesion', clinicalQuestion: 'Characterise a pigmented forearm lesion; exclude melanoma.', relevantHistory: 'Lesion enlarging over 3 months.' };
	d.lesion = { ...d.lesion, lesionDescription: '8 mm pigmented lesion, left forearm.', lesionSize: 8, lesionLocation: 'Left forearm', imagingCorrelate: 'none' };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-15' };
	return d;
}

/** A two-week-wait suspected-cancer breast request. */
function twoWeekWaitBreast(): BiopsyRequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr K Mensah', clinicianRole: 'surgeon', registrationBody: 'GMC', siteName: 'Breast unit', referralDate: '2026-05-05' };
	d.patient = { ...d.patient, firstName: 'Sofia', lastName: 'Bianchi', dateOfBirth: '1963-08-22', nhsNumber: '402 345 6789', bodyMassIndex: 28.1 };
	d.procedure = { ...d.procedure, biopsySite: 'breast', biopsyMethod: 'core-needle', laterality: 'right', imagingGuidanceRequired: true, setting: 'outpatient' };
	d.indication = { ...d.indication, primaryIndication: 'suspected-malignancy', clinicalQuestion: 'Confirm or exclude malignancy in a suspicious mass; provide tissue for receptor typing.', relevantHistory: 'Palpable lump, mammographically suspicious (M4).' };
	d.lesion = { ...d.lesion, lesionDescription: '18 mm hypoechoic mass, upper outer quadrant.', lesionSize: 18, lesionLocation: 'Right UOQ', imagingCorrelate: 'ultrasound' };
	d.triage = { ...d.triage, urgency: 'two-week-wait', requestedByDate: '2026-05-18' };
	return d;
}

/** A high-bleeding-risk anticoagulated liver request. */
function anticoagulatedLiver(): BiopsyRequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr L Romano', clinicianRole: 'radiologist', registrationBody: 'GMC', siteName: 'Interventional radiology', referralDate: '2026-05-05' };
	d.patient = { ...d.patient, firstName: 'Petra', lastName: 'Novak', dateOfBirth: '1955-12-03', nhsNumber: '403 456 7890', bodyMassIndex: 31.5 };
	d.procedure = { ...d.procedure, biopsySite: 'liver', biopsyMethod: 'image-guided', laterality: 'not-applicable', imagingGuidanceRequired: true, setting: 'inpatient' };
	d.indication = { ...d.indication, primaryIndication: 'characterise-lesion', clinicalQuestion: 'Characterise an indeterminate hepatic lesion.', relevantHistory: 'On apixaban for atrial fibrillation.' };
	d.lesion = { ...d.lesion, lesionDescription: '24 mm segment VII lesion.', lesionSize: 24, lesionLocation: 'Segment VII', imagingCorrelate: 'ct' };
	d.bleeding = { ...d.bleeding, takingAnticoagulant: true, anticoagulantAgent: 'apixaban', inr: 1.2 };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-20' };
	return d;
}

/** A mismatched, incomplete, thrombocytopenic emergency request (worst case). */
function mismatchedEmergency(): BiopsyRequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr M Adebayo', clinicianRole: 'oncologist', registrationBody: 'GMC', referralDate: '2026-05-09' };
	d.patient = { ...d.patient, firstName: 'Yuki', lastName: 'Tanaka', dateOfBirth: '1948-04-18', nhsNumber: '410 123 4567' };
	d.procedure = { ...d.procedure, biopsySite: 'skin', biopsyMethod: 'core-needle', setting: 'emergency' };
	d.indication = { ...d.indication, primaryIndication: 'lymphadenopathy', clinicalQuestion: '' };
	d.bleeding = { ...d.bleeding, plateletCount: 35, bleedingDisorder: true, immunosuppressed: true };
	d.triage = { ...d.triage, urgency: 'emergency' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'BX-2026-0001', patientName: 'Okafor, Amara', referralDate: '2026-05-04', data: routineSkin() },
	{ id: 'BX-2026-0002', patientName: 'Bianchi, Sofia', referralDate: '2026-05-05', data: twoWeekWaitBreast() },
	{ id: 'BX-2026-0003', patientName: 'Novak, Petra', referralDate: '2026-05-05', data: anticoagulatedLiver() },
	{ id: 'BX-2026-0004', patientName: 'Tanaka, Yuki', referralDate: '2026-05-09', data: mismatchedEmergency() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		biopsySite: s.data.procedure.biopsySite,
		indication: s.data.indication.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		bleedingRiskBand: g.bleedingRiskBand,
		triageTier: g.triageTier,
		twoWeekWaitEligible: g.twoWeekWaitEligible,
		completenessPercent: g.completenessPercent,
		flagCount: g.flags.length
	};
});
