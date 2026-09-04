import { PRINCIPLES } from './principles.js';

  /**
   * Build a fresh, fully-blank assessment in the shape the wizard holds and
   * the grader consumes: respondent block, one `{ score: null, comment: '',
   * weight: 1.0 }` response per principle, and the action plan. This is the
   * engine's default-state factory — `calculateMaturity(emptyAssessment())`
   * is the all-unanswered baseline (maturity 'insufficient-data').
   */
  function emptyAssessment() {
    return {
      respondent: {
        isAnonymous: false,
        fullName: '',
        email: '',
        role: '',
        yearsInAgile: '',
        teamName: '',
        organisationName: '',
        assessmentDate: '',
        assessmentPeriod: '',
      },
      responses: PRINCIPLES.map(function () { return { score: null, comment: '', weight: 1.0 }; }),
      actionPlan: {
        topAction1: '',
        topAction2: '',
        topAction3: '',
        coachNotes: '',
        overallNotes: '',
      },
    };
  }

  
  

  const COACHING = {
    'customer-satisfaction': {
      high: 'Customer feedback loops are tight; keep tracking outcome metrics, not output.',
      mid: 'Customer-feedback loops exist but are inconsistent. Define a cadence for user research and outcome metrics.',
      low: "Customer is at arm's length. Establish a recurring feedback loop with real users this quarter.",
    },
    'welcome-change': {
      high: 'Change is treated as an opportunity; preserve light-weight change-control overhead.',
      mid: 'Change is tolerated but slow. Audit hand-offs and approval gates that delay re-prioritisation.',
      low: 'Change is treated as a threat. Replace heavy change-control with a lightweight backlog re-ordering ritual.',
    },
    'deliver-frequently': {
      high: 'Releases are routine and low-drama. Continue to shrink batch size where possible.',
      mid: 'Delivery cadence is uneven. Set a target cycle time and identify the largest batch-size constraint.',
      low: 'Delivery is rare or unpredictable. Reduce batch size and remove release ceremonies that add no value.',
    },
    'collaboration': {
      high: 'Daily collaboration is healthy; safeguard the rituals that keep stakeholders close to the work.',
      mid: 'Stakeholder collaboration is intermittent. Schedule a recurring product-engineering sync.',
      low: 'Stakeholders and engineers are working in silos. Co-locate decisions or create a daily 15-minute joint stand-up.',
    },
    'motivated-individuals': {
      high: 'People feel trusted and supported. Continue investing in autonomy and tools.',
      mid: 'Motivation is mixed. Run a 1:1 listening tour to surface friction.',
      low: 'Morale is low or trust is thin. Address environment, tooling, or management style before adding more process.',
    },
    'face-to-face': {
      high: 'Real-time conversation is the default for important decisions; document outcomes, not deliberations.',
      mid: 'Conversation happens but key decisions still drift in async threads. Define which decisions must be live.',
      low: 'Important decisions are stuck in chat or email. Establish a synchronous decision ritual.',
    },
    'working-software': {
      high: 'Progress is measured by shipped, working capability. Continue.',
      mid: 'Progress is partly tracked by output proxies. Replace velocity / hours dashboards with shipped-feature counts.',
      low: 'Progress is reported by activity, not by working software. Make working software the headline metric.',
    },
    'sustainable-development': {
      high: 'Pace is sustainable. Watch for early signs of crunch creeping in.',
      mid: 'Pace is variable; crunch is creeping in. Capacity-plan with explicit slack.',
      low: 'Crunch and heroics are routine. Reset capacity and protect non-overtime delivery before scope.',
    },
    'technical-excellence': {
      high: 'Technical health is part of definition-of-done; keep refactoring continuous.',
      mid: 'Quality work is squeezed. Carve out explicit capacity for testing and refactoring.',
      low: 'Technical debt is accumulating faster than it is being repaid. Treat this as the top organisational risk.',
    },
    'simplicity': {
      high: 'Scope is actively trimmed; resist gold-plating.',
      mid: 'Scope creeps in. Add a written "what we are NOT doing" list to every initiative.',
      low: 'Over-engineering or scope creep is the norm. Make trimming a non-optional part of planning.',
    },
    'self-organising-teams': {
      high: 'Teams choose how to deliver. Reinforce psychological safety to keep emergence working.',
      mid: 'Self-organisation is partial. Audit which decisions managers still own that the team could.',
      low: 'Command-and-control culture. Push architecture and design decisions back to the team and provide context, not directives.',
    },
    'regular-reflection': {
      high: 'Retrospectives drive concrete experiments. Continue closing the loop on each.',
      mid: 'Retrospectives happen but actions slip. Track each retro action like a top-priority story.',
      low: 'Retrospectives are skipped or theatrical. Reinstate them on a fixed schedule with one written follow-up.',
    },
  };

  const FLAG_SPECS = {
    'customer-satisfaction': {
      category: 'customer-disconnect',
      priority: 'high',
      description: 'The team is at risk of building features that customers do not value.',
      suggestedAction:
        'Stand up a real customer-feedback loop within the next two weeks (interviews, beta cohort, or analytics).',
    },
    'welcome-change': {
      category: 'change-resistance',
      priority: 'high',
      description: 'Change is treated as a threat; competitive responsiveness will suffer.',
      suggestedAction: 'Replace heavy change-control with a lightweight backlog re-prioritisation ritual.',
    },
    'deliver-frequently': {
      category: 'slow-delivery',
      priority: 'medium',
      description: 'Long delivery cycles delay learning and increase batch risk.',
      suggestedAction: 'Pick one initiative and ship a thin slice within two weeks; measure cycle time.',
    },
    'collaboration': {
      category: 'silo-collaboration',
      priority: 'high',
      description: 'Engineering and business are operating in silos.',
      suggestedAction: 'Schedule a daily 15-minute product-engineering sync and rotate attendees.',
    },
    'motivated-individuals': {
      category: 'morale-risk',
      priority: 'high',
      description: 'Trust, environment, or motivation are weak. People will leave or disengage.',
      suggestedAction: 'Run a structured 1:1 listening tour; surface and remove the top three friction points.',
    },
    'face-to-face': {
      category: 'communication-gap',
      priority: 'medium',
      description: 'Critical decisions are stuck in async threads.',
      suggestedAction:
        'Define which decision classes require synchronous conversation; capture outcomes (not deliberations) in writing.',
    },
    'working-software': {
      category: 'output-not-outcome',
      priority: 'medium',
      description: 'Progress is being judged by activity rather than working software.',
      suggestedAction: 'Replace velocity / hours dashboards with a shipped-features dashboard.',
    },
    'sustainable-development': {
      category: 'burnout-risk',
      priority: 'high',
      description: 'Crunch is the default; burnout and quality regressions are likely.',
      suggestedAction: 'Reset capacity to a sustainable baseline and protect non-overtime delivery before adding scope.',
    },
    'technical-excellence': {
      category: 'technical-debt',
      priority: 'high',
      description: 'Technical debt is growing faster than it is being repaid; future agility is at risk.',
      suggestedAction: 'Allocate explicit weekly capacity to tests, refactoring, and infrastructure quality.',
    },
    'simplicity': {
      category: 'over-engineering',
      priority: 'medium',
      description: 'Scope creep or over-engineering is the norm; the team is doing more work than is required.',
      suggestedAction: 'Add a written "what we are NOT doing" list to every initiative; review weekly.',
    },
    'self-organising-teams': {
      category: 'command-and-control',
      priority: 'high',
      description: 'Decision-making sits with managers, not with the team closest to the work.',
      suggestedAction: 'Push design and architecture decisions back to the team; managers provide context, not directives.',
    },
    'regular-reflection': {
      category: 'no-retrospective',
      priority: 'high',
      description: 'Retrospectives are skipped or theatrical; the team cannot improve itself.',
      suggestedAction: 'Reinstate retrospectives on a fixed cadence; track each follow-up like a top-priority story.',
    },
  };

  function pad2(n) { return n.toString().padStart(2, '0'); }

  function bandFor(score) {
    if (score === null || score === undefined) return 'unanswered';
    if (score >= 4) return 'high';
    if (score === 3) return 'mid';
    return 'low';
  }

  function deriveMaturity(meanScore) {
    if (meanScore === null) return 'insufficient-data';
    if (meanScore >= 4.5) return 'optimising';
    if (meanScore >= 3.75) return 'mature';
    if (meanScore >= 3.0) return 'developing';
    if (meanScore >= 2.0) return 'initial';
    return 'ad-hoc';
  }

  function clampWeight(w) {
    if (w === null || w === undefined || isNaN(w) || w <= 0) return 1.0;
    if (w < 0.5) return 0.5;
    if (w > 2.0) return 2.0;
    return w;
  }

  function calculateMaturity(data) {
    let sum = 0;
    let weightedSum = 0;
    let weightSum = 0;
    let answeredCount = 0;
    let weightsCustomised = false;
    const perPrincipleBands = [];
    const firedRules = [];
    const additionalFlags = [];

    for (let i = 0; i < PRINCIPLES.length; i += 1) {
      const principle = PRINCIPLES[i];
      const resp = data.responses[i] || {};
      const score = resp.score === undefined ? null : resp.score;
      const w = clampWeight(resp.weight);
      if (Math.abs(w - 1.0) > 1e-6) weightsCustomised = true;
      const band = bandFor(score);
      perPrincipleBands.push(band);

      if (score !== null && score !== undefined) {
        sum += score;
        weightedSum += score * w;
        weightSum += w;
        answeredCount += 1;
      }

      if (band === 'unanswered') {
        firedRules.push({
          ruleId: 'R-P' + pad2(principle.number) + '-UNANSWERED',
          principleNumber: principle.number,
          principleSlug: principle.slug,
          band: band,
          description: 'Principle ' + principle.number + ' (' + principle.shortTitle + ') was not answered.',
        });
      } else {
        const coaching = COACHING[principle.slug] || {};
        firedRules.push({
          ruleId: 'R-P' + pad2(principle.number) + '-' + band.toUpperCase(),
          principleNumber: principle.number,
          principleSlug: principle.slug,
          band: band,
          description: coaching[band] || '',
        });
      }

      if (score !== null && score !== undefined && score <= 2) {
        const spec = FLAG_SPECS[principle.slug];
        if (spec) {
          additionalFlags.push({
            flagId: 'F-' + spec.category.toUpperCase(),
            category: spec.category,
            priority: spec.priority,
            principleNumber: principle.number,
            description: spec.description,
            suggestedAction: spec.suggestedAction,
          });
        }
      }
      if (score === 1) {
        additionalFlags.push({
          flagId: 'F-CRITICAL-P' + pad2(principle.number),
          category: 'critical-principle-gap',
          priority: 'high',
          principleNumber: principle.number,
          description:
            'Principle ' + principle.number + ' (' + principle.shortTitle + ') scored the minimum (1).',
          suggestedAction: 'Treat this principle as a top-priority coaching focus this cycle.',
        });
      }
    }

    const enoughAnswers = answeredCount >= 6;
    const meanScore = enoughAnswers ? Math.round((sum / answeredCount) * 100) / 100 : null;
    const weightedMeanScore = enoughAnswers && weightSum > 0 ? Math.round((weightedSum / weightSum) * 100) / 100 : null;
    const maturity = deriveMaturity(weightedMeanScore);

    if (answeredCount < 6) {
      additionalFlags.push({
        flagId: 'F-INSUFFICIENT-DATA',
        category: 'insufficient-data',
        priority: 'medium',
        principleNumber: null,
        description: 'Fewer than six principles received a score; the composite maturity is not reportable.',
        suggestedAction: 'Complete the remaining principles before relying on the maturity result.',
      });
    }

    return {
      answeredCount: answeredCount,
      meanScore: meanScore,
      weightedMeanScore: weightedMeanScore,
      weightsCustomised: weightsCustomised,
      maturity: maturity,
      perPrincipleBands: perPrincipleBands,
      firedRules: firedRules,
      additionalFlags: additionalFlags,
    };
  }

  
  
  

export { emptyAssessment, bandFor, deriveMaturity, calculateMaturity };
