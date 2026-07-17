import type { GradingResult, WaitingListCard } from './types.js';
import { calculateWaitingTime } from './waiting-time-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { daysBetween, todayIso as nowIso } from './utils.js';

export interface CalculateOptions {
  todayIso?: string;
}

export function calculateWaitingTimeStatus(
  card: WaitingListCard,
  options: CalculateOptions = {}
): GradingResult {
  const today = options.todayIso ?? nowIso();
  const wt = calculateWaitingTime(card, today);
  const additionalFlags = detectAdditionalFlags(card, today);

  const daysToAppointment = daysBetween(today, card.appointment.appointmentDate);

  return {
    waitingTimeStatus: wt.band,
    clinicalPriority: card.waitingList.clinicalPriority,
    targetWaitWeeks: wt.targetWaitWeeks,
    daysWaited: wt.daysWaited,
    weeksWaited: wt.weeksWaited,
    daysToTarget: wt.daysToTarget,
    daysToBreach: wt.daysToBreach,
    daysToAppointment,
    firedRules: wt.firedRules,
    additionalFlags,
    graderNotes: ''
  };
}
