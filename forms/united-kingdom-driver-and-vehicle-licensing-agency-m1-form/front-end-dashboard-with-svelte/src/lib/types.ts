/** Patient row displayed in the clinician dashboard for the UK DVLA M1 form */
export interface PatientRow {
	id: string;
	applicantName: string;
	dateOfBirth: string;
	drivingLicenceNumber: string;
	mentalHealthConditions: string[];
	suicidalThoughtsVariant: boolean;
	recentContact: boolean;
	highPriorityFlagCount: number;
	submittedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
