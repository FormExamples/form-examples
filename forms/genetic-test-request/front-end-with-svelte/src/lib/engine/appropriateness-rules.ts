import type { GeneticTestRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — appropriateness (NHS National Genomic Test Directory, 1–9 ordinal).
 *
 * The Test Directory pairs each clinical indication with a set of eligible test
 * types (the "ideal" technology). A request whose indication and test type
 * clearly meet a Directory clinical indication scores 7–9 (eligible); a
 * plausible-but-suboptimal technology scores 4–6 (partial / borderline); a
 * clearly mismatched pairing scores 1–3 (not eligible).
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */

/** Map of indication → { ideal:[testType], plausible:[testType] }. */
const INDICATION_TEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-genetic-disorder': {
		ideal: ['whole-genome', 'whole-exome', 'gene-panel'],
		plausible: ['diagnostic-single-gene', 'chromosomal-microarray']
	},
	'familial-cancer': {
		ideal: ['gene-panel', 'diagnostic-single-gene'],
		plausible: ['predictive-presymptomatic', 'whole-exome']
	},
	'developmental-delay': {
		ideal: ['chromosomal-microarray', 'whole-genome'],
		plausible: ['whole-exome', 'karyotype']
	},
	'congenital-anomaly': {
		ideal: ['chromosomal-microarray', 'whole-genome'],
		plausible: ['karyotype', 'whole-exome']
	},
	'cardiomyopathy-arrhythmia': {
		ideal: ['gene-panel'],
		plausible: ['whole-exome', 'diagnostic-single-gene', 'predictive-presymptomatic']
	},
	neuromuscular: {
		ideal: ['gene-panel', 'whole-exome'],
		plausible: ['diagnostic-single-gene', 'whole-genome']
	},
	'predictive-family-history': {
		ideal: ['predictive-presymptomatic', 'diagnostic-single-gene'],
		plausible: ['gene-panel']
	},
	'carrier-screening': {
		ideal: ['carrier-testing', 'diagnostic-single-gene'],
		plausible: ['gene-panel']
	},
	'prenatal-diagnosis': {
		ideal: ['prenatal', 'chromosomal-microarray', 'karyotype'],
		plausible: ['gene-panel', 'diagnostic-single-gene']
	},
	pharmacogenomics: { ideal: ['pharmacogenomic'], plausible: ['gene-panel'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBandFromScore(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for the indication × test-type pairing and return
 * the band plus the fired rule. Defaults to a neutral may-be-appropriate when
 * the indication or test type has not yet been chosen.
 */
export function gradeAppropriateness(r: GeneticTestRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.request.primaryIndication;
	const testType = r.request.testType;

	if (!indication || !testType) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or test type not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(testType)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-ELIGIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${testType} test meets the National Genomic Test Directory eligibility for "${indication}".`
				}
			]
		};
	}

	if (map.plausible.includes(testType)) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PARTIAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${testType} test may be eligible for "${indication}" but is not the first-line Directory technology.`
				}
			]
		};
	}

	if (indication === 'other') {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-OTHER',
					axis: 'appropriateness',
					category: 'other',
					description:
						'Indication recorded as "other"; eligibility requires clinician / laboratory vetting against the Test Directory.'
				}
			]
		};
	}

	return {
		appropriatenessScore: 2,
		appropriatenessBand: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} test does not match a Test Directory eligibility for "${indication}"; query the referrer.`
			}
		]
	};
}
