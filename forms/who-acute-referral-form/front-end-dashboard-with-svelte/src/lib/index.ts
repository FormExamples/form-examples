// place files you want to import through the `$lib` alias in this folder.
export { fetchPatients } from './api.ts';
export { patients } from './data.ts';
export type {
	DashboardPatientsResponse,
	ModeOfTransfer,
	PatientRow,
	TransferStatus,
} from './types.ts';
