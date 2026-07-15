import { ageYearsAt } from './utils.js';

// Attorney rule family, ported from the SvelteKit engine.

function attorneyKey(a) {
  return `${(a.givenNames || '').trim().toLowerCase()}|${(a.familyName || '').trim().toLowerCase()}|${a.birthDate}`;
}

function applyAttorneyRules(app) {
  const fired = [];
  const { attorneys, replacementAttorneys, donor } = app;
  const signingDate = donor.capacityDeclaredAt || new Date().toISOString();

  if (attorneys.length === 0) {
    fired.push({
      ruleId: 'R-MCA-ATT-COUNT-MIN',
      severity: 'fatal',
      ruleFamily: 'attorney',
      sourceCitation: 'MCA 2005 s.10(1)',
      description: 'At least one attorney must be named.',
      suggestedCorrection: 'Name 1 to 4 attorneys on LP1H s.2.',
    });
  }

  if (attorneys.length > 4) {
    fired.push({
      ruleId: 'R-MCA-ATT-COUNT-MAX',
      severity: 'fatal',
      ruleFamily: 'attorney',
      sourceCitation: 'LP1H s.2',
      description: `Too many attorneys: ${attorneys.length}; maximum is 4.`,
      suggestedCorrection: 'Reduce the number of attorneys to four or fewer.',
    });
  }

  if (replacementAttorneys.length > 4) {
    fired.push({
      ruleId: 'R-MCA-REPL-COUNT-MAX',
      severity: 'fatal',
      ruleFamily: 'attorney',
      sourceCitation: 'LP1H s.4',
      description: `Too many replacement attorneys: ${replacementAttorneys.length}; maximum is 4.`,
      suggestedCorrection: 'Reduce the number of replacement attorneys to four or fewer.',
    });
  }

  attorneys.forEach((a, idx) => {
    const age = a.birthDate ? ageYearsAt(a.birthDate, signingDate) : null;
    if (age !== null && age < 18) {
      fired.push({
        ruleId: `R-MCA-ATT-AGE#${idx + 1}`,
        severity: 'fatal',
        ruleFamily: 'attorney',
        sourceCitation: 'MCA 2005 s.10(1)(a)',
        description: `Attorney #${idx + 1} is ${age} years old; must be 18 or older.`,
        suggestedCorrection: 'All attorneys must be at least 18 years old.',
      });
    }
    if (a.capacityDeclared !== 'yes') {
      fired.push({
        ruleId: `R-MCA-ATT-CAP#${idx + 1}`,
        severity: 'fatal',
        ruleFamily: 'attorney',
        sourceCitation: 'MCA 2005 s.10(1)(b)',
        description: `Attorney #${idx + 1} has not declared capacity to act.`,
        suggestedCorrection: 'Each attorney must confirm they have capacity to act.',
      });
    }
    if (
      (a.givenNames || '').trim().toLowerCase() === (donor.givenNames || '').trim().toLowerCase() &&
      (a.familyName || '').trim().toLowerCase() === (donor.familyName || '').trim().toLowerCase() &&
      a.birthDate === donor.birthDate &&
      a.birthDate !== ''
    ) {
      fired.push({
        ruleId: `R-MCA-ATT-NOT-DONOR#${idx + 1}`,
        severity: 'fatal',
        ruleFamily: 'attorney',
        sourceCitation: 'MCA 2005 s.10(1)',
        description: `Attorney #${idx + 1} appears to be the donor.`,
        suggestedCorrection: 'Remove the donor from the attorney list.',
      });
    }
  });

  const seen = new Map();
  attorneys.forEach((a, idx) => {
    const key = attorneyKey(a);
    if (key !== '||') {
      const positions = seen.get(key) || [];
      positions.push(idx + 1);
      seen.set(key, positions);
    }
  });
  for (const [, positions] of seen) {
    if (positions.length > 1) {
      fired.push({
        ruleId: 'R-MCA-ATT-DISTINCT',
        severity: 'fatal',
        ruleFamily: 'attorney',
        sourceCitation: 'LP1H s.2',
        description: `Duplicate attorney appears in positions ${positions.join(', ')}.`,
        suggestedCorrection: 'Each attorney must be listed only once.',
      });
      break;
    }
  }

  replacementAttorneys.forEach((r, idx) => {
    const age = r.birthDate ? ageYearsAt(r.birthDate, signingDate) : null;
    if (age !== null && age < 18) {
      fired.push({
        ruleId: `R-MCA-REPL-AGE#${idx + 1}`,
        severity: 'fatal',
        ruleFamily: 'attorney',
        sourceCitation: 'MCA 2005 s.10(1)(a)',
        description: `Replacement attorney #${idx + 1} is ${age} years old; must be 18 or older.`,
        suggestedCorrection: 'All replacement attorneys must be at least 18 years old.',
      });
    }
    const rKey = attorneyKey(r);
    if (rKey !== '||' && attorneys.some((a) => attorneyKey(a) === rKey)) {
      fired.push({
        ruleId: `R-MCA-REPL-DISTINCT#${idx + 1}`,
        severity: 'high',
        ruleFamily: 'attorney',
        sourceCitation: 'OPG LP12',
        description: `Replacement attorney #${idx + 1} is also named as a primary attorney.`,
        suggestedCorrection: 'A person cannot be both a primary and a replacement attorney.',
      });
    }
  });

  attorneys.forEach((a, idx) => {
    if (a.isBankrupt === 'yes') {
      fired.push({
        ruleId: `R-MCA-ATT-BANKRUPT#${idx + 1}`,
        severity: 'medium',
        ruleFamily: 'attorney',
        sourceCitation: 'MCA 2005 s.10(2) (bankruptcy bar applies only to P&FA LPAs)',
        description: `Attorney #${idx + 1} is bankrupt. Informational only for H&W LPAs.`,
        suggestedCorrection: 'No correction required for an H&W LPA.',
      });
    }
  });

  if (app.decisionRule === '') {
    fired.push({
      ruleId: 'R-MCA-JOINT-CHOICE',
      severity: 'high',
      ruleFamily: 'attorney',
      sourceCitation: 'LP1H s.3',
      description: 'The donor must choose how the attorneys decide together.',
      suggestedCorrection: 'Select jointly, jointly-and-severally, or mixed on LP1H s.3.',
    });
  }
  if (app.decisionRule === 'mixed' && !app.jointDecisionSet.trim()) {
    fired.push({
      ruleId: 'R-MCA-JOINT-MIXED-SCOPE',
      severity: 'high',
      ruleFamily: 'attorney',
      sourceCitation: 'LPA Regs 2007 Sch.1',
      description: 'Mixed decision-making was selected without specifying which decisions are joint.',
      suggestedCorrection: 'List the decisions that must be made jointly.',
    });
  }
  if (app.decisionRule === 'jointly' && replacementAttorneys.length > 0) {
    fired.push({
      ruleId: 'R-MCA-JOINT-COLLAPSE',
      severity: 'medium',
      ruleFamily: 'attorney',
      sourceCitation: 'OPG LP12',
      description: 'Jointly-acting attorneys collapse the whole LPA if any one drops out.',
      suggestedCorrection: 'Consider jointly-and-severally or mixed if replacements should take over.',
    });
  }

  return fired;
}

export { applyAttorneyRules };
