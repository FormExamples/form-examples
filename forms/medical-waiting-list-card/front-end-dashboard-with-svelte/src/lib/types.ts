// Dashboard row type — a compact summary of one waiting list card.
//
// camelCase property names mirror the SvelteKit form and the Rust backend
// serde rename_all = "camelCase".

export type WaitingTimeStatus =
  | 'within-target'
  | 'approaching-breach'
  | 'breached'
  | 'long-wait';

export type ClinicalPriority = 'P1a' | 'P1b' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

export type FlagPriority = 'low' | 'medium' | 'high';

export interface SummaryFlag {
  category: string;
  priority: FlagPriority;
}

export interface WaitingListCardSummary {
  id: string;
  patientName: string;
  nhsNumber: string;
  specialty: string;
  procedureDescription: string;
  clinicalPriority: ClinicalPriority;
  rttClockStartDate: string;
  weeksWaited: number;
  waitingTimeStatus: WaitingTimeStatus;
  nextAppointmentDate: string | null;
  nextAppointmentSite: string;
  practitionerName: string;
  flags: SummaryFlag[];
}
