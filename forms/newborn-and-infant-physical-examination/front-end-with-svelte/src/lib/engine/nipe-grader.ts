import type {
	AssessmentData,
	Completeness,
	ComponentResult,
	FiredRule,
	GradingResult,
	OverallOutcome,
	Referral,
	TestesResult
} from './types';
import { LOW_SAT, nipeReferRules } from './nipe-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** An enum observation counts as unexamined when blank or explicitly not-examined. */
function enumUnexamined(v: string): boolean {
	return v === '' || v === 'not-examined';
}

/** True when every eyes observation is unexamined. */
function eyesAllUnexamined(d: AssessmentData): boolean {
	return (
		enumUnexamined(d.eyes.eyesRedReflexRight) &&
		enumUnexamined(d.eyes.eyesRedReflexLeft) &&
		enumUnexamined(d.eyes.eyesAppearance)
	);
}

/** True when every heart observation (enums + both saturations) is unexamined. */
function heartAllUnexamined(d: AssessmentData): boolean {
	return (
		enumUnexamined(d.heart.heartMurmur) &&
		enumUnexamined(d.heart.femoralPulsesRight) &&
		enumUnexamined(d.heart.femoralPulsesLeft) &&
		enumUnexamined(d.heart.centralCyanosis) &&
		d.heart.oxygenSaturationPreductal === null &&
		d.heart.oxygenSaturationPostductal === null
	);
}

/** True when every hip manoeuvre is unexamined (risk factors excluded). */
function hipsAllUnexamined(d: AssessmentData): boolean {
	return (
		enumUnexamined(d.hips.barlowTest) &&
		enumUnexamined(d.hips.ortolaniTest) &&
		enumUnexamined(d.hips.hipAbduction)
	);
}

/** True when both testes are unexamined. */
function testesBothUnexamined(d: AssessmentData): boolean {
	return enumUnexamined(d.testes.testisRight) && enumUnexamined(d.testes.testisLeft);
}

/** Did a given component's refer rule fire? */
function componentRefers(d: AssessmentData, component: string): boolean {
	const rule = nipeReferRules.find((r) => r.component === component);
	return rule ? rule.evaluate(d) : false;
}

/** Is the heart refer critical (same-day) rather than routine? */
export function heartCritical(d: AssessmentData): boolean {
	return (
		d.heart.centralCyanosis === 'present' ||
		d.heart.femoralPulsesRight === 'weak' ||
		d.heart.femoralPulsesRight === 'absent' ||
		d.heart.femoralPulsesLeft === 'weak' ||
		d.heart.femoralPulsesLeft === 'absent' ||
		(d.heart.oxygenSaturationPreductal !== null &&
			d.heart.oxygenSaturationPreductal < LOW_SAT) ||
		(d.heart.oxygenSaturationPostductal !== null &&
			d.heart.oxygenSaturationPostductal < LOW_SAT)
	);
}

/** Is the hip refer driven by an abnormal exam (vs a risk factor only)? */
export function hipsAbnormalExam(d: AssessmentData): boolean {
	return (
		d.hips.barlowTest === 'positive' ||
		d.hips.ortolaniTest === 'positive' ||
		d.hips.hipAbduction === 'limited'
	);
}

/** Are both testes undescended / not palpable (bilateral)? */
export function testesBilateral(d: AssessmentData): boolean {
	const bad = (v: string) => v === 'undescended' || v === 'not-palpable';
	return bad(d.testes.testisRight) && bad(d.testes.testisLeft);
}

/** Classify a three-state key component. */
function classifyComponent(refers: boolean, allUnexamined: boolean): ComponentResult {
	if (refers) return 'refer';
	if (allUnexamined) return 'not-examined';
	return 'satisfactory';
}

/**
 * Pure function: compute the full NIPE classification for the supplied
 * examination data. This is a classification / completeness form — there is NO
 * numeric total, no cut-off, and no band table.
 *
 * Classification algorithm (spec §4):
 *   each key component  = refer trigger ? 'refer'
 *                       : all obs unexamined ? 'not-examined' : 'satisfactory'
 *   testes              = sex != 'male' ? 'not-applicable' : (as above)
 *
 *   overallOutcome (over applicable components; testes excluded when N/A):
 *     any 'refer'        -> 'refer'
 *     any 'not-examined' -> 'incomplete'
 *     otherwise          -> 'satisfactory'
 *
 *   completeness = any applicable 'not-examined' ? 'incomplete' : 'complete'
 *
 * A screening classification records whether onward referral is indicated; it
 * is not a diagnosis.
 */
