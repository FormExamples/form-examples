import type { UltrasoundRequest } from './types';

/**
 * Build a fresh, fully-blank obstetric ultrasound request. Strings default to
 * `''`; numeric / date fields default to `null` (numbers) or `''` (dates);
 * boolean red-flag / risk fields default to `false`.
 */
export function createDefaultRequest(): UltrasoundRequest {
	return {
		clinician: {
			clinicianName: '',
			clinicianRole: '',
			registrationBody: '',
			registrationNumber: '',
			requesterContact: '',
			supervisingConsultant: '',
			siteName: '',
			referralDate: ''
		},
		patient: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			nhsNumber: '',
			bodyMassIndex: null,
			interpreterRequired: false
		},
		dating: {
			lastMenstrualPeriodDate: '',
			lastMenstrualPeriodReliability: '',
			estimatedDueDate: '',
			estimatedDueDateMethod: '',
			gestationalAgeWeeks: null,
			gestationalAgeDays: null
		},
		history: {
			gravida: null,
			para: null,
			plurality: '',
			chorionicity: '',
			conceptionMethod: '',
			rhesusStatus: ''
		},
		request: {
			requestedScanType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: '',
			previousScanFinding: '',
			previousScanDate: ''
		},
		symptoms: {
			vaginalBleeding: '',
			abdominalPain: '',
			reducedFetalMovements: false,
			suspectedEctopic: false,
			haemodynamicallyUnstable: false
		},
		riskFactors: {
			hypertension: false,
			diabetes: false,
			previousGrowthRestriction: false,
			previousPretermBirth: false,
			previousCaesarean: false,
			smoker: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
