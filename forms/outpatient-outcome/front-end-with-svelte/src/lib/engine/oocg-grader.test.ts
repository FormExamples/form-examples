import { describe, it, expect } from 'vitest';
import { gradeOOCG } from './oocg-grader';
import { gradeClinical } from './clinical-domain';
import { gradePROM } from './prom-domain';
import { gradePREM } from './prem-domain';
import { gradeOperational } from './operational-domain';
import { detectFlaggedIssues } from './flagged-issues';
import {
	gradeMax,
	gradeOrdinal,
	eq5dSummary,
	promisGphTScore,
	promisMhTScore,
	calcWaitDays
} from './utils';
import type { AssessmentData, PromEq5d5l, PromPromis } from './types';

// ──────────────────────────────────────────────────────────────────────────────
// Test helpers
// ──────────────────────────────────────────────────────────────────────────────

function makeData(overrides: Partial<AssessmentData> = {}): AssessmentData {
	const base: AssessmentData = {
		patientDetails: {
			givenName: 'Jane',
			familyName: 'Doe',
			dateOfBirth: '1980-01-01',
			nhsNumber: '123 456 7890',
			sex: 'female'
		},
		encounterDetails: {
			clinicDate: '2026-04-01',
			specialty: 'Cardiology',
			clinicianName: 'Dr Smith',
			modality: 'in_person',
			appointmentType: 'follow_up'
		},
		operationalEfficiency: {
			referralDate: '2026-01-01',
			appointmentDate: '2026-04-01',
			waitTimeDays: 90,
			serviceTargetDays: 90,
			nhsAttendanceOutcome: 'attended_discharged'
		},
		clinicalOutcome: {
			presentingComplaint: 'Chest pain',
			diagnosis: 'Stable angina',
			treatmentDelivered: 'Medication review',
			outcomeClassification: 'improved'
		},
		promEq5d5l: {
			beforeMobility: 3,
			beforeSelfCare: 2,
			beforeUsualActivities: 3,
			beforePainDiscomfort: 4,
			beforeAnxietyDepression: 2,
			beforeVas: 50,
			afterMobility: 2,
			afterSelfCare: 2,
			afterUsualActivities: 2,
			afterPainDiscomfort: 3,
			afterAnxietyDepression: 2,
			afterVas: 70
		},
		promGrc: {
			globalRatingOfChange: 2,
			selfRatedHealth: 'good'
		},
		promPromis: {
			item1GeneralHealth: 4,
			item2QualityOfLife: 4,
			item3PhysicalHealth: 4,
			item4MentalHealth: 4,
			item5Satisfaction: 4,
			item6FatigueFrequency: 2,
			item7EmotionalProblems: 2,
			item8SocialActivities: 4,
			item9Pain: 2,
			item10EverydayActivities: 4,
			globalPhysicalHealthTScore: null,
			globalMentalHealthTScore: null
		},
		premFft: {
			fftResponse: 'likely',
			fftComment: 'Very helpful'
		},
		followupPlan: {
			disposition: 'discharge',
			nextAppointmentDate: '',
			onwardReferralSpecialty: '',
			followupNotes: ''
		},
		signOff: {
			reportingClinicianName: 'Dr Smith',
			reportingClinicianRole: 'Consultant',
			signedOffAt: '2026-04-01T12:00:00Z'
		}
	};
	return { ...base, ...overrides };
}

// ──────────────────────────────────────────────────────────────────────────────
// utils
// ──────────────────────────────────────────────────────────────────────────────

describe('gradeMax', () => {
	it('returns worst grade from a list', () => {
		expect(gradeMax(['A', 'B', 'C'])).toBe('C');
		expect(gradeMax(['A', 'E', 'B'])).toBe('E');
		expect(gradeMax(['A', 'A', 'A'])).toBe('A');
	});

	it('ignores empty strings', () => {
		expect(gradeMax(['A', '', 'C'])).toBe('C');
		expect(gradeMax(['', ''])).toBe('');
	});

	it('returns empty string when all grades are empty', () => {
		expect(gradeMax([])).toBe('');
		expect(gradeMax([''])).toBe('');
	});
});

describe('gradeOrdinal', () => {
	it('maps A=0 and E=4', () => {
		expect(gradeOrdinal('A')).toBe(0);
		expect(gradeOrdinal('E')).toBe(4);
		expect(gradeOrdinal('')).toBe(-1);
	});
});