export function calculateNipeGrade(data: AssessmentData): GradingResult {
	const d = data;
	const timestamp = new Date().toISOString();

	const eyesResult = classifyComponent(componentRefers(d, 'eyes'), eyesAllUnexamined(d));
	const heartResult = classifyComponent(componentRefers(d, 'heart'), heartAllUnexamined(d));
	const hipsResult = classifyComponent(componentRefers(d, 'hips'), hipsAllUnexamined(d));

	let testesResult: TestesResult;
	if (d.identification.sex !== 'male') {
		testesResult = 'not-applicable';
	} else {
		testesResult = classifyComponent(componentRefers(d, 'testes'), testesBothUnexamined(d));
	}

	// Applicable components for the roll-up (testes excluded when not-applicable).
	const applicable: ComponentResult[] = [eyesResult, heartResult, hipsResult];
	if (testesResult !== 'not-applicable') applicable.push(testesResult);

	let overallOutcome: OverallOutcome;
	if (applicable.some((r) => r === 'refer')) {
		overallOutcome = 'refer';
	} else if (applicable.some((r) => r === 'not-examined')) {
		overallOutcome = 'incomplete';
	} else {
		overallOutcome = 'satisfactory';
	}

	const anyNotExamined = applicable.some((r) => r === 'not-examined');
	const completeness: Completeness = anyNotExamined ? 'incomplete' : 'complete';
	const examined = applicable.filter((r) => r !== 'not-examined').length;
	const completenessPercent =
		applicable.length > 0 ? Math.round((examined / applicable.length) * 100) : 0;

	// ─── Referral pathways (one per refer component) ────────────────
	const referrals: Referral[] = [];
	if (eyesResult === 'refer') {
		referrals.push({
			component: 'eyes',
			pathway: 'Urgent ophthalmology — suspected congenital cataract',
			urgency: 'within-2-weeks'
		});
	}
	if (heartResult === 'refer') {
		referrals.push({
			component: 'heart',
			pathway: heartCritical(d)
				? 'Urgent cardiac / neonatal review — possible critical congenital heart disease'
				: 'Cardiac / neonatal assessment per local pathway',
			urgency: heartCritical(d) ? 'same-day' : 'within-2-weeks'
		});
	}
	if (hipsResult === 'refer') {
		referrals.push({
			component: 'hips',
			pathway: 'Hip ultrasound (developmental dysplasia of the hip)',
			urgency: hipsAbnormalExam(d) ? 'within-2-weeks' : 'by-6-weeks'
		});
	}
	if (testesResult === 'refer') {
		referrals.push({
			component: 'testes',
			pathway: testesBilateral(d)
				? 'Same-day senior / endocrine review — possible disorder of sex development'
				: 'Senior / urology review; refer if persistent',
			urgency: testesBilateral(d) ? 'same-day' : 'review-6-8-weeks'
		});
	}

	// ─── Audit trail of fired classification rules ──────────────────
	const firedRules: FiredRule[] = [];
	for (const rule of nipeReferRules) {
		if (rule.component === 'testes' && testesResult === 'not-applicable') continue;
		let fired = false;
		try {
			fired = rule.evaluate(d) === true;
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`NIPE rule ${rule.id} evaluation failed:`, e);
		}
		if (fired) {
			firedRules.push({
				id: rule.id,
				component: rule.component,
				category: rule.category,
				description: rule.description
			});
		}
	}
	firedRules.push({
		id: 'R-OVERALL-01',
		component: 'overall',
		category: 'outcome-rollup',
		description:
			overallOutcome === 'refer'
				? 'One or more key components classed Refer — referral pathway triggered'
				: overallOutcome === 'incomplete'
					? 'One or more applicable key components Not examined — screen must be completed'
					: 'All applicable key components examined and Satisfactory'
	});

	const partial: Omit<GradingResult, 'flaggedIssues'> = {
		eyesResult,
		heartResult,
		hipsResult,
		testesResult,
		overallOutcome,
		completeness,
		completenessPercent,
		referrals,
		firedRules,
		timestamp
	};

	return {
		...partial,
		flaggedIssues: detectFlaggedIssues(d, {
			eyesResult,
			heartResult,
			hipsResult,
			testesResult
		})
	};
}
