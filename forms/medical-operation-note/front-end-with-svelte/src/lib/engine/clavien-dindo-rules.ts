import type {
  ClavienDindoGrade,
  CompositeRisk,
  FiredRule,
  OperationNote,
} from './types.js';

/**
 * Map a Clavien–Dindo grade to the composite-risk band it drives.
 *
 *   0          → routine
 *   I, II      → complicated
 *   IIIa, IIIb → high-risk
 *   IVa, IVb, V → critical
 */
export function clavienDindoToRisk(grade: ClavienDindoGrade): CompositeRisk {
  switch (grade) {
    case '0':
      return 'routine';
    case 'I':
    case 'II':
      return 'complicated';
    case 'IIIa':
    case 'IIIb':
      return 'high-risk';
    case 'IVa':
    case 'IVb':
    case 'V':
      return 'critical';
  }
}

/**
 * Resolve the recorded Clavien–Dindo grade (defaults to '0' when not yet
 * recorded), and emit a FiredRule describing the contribution.
 */
export function applyClavienDindoRules(data: OperationNote): {
  grade: ClavienDindoGrade;
  firedRules: FiredRule[];
} {
  const recorded = data.safetyCountsEbl.clavienDindoGrade;
  const grade: ClavienDindoGrade = recorded === '' ? '0' : recorded;
  if (grade === '0') return { grade, firedRules: [] };

  return {
    grade,
    firedRules: [
      {
        ruleId: `R-CD-${grade}`,
        instrument: 'clavien-dindo',
        grade,
        category: 'complication',
        description: `Clavien–Dindo grade ${grade} intra-operative complication`,
      },
    ],
  };
}
