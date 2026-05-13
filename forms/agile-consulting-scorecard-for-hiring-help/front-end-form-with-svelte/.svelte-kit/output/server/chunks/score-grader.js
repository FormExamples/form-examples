function answerToPoints(answer) {
  return answer === true ? 1 : 0;
}
function answerToGrade(answer) {
  if (answer === true) return "yes";
  if (answer === false) return "no";
  return "unanswered";
}
function totalToBand(total) {
  if (total <= 4) return "low";
  if (total === 5) return "borderline";
  if (total <= 10) return "medium";
  return "high";
}
function bandToRecommendation(band) {
  switch (band) {
    case "low":
      return "do-not-hire-yet";
    case "borderline":
      return "do-homework-first";
    case "medium":
      return "do-homework-first";
    case "high":
      return "trial-engagement";
  }
}
const MANIFESTO = [
  {
    itemNumber: 1,
    ruleId: "R-MANIFESTO-1",
    category: "individuals-and-interactions",
    description: "Every leader is in conversation with customers >=1 hour per week, with weekly results radiated to stakeholders.",
    get: (m) => m.m1.done
  },
  {
    itemNumber: 2,
    ruleId: "R-MANIFESTO-2",
    category: "working-software",
    description: 'The team has launched a brand-new "hello world" program to production and discussed the experience.',
    get: (m) => m.m2.done
  },
  {
    itemNumber: 3,
    ruleId: "R-MANIFESTO-3",
    category: "customer-collaboration",
    description: "The organization has bought copies of the customer's favourite book and shared with the team (org spend, not personal).",
    get: (m) => m.m3.done
  },
  {
    itemNumber: 4,
    ruleId: "R-MANIFESTO-4",
    category: "responding-to-change",
    description: "Every senior leader (BoD/CXO/VP/Dir) has read one agile change-management book and shared three takeaways.",
    get: (m) => m.m4.done
  }
];
function gradeManifesto(items) {
  let subtotal = 0;
  const firedRules = [];
  for (const spec of MANIFESTO) {
    const answer = spec.get(items);
    const points = answerToPoints(answer);
    subtotal += points;
    firedRules.push({
      ruleId: spec.ruleId,
      instrument: "manifesto",
      itemNumber: spec.itemNumber,
      grade: answerToGrade(answer),
      pointsAwarded: points,
      category: spec.category,
      description: spec.description
    });
  }
  return { subtotal, firedRules };
}
const PRINCIPLES = [
  {
    itemNumber: 5,
    principleNumber: 1,
    ruleId: "R-PRINCIPLES-1",
    category: "customer-satisfaction",
    description: "Every product lead measures customer Net Promoter Score (NPS).",
    get: (p) => p.p1.done
  },
  {
    itemNumber: 6,
    principleNumber: 2,
    ruleId: "R-PRINCIPLES-2",
    category: "welcome-changing-requirements",
    description: 'The "hello world" program has been internationalized to >=1 additional language using the user locale.',
    get: (p) => p.p2.done
  },
  {
    itemNumber: 7,
    principleNumber: 3,
    ruleId: "R-PRINCIPLES-3",
    category: "deliver-frequently",
    description: 'The internationalized "hello world" version has been launched to production and verified by a native speaker.',
    get: (p) => p.p3.done
  },
  {
    itemNumber: 8,
    principleNumber: 4,
    ruleId: "R-PRINCIPLES-4",
    category: "business-and-developers-together",
    description: "Commitment is in place from every product / project / programme / practice lead.",
    get: (p) => p.p4.done
  },
  {
    itemNumber: 9,
    principleNumber: 5,
    ruleId: "R-PRINCIPLES-5",
    category: "motivated-individuals",
    description: "A 3-amigos team (business + dev + test) has shipped a real new MVP within 30 days and on budget.",
    get: (p) => p.p5.done
  },
  {
    itemNumber: 10,
    principleNumber: 6,
    ruleId: "R-PRINCIPLES-6",
    category: "face-to-face",
    description: "Every product owner has committed to >=50% face-to-face time (or weekly-video equivalent for remote teams).",
    get: (p) => p.p6.done
  },
  {
    itemNumber: 11,
    principleNumber: 7,
    ruleId: "R-PRINCIPLES-7",
    category: "working-software-is-primary-measure",
    description: 'A new "fizz buzz" program has been created and shipped to production.',
    get: (p) => p.p7.done
  },
  {
    itemNumber: 12,
    principleNumber: 8,
    ruleId: "R-PRINCIPLES-8",
    category: "sustainable-pace",
    description: "All staff have a sustaining budget for >=1 year secured.",
    get: (p) => p.p8.done
  },
  {
    itemNumber: 13,
    principleNumber: 9,
    ruleId: "R-PRINCIPLES-9",
    category: "technical-excellence",
    description: "Quality-attribute metrics are wired into pre-commit hooks and continuous integration.",
    get: (p) => p.p9.done
  },
  {
    itemNumber: 14,
    principleNumber: 10,
    ruleId: "R-PRINCIPLES-10",
    category: "simplicity",
    description: "Every product team has >=2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC).",
    get: (p) => p.p10.done
  },
  {
    itemNumber: 15,
    principleNumber: 11,
    ruleId: "R-PRINCIPLES-11",
    category: "self-organizing-teams",
    description: 'A 5-point Likert "our team is self-organizing" averages "Agree" or better.',
    get: (p) => p.p11.done
  },
  {
    itemNumber: 16,
    principleNumber: 12,
    ruleId: "R-PRINCIPLES-12",
    category: "reflection",
    description: "Every leader has shared their previous 2 retrospectives with all stakeholders.",
    get: (p) => p.p12.done
  }
];
function gradePrinciples(items) {
  let subtotal = 0;
  const firedRules = [];
  for (const spec of PRINCIPLES) {
    const answer = spec.get(items);
    const points = answerToPoints(answer);
    subtotal += points;
    firedRules.push({
      ruleId: spec.ruleId,
      instrument: "principles",
      itemNumber: spec.itemNumber,
      grade: answerToGrade(answer),
      pointsAwarded: points,
      category: spec.category,
      description: spec.description
    });
  }
  return { subtotal, firedRules };
}
function computeFlags(data) {
  const out = [];
  const { manifesto, principles } = data;
  if (manifesto.m4.done === false) {
    out.push({
      flagId: "F-NO-SENIOR-LEADERSHIP-BUYIN-001",
      category: "no-senior-leadership-buyin",
      priority: "high",
      description: "Manifesto 4 not satisfied: no senior leader has read an agile change-management book and shared takeaways.",
      suggestedAction: "Have every BoD/CXO/VP/Director read one agile change book and present three takeaways before procurement."
    });
  }
  if (manifesto.m1.done === false || principles.p1.done === false) {
    out.push({
      flagId: "F-NO-CUSTOMER-CONTACT-001",
      category: "no-customer-contact",
      priority: "high",
      description: "Customer-contact gap: leaders are not in regular conversation with customers, or NPS is not measured.",
      suggestedAction: "Establish weekly customer conversations for every product lead and stand up a basic NPS measurement."
    });
  }
  if (manifesto.m2.done === false && principles.p7.done === false) {
    out.push({
      flagId: "F-NO-WORKING-SOFTWARE-001",
      category: "no-working-software",
      priority: "high",
      description: 'No warm-up programs shipped: neither "hello world" nor "fizz buzz" has been launched to production.',
      suggestedAction: 'Run the warm-up exercise: ship "hello world" then "fizz buzz" to production with a real team and discuss.'
    });
  }
  if (principles.p8.done === false) {
    out.push({
      flagId: "F-NO-SUSTAINABLE-BUDGET-001",
      category: "no-sustainable-budget",
      priority: "medium",
      description: "Principle 8 not satisfied: less than 1 year of staff sustaining budget is secured.",
      suggestedAction: "Secure a 1-year sustaining budget before engaging consultants, or scope the engagement to budget."
    });
  }
  if (principles.p11.done === false) {
    out.push({
      flagId: "F-NO-SELF-ORGANIZATION-001",
      category: "no-self-organization",
      priority: "medium",
      description: 'Principle 11 not satisfied: self-organization Likert average is below "Agree".',
      suggestedAction: "Run a focused self-organization improvement initiative (e.g. The Vanguard Method) before hiring agile coaches."
    });
  }
  if (principles.p12.done === false) {
    out.push({
      flagId: "F-NO-REFLECTION-CULTURE-001",
      category: "no-reflection-culture",
      priority: "medium",
      description: "Principle 12 not satisfied: leaders are not running or sharing retrospectives.",
      suggestedAction: "Establish a regular leader-level retrospective cadence and require sharing the last two with stakeholders."
    });
  }
  return out;
}
function gradeScorecard(data) {
  const manifesto = gradeManifesto(data.manifesto);
  const principles = gradePrinciples(data.principles);
  const scoreTotal = manifesto.subtotal + principles.subtotal;
  const computedBand = totalToBand(scoreTotal);
  const recommendation = bandToRecommendation(computedBand);
  const firedRules = [
    ...manifesto.firedRules,
    ...principles.firedRules,
    {
      ruleId: `R-COMPOSITE-${computedBand.toUpperCase()}`,
      instrument: "composite",
      itemNumber: null,
      grade: computedBand,
      pointsAwarded: 0,
      category: "composite",
      description: `Total ${scoreTotal}/16 places the organization in the "${computedBand}" readiness band.`
    }
  ];
  const additionalFlags = computeFlags(data);
  return {
    scoreTotal,
    manifestoSubtotal: manifesto.subtotal,
    principlesSubtotal: principles.subtotal,
    computedBand,
    recommendation,
    firedRules,
    additionalFlags
  };
}
export {
  gradeScorecard as g
};
