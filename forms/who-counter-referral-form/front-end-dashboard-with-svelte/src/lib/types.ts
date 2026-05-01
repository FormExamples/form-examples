/** Recommended follow-up timeframe for the counter-referred patient */
export type FollowUpTimeframe =
	| 'urgent'
	| '2-6-days'
	| '1-2-weeks'
	| 'over-2-weeks';

/** Patient row displayed in the clinician dashboard */
export interface PatientRow {
	id: string;
	patientName: string;
	dateOfBirth: string;
	sex: string;
	referralFacility: string;
	primaryCareFacility: string;
	finalDiagnosis: string;
	followUpTimeframe: FollowUpTimeframe;
	statusFlags: string[];
	patientFamilyInformed: boolean;
	highPriorityFlagCount: number;
	dischargedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
