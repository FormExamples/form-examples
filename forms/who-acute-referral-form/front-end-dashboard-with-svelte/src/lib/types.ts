/** Mode of transfer for inter-facility transport */
export type ModeOfTransfer = 'road' | 'air' | 'sea' | '';

/** Transfer status across the two-party referral lifecycle */
export type TransferStatus =
	| 'initiated'
	| 'in-transit'
	| 'arrived'
	| 'feedback-received';

/** Patient row displayed in the clinician dashboard */
export interface PatientRow {
	id: string;
	patientName: string;
	dateOfBirth: string;
	sex: string;
	initiatingFacility: string;
	referralFacility: string;
	modeOfTransfer: ModeOfTransfer;
	primaryDiagnosis: string;
	transferStatus: TransferStatus;
	urgentFlagCount: number;
	departureTime: string;
	arrivalTime: string | null;
}

/** Response from GET /api/dashboard/patients */
export interface DashboardPatientsResponse {
	items: PatientRow[];
	total: number;
}
