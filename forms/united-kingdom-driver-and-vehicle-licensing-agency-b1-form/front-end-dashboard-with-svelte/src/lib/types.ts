/** Applicant row displayed in the DVLA B1 clinician dashboard */
export interface PatientRow {
	id: string;
	applicantName: string;
	dateOfBirth: string;
	drivingLicenceNumber: string;
	conditionsDeclared: number;
	epilepsyDeclared: boolean;
	validationCompleteness: number;
	highPriorityFlagCount: number;
	submittedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
