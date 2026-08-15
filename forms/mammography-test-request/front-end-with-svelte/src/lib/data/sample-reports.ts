import type {
	ClinicianSection,
	DashboardRow,
	HistorySection,
	MammographyRequest,
	PatientSection,
	RequestSection,
	SymptomsSection,
	TriageSection
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/request.svelte.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	data: MammographyRequest;
}

/** Build a full request from per-section overrides on top of the blank default. */
function build(parts: {
	clinician?: Partial<ClinicianSection>;
	patient?: Partial<PatientSection>;
	request?: Partial<RequestSection>;
	symptoms?: Partial<SymptomsSection>;
	history?: Partial<HistorySection>;
	triage?: Partial<TriageSection>;
}): MammographyRequest {
	const base = createDefaultRequest();
	return {
		clinician: { ...base.clinician, ...parts.clinician },
		patient: { ...base.patient, ...parts.patient },
		request: { ...base.request, ...parts.request },
		symptoms: { ...base.symptoms, ...parts.symptoms },
		history: { ...base.history, ...parts.history },
		triage: { ...base.triage, ...parts.triage }
	};
}

/** MM-2026-0001 — routine screening: appropriate, low priority, accept. */
function routineScreening(): MammographyRequest {
	return build({
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'gp',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net',
			siteName: 'Headington Medical Practice',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			bodyMassIndex: 26.1
		},
		request: {
			examType: 'screening',
			primaryIndication: 'routine-screening',
			laterality: 'bilateral',
			clinicalQuestion: 'Routine three-yearly NHSBSP screening mammogram.',
			relevantHistory: 'No breast symptoms. Last screen normal three years ago.'
		},
		history: { previousMammogram: 'normal', pregnancyOrLactating: 'no' },
		triage: { urgency: 'routine', setting: 'screening-unit', requestedByDate: '2026-07-20' }
	});
}

/** MM-2026-0002 — breast lump aged ≥30: two-week-wait, high priority, appropriate. */
function breastLumpTwoWeekWait(): MammographyRequest {
	return build({
		clinician: {
			clinicianName: 'Dr Imran Khan',
			clinicianRole: 'gp',
			registrationBody: 'GMC',
			registrationNumber: '7088221',
			requesterContact: 'bleep 2231',
			siteName: 'Cowley Road Surgery',
			referralDate: '2026-06-12'
		},
		patient: {
			firstName: 'Aisha',
			lastName: 'Rahman',
			dateOfBirth: '1980-11-02',
			nhsNumber: '500 123 4567',
			bodyMassIndex: 24.4
		},
		request: {
			examType: 'diagnostic',
			primaryIndication: 'breast-lump',
			laterality: 'left',
			clinicalQuestion: 'New firm, non-tender lump left upper outer quadrant — characterise.',
			relevantHistory: 'Noticed 3 weeks ago, no trauma. No prior imaging.'
		},
		symptoms: { symptomLump: true },
		history: { previousMammogram: 'none', pregnancyOrLactating: 'no' },
		triage: { urgency: 'urgent', setting: 'outpatient', requestedByDate: '2026-06-24' }
	});
}

/** MM-2026-0003 — family-history surveillance: may-be / appropriate, moderate priority. */
function familyHistorySurveillance(): MammographyRequest {
	return build({
		clinician: {
			clinicianName: 'Dr Helen Carter',
			clinicianRole: 'breast-surgeon',
			registrationBody: 'GMC',
			registrationNumber: '6643110',
			requesterContact: 'helen.carter@nhs.net',
			siteName: 'Churchill Breast Unit',
			referralDate: '2026-06-15'
		},
		patient: {
			firstName: 'Joanne',
			lastName: 'Pearce',
			dateOfBirth: '1972-07-19',
			nhsNumber: '511 222 8899',
			bodyMassIndex: 29.0
		},
		request: {
			examType: 'diagnostic',
			primaryIndication: 'family-history',
			laterality: 'bilateral',
			clinicalQuestion: 'Moderate-risk family history surveillance imaging.',
			relevantHistory: 'Mother and maternal aunt with breast cancer < 50.'
		},
		history: {
			previousMammogram: 'normal',
			familyHistoryBreastCancer: true,
			pregnancyOrLactating: 'no'
		},
		triage: { urgency: 'routine', setting: 'outpatient' }
	});
}

/** MM-2026-0004 — mismatched request, incomplete: usually-not-appropriate, query-referrer. */
function mismatchQueryReferrer(): MammographyRequest {
	return build({
		clinician: {
			clinicianName: 'Dr Tom Bridges',
			clinicianRole: 'hospital-doctor',
			registrationBody: 'GMC',
			registrationNumber: '7211098',
			referralDate: '2026-06-18'
		},
		patient: {
			firstName: 'Laura',
			lastName: 'Bennett',
			dateOfBirth: '1995-02-08',
			nhsNumber: '',
			bodyMassIndex: 22.0
		},
		request: {
			examType: 'symptomatic',
			primaryIndication: 'routine-screening',
			laterality: '',
			clinicalQuestion: '',
			relevantHistory: 'Asymptomatic; patient requested a scan.'
		},
		history: { previousMammogram: 'unknown', pregnancyOrLactating: 'unknown' },
		triage: { urgency: 'routine' }
	});
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'MM-2026-0001', patientName: 'Hughes, Margaret', data: routineScreening() },
	{ id: 'MM-2026-0002', patientName: 'Rahman, Aisha', data: breastLumpTwoWeekWait() },
	{ id: 'MM-2026-0003', patientName: 'Pearce, Joanne', data: familyHistorySurveillance() },
	{ id: 'MM-2026-0004', patientName: 'Bennett, Laura', data: mismatchQueryReferrer() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		examType: s.data.request.examType,
		indication: s.data.request.primaryIndication,
		referralDate: s.data.clinician.referralDate,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		twoWeekWaitEligible: g.twoWeekWaitEligible,
		completenessPercent: g.completenessPercent,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
