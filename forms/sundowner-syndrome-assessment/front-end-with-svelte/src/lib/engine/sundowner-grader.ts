import type { AssessmentData, FiredRule, GradingResult, NPIDomainResult } from './types';
import { severityFromCMAI, severityLabel, npiBandLabel } from './utils';
import { cmaiItems, npiDomains, CMAI_ITEM_IDS } from './cmai-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Sum the 29 CMAI items. Unanswered items (stored as 0) are treated as 1
 * ("Never") so a partly-complete form still classifies sensibly.
 */
export function sumCMAI(data: AssessmentData): { total: number; answered: number } {
	const cmai = data.behaviouralSymptoms?.cmai ?? {};
	let total = 0;
	let answered = 0;
	for (const id of CMAI_ITEM_IDS) {
		const v = cmai[id];
		if (typeof v === 'number' && v >= 1 && v <= 7) {
			total += v;
			answered++;
		} else {
			total += 1; // unanswered scored as "Never"
		}
	}
	return { total, answered };
}

/** Sum the 12 NPI domain scores (frequency * severity, each 0-12). */
export function sumNPI(data: AssessmentData): {
	total: number;
	answered: number;
	perDomain: NPIDomainResult[];
} {
	const npi = data.behaviouralSymptoms?.npi ?? {};
	let total = 0;
	let answered = 0;
	const perDomain: NPIDomainResult[] = [];
	for (const domain of npiDomains) {
		const entry = npi[domain.key] ?? { frequency: 0, severity: 0 };
		const f = Number(entry.frequency) || 0;
		const s = Number(entry.severity) || 0;
		const score = f >= 1 && f <= 4 && s >= 1 && s <= 3 ? f * s : 0;
		if (score > 0) answered++;
		total += score;
		perDomain.push({ key: domain.key, label: domain.label, score, frequency: f, severity: s });
	}
	return { total, answered, perDomain };
}

/**
 * Pure function: grades the sundowner assessment, returning the CMAI total,
 * NPI total, severity band, completion counts, per-domain NPI breakdown, the
 * fired scoring rules, and the clinician-facing flagged issues.
 */
export function gradeSundowner(data: AssessmentData): GradingResult {
	const cmaiSum = sumCMAI(data);
	const npiSum = sumNPI(data);
	const cmaiScore = cmaiSum.total;
	const npiScore = npiSum.total;
	const severity = severityFromCMAI(cmaiScore);

	const firedRules: FiredRule[] = [];

	// CMAI band rule.
	firedRules.push({
		id: 'CMAI-BAND',
		category: 'CMAI Total',
		description: `CMAI total ${cmaiScore} of 203 (${cmaiSum.answered} of 29 items observed).`,
		detail: `Severity band: ${severityLabel(severity)} (CMAI thresholds: 29-45 mild, 46-75 moderate, 76-120 severe, >120 critical).`
	});

	// Highly-elevated CMAI items (>= 5: at least daily).
	const highCmaiItems = cmaiItems.filter((item) => {
		const v = data.behaviouralSymptoms?.cmai?.[item.id];
		return typeof v === 'number' && v >= 5;
	});
	if (highCmaiItems.length > 0) {
		firedRules.push({
			id: 'CMAI-DAILY',
			category: 'CMAI Items',
			description: `${highCmaiItems.length} CMAI item(s) occurring at least daily.`,
			detail: highCmaiItems.map((i) => `#${i.number} ${i.label}`).join('; ')
		});
	}

	// NPI total band.
	firedRules.push({
		id: 'NPI-TOTAL',
		category: 'NPI Total',
		description: `NPI total ${npiScore} of 144 across 12 domains (${npiSum.answered} domain(s) endorsed).`,
		detail: `NPI total is ${npiBandLabel(npiScore).toLowerCase()}.`
	});

	// Elevated NPI sub-domains (score >= 4).
	const elevatedDomains = npiSum.perDomain.filter((d) => d.score >= 4);
	if (elevatedDomains.length > 0) {
		firedRules.push({
			id: 'NPI-DOMAINS',
			category: 'NPI Domains',
			description: `${elevatedDomains.length} NPI domain(s) with score >= 4.`,
			detail: elevatedDomains
				.map((d) => `${d.label} (F${d.frequency} x S${d.severity} = ${d.score})`)
				.join('; ')
		});
	}

	return {
		cmaiScore,
		npiScore,
		severity,
		cmaiAnsweredCount: cmaiSum.answered,
		npiAnsweredCount: npiSum.answered,
		npiPerDomain: npiSum.perDomain,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
