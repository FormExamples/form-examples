/** Patient row displayed in the clinician dashboard for the UK DVLA V1 form. */
export interface PatientRow {
	id: string;
	applicantName: string;
	dateOfBirth: string;
	drivingLicenceNumber: string;
	monocularVision: boolean;
	glaucomaDeclared: boolean;
	diplopiaDeclared: boolean;
	highPriorityFlagCount: number;
	validationCompleteness: number;
	submittedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
