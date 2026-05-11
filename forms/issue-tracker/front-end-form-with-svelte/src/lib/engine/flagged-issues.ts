import type { AdditionalFlag, IssueTrackerAssessment } from './types';

// Safety-critical flags that fire independently of the composite priority.
// Each flag has a stable id, a category, a priority, a description, and a
// suggested action for the on-call responder.
export function computeFlags(data: IssueTrackerAssessment): AdditionalFlag[] {
	const out: AdditionalFlag[] = [];
	const { scores, reporter } = data;

	if (scores.scoreByHarmGrade === 4) {
		out.push({
			flagId: 'F-HARM-FATAL-001',
			category: 'harm-fatal',
			priority: 'high',
			description: 'NHS LFPSE harm grade 4 (fatal).',
			suggestedAction: 'Escalate to LFPSE; notify the trust patient-safety lead immediately.',
		});
	}

	if (scores.scoreByFailureCondition === 'A') {
		out.push({
			flagId: 'F-FAILURE-A-001',
			category: 'failure-catastrophic',
			priority: 'high',
			description: 'FAA / EASA failure condition Level A (catastrophic).',
			suggestedAction: 'Trigger incident bridge; notify safety officer; consider system shutdown.',
		});
	}

	if (scores.scoreBySeverityOfImpact === 5) {
		out.push({
			flagId: 'F-SEVERITY-5-001',
			category: 'severity-catastrophic',
			priority: 'high',
			description: 'Severity of impact 5 (catastrophic).',
			suggestedAction: 'Escalate to executive on-call; prepare customer communication.',
		});
	}

	if (scores.scoreByMagnitudeOfDamage === 10) {
		out.push({
			flagId: 'F-MAGNITUDE-10-001',
			category: 'magnitude-total-destruction',
			priority: 'high',
			description: 'Magnitude of damage 10 (total destruction).',
			suggestedAction: 'Initiate disaster-recovery plan; preserve evidence for forensics.',
		});
	}

	const f = scores.scoreByFrequencyPercent;
	if (f !== null && f >= 95) {
		out.push({
			flagId: 'F-FREQUENCY-95-001',
			category: 'frequency-universal',
			priority: 'high',
			description: `Frequency ${f}% — effectively universal impact.`,
			suggestedAction: 'Treat as full outage; activate status page and on-call rotation.',
		});
	}

	if (scores.scoreByMoscowRequirement === 1) {
		out.push({
			flagId: 'F-MOSCOW-MUST-001',
			category: 'requirement-mandatory',
			priority: 'medium',
			description: 'MoSCoW classification "must have".',
			suggestedAction: 'Hold release until resolved; do not defer.',
		});
	}

	const regulatoryCategories = new Set([
		'clinical-safety',
		'data-protection',
		'workplace-safety',
		'medical-device',
		'regulatory',
	]);
	if (
		regulatoryCategories.has(reporter.issueCategory) &&
		(scores.scoreByHarmGrade !== null && scores.scoreByHarmGrade >= 2)
	) {
		out.push({
			flagId: 'F-REGULATORY-001',
			category: 'regulatory',
			priority: 'high',
			description: `Issue category "${reporter.issueCategory}" with harm ≥ 2 — regulatory reporting may apply.`,
			suggestedAction: 'Notify compliance / legal; prepare LFPSE / ICO / RIDDOR / MHRA report as appropriate.',
		});
	}

	return out;
}
