import { describe, it, expect } from 'vitest';
import {
	gradeMentalHealthActAssessment,
	deriveUrgency,
	evaluateSignatories
} from './mha-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { sectionToClass } from './mha-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { assessedAt: '', location: '', referralSource: '', reasonForAssessment: '' },
		identification: { personIdentifier: '', ageBand: '', sex: '', firstLanguage: '' },
		professionals: {
			amhpName: '',
			amhpApproved: '',
			doctor1Name: '',
			doctor1GmcNumber: '',
			doctor1Section12Approved: '',
			doctor1ExaminedAt: '',
			doctor2Name: '',
			doctor2GmcNumber: '',
			doctor2Section12Approved: '',
			doctor2ExaminedAt: '',
			priorAcquaintance: ''
		},
		mentalDisorder: { mentalDisorderPresent: '', mentalDisorderEvidence: '' },
		risk: {
			riskToOwnHealth: '',
			riskToOwnSafety: '',
			riskToOthers: '',
			riskEvidence: '',
			riskImminence: ''
		},
		leastRestrictive: { leastRestrictiveMet: '', alternativesConsidered: '' },
		treatment: { appropriateTreatmentAvailable: '', treatmentPlanSummary: '' },
		nearestRelative: {
			nearestRelativeIdentified: '',
			nearestRelativeConsulted: '',
			nearestRelativeObjection: '',
			consultationRecord: ''
		},
		recommendation: {
			recommendedSection: '',
			outcome: '',
			bedIdentified: '',
			conveyance: '',
			clinicalLegalNote: ''
		}
	};
}

/** A fully-documented, valid Section 2 application. */
function createValidSection2(): AssessmentData {
	const d = createDefaultAssessment();
	d.professionals.amhpName = 'A. Okafor';
	d.professionals.amhpApproved = 'yes';
	d.professionals.doctor1Name = 'Dr R. Singh';
	d.professionals.doctor1Section12Approved = 'yes';
	d.professionals.doctor1ExaminedAt = '2026-06-20T09:00';
	d.professionals.doctor2Name = 'Dr L. Chen';
	d.professionals.doctor2Section12Approved = 'no';
	d.professionals.doctor2ExaminedAt = '2026-06-20T11:00';
	d.professionals.priorAcquaintance = 'yes';
	d.mentalDisorder.mentalDisorderPresent = 'met';
	d.mentalDisorder.mentalDisorderEvidence = 'Acute psychotic episode with paranoid delusions.';
	d.risk.riskToOwnSafety = 'met';
	d.risk.riskEvidence = 'Expressed intent to self-harm; recent attempt.';
	d.risk.riskImminence = 'moderate';
	d.leastRestrictive.leastRestrictiveMet = 'met';
	d.leastRestrictive.alternativesConsidered = 'Informal admission declined; community unsafe.';
	d.recommendation.recommendedSection = '2';
	d.recommendation.outcome = 'detain-under-section';
	d.recommendation.bedIdentified = 'yes';
	return d;
}

describe('Mental Health Act classification / validation engine', () => {
	it('maps recommended section enums to section classes', () => {
		expect(sectionToClass('2')).toBe('section-2');
		expect(sectionToClass('3')).toBe('section-3');
		expect(sectionToClass('136')).toBe('section-136');
		expect(sectionToClass('none')).toBe('none');
		expect(sectionToClass('')).toBe('none');
	});

	it('classifies a fully-documented Section 2 as valid and urgent', () => {
		const r = gradeMentalHealthActAssessment(createValidSection2());
		expect(r.recommendedSectionClass).toBe('section-2');
		expect(r.completenessStatus).toBe('valid');
		expect(r.urgencyClass).toBe('urgent');
	});

	it('marks a Section 2 incomplete when the second doctor is missing', () => {
		const d = createValidSection2();
		d.professionals.doctor2Name = '';
		const r = gradeMentalHealthActAssessment(d);
		expect(r.completenessStatus).toBe('incomplete');
		expect(r.requiredSignatories.find((s) => s.role === 'doctor2')?.present).toBe(false);
	});

	it('marks a Section 2 incomplete when no doctor is Section 12 approved', () => {
		const d = createValidSection2();
		d.professionals.doctor1Section12Approved = 'no';
		d.professionals.doctor2Section12Approved = 'no';
		const r = gradeMentalHealthActAssessment(d);
		expect(r.completenessStatus).toBe('incomplete');
		expect(r.requiredSignatories.find((s) => s.role === 's12')?.present).toBe(false);
	});

	it('requires appropriate treatment for a valid Section 3', () => {
		const d = createValidSection2();
		d.recommendation.recommendedSection = '3';
		// Section 3 adds the appropriate-treatment criterion, not yet met.
		let r = gradeMentalHealthActAssessment(d);
		expect(r.recommendedSectionClass).toBe('section-3');
		expect(r.completenessStatus).toBe('incomplete');
		d.treatment.appropriateTreatmentAvailable = 'met';
		d.treatment.treatmentPlanSummary = 'Inpatient treatment on the acute ward.';
		r = gradeMentalHealthActAssessment(d);
		expect(r.completenessStatus).toBe('valid');
	});

	it('classifies emergency sections (s4/s5/s136) as emergency urgency', () => {
		const d = createDefaultAssessment();
		d.recommendation.recommendedSection = '4';
		expect(deriveUrgency(d, sectionToClass(d.recommendation.recommendedSection))).toBe('emergency');
		d.recommendation.recommendedSection = '136';
		expect(deriveUrgency(d, sectionToClass(d.recommendation.recommendedSection))).toBe('emergency');
	});

	it('escalates s2/s3 to emergency when risk is imminent', () => {
		const d = createValidSection2();
		d.risk.riskImminence = 'imminent';
		expect(gradeMentalHealthActAssessment(d).urgencyClass).toBe('emergency');
	});

	it('treats the none class as valid only with a resolved outcome', () => {
		const d = createDefaultAssessment();
		d.recommendation.recommendedSection = 'none';
		expect(gradeMentalHealthActAssessment(d).completenessStatus).toBe('incomplete');
		d.recommendation.outcome = 'informal-admission';
		const r = gradeMentalHealthActAssessment(d);
		expect(r.recommendedSectionClass).toBe('none');
		expect(r.completenessStatus).toBe('valid');
		expect(r.urgencyClass).toBe('routine');
	});

	it('requires no signatories for the none class', () => {
		expect(evaluateSignatories(createDefaultAssessment(), 'none')).toEqual([]);
	});

	it('makes NO automated detention decision (no such field on the result)', () => {
		const r = gradeMentalHealthActAssessment(createValidSection2());
		expect(r).not.toHaveProperty('detentionDecision');
		expect(r).not.toHaveProperty('detain');
	});
});

