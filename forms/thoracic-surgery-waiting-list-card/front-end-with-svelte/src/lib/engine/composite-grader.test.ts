import { describe, expect, it } from 'vitest';
import { calculateWaitingTimeStatus } from './composite-grader.js';
import { createEmptyCard } from './factory.js';

function cardAt(clockStartIso: string, priority: 'P1a' | 'P1b' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6') {
  const card = createEmptyCard();
  card.waitingList.rttClockStartDate = clockStartIso;
  card.waitingList.clinicalPriority = priority;
  return card;
}

describe('calculateWaitingTimeStatus', () => {
  it('returns an empty band when the priority or clock-start is missing', () => {
    const card = createEmptyCard();
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-06-01' });
    expect(r.waitingTimeStatus).toBe('');
    expect(r.firedRules).toHaveLength(0);
  });

  it('bands a fresh P4 referral as within-target', () => {
    const r = calculateWaitingTimeStatus(cardAt('2026-05-01', 'P4'), { todayIso: '2026-05-15' });
    expect(r.waitingTimeStatus).toBe('within-target');
    expect(r.daysWaited).toBe(14);
    expect(r.targetWaitWeeks).toBe(18);
    expect(r.firedRules.some((f) => f.ruleId === 'R-WTS-WITHIN-001')).toBe(true);
  });

  it('bands a P4 referral within 4 weeks of 18-week breach as approaching-breach', () => {
    // 15 weeks waited; 21 days to RTT breach -> approaching
    const r = calculateWaitingTimeStatus(cardAt('2026-01-01', 'P4'), { todayIso: '2026-04-16' });
    expect(r.waitingTimeStatus).toBe('approaching-breach');
    expect(r.firedRules.some((f) => f.ruleId === 'R-WTS-APPROACH-001')).toBe(true);
  });

  it('bands a P4 referral past 18 weeks as breached', () => {
    const r = calculateWaitingTimeStatus(cardAt('2026-01-01', 'P4'), { todayIso: '2026-06-01' });
    expect(r.waitingTimeStatus).toBe('breached');
    expect(r.firedRules.some((f) => f.ruleId === 'R-WTS-RTT-001')).toBe(true);
  });

  it('bands a P2 referral past the 4-week target as breached', () => {
    const r = calculateWaitingTimeStatus(cardAt('2026-04-01', 'P2'), { todayIso: '2026-05-15' });
    expect(r.waitingTimeStatus).toBe('breached');
    expect(r.firedRules.some((f) => f.ruleId === 'R-WTS-TARGET-001')).toBe(true);
  });

  it('bands a > 52-week patient as long-wait regardless of priority', () => {
    const r = calculateWaitingTimeStatus(cardAt('2025-01-01', 'P5'), { todayIso: '2026-06-01' });
    expect(r.waitingTimeStatus).toBe('long-wait');
    expect(r.firedRules.some((f) => f.ruleId === 'R-LW-52WK-001')).toBe(true);
    expect(r.additionalFlags.some((f) => f.category === 'long-waiter-52-week')).toBe(true);
  });

  it('treats P6 as within-target with no target', () => {
    const r = calculateWaitingTimeStatus(cardAt('2026-01-01', 'P6'), { todayIso: '2026-06-01' });
    expect(r.waitingTimeStatus).toBe('within-target');
    expect(r.targetWaitWeeks).toBeNull();
  });

  it('flags a P1a entry with no appointment within 7 days', () => {
    const card = cardAt('2026-05-30', 'P1a');
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-31' });
    expect(r.additionalFlags.some((f) => f.category === 'priority-1-escalation')).toBe(true);
  });

  it('does not fire P1 escalation when an appointment is scheduled within 7 days', () => {
    const card = cardAt('2026-05-30', 'P1b');
    card.appointment.appointmentDate = '2026-06-01';
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-31' });
    expect(r.additionalFlags.some((f) => f.category === 'priority-1-escalation')).toBe(false);
  });

  it('flags a suspected-cancer referral with appointment > 14 days away', () => {
    const card = cardAt('2026-05-01', 'P2');
    card.referral.suspectedCancer = 'yes';
    card.appointment.appointmentDate = '2026-06-01';
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-10' });
    expect(r.additionalFlags.some((f) => f.category === 'two-week-wait-cancer')).toBe(true);
  });

  it('flags missing appointment after 14 days', () => {
    const card = cardAt('2026-05-01', 'P4');
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-20' });
    expect(r.additionalFlags.some((f) => f.category === 'missing-appointment')).toBe(true);
  });

  it('flags interpreter required when no access notes', () => {
    const card = cardAt('2026-05-01', 'P4');
    card.patient.interpreterRequired = 'yes';
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-10' });
    expect(r.additionalFlags.some((f) => f.category === 'interpreter-required')).toBe(true);
  });

  it('flags missing contact details when patient has none', () => {
    const card = cardAt('2026-05-01', 'P4');
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-10' });
    expect(r.additionalFlags.some((f) => f.category === 'contact-details-missing')).toBe(true);
  });

  it('does not flag contact when patient has email', () => {
    const card = cardAt('2026-05-01', 'P4');
    card.patient.email = 'patient@example.com';
    const r = calculateWaitingTimeStatus(card, { todayIso: '2026-05-10' });
    expect(r.additionalFlags.some((f) => f.category === 'contact-details-missing')).toBe(false);
  });
});
