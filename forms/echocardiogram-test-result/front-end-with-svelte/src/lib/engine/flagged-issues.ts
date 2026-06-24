import type { EchocardiogramResult, Flag, FlagPriority } from './types';
import {
	hasCriticalFinding,
	hasSevereValveDisease,
	hasModerateValveDisease,
	hasSevereLvImpairment
} from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror
 * sql/07_create_table_echocardiogram_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: EchocardiogramResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description:
				'A critical finding (severe valve disease, vegetation, pericardial effusion, severe LV impairment, or intracardiac thrombus) is present.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately and document the communication.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description: 'Critical finding present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── severe-valve-disease ───
	if (hasSevereValveDisease(r)) {
		flags.push({
			flagId: 'F-SEVERE-VALVE-001',
			category: 'severe-valve-disease',
			priority: 'high',
			description: 'Severe valvular stenosis or regurgitation is present.',
			suggestedAction: 'Refer to the valve / heart-team for assessment of intervention.'
		});
	}

	// ─── suspected-endocarditis ───
	if (r.vegetation) {
		flags.push({
			flagId: 'F-ENDOCARDITIS-001',
			category: 'suspected-endocarditis',
			priority: 'high',
			description: 'A valvular vegetation is reported, raising suspicion of infective endocarditis.',
			suggestedAction:
				'Alert the referring team urgently; consider blood cultures, antibiotics, and endocarditis-team review.'
		});
	}

	// ─── pericardial-effusion-tamponade ───
	if (r.pericardialEffusion) {
		flags.push({
			flagId: 'F-PERICARDIAL-EFFUSION-001',
			category: 'pericardial-effusion-tamponade',
			priority: 'high',
			description: 'A pericardial effusion is present, with potential tamponade risk.',
			suggestedAction: 'Assess for tamponade and escalate urgently if haemodynamic compromise.'
		});
	}

	// ─── severe-lv-impairment ───
	if (hasSevereLvImpairment(r)) {
		flags.push({
			flagId: 'F-SEVERE-LV-001',
			category: 'severe-lv-impairment',
			priority: 'high',
			description: 'Left-ventricular systolic function is severely impaired.',
			suggestedAction: 'Refer to the heart-failure service and optimise guideline-directed therapy.'
		});
	}

	// ─── intracardiac-thrombus ───
	if (r.intracardiacThrombus) {
		flags.push({
			flagId: 'F-THROMBUS-001',
			category: 'intracardiac-thrombus',
			priority: 'high',
			description: 'An intracardiac thrombus is reported.',
			suggestedAction: 'Alert the referrer; consider anticoagulation and embolic-risk assessment.'
		});
	}

	// ─── urgent-referral (moderate valve disease without a critical finding) ───
	if (hasModerateValveDisease(r) && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Moderate valve disease is present and may warrant cardiology referral.',
			suggestedAction: 'Consider referral to cardiology for surveillance and management.'
		});
	}

	// ─── abnormal-requiring-action (regional wall-motion abnormality) ───
	if (r.regionalWallMotionAbnormality && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'medium',
			description: 'A regional wall-motion abnormality is present, suggesting ischaemic disease.',
			suggestedAction: 'Ensure the referrer is alerted and an ischaemia work-up is considered.'
		});
	}

	// ─── limited-study-quality ───
	if (r.studyQuality === 'poor' || r.studyQuality === 'limited') {
		flags.push({
			flagId: 'F-LIMITED-QUALITY-001',
			category: 'limited-study-quality',
			priority: r.studyQuality === 'poor' ? 'high' : 'medium',
			description: `Study quality is ${r.studyQuality}; diagnostic confidence may be reduced.`,
			suggestedAction:
				'Consider a contrast study or transoesophageal echo to reach diagnostic quality.'
		});
	}

	// ─── missing-impression ───
	if (r.impression.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-IMPRESSION-001',
			category: 'missing-impression',
			priority: 'medium',
			description: 'No impression / conclusion has been recorded.',
			suggestedAction: 'Add an impression that answers the clinical question.'
		});
	}

	// ─── missing-measurement (LV impairment described but no EF recorded) ───
	if (r.lvFunction !== '' && r.lvFunction !== 'normal' && r.lvEjectionFractionPercent === null) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'Impaired LV function is reported but no ejection fraction was recorded.',
			suggestedAction: 'Record the LV ejection fraction percentage for surveillance.'
		});
	}

	// ─── unexpected-finding (abnormal but no originating request linked) ───
	if (
		(hasSevereValveDisease(r) || r.vegetation || r.intracardiacThrombus) &&
		r.originatingRequestReference.trim() === ''
	) {
		flags.push({
			flagId: 'F-UNEXPECTED-FINDING-001',
			category: 'unexpected-finding',
			priority: 'low',
			description: 'A significant finding is present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
