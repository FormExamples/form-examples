import type {
	AgileConsultingScorecardAssessment,
	Band,
	GradeResult,
} from './types';
import { bandToRecommendation } from './utils';

/**
 * Redacted, vendor-facing summary of a scorecard. Designed to be shared
 * with prospective agile consultants in a request-for-proposal (RFP) so
 * they can scope an engagement without seeing internal details.
 *
 * Deliberately omits:
 *   - per-item answers (`true` / `false` / `null`) and evidence text;
 *   - respondent name, email, phone, role, department, seniority;
 *   - organization legal name, headcount, region, website, notes;
 *   - signed-off override text and signature.
 *
 * Retains:
 *   - organization name + sector + size band (for matching the consultant
 *     to the buyer's domain and scale);
 *   - assessment date (so the consultant knows how fresh the snapshot is);
 *   - score totals + band (overall readiness signal);
 *   - flag *categories* + *priorities* — but not the prose descriptions
 *     or suggested actions, which can leak the buyer's specific gaps;
 *   - the canonical recommendation slug.
 */
export interface PreTenderSummary {
	$schemaVersion: 1;
	organization: {
		organizationName: string;
		sector: string;
		sizeBand: string;
	};
	assessment: {
		assessmentDate: string;
	};
	score: {
		total: number;
		manifestoSubtotal: number;
		principlesSubtotal: number;
		band: Band;
		recommendation: string;
	};
	flags: Array<{
		category: string;
		priority: 'low' | 'medium' | 'high';
	}>;
}

export function toPreTenderSummary(
	data: AgileConsultingScorecardAssessment,
	grade: GradeResult,
): PreTenderSummary {
	return {
		$schemaVersion: 1,
		organization: {
			organizationName: data.organization.organizationName,
			sector: data.organization.sector,
			sizeBand: data.organization.sizeBand,
		},
		assessment: {
			assessmentDate: data.assessment.assessmentDate,
		},
		score: {
			total: grade.scoreTotal,
			manifestoSubtotal: grade.manifestoSubtotal,
			principlesSubtotal: grade.principlesSubtotal,
			band: grade.computedBand,
			recommendation: bandToRecommendation(grade.computedBand),
		},
		flags: grade.additionalFlags.map((f) => ({
			category: f.category,
			priority: f.priority,
		})),
	};
}
