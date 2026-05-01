/** Triage category assigned in the emergency unit */
export type TriageCategory = 'red' | 'yellow' | 'green' | '';

/** Mechanism of injury */
export type Mechanism =
	| 'road-traffic'
	| 'fall'
	| 'penetrating'
	| 'blunt'
	| 'burn'
	| 'other'
	| '';

/** Disposition outcome from the emergency unit */
export type Disposition =
	| 'admit'
	| 'transfer'
	| 'discharge'
	| 'died'
	| 'lwbs'
	| '';

/** Patient row displayed in the clinician dashboard */
export interface PatientRow {
	id: string;
	patientName: string;
	dateOfBirth: string;
	sex: string;
	injuryLocation: string;
	triageCategory: TriageCategory;
	deadOnArrival: boolean;
	mechanism: Mechanism;
	gcsTotal: number | null;
	fastPositive: boolean;
	urgentFlagCount: number;
	disposition: Disposition;
	providerName: string;
	dispositionAt: string | null;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
