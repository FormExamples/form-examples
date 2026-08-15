import type { ClinicalPriority, WaitingListCard, WaitingTimeStatus } from '#lib/engine/types.js';
import { calculateWaitingTimeStatus } from '#lib/engine/composite-grader.js';
import { createEmptyCard } from '#lib/engine/factory.js';

/**
 * Fixed reference "today" used to derive the dashboard rows so the sample bands
 * (within-target / approaching-breach / breached / long-wait) stay stable
 * regardless of when the page is viewed.
 */
const REFERENCE_TODAY = '2026-06-28';

/** A sample card: an identifier and the full data the engine grades. */
export interface SampleCard {
  id: string;
  patientName: string;
  data: WaitingListCard;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  specialty: string;
  clinicalPriority: ClinicalPriority;
  rttClockStartDate: string;
  weeksWaited: number | null;
  waitingTimeStatus: WaitingTimeStatus;
  nextAppointmentDate: string | null;
  practitionerName: string;
  flagCount: number;
}

/** A fresh P4 routine referral comfortably within both targets. */
function withinTarget(): WaitingListCard {
  const c = createEmptyCard();
  c.status = 'submitted';
  c.practitioner = { ...c.practitioner, name: 'Dr Sara Patel', role: 'consultant', organisationName: 'Royal Orthopaedic Hospital' };
  c.patient = { ...c.patient, name: 'Alice Anderson', unitedKingdomNhsNumber: '485 777 3456', email: 'alice.anderson@example.com', phone: '07700 900123' };
  c.referral = { ...c.referral, referralSource: 'gp', referralDate: '2026-04-28', reasonForReferral: 'Right knee osteoarthritis', presentingCondition: 'Progressive knee pain', suspectedCancer: 'no' };
  c.waitingList = { ...c.waitingList, listName: 'Orthopaedic — knee replacement', specialty: 'Trauma & Orthopaedics', procedureDescription: 'Right total knee replacement', clinicalPriority: 'P4', rttClockStartDate: '2026-05-01', expectedProcedureType: 'inpatient-procedure', expectedWaitWeeks: 16 };
  c.appointment = { ...c.appointment, appointmentDate: '2026-07-10', appointmentType: 'pre-assessment', siteName: 'Royal Orthopaedic Hospital — Outpatients', status: 'confirmed' };
  c.communication = { ...c.communication, consentToReminders: 'yes' };
  return c;
}

/** A P4 routine referral within four weeks of the 18-week RTT breach. */
function approachingBreach(): WaitingListCard {
  const c = createEmptyCard();
  c.status = 'submitted';
  c.practitioner = { ...c.practitioner, name: 'Mr Tom Wilkins', role: 'consultant', organisationName: "St Mary's Hospital" };
  c.patient = { ...c.patient, name: 'Brian Brown', unitedKingdomNhsNumber: '623 998 1122', email: 'brian.brown@example.com', phone: '07700 900456' };
  c.referral = { ...c.referral, referralSource: 'gp', referralDate: '2026-03-08', reasonForReferral: 'Symptomatic gallstones', presentingCondition: 'Recurrent biliary colic', suspectedCancer: 'no' };
  c.waitingList = { ...c.waitingList, listName: 'General Surgery — cholecystectomy', specialty: 'General Surgery', procedureDescription: 'Laparoscopic cholecystectomy', clinicalPriority: 'P4', rttClockStartDate: '2026-03-10', expectedProcedureType: 'day-case-procedure', expectedWaitWeeks: 17 };
  c.appointment = { ...c.appointment, appointmentDate: '2026-07-05', appointmentType: 'procedure', siteName: "St Mary's Hospital — Day Surgery Unit", status: 'scheduled' };
  c.communication = { ...c.communication, consentToReminders: 'yes' };
  return c;
}

/** A P2 time-critical cancer referral past the 4-week target. */
function breached(): WaitingListCard {
  const c = createEmptyCard();
  c.status = 'submitted';
  c.practitioner = { ...c.practitioner, name: 'Dr Helen Macleod', role: 'consultant', organisationName: 'Cardiothoracic Centre' };
  c.patient = { ...c.patient, name: 'Catherine Carter', unitedKingdomNhsNumber: '711 442 5566', email: 'catherine.carter@example.com', phone: '07700 900789' };
  c.referral = { ...c.referral, referralSource: 'consultant', referralDate: '2026-04-30', reasonForReferral: 'Suspected lung malignancy on imaging', presentingCondition: 'Chest mass on CT', suspectedCancer: 'yes' };
  c.waitingList = { ...c.waitingList, listName: 'Cardiothoracic — rapid access', specialty: 'Cardiology', procedureDescription: 'Diagnostic bronchoscopy', clinicalPriority: 'P2', rttClockStartDate: '2026-05-01', expectedProcedureType: 'diagnostic', expectedWaitWeeks: 4 };
  c.appointment = { ...c.appointment, appointmentDate: '2026-07-20', appointmentType: 'diagnostic', siteName: 'Cardiothoracic Centre — Rapid Access Clinic', status: 'scheduled' };
  c.communication = { ...c.communication, consentToReminders: 'yes' };
  return c;
}

/** A P4 patient who has waited more than 52 weeks with no appointment booked. */
function longWait(): WaitingListCard {
  const c = createEmptyCard();
  c.status = 'submitted';
  c.practitioner = { ...c.practitioner, name: 'Mr Rohit Singh', role: 'consultant', organisationName: 'ENT Centre' };
  c.patient = { ...c.patient, name: 'Eleanor Evans', unitedKingdomNhsNumber: '935 110 4477', interpreterRequired: 'no' };
  c.referral = { ...c.referral, referralSource: 'gp', referralDate: '2025-03-28', reasonForReferral: 'Recurrent tonsillitis', presentingCondition: 'Chronic tonsillitis', suspectedCancer: 'no' };
  c.waitingList = { ...c.waitingList, listName: 'ENT — tonsillectomy', specialty: 'ENT', procedureDescription: 'Tonsillectomy', clinicalPriority: 'P4', rttClockStartDate: '2025-04-01', expectedProcedureType: 'day-case-procedure', expectedWaitWeeks: 26 };
  c.appointment = { ...c.appointment, status: 'scheduled' };
  c.communication = { ...c.communication, consentToReminders: 'no' };
  return c;
}

/** The sample cards, keyed by stable id (used to seed the wizard). */
export const sampleCards: SampleCard[] = [
  { id: 'WLC-2026-0001', patientName: 'Anderson, Alice', data: withinTarget() },
  { id: 'WLC-2026-0002', patientName: 'Brown, Brian', data: approachingBreach() },
  { id: 'WLC-2026-0003', patientName: 'Carter, Catherine', data: breached() },
  { id: 'WLC-2026-0004', patientName: 'Evans, Eleanor', data: longWait() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCardRows: DashboardRow[] = sampleCards.map((s) => {
  const g = calculateWaitingTimeStatus(s.data, { todayIso: REFERENCE_TODAY });
  return {
    id: s.id,
    patientName: s.patientName,
    specialty: s.data.waitingList.specialty,
    clinicalPriority: s.data.waitingList.clinicalPriority,
    rttClockStartDate: s.data.waitingList.rttClockStartDate ?? '',
    weeksWaited: g.weeksWaited,
    waitingTimeStatus: g.waitingTimeStatus,
    nextAppointmentDate: s.data.appointment.appointmentDate,
    practitionerName: s.data.practitioner.name,
    flagCount: g.additionalFlags.length
  };
});
