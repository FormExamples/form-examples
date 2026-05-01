// place files you want to import through the `$lib` alias in this folder.
export { fetchPatients } from './api.ts';
export { patients } from './data.ts';
export type {
	ArrivalMode,
	Avpu,
	DashboardPatientsResponse,
	Disposition,
	PatientRow,
} from './types.ts';
