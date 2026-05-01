/** Patient row displayed in the clinician dashboard */
export interface PatientRow {
	id: string;
	nhsNumber: string;
	patientName: string;
	depressionSeverity: string;
	anxietySeverity: string;
	stressSeverity: string;
	suicidalIdeationFlag: boolean;
	completedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
