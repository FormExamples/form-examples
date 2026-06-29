// Flagged-issue detection for the Audio-Vestibular Assessment.
//
// Independent of the WHO grade and the DHI total, this module raises
// clinician-facing flags for red-flag presentations (sudden sensorineural
// hearing loss, asymmetric hearing loss suggesting retrocochlear pathology,
// central neurological signs), high handicap scores, fall risk, and findings
// that warrant ENT or neurology referral.
//
// Priority levels: urgent > high > medium > low.

import type { AssessmentData, AdditionalFlag, GradingResult } from './types';

export function detectAdditionalFlags(
	data: AssessmentData,
	result: GradingResult
): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── RED-FLAG presentations ───────────────────────────────────────
	if (
		data.presentingSymptoms.hearingLoss === 'yes' &&
		data.presentingSymptoms.hearingLossOnset === 'sudden'
	) {
		flags.push({
			id: 'FLAG-RED-001',
			category: 'Red Flag',
			message:
				'Sudden hearing loss reported - possible sudden sensorineural hearing loss; same-day ENT review and consider corticosteroids.',
			priority: 'urgent'
		});
	}

	if (data.presentingSymptoms.neurologicalSymptoms === 'yes') {
		flags.push({
			id: 'FLAG-RED-002',
			category: 'Red Flag',
			message:
				'Associated neurological symptoms (weakness, diplopia, dysarthria, etc.) - urgent neurology evaluation.',
			priority: 'urgent'
		});
	}

	if (
		data.vestibularScreening.headImpulseTest === 'normal' &&
		data.vestibularScreening.nystagmus &&
		data.vestibularScreening.nystagmus !== 'none' &&
		data.presentingSymptoms.vertigo === 'yes'
	) {
		flags.push({
			id: 'FLAG-RED-003',
			category: 'Red Flag',
			message:
				'Acute vertigo with normal HIT and nystagmus - consider central cause (HINTS: refer for neurology / posterior circulation imaging).',
			priority: 'urgent'
		});
	}

	// ─── Asymmetric hearing loss (retrocochlear screen) ──────────────
	if (result.asymmetry !== null && result.asymmetry >= 15) {
		flags.push({
			id: 'FLAG-PTA-001',
			category: 'Pure-Tone Audiometry',
			message: `Inter-aural asymmetry ${result.asymmetry} dB - retrocochlear pathology screen (MRI IAM) recommended.`,
			priority: 'high'
		});
	}

	// ─── Severe / profound hearing loss ──────────────────────────────
	if (result.hearingLossGrade === 'profound') {
		flags.push({
			id: 'FLAG-PTA-002',
			category: 'Pure-Tone Audiometry',
			message: 'Profound hearing loss - consider cochlear implant assessment.',
			priority: 'high'
		});
	} else if (result.hearingLossGrade === 'severe') {
		flags.push({
			id: 'FLAG-PTA-003',
			category: 'Pure-Tone Audiometry',
			message: 'Severe hearing loss - hearing-aid candidacy review and audiology rehabilitation.',
			priority: 'medium'
		});
	} else if (
		result.hearingLossGrade === 'moderately-severe' ||
		result.hearingLossGrade === 'moderate'
	) {
		flags.push({
			id: 'FLAG-PTA-004',
			category: 'Pure-Tone Audiometry',
			message: 'Moderate hearing loss - hearing-aid candidacy review.',
			priority: 'medium'
		});
	}

	// ─── Word recognition concerns ───────────────────────────────────
	for (const side of ['right', 'left'] as const) {
		const wr = data.speechAudiometry[`${side}WordRecognitionPercent`];
		if (wr !== null && wr < 50) {
			flags.push({
				id: `FLAG-SPEECH-${side === 'right' ? 'R' : 'L'}-001`,
				category: 'Speech Audiometry',
				message: `Poor word-recognition score (${wr}%) ${side} ear - retrocochlear screen indicated.`,
				priority: 'high'
			});
		}
	}

	// ─── Tympanometry / middle-ear effusion ──────────────────────────
	for (const side of ['right', 'left'] as const) {
		const tymp = data.tympanometryAcousticReflexes[`${side}Tympanogram`];
		if (tymp === 'B') {
			flags.push({
				id: `FLAG-TYMP-${side === 'right' ? 'R' : 'L'}-001`,
				category: 'Tympanometry',
				message: `Type B tympanogram ${side} ear - middle-ear effusion or perforation; ENT review.`,
				priority: 'medium'
			});
		} else if (tymp === 'C') {
			flags.push({
				id: `FLAG-TYMP-${side === 'right' ? 'R' : 'L'}-002`,
				category: 'Tympanometry',
				message: `Type C tympanogram ${side} ear - Eustachian-tube dysfunction.`,
				priority: 'low'
			});
		}
	}

	// ─── Otoscopic red flags ─────────────────────────────────────────
	for (const side of ['right', 'left'] as const) {
		const ear = data.otoscopicExamination[`${side}Ear`];
		if (!ear) continue;
		if (ear.tympanicMembrane === 'perforation') {
			flags.push({
				id: `FLAG-OTO-${side === 'right' ? 'R' : 'L'}-001`,
				category: 'Otoscopic',
				message: `${side[0].toUpperCase() + side.slice(1)} TM perforation - ENT review.`,
				priority: 'medium'
			});
		}
		if (ear.canalStatus === 'otorrhea') {
			flags.push({
				id: `FLAG-OTO-${side === 'right' ? 'R' : 'L'}-002`,
				category: 'Otoscopic',
				message: `${side[0].toUpperCase() + side.slice(1)} ear discharge - infection screen and ENT review.`,
				priority: 'medium'
			});
		}
	}

	// ─── Vestibular findings ─────────────────────────────────────────
	if (
		data.vestibularScreening.dixHallpike === 'positive-right' ||
		data.vestibularScreening.dixHallpike === 'positive-left' ||
		data.vestibularScreening.dixHallpike === 'bilateral'
	) {
		flags.push({
			id: 'FLAG-VEST-001',
			category: 'Vestibular',
			message:
				'Positive Dix-Hallpike - posterior canal BPPV; particle-repositioning manoeuvre indicated.',
			priority: 'medium'
		});
	}

	if (
		data.vestibularScreening.headImpulseTest === 'abnormal-right' ||
		data.vestibularScreening.headImpulseTest === 'abnormal-left'
	) {
		flags.push({
			id: 'FLAG-VEST-002',
			category: 'Vestibular',
			message:
				'Abnormal head-impulse test - peripheral vestibular hypofunction; vestibular rehabilitation indicated.',
			priority: 'medium'
		});
	}

	if (data.vestibularScreening.rombergTest === 'abnormal') {
		flags.push({
			id: 'FLAG-VEST-003',
			category: 'Vestibular',
			message: 'Abnormal Romberg - imbalance and falls risk; review safety.',
			priority: 'medium'
		});
	}

	// ─── DHI severity ────────────────────────────────────────────────
	if (result.dhiHandicapLevel === 'severe') {
		flags.push({
			id: 'FLAG-DHI-001',
			category: 'DHI',
			message: `DHI ${result.dhiTotal}/100 - severe perceived handicap; vestibular rehabilitation strongly indicated.`,
			priority: 'high'
		});
	} else if (result.dhiHandicapLevel === 'moderate') {
		flags.push({
			id: 'FLAG-DHI-002',
			category: 'DHI',
			message: `DHI ${result.dhiTotal}/100 - moderate perceived handicap; consider vestibular rehabilitation.`,
			priority: 'medium'
		});
	}

	// ─── Falls risk ──────────────────────────────────────────────────
	if (
		data.presentingSymptoms.falls === 'yes' &&
		data.presentingSymptoms.fallsLastYearCount !== null &&
		data.presentingSymptoms.fallsLastYearCount >= 2
	) {
		flags.push({
			id: 'FLAG-FALL-001',
			category: 'Falls',
			message: `${data.presentingSymptoms.fallsLastYearCount} falls in the last year - multifactorial falls assessment indicated.`,
			priority: 'high'
		});
	} else if (data.presentingSymptoms.falls === 'yes') {
		flags.push({
			id: 'FLAG-FALL-002',
			category: 'Falls',
			message: 'History of falls - safety review.',
			priority: 'medium'
		});
	}

	// ─── Fluctuating hearing loss + vertigo (Meniere screen) ─────────
	if (
		data.presentingSymptoms.hearingLossOnset === 'fluctuating' &&
		data.presentingSymptoms.vertigo === 'yes' &&
		data.presentingSymptoms.tinnitus === 'yes'
	) {
		flags.push({
			id: 'FLAG-MEN-001',
			category: 'Differential',
			message:
				'Fluctuating hearing loss + episodic vertigo + tinnitus - consider Meniere disease.',
			priority: 'medium'
		});
	}

	// ─── Bothersome tinnitus ─────────────────────────────────────────
	if (data.presentingSymptoms.tinnitus === 'yes') {
		flags.push({
			id: 'FLAG-TINN-001',
			category: 'Tinnitus',
			message: 'Tinnitus reported - consider tinnitus management programme.',
			priority: 'low'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder: Record<AdditionalFlag['priority'], number> = {
		urgent: 0,
		high: 1,
		medium: 2,
		low: 3
	};
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
