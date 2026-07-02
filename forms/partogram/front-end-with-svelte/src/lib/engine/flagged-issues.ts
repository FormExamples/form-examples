// Flagged-issue detection (red flags) for the Partogram. Emitted independently
// of the progress classification (spec §5), each scanned across the WHOLE
// observation series, each with a priority. Each flag mirrors a category in the
// `partogram_grade_flag` SQL table:
//
//   - action-line-crossed    (high)   — latest dilatation on / right of action line
//   - fetal-heart-abnormal    (high)   — any FHR < 110 or > 160 bpm
//   - meconium                (high)   — any liquor state = meconium-stained
//   - maternal-fever          (high)   — any temperature >= 37.5 C
//   - maternal-hypertension   (high)   — any systolic >= 140 or diastolic >= 90
//   - alert-line-crossed      (medium) — latest dilatation between the lines
//   - poor-progress           (medium) — no dilatation increase over >= 4 h
//   - maternal-tachycardia    (medium) — any pulse >= 120 bpm
//   - maternal-hypotension    (medium) — any systolic < 90 mmHg
//   - ketonuria               (low)    — any urine ketones present
//   - proteinuria             (low)    — any urine protein present
//   - incomplete              (low)    — a plotted row missing dilatation or time

import type { AssessmentData, FlaggedIssue, GradingResult, Observation } from './types';
import {
	num,
	FHR_LOW_BPM,
	FHR_HIGH_BPM,
	TEMPERATURE_FEVER_C,
	SYSTOLIC_HYPERTENSION_MMHG,
	DIASTOLIC_HYPERTENSION_MMHG,
	PULSE_TACHYCARDIA_BPM,
	SYSTOLIC_HYPOTENSION_MMHG,
	POOR_PROGRESS_HOURS,
	MS_PER_HOUR
} from './partogram-rules';

/** The subset of the grade the flag detector needs (progress + latest point). */
export type GradeContext = Omit<GradingResult, 'flaggedIssues' | 'timestamp'>;

/**
 * True when no dilatation increase is recorded across any window of at least
 * `POOR_PROGRESS_HOURS` hours: i.e. some earlier dilatation reading has an
 * equal-or-greater dilatation than a later reading >= 4 h afterwards.
 */