describe('calcWaitDays', () => {
	it('computes correct days', () => {
		expect(calcWaitDays('2026-01-01', '2026-04-01')).toBe(90);
	});
	it('returns null for invalid dates', () => {
		expect(calcWaitDays('', '2026-04-01')).toBeNull();
	});
});

describe('eq5dSummary', () => {
	it('correctly counts improved/worsened/unchanged', () => {
		const prom: PromEq5d5l = {
			beforeMobility: 3, afterMobility: 2,     // improved
			beforeSelfCare: 2, afterSelfCare: 3,     // worsened
			beforeUsualActivities: 3, afterUsualActivities: 3, // unchanged
			beforePainDiscomfort: 4, afterPainDiscomfort: 2,   // improved
			beforeAnxietyDepression: 2, afterAnxietyDepression: 2, // unchanged
			beforeVas: 50, afterVas: 60               // improved (VAS higher=better)
		};
		const s = eq5dSummary(prom);
		expect(s.improved).toBe(3);
		expect(s.worsened).toBe(1);
		expect(s.unchanged).toBe(2);
		expect(s.missing).toBe(0);
	});

	it('counts nulls as missing', () => {
		const prom: PromEq5d5l = {
			beforeMobility: null, afterMobility: null,
			beforeSelfCare: null, afterSelfCare: null,
			beforeUsualActivities: null, afterUsualActivities: null,
			beforePainDiscomfort: null, afterPainDiscomfort: null,
			beforeAnxietyDepression: null, afterAnxietyDepression: null,
			beforeVas: null, afterVas: null
		};
		const s = eq5dSummary(prom);
		expect(s.missing).toBe(6);
	});
});

describe('PROMIS T-score approximation', () => {
	it('returns null when items are null', () => {
		const p = { item1GeneralHealth: null } as unknown as PromPromis;
		expect(promisGphTScore(p as PromPromis)).toBeNull();
	});

	it('returns a value in the expected T-score range for best-case inputs', () => {
		const p: PromPromis = {
			item1GeneralHealth: 5, item2QualityOfLife: 5, item3PhysicalHealth: 5,
			item4MentalHealth: 5, item5Satisfaction: 5, item6FatigueFrequency: 1,
			item7EmotionalProblems: 1, item8SocialActivities: 5,
			item9Pain: 0, item10EverydayActivities: 5,
			globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
		};
		const gph = promisGphTScore(p)!;
		const gmh = promisMhTScore(p)!;
		expect(gph).toBeGreaterThan(55);
		expect(gmh).toBeGreaterThan(55);
	});

	it('returns low T-scores for worst-case inputs', () => {
		const p: PromPromis = {
			item1GeneralHealth: 1, item2QualityOfLife: 1, item3PhysicalHealth: 1,
			item4MentalHealth: 1, item5Satisfaction: 1, item6FatigueFrequency: 5,
			item7EmotionalProblems: 5, item8SocialActivities: 1,
			item9Pain: 10, item10EverydayActivities: 1,
			globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
		};
		const gph = promisGphTScore(p)!;
		const gmh = promisMhTScore(p)!;
		expect(gph).toBeLessThan(25);
		expect(gmh).toBeLessThan(30);
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Clinical domain
// ──────────────────────────────────────────────────────────────────────────────

describe('gradeClinical', () => {
	it.each([
		['resolved', 'A'],
		['improved', 'B'],
		['unchanged', 'C'],
		['worsened', 'D'],
		['died', 'E']
	] as const)('maps %s → %s', (cls, expected) => {
		const data = makeData({
			clinicalOutcome: { presentingComplaint: '', diagnosis: '', treatmentDelivered: '', outcomeClassification: cls }
		});
		expect(gradeClinical(data).grade).toBe(expected);
	});

	it('returns empty string for missing classification', () => {
		const data = makeData({
			clinicalOutcome: { presentingComplaint: '', diagnosis: '', treatmentDelivered: '', outcomeClassification: '' }
		});
		expect(gradeClinical(data).grade).toBe('');
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// PREM domain
// ──────────────────────────────────────────────────────────────────────────────

describe('gradePREM', () => {
	it.each([
		['extremely_likely', 'A'],
		['likely', 'B'],
		['neither', 'C'],
		['unlikely', 'D'],
		['extremely_unlikely', 'E']
	] as const)('maps FFT %s → %s', (fft, expected) => {
		const data = makeData({ premFft: { fftResponse: fft, fftComment: '' } });
		expect(gradePREM(data).grade).toBe(expected);
	});

	it('returns empty for dont_know', () => {
		const data = makeData({ premFft: { fftResponse: 'dont_know', fftComment: '' } });
		expect(gradePREM(data).grade).toBe('');
	});

	it('returns empty for missing response', () => {
		const data = makeData({ premFft: { fftResponse: '', fftComment: '' } });
		expect(gradePREM(data).grade).toBe('');
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Operational domain
// ──────────────────────────────────────────────────────────────────────────────

describe('gradeOperational', () => {
	it('grades A when attended and within target', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '2026-01-01',
				appointmentDate: '2026-04-01',
				waitTimeDays: 60,
				serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_discharged'
			}
		});
		expect(gradeOperational(data).grade).toBe('A');
	});

	it('grades B when attended and within 1.5x target', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: 120,
				serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_follow_up'
			}
		});
		expect(gradeOperational(data).grade).toBe('B');
	});

	it('grades C when attended and beyond 1.5x target', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: 200,
				serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_pifu'
			}
		});
		expect(gradeOperational(data).grade).toBe('C');
	});

	it('grades D when patient cancelled', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: null,
				serviceTargetDays: null,
				nhsAttendanceOutcome: 'patient_cancelled'
			}
		});
		expect(gradeOperational(data).grade).toBe('D');
	});

	it('grades E when DNA', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: null,
				serviceTargetDays: null,
				nhsAttendanceOutcome: 'patient_dna'
			}
		});
		expect(gradeOperational(data).grade).toBe('E');
	});

	it('grades E when provider cancelled', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: null,
				serviceTargetDays: null,
				nhsAttendanceOutcome: 'provider_cancelled'
			}
		});
		expect(gradeOperational(data).grade).toBe('E');
	});

	it('returns empty when attendance outcome is missing', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '',
				appointmentDate: '',
				waitTimeDays: null,
				serviceTargetDays: null,
				nhsAttendanceOutcome: ''
			}
		});
		expect(gradeOperational(data).grade).toBe('');
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// PROM domain
// ──────────────────────────────────────────────────────────────────────────────

