import type { AdditionalFlag, WaitingListCard } from './types.js';
import { daysBetween } from './utils.js';
import { LONG_WAIT_WEEKS } from './priority-targets.js';

const TWO_WEEK_WAIT_DAYS = 14;
const PRIORITY_1_DAYS = 7;
const MISSING_APPOINTMENT_DAYS = 14;

export function detectAdditionalFlags(card: WaitingListCard, todayIso: string): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];
  const { waitingList, appointment, referral, patient } = card;

  const daysWaited = daysBetween(waitingList.rttClockStartDate, todayIso);
  const daysToAppointment = daysBetween(todayIso, appointment.appointmentDate);

  if (daysWaited !== null && daysWaited > LONG_WAIT_WEEKS * 7) {
    flags.push({
      flagId: 'F-LONG-WAITER-001',
      category: 'long-waiter-52-week',
      priority: 'high',
      description: `Patient has waited more than ${LONG_WAIT_WEEKS} weeks. Mandatory long-waiter review required.`,
      suggestedAction: 'Trigger long-waiter harm-review process and contact the patient.'
    });
  }

  if (
    (waitingList.clinicalPriority === 'P1a' || waitingList.clinicalPriority === 'P1b') &&
    (daysToAppointment === null || daysToAppointment > PRIORITY_1_DAYS)
  ) {
    flags.push({
      flagId: 'F-P1-ESCALATION-001',
      category: 'priority-1-escalation',
      priority: 'high',
      description: `Priority-1 patient (${waitingList.clinicalPriority}) has no appointment within ${PRIORITY_1_DAYS} days.`,
      suggestedAction: 'Escalate to the on-call consultant and booking lead immediately.'
    });
  }

  if (
    referral.suspectedCancer === 'yes' &&
    (daysToAppointment === null || daysToAppointment > TWO_WEEK_WAIT_DAYS)
  ) {
    flags.push({
      flagId: 'F-2WW-CANCER-001',
      category: 'two-week-wait-cancer',
      priority: 'high',
      description: `Suspected-cancer referral has no appointment within ${TWO_WEEK_WAIT_DAYS} days.`,
      suggestedAction: 'Book a two-week-wait clinic slot or escalate to cancer pathway navigator.'
    });
  }

  if (
    appointment.appointmentDate === null &&
    daysWaited !== null &&
    daysWaited > MISSING_APPOINTMENT_DAYS
  ) {
    flags.push({
      flagId: 'F-MISSING-APPT-001',
      category: 'missing-appointment',
      priority: 'medium',
      description: `No appointment scheduled more than ${MISSING_APPOINTMENT_DAYS} days after RTT clock-start.`,
      suggestedAction: 'Contact the patient and book the next appropriate appointment.'
    });
  }

  if (patient.interpreterRequired === 'yes' && appointment.accessNotes.trim() === '') {
    flags.push({
      flagId: 'F-INTERPRETER-001',
      category: 'interpreter-required',
      priority: 'medium',
      description: 'Patient requires an interpreter but no booking is recorded in the appointment access notes.',
      suggestedAction: 'Book the interpreter and record the booking reference in the appointment access notes.'
    });
  }

  if (
    patient.accessibilityNeeds.trim() !== '' &&
    appointment.appointmentDate !== null &&
    appointment.accessNotes.trim() === ''
  ) {
    flags.push({
      flagId: 'F-ACCESS-UNMET-001',
      category: 'accessibility-unmet',
      priority: 'medium',
      description:
        'Patient has recorded accessibility needs but the appointment access notes are empty.',
      suggestedAction:
        'Confirm the appointment location meets the recorded accessibility needs and document in access notes.'
    });
  }

  const hasContact =
    patient.email.trim() !== '' ||
    patient.phone.trim() !== '' ||
    patient.postalAddressAsFullText.trim() !== '';
  if (!hasContact) {
    flags.push({
      flagId: 'F-NO-CONTACT-001',
      category: 'contact-details-missing',
      priority: 'low',
      description: 'No email, phone, or postal address recorded for the patient.',
      suggestedAction: 'Contact the patient or GP practice to confirm at least one channel.'
    });
  }

  return flags;
}
