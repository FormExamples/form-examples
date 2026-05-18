(function () {
  'use strict';

  const NS = (window.AgileChecklist = window.AgileChecklist || {});
  const TEAMS_ITEMS = NS.TEAMS_ITEMS;
  const STAKEHOLDERS_ITEMS = NS.STAKEHOLDERS_ITEMS;
  const PRACTICES_ITEMS = NS.PRACTICES_ITEMS;

  const SECTION_LOW_THRESHOLD = 50;
  const SECTION_IMBALANCE_THRESHOLD = 30;
  const MIN_ANSWERED_FOR_REPORT = 30;

  const COACHING = {
    teams: {
      high: 'Teams have strong agile habits — autonomy, learning, and finishing. Preserve psychological safety as the team grows.',
      mid: 'Team behaviours are uneven. Identify two or three weak items and turn them into named retrospective experiments.',
      low: 'Teams are not yet operating with agile habits. Start with autonomy, finishing work, and dissent-safety; coaching is needed.',
    },
    stakeholders: {
      high: 'Stakeholders trust and support the team. Continue investing in transparency and shared goals.',
      mid: 'Stakeholder support is partial. Audit which decisions sponsors still take back at the first sign of trouble.',
      low: 'Stakeholder behaviour is the binding constraint. No team can outrun a sponsor who revokes authority and punishes experiments.',
    },
    practices: {
      high: 'Operating practices are healthy — quick decisions, finished-work focus, blame-free culture. Keep watching for over-engineering.',
      mid: 'Practices are partly in place. Pick the two weakest items and address them at the system level, not the team level.',
      low: 'Operating practices are working against agility. Address finished-over-WIP, quality-over-deadline, and blame culture before adding rituals.',
    },
  };

  function bandFor(percent) {
    if (percent === null || percent === undefined) return 'unanswered';
    if (percent >= 75) return 'high';
    if (percent >= 50) return 'mid';
    return 'low';
  }

  function deriveMaturity(overallPercent) {
    if (overallPercent === null) return 'insufficient-data';
    if (overallPercent >= 90) return 'optimising';
    if (overallPercent >= 75) return 'mature';
    if (overallPercent >= 50) return 'developing';
    if (overallPercent >= 25) return 'initial';
    return 'ad-hoc';
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function scoreSection(section, items, answers) {
    let yesCount = 0, noCount = 0, notApplicableCount = 0, unansweredCount = 0;
    items.forEach(function (item) {
      const a = answers[item.id] || '';
      if (a === 'yes') yesCount += 1;
      else if (a === 'no') noCount += 1;
      else if (a === 'not-applicable') notApplicableCount += 1;
      else unansweredCount += 1;
    });
    const applicableCount = yesCount + noCount;
    const percent = applicableCount === 0 ? null : round2((yesCount / applicableCount) * 100);
    return {
      section: section,
      yesCount: yesCount,
      noCount: noCount,
      notApplicableCount: notApplicableCount,
      unansweredCount: unansweredCount,
      applicableCount: applicableCount,
      percent: percent,
      band: bandFor(percent),
    };
  }

  function applyMaturityRules(scores) {
    const fired = [];
    [scores.teams, scores.stakeholders, scores.practices].forEach(function (s) {
      if (s.band === 'unanswered') {
        fired.push({
          ruleId: 'R-' + s.section.toUpperCase() + '-UNANSWERED',
          section: s.section,
          band: s.band,
          description: capitalise(s.section) + ' section was not answered.',
        });
      } else {
        fired.push({
          ruleId: 'R-' + s.section.toUpperCase() + '-' + s.band.toUpperCase(),
          section: s.section,
          band: s.band,
          description: COACHING[s.section][s.band],
        });
      }
    });
    return fired;
  }

  function isNo(a) { return a === 'no'; }

  function detectAdditionalFlags(answers, scores, answeredCount) {
    const flags = [];

    if (scores.teams.percent !== null && scores.teams.percent < SECTION_LOW_THRESHOLD) {
      flags.push({
        flagId: 'F-TEAMS-AUTONOMY',
        category: 'teams-autonomy-risk',
        priority: 'high',
        section: 'teams',
        triggeringItems: [],
        description: 'Teams section scored ' + scores.teams.percent.toFixed(0) + '% — autonomy and finishing habits are weak.',
        suggestedAction: 'Run a focused retrospective on autonomy, finishing work, and decision authority.',
      });
    }
    if (scores.stakeholders.percent !== null && scores.stakeholders.percent < SECTION_LOW_THRESHOLD) {
      flags.push({
        flagId: 'F-STAKEHOLDERS-TRUST',
        category: 'stakeholders-trust-risk',
        priority: 'high',
        section: 'stakeholders',
        triggeringItems: [],
        description: 'Stakeholders section scored ' + scores.stakeholders.percent.toFixed(0) + '% — sponsorship is the binding constraint.',
        suggestedAction: 'Brief executive sponsors on agile delegation; renegotiate explicit decision rights.',
      });
    }
    if (scores.practices.percent !== null && scores.practices.percent < SECTION_LOW_THRESHOLD) {
      flags.push({
        flagId: 'F-PRACTICES-DISCIPLINE',
        category: 'practices-discipline-risk',
        priority: 'high',
        section: 'practices',
        triggeringItems: [],
        description: 'Practices section scored ' + scores.practices.percent.toFixed(0) + '% — operating practices are working against agility.',
        suggestedAction: 'Address finished-over-WIP, quality-over-deadline, and blame culture as system-level changes.',
      });
    }

    const defined = [scores.teams, scores.stakeholders, scores.practices]
      .filter(function (s) { return s.percent !== null; });
    if (defined.length >= 2) {
      let maxSpread = 0;
      for (let i = 0; i < defined.length; i += 1) {
        for (let j = i + 1; j < defined.length; j += 1) {
          maxSpread = Math.max(maxSpread, Math.abs(defined[i].percent - defined[j].percent));
        }
      }
      if (maxSpread > SECTION_IMBALANCE_THRESHOLD) {
        flags.push({
          flagId: 'F-SECTION-IMBALANCE',
          category: 'section-imbalance',
          priority: 'medium',
          section: '',
          triggeringItems: [],
          description: 'Section spread is ' + maxSpread.toFixed(0) + ' percentage points — adoption is uneven across audiences.',
          suggestedAction: 'Align coaching across teams, stakeholders, and practices so improvements are not undone elsewhere.',
        });
      }
    }

    if (isNo(answers.t08) && isNo(answers.p12)) {
      flags.push({
        flagId: 'F-FINISHED-WORK',
        category: 'finished-work-risk',
        priority: 'high',
        section: '',
        triggeringItems: ['t08', 'p12'],
        description: 'Teams wait on others (t08=no) and the organisation values WIP over finished work (p12=no).',
        suggestedAction: 'Set explicit WIP limits and prioritise finishing in-flight work over starting new work.',
      });
    }
    if (isNo(answers.s09) && isNo(answers.s10)) {
      flags.push({
        flagId: 'F-EXPERIMENTATION-BLOCKED',
        category: 'experimentation-blocked',
        priority: 'high',
        section: 'stakeholders',
        triggeringItems: ['s09', 's10'],
        description: 'Stakeholders neither support experiments (s09=no) nor tolerate failed ones (s10=no).',
        suggestedAction: 'Negotiate a formal experiment budget with the sponsor; agree explicitly that some experiments will fail.',
      });
    }
    if (isNo(answers.t17) && isNo(answers.t18)) {
      flags.push({
        flagId: 'F-LEARNING-STALLED',
        category: 'learning-stalled',
        priority: 'medium',
        section: 'teams',
        triggeringItems: ['t17', 't18'],
        description: 'Teams neither seek (t17=no) nor improve (t18=no) skills — long-term capability is decaying.',
        suggestedAction: 'Schedule recurring learning time and pair people deliberately on unfamiliar work.',
      });
    }

    const psych = [];
    if (isNo(answers.t22)) psych.push('t22');
    if (isNo(answers.s08)) psych.push('s08');
    if (isNo(answers.p14)) psych.push('p14');
    if (psych.length > 0) {
      flags.push({
        flagId: 'F-PSYCHOLOGICAL-SAFETY',
        category: 'psychological-safety-risk',
        priority: 'high',
        section: '',
        triggeringItems: psych,
        description: 'Psychological safety is at risk — dissent, sustained authority, or blameless problem-solving is missing.',
        suggestedAction: 'Address safety before adding rituals or processes; nothing else compounds without it.',
      });
    }

    if (answeredCount < MIN_ANSWERED_FOR_REPORT) {
      flags.push({
        flagId: 'F-INSUFFICIENT-DATA',
        category: 'insufficient-data',
        priority: 'medium',
        section: '',
        triggeringItems: [],
        description: 'Only ' + answeredCount + ' of 57 items answered; the composite maturity is not reportable below 30.',
        suggestedAction: 'Complete more items before relying on the maturity result.',
      });
    }

    return flags;
  }

  function capitalise(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function calculateMaturity(answers) {
    const teams = scoreSection('teams', TEAMS_ITEMS, answers);
    const stakeholders = scoreSection('stakeholders', STAKEHOLDERS_ITEMS, answers);
    const practices = scoreSection('practices', PRACTICES_ITEMS, answers);

    const answeredCount =
      teams.yesCount + teams.noCount + teams.notApplicableCount +
      stakeholders.yesCount + stakeholders.noCount + stakeholders.notApplicableCount +
      practices.yesCount + practices.noCount + practices.notApplicableCount;

    const sectionPercents = [teams.percent, stakeholders.percent, practices.percent];
    const defined = sectionPercents.filter(function (p) { return p !== null; });
    const haveAllSections = defined.length === 3;
    const overallPercent =
      haveAllSections && answeredCount >= MIN_ANSWERED_FOR_REPORT
        ? round2(defined.reduce(function (a, b) { return a + b; }, 0) / defined.length)
        : null;

    const maturity = deriveMaturity(overallPercent);
    const firedRules = applyMaturityRules({ teams: teams, stakeholders: stakeholders, practices: practices });
    const additionalFlags = detectAdditionalFlags(answers, { teams: teams, stakeholders: stakeholders, practices: practices }, answeredCount);

    return {
      answeredCount: answeredCount,
      teams: teams,
      stakeholders: stakeholders,
      practices: practices,
      overallPercent: overallPercent,
      maturity: maturity,
      firedRules: firedRules,
      additionalFlags: additionalFlags,
    };
  }

  NS.bandFor = bandFor;
  NS.deriveMaturity = deriveMaturity;
  NS.calculateMaturity = calculateMaturity;
})();