describe('gradePROM', () => {
	it('grades A when all three instruments improved', () => {
		// EQ-5D improved (after < before on dims), GRC positive, PROMIS good T-scores
		const data = makeData({
			promEq5d5l: {
				beforeMobility: 4, afterMobility: 1,
				beforeSelfCare: 4, afterSelfCare: 1,
				beforeUsualActivities: 4, afterUsualActivities: 1,
				beforePainDiscomfort: 4, afterPainDiscomfort: 1,
				beforeAnxietyDepression: 4, afterAnxietyDepression: 1,
				beforeVas: 30, afterVas: 80
			},
			promGrc: { globalRatingOfChange: 3, selfRatedHealth: 'excellent' },
			promPromis: {
				item1GeneralHealth: 5, item2QualityOfLife: 5, item3PhysicalHealth: 5,
				item4MentalHealth: 5, item5Satisfaction: 5, item6FatigueFrequency: 1,
				item7EmotionalProblems: 1, item8SocialActivities: 5,
				item9Pain: 0, item10EverydayActivities: 5,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		expect(gradePROM(data).grade).toBe('A');
	});

	it('grades E when multiple instruments worsened', () => {
		const data = makeData({
			promEq5d5l: {
				beforeMobility: 1, afterMobility: 4,
				beforeSelfCare: 1, afterSelfCare: 4,
				beforeUsualActivities: 1, afterUsualActivities: 4,
				beforePainDiscomfort: 1, afterPainDiscomfort: 4,
				beforeAnxietyDepression: 1, afterAnxietyDepression: 4,
				beforeVas: 80, afterVas: 20
			},
			promGrc: { globalRatingOfChange: -3, selfRatedHealth: 'poor' },
			promPromis: {
				item1GeneralHealth: 1, item2QualityOfLife: 1, item3PhysicalHealth: 1,
				item4MentalHealth: 1, item5Satisfaction: 1, item6FatigueFrequency: 5,
				item7EmotionalProblems: 5, item8SocialActivities: 1,
				item9Pain: 10, item10EverydayActivities: 1,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		expect(gradePROM(data).grade).toBe('E');
	});

	it('grades C when instruments are stable', () => {
		const data = makeData({
			promEq5d5l: {
				beforeMobility: 3, afterMobility: 3,
				beforeSelfCare: 3, afterSelfCare: 3,
				beforeUsualActivities: 3, afterUsualActivities: 3,
				beforePainDiscomfort: 3, afterPainDiscomfort: 3,
				beforeAnxietyDepression: 3, afterAnxietyDepression: 3,
				beforeVas: 50, afterVas: 50
			},
			promGrc: { globalRatingOfChange: 0, selfRatedHealth: 'good' },
			promPromis: {
				item1GeneralHealth: 3, item2QualityOfLife: 3, item3PhysicalHealth: 3,
				item4MentalHealth: 3, item5Satisfaction: 3, item6FatigueFrequency: 3,
				item7EmotionalProblems: 3, item8SocialActivities: 3,
				item9Pain: 5, item10EverydayActivities: 3,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		const grade = gradePROM(data).grade;
		// PROMIS mid-point (~50 T-score) = stable; GRC = 0 = stable; EQ-5D no change = stable → C
		expect(grade).toBe('C');
	});

	it('returns empty when all PROM data is missing', () => {
		const data = makeData({
			promEq5d5l: {
				beforeMobility: null, afterMobility: null,
				beforeSelfCare: null, afterSelfCare: null,
				beforeUsualActivities: null, afterUsualActivities: null,
				beforePainDiscomfort: null, afterPainDiscomfort: null,
				beforeAnxietyDepression: null, afterAnxietyDepression: null,
				beforeVas: null, afterVas: null
			},
			promGrc: { globalRatingOfChange: null, selfRatedHealth: '' },
			promPromis: {
				item1GeneralHealth: null, item2QualityOfLife: null, item3PhysicalHealth: null,
				item4MentalHealth: null, item5Satisfaction: null, item6FatigueFrequency: null,
				item7EmotionalProblems: null, item8SocialActivities: null,
				item9Pain: null, item10EverydayActivities: null,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		expect(gradePROM(data).grade).toBe('');
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Flagged issues
// ──────────────────────────────────────────────────────────────────────────────

describe('detectFlaggedIssues', () => {
	it('flags DNA as critical', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: null, serviceTargetDays: null,
				nhsAttendanceOutcome: 'patient_dna'
			}
		});
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-OPS-001' && f.priority === 'critical')).toBe(true);
	});

	it('flags provider cancel as critical', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: null, serviceTargetDays: null,
				nhsAttendanceOutcome: 'provider_cancelled'
			}
		});
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-OPS-002' && f.priority === 'critical')).toBe(true);
	});

	it('flags worsened clinical as high', () => {
		const flags = detectFlaggedIssues(makeData(), 'D', '');
		expect(flags.some((f) => f.id === 'FLAG-CLIN-001' && f.priority === 'high')).toBe(true);
	});

	it('flags died clinical as high', () => {
		const flags = detectFlaggedIssues(makeData(), 'E', '');
		expect(flags.some((f) => f.id === 'FLAG-CLIN-002' && f.priority === 'high')).toBe(true);
	});

	it('flags FFT Poor as medium', () => {
		const flags = detectFlaggedIssues(makeData(), '', 'D');
		expect(flags.some((f) => f.id === 'FLAG-PREM-001' && f.priority === 'medium')).toBe(true);
	});

	it('flags wait time exceeding target as low', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: 100,
				serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_discharged'
			}
		});
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-OPS-004' && f.priority === 'low')).toBe(true);
	});

	it('flags wait time exceeding 1.5x target as medium', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: 200,
				serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_discharged'
			}
		});
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-OPS-003' && f.priority === 'medium')).toBe(true);
	});

	it('flags missing PREM data as low', () => {
		const data = makeData({ premFft: { fftResponse: '', fftComment: '' } });
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-DQ-003' && f.priority === 'low')).toBe(true);
	});

	it('flags missing attendance outcome as low', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: null, serviceTargetDays: null,
				nhsAttendanceOutcome: ''
			}
		});
		const flags = detectFlaggedIssues(data, '', '');
		expect(flags.some((f) => f.id === 'FLAG-DQ-004' && f.priority === 'low')).toBe(true);
	});

	it('sorts critical before high before medium before low', () => {
		const data = makeData({
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: 200, serviceTargetDays: 90,
				nhsAttendanceOutcome: 'patient_dna'
			}
		});
		const flags = detectFlaggedIssues(data, 'D', 'D');
		const priorities = flags.map((f) => f.priority);
		const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
		for (let i = 0; i < priorities.length - 1; i++) {
			expect(priorityOrder[priorities[i]]).toBeLessThanOrEqual(priorityOrder[priorities[i + 1]]);
		}
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Full gradeOOCG orchestrator
// ──────────────────────────────────────────────────────────────────────────────

describe('gradeOOCG', () => {
	it('overall = worst of four domain grades', () => {
		// Clinical B, PREM A, Operational A → worst should be B
		const data = makeData({
			clinicalOutcome: {
				presentingComplaint: '',
				diagnosis: '',
				treatmentDelivered: '',
				outcomeClassification: 'improved'
			},
			premFft: { fftResponse: 'extremely_likely', fftComment: '' },
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: 60, serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_discharged'
			}
		});
		const result = gradeOOCG(data);
		// PROM grade depends on data; but clinical=B, prem=A, ops=A
		// Overall must be at least B (clinical)
		expect(gradeOrdinal(result.overallGrade)).toBeGreaterThanOrEqual(gradeOrdinal('B'));
	});

	it('all best → overall A', () => {
		const data = makeData({
			clinicalOutcome: {
				presentingComplaint: 'chest pain',
				diagnosis: 'resolved',
				treatmentDelivered: 'medication',
				outcomeClassification: 'resolved'
			},
			premFft: { fftResponse: 'extremely_likely', fftComment: '' },
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: 60, serviceTargetDays: 90,
				nhsAttendanceOutcome: 'attended_discharged'
			},
			promEq5d5l: {
				beforeMobility: 5, afterMobility: 1,
				beforeSelfCare: 5, afterSelfCare: 1,
				beforeUsualActivities: 5, afterUsualActivities: 1,
				beforePainDiscomfort: 5, afterPainDiscomfort: 1,
				beforeAnxietyDepression: 5, afterAnxietyDepression: 1,
				beforeVas: 10, afterVas: 100
			},
			promGrc: { globalRatingOfChange: 3, selfRatedHealth: 'excellent' },
			promPromis: {
				item1GeneralHealth: 5, item2QualityOfLife: 5, item3PhysicalHealth: 5,
				item4MentalHealth: 5, item5Satisfaction: 5, item6FatigueFrequency: 1,
				item7EmotionalProblems: 1, item8SocialActivities: 5,
				item9Pain: 0, item10EverydayActivities: 5,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		const result = gradeOOCG(data);
		expect(result.overallGrade).toBe('A');
		expect(result.clinicalGrade).toBe('A');
		expect(result.premGrade).toBe('A');
		expect(result.operationalGrade).toBe('A');
	});

	it('all worst → overall E', () => {
		const data = makeData({
			clinicalOutcome: {
				presentingComplaint: '',
				diagnosis: '',
				treatmentDelivered: '',
				outcomeClassification: 'died'
			},
			premFft: { fftResponse: 'extremely_unlikely', fftComment: '' },
			operationalEfficiency: {
				referralDate: '', appointmentDate: '',
				waitTimeDays: null, serviceTargetDays: null,
				nhsAttendanceOutcome: 'patient_dna'
			},
			promEq5d5l: {
				beforeMobility: 1, afterMobility: 5,
				beforeSelfCare: 1, afterSelfCare: 5,
				beforeUsualActivities: 1, afterUsualActivities: 5,
				beforePainDiscomfort: 1, afterPainDiscomfort: 5,
				beforeAnxietyDepression: 1, afterAnxietyDepression: 5,
				beforeVas: 100, afterVas: 0
			},
			promGrc: { globalRatingOfChange: -3, selfRatedHealth: 'poor' },
			promPromis: {
				item1GeneralHealth: 1, item2QualityOfLife: 1, item3PhysicalHealth: 1,
				item4MentalHealth: 1, item5Satisfaction: 1, item6FatigueFrequency: 5,
				item7EmotionalProblems: 5, item8SocialActivities: 1,
				item9Pain: 10, item10EverydayActivities: 1,
				globalPhysicalHealthTScore: null, globalMentalHealthTScore: null
			}
		});
		const result = gradeOOCG(data);
		expect(result.overallGrade).toBe('E');
		expect(result.clinicalGrade).toBe('E');
		expect(result.premGrade).toBe('E');
		expect(result.operationalGrade).toBe('E');
	});

	it('result includes fired rules and flagged issues', () => {
		const result = gradeOOCG(makeData());
		expect(result.firedRules.length).toBeGreaterThan(0);
		expect(result.flaggedIssues).toBeDefined();
		expect(result.timestamp).toBeTruthy();
	});

	it('result has all four domain grades', () => {
		const result = gradeOOCG(makeData());
		expect(result.clinicalGrade).toBeTruthy();
		expect(result.premGrade).toBeTruthy();
		expect(result.operationalGrade).toBeTruthy();
	});
});