export function noProgressOverWindow(observations: Observation[]): boolean {
	const points = observations
		.filter((o) => num(o.cervicalDilatationCm) !== null && o.observedAt)
		.map((o) => ({ d: num(o.cervicalDilatationCm) as number, t: Date.parse(o.observedAt) }))
		.filter((p) => !Number.isNaN(p.t))
		.sort((a, b) => a.t - b.t);

	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			const spanHours = (points[j].t - points[i].t) / MS_PER_HOUR;
			if (spanHours >= POOR_PROGRESS_HOURS && points[j].d <= points[i].d) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Detect every flagged issue for the supplied record. `grade` is the
 * reference-line result from `calculateGrade`. Order is high → medium → low
 * after a final priority sort.
 */
export function detectFlaggedIssues(data: AssessmentData, grade: GradeContext): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const observations = data.observations || [];

	// ─── Action line crossed (HIGH) ─────────────────────────────
	if (grade.progressClassification === 'actionLineCrossed') {
		flags.push({
			id: 'F-ACTION-LINE-001',
			category: 'action-line-crossed',
			priority: 'high',
			description: `Latest dilatation ${grade.latestDilatationCm} cm is on or right of the action line at ${grade.elapsedHours === null ? '?' : grade.elapsedHours.toFixed(1)} h of active labour`,
			suggestedAction:
				'Obstetric review required: reassess for obstructed labour and consider augmentation or operative delivery.'
		});
	}

	// ─── Fetal heart rate abnormal (HIGH) ───────────────────────
	const abnormalFhr = observations
		.map((o) => num(o.fetalHeartRate))
		.filter((v): v is number => v !== null && (v < FHR_LOW_BPM || v > FHR_HIGH_BPM));
	if (abnormalFhr.length > 0) {
		flags.push({
			id: 'F-FHR-001',
			category: 'fetal-heart-abnormal',
			priority: 'high',
			description: `Fetal heart rate outside ${FHR_LOW_BPM}-${FHR_HIGH_BPM} bpm recorded (${abnormalFhr.join(', ')} bpm)`,
			suggestedAction:
				'Assess fetal wellbeing; consider continuous cardiotocography, maternal repositioning, and obstetric review.'
		});
	}

	// ─── Meconium-stained liquor (HIGH) ─────────────────────────
	if (observations.some((o) => o.liquorState === 'meconium')) {
		flags.push({
			id: 'F-MECONIUM-001',
			category: 'meconium',
			priority: 'high',
			description: 'Meconium-stained liquor recorded',
			suggestedAction:
				'Consider continuous fetal monitoring and neonatal-team awareness for delivery.'
		});
	}

	// ─── Maternal fever (HIGH) ──────────────────────────────────
	const feverTemps = observations
		.map((o) => num(o.temperature))
		.filter((v): v is number => v !== null && v >= TEMPERATURE_FEVER_C);
	if (feverTemps.length > 0) {
		flags.push({
			id: 'F-FEVER-001',
			category: 'maternal-fever',
			priority: 'high',
			description: `Maternal temperature at or above ${TEMPERATURE_FEVER_C} C recorded (${feverTemps.map((t) => t.toFixed(1)).join(', ')} C)`,
			suggestedAction:
				'Assess for chorioamnionitis or sepsis; consider cultures, hydration, and antipyretics per protocol.'
		});
	}

	// ─── Maternal hypertension (HIGH) ───────────────────────────
	const hypertensive = observations.some((o) => {
		const sys = num(o.systolicBloodPressure);
		const dia = num(o.diastolicBloodPressure);
		return (
			(sys !== null && sys >= SYSTOLIC_HYPERTENSION_MMHG) ||
			(dia !== null && dia >= DIASTOLIC_HYPERTENSION_MMHG)
		);
	});
	if (hypertensive) {
		flags.push({
			id: 'F-HYPERTENSION-001',
			category: 'maternal-hypertension',
			priority: 'high',
			description: `Maternal blood pressure at or above ${SYSTOLIC_HYPERTENSION_MMHG}/${DIASTOLIC_HYPERTENSION_MMHG} mmHg recorded`,
			suggestedAction:
				'Assess for pre-eclampsia: check proteinuria, symptoms, and reflexes; escalate to the obstetric team.'
		});
	}

	// ─── Alert line crossed (MEDIUM) ────────────────────────────
	if (grade.progressClassification === 'alertLineCrossed') {
		flags.push({
			id: 'F-ALERT-LINE-001',
			category: 'alert-line-crossed',
			priority: 'medium',
			description: `Latest dilatation ${grade.latestDilatationCm} cm is between the alert and action lines at ${grade.elapsedHours === null ? '?' : grade.elapsedHours.toFixed(1)} h of active labour`,
			suggestedAction:
				'Slow progress: review, reassess, consider amniotomy, and transfer if in a peripheral unit.'
		});
	}

	// ─── Poor progress / prolonged labour (MEDIUM) ──────────────
	if (noProgressOverWindow(observations)) {
		flags.push({
			id: 'F-POOR-PROGRESS-001',
			category: 'poor-progress',
			priority: 'medium',
			description: `No increase in cervical dilatation across at least ${POOR_PROGRESS_HOURS} h of active labour`,
			suggestedAction:
				'Reassess progress, contractions, and fetal position; consider amniotomy or oxytocin augmentation per protocol.'
		});
	}

	// ─── Maternal tachycardia (MEDIUM) ──────────────────────────
	const tachy = observations
		.map((o) => num(o.pulse))
		.filter((v): v is number => v !== null && v >= PULSE_TACHYCARDIA_BPM);
	if (tachy.length > 0) {
		flags.push({
			id: 'F-TACHYCARDIA-001',
			category: 'maternal-tachycardia',
			priority: 'medium',
			description: `Maternal pulse at or above ${PULSE_TACHYCARDIA_BPM} bpm recorded (${tachy.join(', ')} bpm)`,
			suggestedAction:
				'Assess for pain, dehydration, infection, or haemorrhage; review hydration and analgesia.'
		});
	}

	// ─── Maternal hypotension (MEDIUM) ──────────────────────────
	const hypotension = observations
		.map((o) => num(o.systolicBloodPressure))
		.filter((v): v is number => v !== null && v < SYSTOLIC_HYPOTENSION_MMHG);
	if (hypotension.length > 0) {
		flags.push({
			id: 'F-HYPOTENSION-001',
			category: 'maternal-hypotension',
			priority: 'medium',
			description: `Maternal systolic blood pressure below ${SYSTOLIC_HYPOTENSION_MMHG} mmHg recorded (${hypotension.join(', ')} mmHg)`,
			suggestedAction:
				'Assess perfusion and for haemorrhage; review fluids and epidural effect, and escalate if persistent.'
		});
	}

	// ─── Ketonuria (LOW) ────────────────────────────────────────
	if (observations.some((o) => o.urineKetones !== '' && o.urineKetones !== 'negative')) {
		flags.push({
			id: 'F-KETONURIA-001',
			category: 'ketonuria',
			priority: 'low',
			description: 'Urine ketones present',
			suggestedAction:
				'Review hydration and caloric intake in labour; consider oral or intravenous fluids.'
		});
	}

	// ─── Proteinuria (LOW) ──────────────────────────────────────
	if (observations.some((o) => o.urineProtein !== '' && o.urineProtein !== 'negative')) {
		flags.push({
			id: 'F-PROTEINURIA-001',
			category: 'proteinuria',
			priority: 'low',
			description: 'Urine protein present',
			suggestedAction: 'Assess for pre-eclampsia alongside blood pressure and symptoms.'
		});
	}

	// ─── Incomplete observation (LOW) ───────────────────────────
	if (observations.length === 0) {
		flags.push({
			id: 'F-INCOMPLETE-NONE-001',
			category: 'incomplete',
			priority: 'low',
			description: 'No observations have been recorded — labour progress cannot be plotted',
			suggestedAction:
				'Record timed observations, including cervical dilatation, to plot progress against the reference lines.'
		});
	} else {
		const incomplete = observations.filter(
			(o) => num(o.cervicalDilatationCm) === null || !o.observedAt
		).length;
		if (incomplete > 0) {
			flags.push({
				id: 'F-INCOMPLETE-ROWS-001',
				category: 'incomplete',
				priority: 'low',
				description: `${incomplete} observation row(s) are missing a dilatation or a time and cannot be plotted`,
				suggestedAction:
					'Complete the time and cervical dilatation for every plotted row, or remove the empty rows.'
			});
		}
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
