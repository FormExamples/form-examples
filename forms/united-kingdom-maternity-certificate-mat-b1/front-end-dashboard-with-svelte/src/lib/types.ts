/** Patient row displayed in the clinician dashboard for UK MAT B1 */
export interface PatientRow {
	id: string;
	patientName: string;
	dateOfBirth: string;
	certificateNumber: string;
	certificateType: 'pre' | 'post';
	expectedDateOfConfinement: string;
	actualDateOfBirth: string | null;
	issuerType: 'doctor' | 'midwife';
	issuerName: string;
	issuerNmcPin: string;
	isDuplicate: boolean;
	highPriorityFlagCount: number;
	issuedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