describe('Mental Health Act flagged-issue detection', () => {
	it('raises the missing-second-recommendation flag for s2 with one doctor', () => {
		const d = createValidSection2();
		d.professionals.doctor2Name = '';
		const flags = detectFlaggedIssues(d, 'section-2', true);
		expect(flags.some((f) => f.id === 'F-MISSING-SECOND-RECOMMENDATION-001')).toBe(true);
	});

	it('raises the s12-doctor-absent flag when neither doctor is approved', () => {
		const d = createValidSection2();
		d.professionals.doctor1Section12Approved = 'no';
		d.professionals.doctor2Section12Approved = 'no';
		const flags = detectFlaggedIssues(d, 'section-2', true);
		expect(flags.some((f) => f.id === 'F-S12-DOCTOR-ABSENT-001')).toBe(true);
	});

	it('raises the criteria-not-met flag when a criterion is not-met', () => {
		const d = createValidSection2();
		d.mentalDisorder.mentalDisorderPresent = 'not-met';
		const flags = detectFlaggedIssues(d, 'section-2', true);
		expect(flags.some((f) => f.id === 'F-CRITERIA-NOT-MET-001')).toBe(true);
	});

	it('raises the least-restrictive concern when alternatives are undocumented', () => {
		const d = createValidSection2();
		d.leastRestrictive.alternativesConsidered = '';
		const flags = detectFlaggedIssues(d, 'section-2', true);
		expect(flags.some((f) => f.category === 'least-restrictive-concern')).toBe(true);
	});

	it('raises the appropriate-treatment-unavailable flag for s3', () => {
		const d = createValidSection2();
		d.recommendation.recommendedSection = '3';
		d.treatment.appropriateTreatmentAvailable = 'not-met';
		const flags = detectFlaggedIssues(d, 'section-3', true);
		expect(flags.some((f) => f.id === 'F-APPROPRIATE-TREATMENT-UNAVAILABLE-001')).toBe(true);
	});

	it('raises the nearest-relative flag for s3 not consulted', () => {
		const d = createValidSection2();
		d.recommendation.recommendedSection = '3';
		d.nearestRelative.nearestRelativeConsulted = 'no';
		const flags = detectFlaggedIssues(d, 'section-3', true);
		expect(flags.some((f) => f.id === 'F-NEAREST-RELATIVE-NOT-CONSULTED-001')).toBe(true);
	});

	it('raises the time-limit-exceeded flag when exams are >5 days apart', () => {
		const d = createValidSection2();
		d.professionals.doctor1ExaminedAt = '2026-06-01T09:00';
		d.professionals.doctor2ExaminedAt = '2026-06-10T09:00';
		const flags = detectFlaggedIssues(d, 'section-2', false);
		expect(flags.some((f) => f.id === 'F-TIME-LIMIT-EXCEEDED-001')).toBe(true);
	});

	it('raises the no-bed-identified flag for a detaining section with no bed', () => {
		const d = createValidSection2();
		d.recommendation.bedIdentified = 'no';
		const flags = detectFlaggedIssues(d, 'section-2', false);
		expect(flags.some((f) => f.id === 'F-NO-BED-IDENTIFIED-001')).toBe(true);
	});

	it('raises the incomplete-documentation flag when incomplete', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 'section-2', true);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createValidSection2();
		d.professionals.doctor2Name = ''; // high
		d.recommendation.bedIdentified = 'no'; // medium
		const flags = detectFlaggedIssues(d, 'section-2', true);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
