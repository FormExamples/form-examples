// Flagged-issue detection for the Dyslexia Assessment.
//
// Independent of the per-domain grader, this module raises clinician-
// facing flags for severe domain scores, hearing/vision concerns,
// developmental history red flags, family history, ESL learners,
// emotional/behavioural impact, mental-health concerns, and missing
// supports/recommendations.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.DyslexiaAssessment.

/**
 * Push a flag for a numeric standardised score that falls below a
 * dyslexia-band threshold.
 * @param {AdditionalFlag[]} flags
 * @param {string} id
 * @param {string} category
 * @param {string} domainName
 * @param {number | null} score
 */
function pushScoreFlag(flags, id, category, domainName, score) {
  if (score === null || score === undefined || Number.isNaN(score)) return;
  if (score < 55) {
    flags.push({
      id,
      category,
      message: `${domainName} score ${score} — significantly below average (severe).`,
      priority: 'high'
    });
  } else if (score < 70) {
    flags.push({
      id,
      category,
      message: `${domainName} score ${score} — well below average (moderate).`,
      priority: 'high'
    });
  } else if (score < 85) {
    flags.push({
      id,
      category,
      message: `${domainName} score ${score} — below average (mild).`,
      priority: 'medium'
    });
  }
}

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ── Domain score alerts ───────────────────────────────────
  pushScoreFlag(flags, 'FLAG-READ-001', 'Reading',
    'Reading fluency', data.readingAssessment.readingFluencyScore);
  pushScoreFlag(flags, 'FLAG-READ-002', 'Reading',
    'Reading comprehension', data.readingAssessment.readingComprehensionScore);
  pushScoreFlag(flags, 'FLAG-WRIT-001', 'Writing & Spelling',
    'Spelling accuracy', data.writingSpelling.spellingAccuracyScore);
  pushScoreFlag(flags, 'FLAG-WRIT-002', 'Writing & Spelling',
    'Written expression', data.writingSpelling.writtenExpressionScore);
  pushScoreFlag(flags, 'FLAG-PHON-001', 'Phonological Processing',
    'Phonological awareness', data.phonologicalProcessing.phonologicalAwarenessScore);
  pushScoreFlag(flags, 'FLAG-PHON-002', 'Phonological Processing',
    'Phonological memory', data.phonologicalProcessing.phonologicalMemoryScore);
  pushScoreFlag(flags, 'FLAG-PHON-003', 'Phonological Processing',
    'Rapid naming', data.phonologicalProcessing.rapidNamingScore);
  pushScoreFlag(flags, 'FLAG-WMPS-001', 'Working Memory & Processing Speed',
    'Working memory', data.workingMemoryProcessingSpeed.workingMemoryScore);
  pushScoreFlag(flags, 'FLAG-WMPS-002', 'Working Memory & Processing Speed',
    'Processing speed', data.workingMemoryProcessingSpeed.processingSpeedScore);

  // ── Sensory concerns: rule out before diagnosing dyslexia ─
  if (data.developmentalHistory.hearingProblems === 'yes') {
    flags.push({
      id: 'FLAG-DEV-001',
      category: 'Developmental History',
      message: 'Reported hearing problems — audiology assessment recommended to exclude hearing loss as a contributor.',
      priority: 'high'
    });
  }
  if (data.developmentalHistory.visionProblems === 'yes') {
    flags.push({
      id: 'FLAG-DEV-002',
      category: 'Developmental History',
      message: 'Reported vision problems — vision assessment recommended to exclude visual contribution.',
      priority: 'high'
    });
  }

  // ── Developmental delay markers ──────────────────────────
  if (data.developmentalHistory.speechDelay === 'yes') {
    flags.push({
      id: 'FLAG-DEV-003',
      category: 'Developmental History',
      message: 'History of speech delay — common precursor to literacy difficulties.',
      priority: 'medium'
    });
  }
  if (data.developmentalHistory.languageDelay === 'yes') {
    flags.push({
      id: 'FLAG-DEV-004',
      category: 'Developmental History',
      message: 'History of language delay — assess for developmental language disorder.',
      priority: 'medium'
    });
  }

  // ── Family history ───────────────────────────────────────
  if (data.developmentalHistory.familyHistoryDyslexia === 'yes') {
    flags.push({
      id: 'FLAG-DEV-005',
      category: 'Developmental History',
      message: 'Family history of dyslexia — significant heritability (40-60%).',
      priority: 'medium'
    });
  }

  // ── ESL learner: differentiate from EAL-only difficulty ──
  if (data.educationalBackground.eslLearner === 'yes') {
    flags.push({
      id: 'FLAG-EDU-001',
      category: 'Educational Background',
      message: 'English as a second language — interpret literacy scores in context; consider first-language assessment.',
      priority: 'medium'
    });
  }

  // ── Attendance / school changes ──────────────────────────
  if (data.educationalBackground.attendanceIssues === 'yes') {
    flags.push({
      id: 'FLAG-EDU-002',
      category: 'Educational Background',
      message: 'Attendance issues reported — may contribute to learning gaps.',
      priority: 'low'
    });
  }
  if (
    data.educationalBackground.schoolChangeCount !== null &&
    data.educationalBackground.schoolChangeCount >= 3
  ) {
    flags.push({
      id: 'FLAG-EDU-003',
      category: 'Educational Background',
      message: `${data.educationalBackground.schoolChangeCount} school changes — disruption may affect literacy progress.`,
      priority: 'low'
    });
  }

  // ── Reversal & decoding markers ──────────────────────────
  if (data.readingAssessment.difficultyDecoding === 'yes') {
    flags.push({
      id: 'FLAG-READ-003',
      category: 'Reading',
      message: 'Difficulty decoding words — hallmark of dyslexia.',
      priority: 'medium'
    });
  }
  if (data.writingSpelling.reversesLettersOrNumbers === 'yes') {
    flags.push({
      id: 'FLAG-WRIT-003',
      category: 'Writing & Spelling',
      message: 'Reverses letters or numbers — classic dyslexia indicator.',
      priority: 'low'
    });
  }

  // ── Emotional / behavioural impact ───────────────────────
  if (data.emotionalBehavioural.lowSelfEsteem === 'yes') {
    flags.push({
      id: 'FLAG-EMOT-001',
      category: 'Emotional & Behavioural',
      message: 'Low self-esteem — common secondary effect; consider emotional support.',
      priority: 'medium'
    });
  }
  if (data.emotionalBehavioural.anxietyAboutSchool === 'yes') {
    flags.push({
      id: 'FLAG-EMOT-002',
      category: 'Emotional & Behavioural',
      message: 'School-related anxiety — assess and support.',
      priority: 'medium'
    });
  }
  if (data.emotionalBehavioural.avoidanceBehaviour === 'yes') {
    flags.push({
      id: 'FLAG-EMOT-003',
      category: 'Emotional & Behavioural',
      message: 'Avoidance behaviours — may indicate distress with literacy demands.',
      priority: 'medium'
    });
  }
  if (data.emotionalBehavioural.mentalHealthConcerns === 'yes') {
    flags.push({
      id: 'FLAG-EMOT-004',
      category: 'Emotional & Behavioural',
      message: 'Mental health concerns — referral to mental-health services recommended.',
      priority: 'high'
    });
  }

  // ── Existing supports ────────────────────────────────────
  if (
    data.previousSupport.previousIntervention === 'no' &&
    data.educationalBackground.previousAssessments === 'no'
  ) {
    flags.push({
      id: 'FLAG-SUPP-001',
      category: 'Previous Support',
      message: 'No previous intervention or assessment — this may be the first formal review.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
