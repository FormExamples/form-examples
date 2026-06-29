import type { FiredRule, WaitingListCard, WaitingTimeStatus } from './types.js';
import {
  APPROACHING_BREACH_WINDOW_WEEKS,
  LONG_WAIT_WEEKS,
  RTT_BREACH_WEEKS,
  targetWaitWeeks
} from './priority-targets.js';
import { daysBetween, weeksBetween } from './utils.js';

export interface WaitingTimeOutcome {
  band: WaitingTimeStatus;
  targetWaitWeeks: number | null;
  daysWaited: number | null;
  weeksWaited: number | null;
  daysToTarget: number | null;
  daysToBreach: number | null;
  firedRules: FiredRule[];
}

const APPROACHING_DAYS = APPROACHING_BREACH_WINDOW_WEEKS * 7;

export function calculateWaitingTime(card: WaitingListCard, todayIso: string): WaitingTimeOutcome {
  const clockStart = card.waitingList.rttClockStartDate;
  const priority = card.waitingList.clinicalPriority;
  const target = targetWaitWeeks(priority);

  const daysWaited = daysBetween(clockStart, todayIso);
  const weeksWaited = weeksBetween(clockStart, todayIso);

  const daysToTarget = target !== null && daysWaited !== null ? Math.round(target * 7) - daysWaited : null;
  const daysToBreach = daysWaited !== null ? RTT_BREACH_WEEKS * 7 - daysWaited : null;

  const firedRules: FiredRule[] = [];

  if (clockStart === null || priority === '') {
    return {
      band: '',
      targetWaitWeeks: target,
      daysWaited,
      weeksWaited,
      daysToTarget,
      daysToBreach,
      firedRules
    };
  }

  if (priority === 'P6') {
    firedRules.push({
      ruleId: 'R-WTS-P6-001',
      instrument: 'clinical-priority',
      band: 'within-target',
      category: 'removed-from-list',
      description: 'Patient is P6 (removed from list); no waiting-time target applies.'
    });
    return {
      band: 'within-target',
      targetWaitWeeks: null,
      daysWaited,
      weeksWaited,
      daysToTarget: null,
      daysToBreach,
      firedRules
    };
  }

  if (daysWaited !== null && daysWaited > LONG_WAIT_WEEKS * 7) {
    firedRules.push({
      ruleId: 'R-LW-52WK-001',
      instrument: 'long-wait',
      band: 'long-wait',
      category: 'long-waiter',
      description: `Patient has waited more than ${LONG_WAIT_WEEKS} weeks since the RTT clock-start date.`
    });
    return {
      band: 'long-wait',
      targetWaitWeeks: target,
      daysWaited,
      weeksWaited,
      daysToTarget,
      daysToBreach,
      firedRules
    };
  }

  if (
    (daysToTarget !== null && daysToTarget < 0) ||
    (daysToBreach !== null && daysToBreach < 0)
  ) {
    if (daysToTarget !== null && daysToTarget < 0) {
      firedRules.push({
        ruleId: 'R-WTS-TARGET-001',
        instrument: 'waiting-time-status',
        band: 'breached',
        category: 'priority-target',
        description: `Patient has waited longer than the ${priority} target of ${target} weeks.`
      });
    }
    if (daysToBreach !== null && daysToBreach < 0) {
      firedRules.push({
        ruleId: 'R-WTS-RTT-001',
        instrument: 'waiting-time-status',
        band: 'breached',
        category: 'rtt-18-week',
        description: `Patient has breached the ${RTT_BREACH_WEEKS}-week NHS RTT standard.`
      });
    }
    return {
      band: 'breached',
      targetWaitWeeks: target,
      daysWaited,
      weeksWaited,
      daysToTarget,
      daysToBreach,
      firedRules
    };
  }

  if (
    (daysToTarget !== null && daysToTarget <= APPROACHING_DAYS) ||
    (daysToBreach !== null && daysToBreach <= APPROACHING_DAYS)
  ) {
    firedRules.push({
      ruleId: 'R-WTS-APPROACH-001',
      instrument: 'waiting-time-status',
      band: 'approaching-breach',
      category: 'approaching-target',
      description: `Patient is within ${APPROACHING_BREACH_WINDOW_WEEKS} weeks of their ${priority} target or the 18-week RTT standard.`
    });
    return {
      band: 'approaching-breach',
      targetWaitWeeks: target,
      daysWaited,
      weeksWaited,
      daysToTarget,
      daysToBreach,
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-WTS-WITHIN-001',
    instrument: 'waiting-time-status',
    band: 'within-target',
    category: 'within-target',
    description: `Patient is within the ${priority} target and the 18-week RTT standard.`
  });

  return {
    band: 'within-target',
    targetWaitWeeks: target,
    daysWaited,
    weeksWaited,
    daysToTarget,
    daysToBreach,
    firedRules
  };
}
