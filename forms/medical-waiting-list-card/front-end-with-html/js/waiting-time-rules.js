import { APPROACHING_BREACH_WINDOW_WEEKS, LONG_WAIT_WEEKS, RTT_BREACH_WEEKS, daysBetween, targetWaitWeeks, weeksBetween } from './priority-targets.js';

  

  export const calculateWaitingTime = function calculateWaitingTime(card, todayIso) {
    const APPROACHING_DAYS = APPROACHING_BREACH_WINDOW_WEEKS * 7;
    const clockStart = card.waitingList.rttClockStartDate;
    const priority = card.waitingList.clinicalPriority;
    const target = targetWaitWeeks(priority);

    const daysWaited = daysBetween(clockStart, todayIso);
    const weeksWaited = weeksBetween(clockStart, todayIso);
    const daysToTarget =
      target !== null && daysWaited !== null ? Math.round(target * 7) - daysWaited : null;
    const daysToBreach = daysWaited !== null ? RTT_BREACH_WEEKS * 7 - daysWaited : null;

    const firedRules = [];

    if (!clockStart || !priority) {
      return {
        band: '',
        targetWaitWeeks: target,
        daysWaited: daysWaited,
        weeksWaited: weeksWaited,
        daysToTarget: daysToTarget,
        daysToBreach: daysToBreach,
        firedRules: firedRules
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
        daysWaited: daysWaited,
        weeksWaited: weeksWaited,
        daysToTarget: null,
        daysToBreach: daysToBreach,
        firedRules: firedRules
      };
    }

    if (daysWaited !== null && daysWaited > LONG_WAIT_WEEKS * 7) {
      firedRules.push({
        ruleId: 'R-LW-52WK-001',
        instrument: 'long-wait',
        band: 'long-wait',
        category: 'long-waiter',
        description:
          'Patient has waited more than ' + LONG_WAIT_WEEKS + ' weeks since the RTT clock-start date.'
      });
      return {
        band: 'long-wait',
        targetWaitWeeks: target,
        daysWaited: daysWaited,
        weeksWaited: weeksWaited,
        daysToTarget: daysToTarget,
        daysToBreach: daysToBreach,
        firedRules: firedRules
      };
    }

    const breached =
      (daysToTarget !== null && daysToTarget < 0) || (daysToBreach !== null && daysToBreach < 0);
    if (breached) {
      if (daysToTarget !== null && daysToTarget < 0) {
        firedRules.push({
          ruleId: 'R-WTS-TARGET-001',
          instrument: 'waiting-time-status',
          band: 'breached',
          category: 'priority-target',
          description:
            'Patient has waited longer than the ' + priority + ' target of ' + target + ' weeks.'
        });
      }
      if (daysToBreach !== null && daysToBreach < 0) {
        firedRules.push({
          ruleId: 'R-WTS-RTT-001',
          instrument: 'waiting-time-status',
          band: 'breached',
          category: 'rtt-18-week',
          description:
            'Patient has breached the ' + RTT_BREACH_WEEKS + '-week NHS RTT standard.'
        });
      }
      return {
        band: 'breached',
        targetWaitWeeks: target,
        daysWaited: daysWaited,
        weeksWaited: weeksWaited,
        daysToTarget: daysToTarget,
        daysToBreach: daysToBreach,
        firedRules: firedRules
      };
    }

    const approaching =
      (daysToTarget !== null && daysToTarget <= APPROACHING_DAYS) ||
      (daysToBreach !== null && daysToBreach <= APPROACHING_DAYS);
    if (approaching) {
      firedRules.push({
        ruleId: 'R-WTS-APPROACH-001',
        instrument: 'waiting-time-status',
        band: 'approaching-breach',
        category: 'approaching-target',
        description:
          'Patient is within ' +
          APPROACHING_BREACH_WINDOW_WEEKS +
          ' weeks of their ' +
          priority +
          ' target or the 18-week RTT standard.'
      });
      return {
        band: 'approaching-breach',
        targetWaitWeeks: target,
        daysWaited: daysWaited,
        weeksWaited: weeksWaited,
        daysToTarget: daysToTarget,
        daysToBreach: daysToBreach,
        firedRules: firedRules
      };
    }

    firedRules.push({
      ruleId: 'R-WTS-WITHIN-001',
      instrument: 'waiting-time-status',
      band: 'within-target',
      category: 'within-target',
      description:
        'Patient is within the ' + priority + ' target and the 18-week RTT standard.'
    });

    return {
      band: 'within-target',
      targetWaitWeeks: target,
      daysWaited: daysWaited,
      weeksWaited: weeksWaited,
      daysToTarget: daysToTarget,
      daysToBreach: daysToBreach,
      firedRules: firedRules
    };
  };
