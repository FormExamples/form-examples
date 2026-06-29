import type { DyslexiaRule } from './types';

// Dyslexia Assessment domain rules.
//
// Each rule projects one of the standardised score fields (mean 100, SD 15)
// from the AssessmentData out as a DomainScore. The grader iterates these
// rules, classifies each score into a severity band, and uses the lowest
// non-null score to set the overall severity.
//
// Domain IDs follow `DYS-NNN`:
//   DYS-001 Reading fluency
//   DYS-002 Reading comprehension
//   DYS-003 Spelling accuracy
//   DYS-004 Written expression
//   DYS-005 Phonological awareness
//   DYS-006 Phonological memory
//   DYS-007 Rapid naming
//   DYS-008 Working memory
//   DYS-009 Processing speed

export const dyslexiaRules: DyslexiaRule[] = [
	{
		id: 'DYS-001',
		category: 'Reading',
		description: 'Reading fluency standardised score',
		evaluate: (d) => d.readingAssessment.readingFluencyScore
	},
	{
		id: 'DYS-002',
		category: 'Reading',
		description: 'Reading comprehension standardised score',
		evaluate: (d) => d.readingAssessment.readingComprehensionScore
	},
	{
		id: 'DYS-003',
		category: 'Writing & Spelling',
		description: 'Spelling accuracy standardised score',
		evaluate: (d) => d.writingSpelling.spellingAccuracyScore
	},
	{
		id: 'DYS-004',
		category: 'Writing & Spelling',
		description: 'Written expression standardised score',
		evaluate: (d) => d.writingSpelling.writtenExpressionScore
	},
	{
		id: 'DYS-005',
		category: 'Phonological Processing',
		description: 'Phonological awareness standardised score',
		evaluate: (d) => d.phonologicalProcessing.phonologicalAwarenessScore
	},
	{
		id: 'DYS-006',
		category: 'Phonological Processing',
		description: 'Phonological memory standardised score',
		evaluate: (d) => d.phonologicalProcessing.phonologicalMemoryScore
	},
	{
		id: 'DYS-007',
		category: 'Phonological Processing',
		description: 'Rapid naming standardised score',
		evaluate: (d) => d.phonologicalProcessing.rapidNamingScore
	},
	{
		id: 'DYS-008',
		category: 'Working Memory & Processing Speed',
		description: 'Working memory standardised score',
		evaluate: (d) => d.workingMemoryProcessingSpeed.workingMemoryScore
	},
	{
		id: 'DYS-009',
		category: 'Working Memory & Processing Speed',
		description: 'Processing speed standardised score',
		evaluate: (d) => d.workingMemoryProcessingSpeed.processingSpeedScore
	}
];
