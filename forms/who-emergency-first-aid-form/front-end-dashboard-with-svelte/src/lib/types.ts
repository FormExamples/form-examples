/** Problem type per WHO Emergency First Aid form (medical vs trauma) */
export type ProblemType = 'medical' | 'trauma' | '';

/** Glasgow Coma Scale level captured under Disability (D) */
export type GcsLevel = 'alert' | 'confused' | 'unconscious' | '';

/** Patient row displayed in the CFAR clinician dashboard */
export interface PatientRow {
	id: string;
	patientName: string;
	age: number | null;
	sex: string;
	problemType: ProblemType;
	majorBleeding: boolean;
	tourniquetApplied: boolean;
	airwayIntervention: boolean;
	gcsLevel: GcsLevel;
	urgentFlagCount: number;
	recordedBy: string;
	recordedAt: string;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
