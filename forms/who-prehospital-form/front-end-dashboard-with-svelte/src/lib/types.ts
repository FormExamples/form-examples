/** Scene type where EMS responded */
export type SceneType =
	| 'home'
	| 'roadside'
	| 'workplace'
	| 'public'
	| 'medical-facility'
	| 'other'
	| '';

/** Triage category: RED (immediate), YELLOW (urgent), GREEN (non-urgent) */
export type TriageCategory = 'red' | 'yellow' | 'green' | '';

/** Patient row displayed in the clinician dashboard */
export interface PatientRow {
	id: string;
	patientName: string;
	age: number;
	sex: string;
	sceneType: SceneType;
	chiefComplaint: string;
	triageCategory: TriageCategory;
	gcsTotal: number | null;
	reassessmentCount: 0 | 1 | 2 | 3;
	urgentFlagCount: number;
	providerName: string;
	dispatchedAt: string;
	handoverAt: string | null;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
