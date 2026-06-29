import type { CompositeRisk, FiredRule, GradingResult, OperationNote } from './types.js';
import { applyClavienDindoRules, clavienDindoToRisk } from './clavien-dindo-rules.js';
import { applyBloodLossRules, bloodLossToRisk } from './blood-loss-rules.js';
import { applyCountRules } from './count-rules.js';
import { applyNeverEventRules } from './never-event-rules.js';
import { applyAnaestheticEventRules } from './anaesthetic-event-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { maxRisk, totalTransfusionUnits } from './utils.js';

/**
 * Compute the composite operative-risk grade for an Operation Note.
 *
 * Algorithm: **max-grade** — the worst per-domain finding sets the
 * composite risk. Routine is the default when no rule fires.
 *
 * Domains evaluated:
 *   1. Clavien–Dindo (intra-op complications)
 *   2. Estimated blood loss
 *   3. Swab / needle / instrument counts
 *   4. Never events (wrong site / side / patient / procedure / implant,
 *      retained foreign body, intra-op arrest)
 *   5. Anaesthetic events (failed intubation, awareness, anaphylaxis,
 *      MH, sux apnoea)
 *   6. Transfusion (≥ 4 units PRBC or MHP activated)
 *   7. Conversion to open (only ever drives ≥ Complicated; flag in report)
 *   8. ASA Physical Status (carry-over from pre-op; ASA V/VI = Critical,
 *      ASA IV = High-risk)
 *   9. Disposition (unplanned escalation to HDU/ICU drives ≥ High-risk)
 *
 * A surgeon override on signOff may set a different `finalRisk` with a
 * documented reason; the computed grade is also retained.
 */
export function calculateOperationGrade(data: OperationNote): GradingResult {
  const firedRules: FiredRule[] = [];

  // Clavien-Dindo
  const cd = applyClavienDindoRules(data);
  firedRules.push(...cd.firedRules);
  const cdRisk = clavienDindoToRisk(cd.grade);

  // Blood loss
  const bl = applyBloodLossRules(data);
  firedRules.push(...bl.firedRules);
  const blRisk = bloodLossToRisk(bl.band);

  // Counts
  const counts = applyCountRules(data);
  firedRules.push(...counts.firedRules);

  // Never events
  const ne = applyNeverEventRules(data);
  firedRules.push(...ne.firedRules);

  // Anaesthetic events
  const ae = applyAnaestheticEventRules(data);
  firedRules.push(...ae.firedRules);

  // Transfusion (≥ 4 units PRBC or MHP) → high-risk
  const prbc = data.safetyCountsEbl.prbcUnits ?? 0;
  const mhpActivated = data.safetyCountsEbl.massiveHaemorrhageProtocolActivated === 'yes';
  let transfusionRisk: CompositeRisk = 'routine';
  if (prbc >= 4 || mhpActivated) {
    transfusionRisk = 'high-risk';
    firedRules.push({
      ruleId: 'R-TRANSFUSION-MASSIVE',
      instrument: 'blood-loss',
      grade: 'high-risk',
      category: 'transfusion',
      description: mhpActivated
        ? 'Massive haemorrhage protocol activated'
        : `${totalTransfusionUnits(data.safetyCountsEbl.prbcUnits, data.safetyCountsEbl.ffpUnits, data.safetyCountsEbl.plateletsUnits, data.safetyCountsEbl.cryoUnits)} blood-product units transfused (≥ 4 PRBC)`,
    });
  }

  // Conversion to open → complicated minimum
  let conversionRisk: CompositeRisk = 'routine';
  if (data.safetyCountsEbl.conversionToOpen === 'yes') {
    conversionRisk = 'complicated';
    firedRules.push({
      ruleId: 'R-CONVERSION-TO-OPEN',
      instrument: 'composite',
      grade: 'complicated',
      category: 'approach',
      description: 'Planned minimally-invasive case converted to open',
    });
  }

  // ASA carry-over
  const asa = data.signOff.asaPhysicalStatus;
  let asaRisk: CompositeRisk = 'routine';
  if (asa !== null) {
    if (asa >= 5) {
      asaRisk = 'critical';
      firedRules.push({
        ruleId: 'R-ASA-VVI',
        instrument: 'composite',
        grade: 'critical',
        category: 'asa',
        description: `ASA ${asa} — moribund / brain-dead patient`,
      });
    } else if (asa === 4) {
      asaRisk = 'high-risk';
      firedRules.push({
        ruleId: 'R-ASA-IV',
        instrument: 'composite',
        grade: 'high-risk',
        category: 'asa',
        description: 'ASA IV — severe systemic disease threatening life',
      });
    }
  }

  // Unplanned escalation
  let dispositionRisk: CompositeRisk = 'routine';
  if (data.postOperativePlan.unplannedEscalation === 'yes') {
    dispositionRisk = 'high-risk';
    firedRules.push({
      ruleId: 'R-UNPLANNED-ESCALATION',
      instrument: 'composite',
      grade: 'high-risk',
      category: 'disposition',
      description: 'Unplanned escalation of post-op disposition',
    });
  }

  // Max-grade combine
  const compositeRisk: CompositeRisk = [
    cdRisk,
    blRisk,
    counts.discrepancyRisk,
    ne.risk,
    ae.risk,
    transfusionRisk,
    conversionRisk,
    asaRisk,
    dispositionRisk,
  ].reduce<CompositeRisk>((acc, r) => maxRisk(acc, r), 'routine');

  const additionalFlags = detectAdditionalFlags(data);

  const surgeonOverride = data.signOff.surgeonOverrideRisk;
  const finalRisk: CompositeRisk = surgeonOverride === '' ? compositeRisk : surgeonOverride;

  return {
    compositeRisk,
    finalRisk,
    surgeonOverrideReason: data.signOff.surgeonOverrideReason,
    clavienDindoGrade: cd.grade,
    asaPhysicalStatus: asa,
    bloodLossBand: bl.band,
    countsAgreed: counts.countsAgreed,
    firedRules,
    additionalFlags,
  };
}
