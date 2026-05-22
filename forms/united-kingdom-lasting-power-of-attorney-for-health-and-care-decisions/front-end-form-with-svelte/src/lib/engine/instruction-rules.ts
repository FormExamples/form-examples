import type { FiredRule, LpaApplication } from './types.js';

const PROHIBITED_PATTERNS = [
  /assist(ed|ing)?\s+(suicide|dying|death)/i,
  /euthana/i,
  /kill\s+(me|the\s+donor)/i,
  /unlawful\s+restraint/i,
];

export function applyInstructionRules(app: LpaApplication): FiredRule[] {
  const fired: FiredRule[] = [];

  if (app.lstChoice === '') {
    fired.push({
      ruleId: 'R-MCA-LST-CHOICE',
      severity: 'fatal',
      ruleFamily: 'instruction',
      sourceCitation: 'MCA 2005 s.11(7)',
      description: 'The donor must select Option A or Option B on life-sustaining treatment.',
      suggestedCorrection: 'Choose Option A (attorneys may decide) or Option B (donor reserves the decision) on LP1H s.5.',
    });
  } else if (app.lstDonorInitialled !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-LST-INITIAL',
      severity: 'fatal',
      ruleFamily: 'instruction',
      sourceCitation: 'LP1H s.5',
      description: 'The donor must personally initial the chosen life-sustaining-treatment option.',
      suggestedCorrection: 'Have the donor initial the Option A or Option B box on LP1H s.5.',
    });
  }

  app.instructions.forEach((ins, idx) => {
    if (ins.statement.trim() && ins.lawfulnessAssessed !== 'yes') {
      fired.push({
        ruleId: `R-MCA-INSTR-LAW#${idx + 1}`,
        severity: 'high',
        ruleFamily: 'instruction',
        sourceCitation: 'MCA 2005 s.9(4)',
        description: `Instruction #${idx + 1} has not been assessed as lawful.`,
        suggestedCorrection: 'A solicitor or certificate provider should confirm the instruction is lawful and possible.',
      });
    }
    if (ins.contradictsAdrt === 'yes') {
      fired.push({
        ruleId: `R-MCA-INSTR-ADRT#${idx + 1}`,
        severity: 'high',
        ruleFamily: 'instruction',
        sourceCitation: 'MCA 2005 s.25',
        description: `Instruction #${idx + 1} contradicts a known Advance Decision to Refuse Treatment.`,
        suggestedCorrection: 'Reconcile the LPA instruction with the existing ADRT, or revoke one of them.',
      });
    }
    if (ins.statement.trim() && PROHIBITED_PATTERNS.some((p) => p.test(ins.statement))) {
      fired.push({
        ruleId: `R-MCA-COP-PROHIBITED#${idx + 1}`,
        severity: 'fatal',
        ruleFamily: 'instruction',
        sourceCitation: 'Suicide Act 1961 s.2; MCA 2005 s.6',
        description: `Instruction #${idx + 1} appears to authorise an unlawful act (assisted dying or unlawful restraint).`,
        suggestedCorrection: 'Remove or rewrite the instruction. An LPA cannot authorise unlawful acts.',
      });
    }
  });

  return fired;
}
