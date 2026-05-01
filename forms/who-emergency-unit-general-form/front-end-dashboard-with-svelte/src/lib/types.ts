/** Mode by which the patient arrived at the emergency unit */
export type ArrivalMode = 'walking' | 'wheelchair' | 'stretcher' | 'ambulance' | '';

/** AVPU level of consciousness: Alert, Verbal, Pain, Unresponsive */
export type Avpu = 'A' | 'V' | 'P' | 'U' | '';

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
	arrivalMode: ArrivalMode;
	chiefComplaint: string;
	avpu: Avpu;
	highRiskSignsPresent: boolean;
	disposition: Disposition;
	urgentFlagCount: number;
	providerName: string;
	dispositionAt: string | null;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
