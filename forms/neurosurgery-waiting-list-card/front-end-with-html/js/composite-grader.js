import { detectAdditionalFlags } from './flagged-issues.js';
import { daysBetween, todayIso } from './priority-targets.js';
import { calculateWaitingTime } from './waiting-time-rules.js';

  

  export const calculateWaitingTimeStatus = function calculateWaitingTimeStatus(card, options) {
    const today = (options && options.todayIso) || todayIso();
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
      daysToAppointment: daysToAppointment,
      firedRules: wt.firedRules,
      additionalFlags: additionalFlags,
      graderNotes: ''
    };
  };
