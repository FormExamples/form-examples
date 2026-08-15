#!/usr/bin/env node
// Standalone Node harness cross-checking the HTML front-end's vanilla-JS
// engine (composite-grader.js) against the same boundary cases asserted by
// the SvelteKit engine's Vitest suite
// (../../front-end-with-svelte/src/lib/engine/grader.test.ts). Run with:
//
//   node js/cross-check.mjs
//
// Exits non-zero on any mismatch, so it can be wired into CI later. This is
// not a generated artefact — the assertions are curated by hand and must be
// kept in lockstep with grader.test.ts.

import { calculateHealthScreening, computeBodyMassIndex } from './composite-grader.js';
import { emptyQuestionnaire } from './types.js';

let pass = 0;
let fail = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
  } else {
    fail++;
    console.error(`FAIL ${name}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  }
}

function blank() {
  return emptyQuestionnaire();
}

function withParq(over) {
  const d = blank();
  Object.assign(d.parq, over);
  return d;
}

function allParqNo() {
  return withParq({
    parqDiagnosedHeartCondition: 'no',
    parqChestPainAtRest: 'no',
    parqChestPainDuringActivity: 'no',
    parqDizzinessOrLossOfConsciousness: 'no',
    parqOtherChronicMedicalCondition: 'no',
    parqPrescribedMedicationForChronicCondition: 'no',
    parqBoneOrJointProblem: 'no'
  });
}

function withAuditC(over) {
  const d = blank();
  Object.assign(d.smokingAlcohol, over);
  return d;
}

function withSymptom(over) {
  const d = blank();
  Object.assign(d.symptoms, over);
  return d;
}

// --- empty questionnaire ---------------------------------------------------
{
  const r = calculateHealthScreening(blank());
  check('empty: parqPlusClearance', r.parqPlusClearance, '');
  check('empty: auditCScore', r.auditCScore, null);
  check('empty: computedRiskBand', r.computedRiskBand, 'low');
  check('empty: flags', r.flags.length, 0);
}

// --- PAR-Q+ clearance --------------------------------------------------
check('parq: all no clears', calculateHealthScreening(allParqNo()).parqPlusClearance, 'cleared');

for (const field of [
  'parqDiagnosedHeartCondition',
  'parqChestPainAtRest',
  'parqChestPainDuringActivity',
  'parqDizzinessOrLossOfConsciousness',
  'parqOtherChronicMedicalCondition',
  'parqPrescribedMedicationForChronicCondition',
  'parqBoneOrJointProblem'
]) {
  const d = allParqNo();
  d.parq[field] = 'yes';
  check(`parq: ${field} yes requires further assessment`,
    calculateHealthScreening(d).parqPlusClearance, 'further-assessment-required');
}

// --- AUDIT-C band — men (5 / 8) --------------------------------------------
for (const [score, expected] of [[4, 'low'], [5, 'increasing-risk'], [7, 'increasing-risk'], [8, 'higher-risk']]) {
  const d = withAuditC({ auditCFrequency: score, auditCTypicalQuantity: 0, auditCBingeFrequency: 0 });
  d.patient.sex = 'male';
  check(`auditc male score ${score}`, calculateHealthScreening(d).auditCBand, expected);
}

// --- AUDIT-C band — women (4 / 8) ------------------------------------------
for (const [score, expected] of [[3, 'low'], [4, 'increasing-risk'], [7, 'increasing-risk'], [8, 'higher-risk']]) {
  const d = withAuditC({ auditCFrequency: score, auditCTypicalQuantity: 0, auditCBingeFrequency: 0 });
  d.patient.sex = 'female';
  check(`auditc female score ${score}`, calculateHealthScreening(d).auditCBand, expected);
}

// --- composite risk band ----------------------------------------------------
check('composite: chest pain refers urgently',
  calculateHealthScreening(withSymptom({ symptomUnexplainedChestPain: 'yes' })).computedRiskBand, 'refer-urgently');
check('composite: fainting refers urgently',
  calculateHealthScreening(withSymptom({ symptomDizzySpellsOrFainting: 'yes' })).computedRiskBand, 'refer-urgently');
check('composite: other red flag is high',
  calculateHealthScreening(withSymptom({ symptomShortnessOfBreathOnExertion: 'yes' })).computedRiskBand, 'high');

{
  const d = withAuditC({ auditCFrequency: 4, auditCTypicalQuantity: 4, auditCBingeFrequency: 0 });
  check('composite: auditc higher-risk is high', calculateHealthScreening(d).computedRiskBand, 'high');
}

{
  const d = blank();
  d.familyHistory.familyHistoryPrematureCardiacEvent = 'yes';
  d.medicalHistory.conditionHypertension = 'yes';
  check('composite: family history + condition is high', calculateHealthScreening(d).computedRiskBand, 'high');
}

{
  const d = allParqNo();
  d.parq.parqBoneOrJointProblem = 'yes';
  check('composite: parq further-assessment is moderate', calculateHealthScreening(d).computedRiskBand, 'moderate');
}

{
  const d = blank();
  d.medicalHistory.conditionAsthma = 'yes';
  check('composite: single condition is moderate', calculateHealthScreening(d).computedRiskBand, 'moderate');
}

// --- body mass index --------------------------------------------------------
check('bmi: null when missing', computeBodyMassIndex(blank()), null);
{
  const d = blank();
  d.vitals.heightAsCm = 180;
  d.vitals.weightAsKg = 81;
  check('bmi: 180cm 81kg is 25.0', computeBodyMassIndex(d), 25.0);
}

// --- paediatric routing ------------------------------------------------------
{
  const d = blank();
  d.context.assessmentDate = '2026-01-01';
  d.patient.birthDate = '2011-01-01';
  const r = calculateHealthScreening(d);
  check('paediatric: 15yo isPaediatric', r.isPaediatric, true);
  check('paediatric: 15yo computedRiskBand', r.computedRiskBand, '');
  check('paediatric: 15yo recommendation', r.computedRecommendation, 'paediatric-pathway');
}

// --- assessor override --------------------------------------------------------
{
  const d = withSymptom({ symptomUnexplainedChestPain: 'yes' });
  d.summary.overrideRiskBand = 'moderate';
  d.summary.overrideReason = 'Explained by a recent musculoskeletal injury.';
  const r = calculateHealthScreening(d);
  check('override: computed unaffected', r.computedRiskBand, 'refer-urgently');
  check('override: final follows override', r.finalRiskBand, 'moderate');
  check('override: flag still fires', r.flags.some((f) => f.category === 'urgent-cardiac-symptom'), true);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
