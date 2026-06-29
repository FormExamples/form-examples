import type { AssessmentData, GfrCategory, AlbuminuriaCategory, RiskLevel, KdigoRule } from './types';
import {
	classifyGfrCategory,
	classifyAlbuminuriaCategory,
	gfrCategoryLabel,
	albuminuriaCategoryLabel,
	estimateEgfrCkdEpi2021,
	calculateAge,
	riskLevelLabel
} from './utils';

/**
 * Resolve the eGFR used for staging: prefer an explicitly entered eGFR;
 * otherwise estimate from creatinine + age + sex via CKD-EPI 2021.
 */
export function resolveEgfr(d: AssessmentData): number | null {
	if (typeof d.bloodTests.egfr === 'number' && d.bloodTests.egfr > 0) {
		return d.bloodTests.egfr;
	}
	const age = d.demographics.age ?? calculateAge(d.demographics.dateOfBirth);
	return estimateEgfrCkdEpi2021(d.bloodTests.serumCreatinine, age, d.demographics.sex);
}

/**
 * Resolve the GFR category used for staging: prefer the clinician-entered
 * value if present; otherwise derive from the resolved eGFR.
 */
export function resolveGfrCategory(d: AssessmentData): GfrCategory {
	if (d.clinicalImpression.gfrCategory) return d.clinicalImpression.gfrCategory;
	return classifyGfrCategory(resolveEgfr(d));
}

/**
 * Resolve the albuminuria category used for staging: prefer the clinician-
 * entered value; otherwise derive from urine ACR.
 */
export function resolveAlbuminuriaCategory(d: AssessmentData): AlbuminuriaCategory {
	if (d.clinicalImpression.albuminuriaCategory) {
		return d.clinicalImpression.albuminuriaCategory;
	}
	return classifyAlbuminuriaCategory(d.urineTests.acr);
}

/**
 * KDIGO heatmap: composite risk by (GFR, Albuminuria) category. Returns
 * `'unknown'` when either input is missing.
 */
export function kdigoCompositeRisk(g: GfrCategory, a: AlbuminuriaCategory): RiskLevel {
	if (!g || !a) return 'unknown';
	const heatmap: Record<string, Record<string, RiskLevel>> = {
		G1: { A1: 'low', A2: 'moderate', A3: 'high' },
		G2: { A1: 'low', A2: 'moderate', A3: 'high' },
		G3a: { A1: 'moderate', A2: 'high', A3: 'very-high' },
		G3b: { A1: 'high', A2: 'very-high', A3: 'very-high' },
		G4: { A1: 'very-high', A2: 'very-high', A3: 'very-high' },
		G5: { A1: 'very-high', A2: 'very-high', A3: 'very-high' }
	};
	return heatmap[g]?.[a] ?? 'unknown';
}

/**
 * Declarative KDIGO classification rules. Each rule produces a single named
 * contribution to the report's audit trail describing how the GFR category,
 * albuminuria category, and composite risk level were derived.
 */
export const kdigoRules: KdigoRule[] = [
	{
		id: 'KDIGO-001',
		category: 'GFR Category',
		description: 'GFR stage derived from eGFR (mL/min/1.73 m²).',
		evaluate: (d) => {
			const g = resolveGfrCategory(d);
			return g ? gfrCategoryLabel(g) : '';
		}
	},
	{
		id: 'KDIGO-002',
		category: 'Albuminuria Category',
		description: 'Albuminuria stage derived from urine ACR (mg/mmol).',
		evaluate: (d) => {
			const a = resolveAlbuminuriaCategory(d);
			return a ? albuminuriaCategoryLabel(a) : '';
		}
	},
	{
		id: 'KDIGO-003',
		category: 'Composite Risk',
		description: 'KDIGO composite risk from GFR × Albuminuria heatmap.',
		evaluate: (d) => {
			const g = resolveGfrCategory(d);
			const a = resolveAlbuminuriaCategory(d);
			const risk = kdigoCompositeRisk(g, a);
			return risk === 'unknown' ? '' : riskLevelLabel(risk);
		}
	}
];
