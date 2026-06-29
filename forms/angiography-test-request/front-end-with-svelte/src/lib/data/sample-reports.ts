import type {
	AppropriatenessBand,
	RequestData,
	SafetyBand,
	TriageTier
} from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: RequestData;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	angiographyType: string;
	indication: string;
	appropriatenessBand: AppropriatenessBand;
	safetyBand: SafetyBand;
	triageTier: TriageTier;
	completenessPercent: number;
	flagCount: number;
}

/** A001 — routine, appropriate, safe peripheral CTA → accept. */
function routinePAD(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr H Iqbal', clinicianRole: 'radiologist', registrationBody: 'GMC', referralDate: '2026-05-04', siteName: 'Vascular imaging' };
	d.patient = { ...d.patient, firstName: 'Amara', lastName: 'Okafor', dateOfBirth: '1962-03-18', nhsNumber: '401 234 5678', bodyMassIndex: 27.4 };
	d.request = { ...d.request, angiographyType: 'ct-angiography', bodyRegion: 'peripheral-lower-limb', primaryIndication: 'peripheral-arterial-disease', clinicalQuestion: 'Assess extent and run-off of lower-limb arterial disease.' };
	d.contrast = { ...d.contrast, contrastRequired: 'iodinated', egfr: 82 };
	d.pregnancy = { ...d.pregnancy, pregnancyStatus: 'not-applicable', irMeRJustification: 'Diagnostic CTA justified for PAD planning.' };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** A002 — appropriate aneurysm CTA but contrast allergy → contraindicated, urgent. */
function aneurysmContrastAllergy(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr K Mensah', clinicianRole: 'vascular-surgeon', registrationBody: 'GMC', referralDate: '2026-05-05', siteName: 'Vascular surgery' };
	d.patient = { ...d.patient, firstName: 'Sofia', lastName: 'Bianchi', dateOfBirth: '1951-11-02', nhsNumber: '402 345 6789', bodyMassIndex: 29.1 };
	d.request = { ...d.request, angiographyType: 'ct-angiography', bodyRegion: 'aorta', primaryIndication: 'aneurysm', clinicalQuestion: 'Characterise infrarenal aortic aneurysm prior to repair.' };
	d.contrast = { ...d.contrast, contrastRequired: 'iodinated', egfr: 68, contrastAllergy: true };
	d.pregnancy = { ...d.pregnancy, pregnancyStatus: 'not-applicable', irMeRJustification: 'CTA justified for aneurysm sizing.' };
	d.triage = { ...d.triage, urgency: 'urgent', setting: 'inpatient' };
	return d;
}

/** A003 — renal stenosis CTA with severe renal impairment + metformin → contraindicated. */
function renalImpairmentMetformin(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr L Romano', clinicianRole: 'cardiologist', registrationBody: 'GMC', referralDate: '2026-05-05', siteName: 'Renal medicine' };
	d.patient = { ...d.patient, firstName: 'Petra', lastName: 'Novak', dateOfBirth: '1948-07-21', nhsNumber: '403 456 7890', bodyMassIndex: 31.6 };
	d.request = { ...d.request, angiographyType: 'ct-angiography', bodyRegion: 'renal', primaryIndication: 'stenosis', clinicalQuestion: 'Assess renal artery stenosis in resistant hypertension.' };
	d.contrast = { ...d.contrast, contrastRequired: 'iodinated', egfr: 24, diabetes: true, metformin: true };
	d.pregnancy = { ...d.pregnancy, pregnancyStatus: 'not-applicable', irMeRJustification: 'CTA justified for renovascular assessment.' };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** A004 — emergency GI-bleeding catheter angiography on anticoagulant → high bleeding flag. */
function emergencyGiBleed(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr M Adebayo', clinicianRole: 'interventional-radiologist', registrationBody: 'GMC', referralDate: '2026-05-06', siteName: 'IR suite' };
	d.patient = { ...d.patient, firstName: 'Layla', lastName: 'Hassan', dateOfBirth: '1957-09-09', nhsNumber: '404 567 8901', bodyMassIndex: 24.8 };
	d.request = { ...d.request, angiographyType: 'catheter-dsa', bodyRegion: 'mesenteric', primaryIndication: 'gi-bleeding', clinicalQuestion: 'Localise and embolise active lower GI haemorrhage.' };
	d.contrast = { ...d.contrast, contrastRequired: 'iodinated', egfr: 64 };
	d.bleeding = { ...d.bleeding, takingAnticoagulant: true, anticoagulantAgent: 'apixaban', takingAntiplatelet: true };
	d.pregnancy = { ...d.pregnancy, pregnancyStatus: 'not-applicable', irMeRJustification: 'Emergency embolisation justified for active bleeding.' };
	d.triage = { ...d.triage, urgency: 'urgent', setting: 'emergency' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'ANG-2026-0001', patientName: 'Okafor, Amara', referralDate: '2026-05-04', data: routinePAD() },
	{ id: 'ANG-2026-0002', patientName: 'Bianchi, Sofia', referralDate: '2026-05-05', data: aneurysmContrastAllergy() },
	{ id: 'ANG-2026-0003', patientName: 'Novak, Petra', referralDate: '2026-05-05', data: renalImpairmentMetformin() },
	{ id: 'ANG-2026-0004', patientName: 'Hassan, Layla', referralDate: '2026-05-06', data: emergencyGiBleed() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		angiographyType: s.data.request.angiographyType,
		indication: s.data.request.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		safetyBand: g.safetyBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		flagCount: g.flags.length
	};
});
