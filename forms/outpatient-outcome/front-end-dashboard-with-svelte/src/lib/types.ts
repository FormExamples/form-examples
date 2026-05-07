/** Grade values used across all OOCG domains */
export type OocgGrade = 'A' | 'B' | 'C' | 'D' | 'E';

/** NHS attendance outcome codes */
export type AttendanceOutcome =
	| 'attended'
	| 'dna'
	| 'cancelled_patient'
	| 'cancelled_provider'
	| 'rescheduled';

/** Consultation modality */
export type Modality = 'in_person' | 'telephone' | 'video';

/** Submission lifecycle status */
export type SubmissionStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** Single row displayed in the OOCG clinician dashboard */
export interface OutcomeRow {
	id: string;
	/** Formatted as "Given Family" */
	patient: string;
	nhsNumber: string;
	clinicDate: string;
	specialty: string;
	modality: Modality;
	waitTimeDays: number;
	nhsAttendanceOutcome: AttendanceOutcome;
	clinicalGrade: OocgGrade;
	promGrade: OocgGrade;
	premGrade: OocgGrade;
	operationalGrade: OocgGrade;
	overallGrade: OocgGrade;
	flagCount: number;
	status: SubmissionStatus;
}

/** Response from GET /api/dashboard/outcomes */
export interface DashboardOutcomesResponse {
	items: OutcomeRow[];
	total: number;
}
