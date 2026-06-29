import type { FitnessBand, FiredRule, GradingResult, MedifAssessment } from './types.js';
import { applyEquipmentRules } from './equipment-rules.js';
import { applyRecentEventRules } from './recent-event-rules.js';
import { applyCardioRespRules } from './cardiorespiratory-rules.js';
import { applyPregnancyRules } from './pregnancy-rules.js';
import { applyCommunicableRules } from './communicable-rules.js';
import { detectSafetyFlags } from './flagged-issues.js';
import { addDaysIso, deskRecommendationFor, maxBand } from './utils.js';

export function evaluateFitnessToFly(data: MedifAssessment): GradingResult {
  const firedRules: FiredRule[] = [
    ...applyEquipmentRules(data),
    ...applyRecentEventRules(data),
    ...applyCardioRespRules(data),
    ...applyPregnancyRules(data),
    ...applyCommunicableRules(data),
  ];

  const fitnessBand: FitnessBand = firedRules.reduce<FitnessBand>(
    (acc, r) => maxBand(acc, r.band),
    'fit',
  );

  const safetyFlags = detectSafetyFlags(data);

  const baseDate =
    data.signoff.physicianSignatureDate || data.physician.signatureDate || new Date().toISOString().slice(0, 10);
  const validUntil = addDaysIso(baseDate, 14);

  return {
    fitnessBand,
    firedRules,
    safetyFlags,
    deskRecommendation: deskRecommendationFor(fitnessBand),
    validUntil,
  };
}
