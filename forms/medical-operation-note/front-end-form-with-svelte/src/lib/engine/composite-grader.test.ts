import { describe, it, expect } from 'vitest';
import { calculateOperationGrade } from './composite-grader.js';
import { createEmptyOperationNote } from './factory.js';

describe('calculateOperationGrade', () => {
  it('returns routine for an empty operation note', () => {
    const data = createEmptyOperationNote();
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('routine');
    expect(r.finalRisk).toBe('routine');
    expect(r.clavienDindoGrade).toBe('0');
    expect(r.bloodLossBand).toBe('minimal');
    expect(r.countsAgreed).toBe(false);
    expect(r.firedRules).toHaveLength(0);
    expect(r.additionalFlags).toHaveLength(0);
  });

  it('grades a mild EBL (300 mL) as routine', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 300;
    const r = calculateOperationGrade(data);
    expect(r.bloodLossBand).toBe('mild');
    expect(r.compositeRisk).toBe('routine');
  });

  it('grades a moderate EBL (1000 mL) as complicated', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 1000;
    const r = calculateOperationGrade(data);
    expect(r.bloodLossBand).toBe('moderate');
    expect(r.compositeRisk).toBe('complicated');
  });

  it('grades EBL > 1500 mL as high-risk and raises massive-haemorrhage flag', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 2000;
    const r = calculateOperationGrade(data);
    expect(r.bloodLossBand).toBe('severe');
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.additionalFlags.some((f) => f.category === 'massive-haemorrhage')).toBe(true);
    expect(r.firedRules.some((f) => f.ruleId === 'R-EBL-MASSIVE-HAEMORRHAGE')).toBe(true);
  });

  it('grades EBL > 3000 mL as critical', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 3500;
    const r = calculateOperationGrade(data);
    expect(r.bloodLossBand).toBe('massive');
    expect(r.compositeRisk).toBe('critical');
  });

  it('count discrepancy forces high-risk and adds incorrect-count flag', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.swabCountAgreed = 'no';
    data.safetyCountsEbl.needleCountAgreed = 'yes';
    data.safetyCountsEbl.instrumentCountAgreed = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.countsAgreed).toBe(false);
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.additionalFlags.some((f) => f.category === 'incorrect-count')).toBe(true);
  });

  it('retained foreign body forces critical', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.retainedForeignBody = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('critical');
    expect(r.additionalFlags.some((f) => f.category === 'retained-foreign-body')).toBe(true);
  });

  it('never-event token wrong-site forces critical', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.neverEventFlags = 'wrong-site';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('critical');
    expect(r.additionalFlags.some((f) => f.category === 'never-event')).toBe(true);
  });

  it('ignores unknown never-event tokens', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.neverEventFlags = 'nonsense-token, another';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('routine');
  });

  it('intra-operative arrest forces critical', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.intraOperativeArrest = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('critical');
    expect(r.additionalFlags.some((f) => f.category === 'intra-operative-arrest')).toBe(true);
  });

  it('massive transfusion (>= 4 PRBC) forces high-risk and raises flag', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.prbcUnits = 4;
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.additionalFlags.some((f) => f.category === 'massive-transfusion')).toBe(true);
  });

  it('massive haemorrhage protocol activation raises massive-transfusion flag', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.massiveHaemorrhageProtocolActivated = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.additionalFlags.some((f) => f.category === 'massive-transfusion')).toBe(true);
  });

  it('conversion to open forces complicated and raises flag', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.conversionToOpen = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('complicated');
    expect(r.additionalFlags.some((f) => f.category === 'conversion-to-open')).toBe(true);
  });

  it('major anaesthetic event (failed-intubation) forces high-risk', () => {
    const data = createEmptyOperationNote();
    data.anaesthesia.events = 'failed-intubation';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.additionalFlags.some((f) => f.category === 'anaesthetic-incident')).toBe(true);
  });

  it('minor anaesthetic event (hypotension) only forces complicated', () => {
    const data = createEmptyOperationNote();
    data.anaesthesia.events = 'hypotension';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('complicated');
    expect(r.additionalFlags.some((f) => f.category === 'anaesthetic-incident')).toBe(false);
  });

  it('ASA IV forces high-risk; ASA V forces critical', () => {
    const data4 = createEmptyOperationNote();
    data4.signOff.asaPhysicalStatus = 4;
    expect(calculateOperationGrade(data4).compositeRisk).toBe('high-risk');

    const data5 = createEmptyOperationNote();
    data5.signOff.asaPhysicalStatus = 5;
    expect(calculateOperationGrade(data5).compositeRisk).toBe('critical');
  });

  it('takes the worst grade across multiple domains (max-grade)', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 700; // complicated
    data.safetyCountsEbl.conversionToOpen = 'yes'; // complicated
    data.safetyCountsEbl.retainedForeignBody = 'yes'; // critical
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('critical');
  });

  it('surgeon override sets finalRisk but preserves computed compositeRisk', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.estimatedBloodLossMl = 2000; // high-risk
    data.signOff.surgeonOverrideRisk = 'complicated';
    data.signOff.surgeonOverrideReason = 'Bleeding from known liver capsule; controlled within 2 min';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.finalRisk).toBe('complicated');
    expect(r.surgeonOverrideReason).toContain('Bleeding from known liver capsule');
  });

  it('unplanned escalation to HDU flags unplanned-icu and raises composite risk', () => {
    const data = createEmptyOperationNote();
    data.postOperativePlan.unplannedEscalation = 'yes';
    data.postOperativePlan.recoveryDestination = 'hdu';
    const r = calculateOperationGrade(data);
    expect(r.compositeRisk).toBe('high-risk');
    expect(r.additionalFlags.some((f) => f.category === 'unplanned-icu-admission')).toBe(true);
  });

  it('implant placed without registry submission raises implant-registry flag', () => {
    const data = createEmptyOperationNote();
    data.materialsImplants.prostheticJoints = 'Stryker Triathlon TKR';
    data.materialsImplants.registrySubmitted = 'no';
    const r = calculateOperationGrade(data);
    expect(r.additionalFlags.some((f) => f.category === 'implant-registry-pending')).toBe(true);
  });

  it('documentation gap raises low-priority documentation-gap flag', () => {
    const data = createEmptyOperationNote();
    data.signOff.documentationGap = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.additionalFlags.some((f) => f.category === 'documentation-gap' && f.priority === 'low')).toBe(true);
  });

  it('all counts agreed → countsAgreed true', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.swabCountAgreed = 'yes';
    data.safetyCountsEbl.needleCountAgreed = 'yes';
    data.safetyCountsEbl.instrumentCountAgreed = 'yes';
    const r = calculateOperationGrade(data);
    expect(r.countsAgreed).toBe(true);
  });
});
