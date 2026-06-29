import type { AssessmentData, AdditionalFlag } from './types';
import { calculateWoundArea } from './utils';

/**
 * Flagged-issue detection. Independent of the Braden total (which the grader
 * computes), this raises clinician-facing flags for pressure-ulcer staging,
 * wound infection, urgent skin findings (necrosis, cyanosis), undernutrition,
 * immobility, incontinence-driven moisture, photographic-consent gaps, and
 * missing referrals.
 */
export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Wound assessment alerts ──────────────────────────────
	if (data.woundAssessment.woundPresent === 'yes') {
		if (
			data.woundAssessment.woundStage === 'stage-iv' ||
			data.woundAssessment.woundStage === 'unstageable'
		) {
			flags.push({
				id: 'FLAG-WOUND-001',
				category: 'Wound',
				message: `Pressure injury ${data.woundAssessment.woundStage === 'unstageable' ? 'unstageable' : 'stage IV'} — urgent tissue-viability review.`,
				priority: 'urgent'
			});
		} else if (data.woundAssessment.woundStage === 'stage-iii') {
			flags.push({
				id: 'FLAG-WOUND-002',
				category: 'Wound',
				message: 'Stage III pressure injury — full-thickness skin loss; specialist wound care required.',
				priority: 'high'
			});
		} else if (data.woundAssessment.woundStage === 'deep-tissue-injury') {
			flags.push({
				id: 'FLAG-WOUND-003',
				category: 'Wound',
				message: 'Deep tissue pressure injury — high-risk evolution to stage III/IV.',
				priority: 'high'
			});
		}

		if (
			data.woundAssessment.tissueType === 'necrotic' ||
			data.woundAssessment.tissueType === 'eschar'
		) {
			flags.push({
				id: 'FLAG-WOUND-004',
				category: 'Wound',
				message: 'Necrotic tissue / eschar present — debridement may be indicated.',
				priority: 'high'
			});
		}

		if (data.woundAssessment.infectionSigns === 'yes') {
			flags.push({
				id: 'FLAG-WOUND-005',
				category: 'Wound',
				message: 'Clinical signs of wound infection — consider swab and antimicrobial review.',
				priority: 'urgent'
			});
		}

		if (data.woundAssessment.woundOdour === 'strong' || data.woundAssessment.woundOdour === 'foul') {
			flags.push({
				id: 'FLAG-WOUND-006',
				category: 'Wound',
				message: 'Strong / foul wound odour — possible anaerobic infection.',
				priority: 'high'
			});
		}

		if (data.woundAssessment.exudateAmount === 'heavy') {
			flags.push({
				id: 'FLAG-WOUND-007',
				category: 'Wound',
				message: 'Heavy wound exudate — review absorbent dressing strategy.',
				priority: 'medium'
			});
		}

		const area = calculateWoundArea(
			data.woundAssessment.woundLength,
			data.woundAssessment.woundWidth
		);
		if (area !== null && area >= 25) {
			flags.push({
				id: 'FLAG-WOUND-008',
				category: 'Wound',
				message: `Large wound area (${area} cm²) — escalate to tissue-viability nurse.`,
				priority: 'high'
			});
		}
	}

	// ─── Braden subscale alerts ───────────────────────────────
	const b = data.bradenScale;
	if (b.sensoryPerception !== null && b.sensoryPerception <= 2) {
		flags.push({
			id: 'FLAG-BRADEN-001',
			category: 'Braden — Sensory',
			message: 'Severely limited sensory perception — patient may not feel pressure-related discomfort.',
			priority: 'high'
		});
	}
	if (b.moisture !== null && b.moisture <= 2) {
		flags.push({
			id: 'FLAG-BRADEN-002',
			category: 'Braden — Moisture',
			message: 'Skin frequently moist — incontinence / perspiration management required.',
			priority: 'high'
		});
	}
	if (b.activity !== null && b.activity <= 2) {
		flags.push({
			id: 'FLAG-BRADEN-003',
			category: 'Braden — Activity',
			message: 'Bedfast or chairfast — implement repositioning schedule.',
			priority: 'high'
		});
	}
	if (b.mobility !== null && b.mobility <= 2) {
		flags.push({
			id: 'FLAG-BRADEN-004',
			category: 'Braden — Mobility',
			message: 'Very limited mobility — pressure-redistribution surface indicated.',
			priority: 'high'
		});
	}
	if (b.nutrition !== null && b.nutrition <= 2) {
		flags.push({
			id: 'FLAG-BRADEN-005',
			category: 'Braden — Nutrition',
			message: 'Probably-inadequate nutrition — dietitian referral recommended.',
			priority: 'medium'
		});
	}
	if (b.frictionShear !== null && b.frictionShear === 1) {
		flags.push({
			id: 'FLAG-BRADEN-006',
			category: 'Braden — Friction & Shear',
			message: 'Significant friction/shear problem — review transfer technique and bed surface.',
			priority: 'high'
		});
	}

	// ─── Skin inspection alerts ───────────────────────────────
	if (
		data.skinInspection.integrity === 'breakdown' ||
		data.skinInspection.integrity === 'open-lesions'
	) {
		flags.push({
			id: 'FLAG-SKIN-001',
			category: 'Skin Integrity',
			message: 'Skin breakdown / open lesions identified on inspection.',
			priority: 'high'
		});
	}
	if (data.skinInspection.turgor === 'tenting' || data.skinInspection.turgor === 'poor') {
		flags.push({
			id: 'FLAG-SKIN-002',
			category: 'Skin Turgor',
			message: 'Reduced skin turgor — assess hydration status.',
			priority: 'medium'
		});
	}
	if (data.skinInspection.colour === 'jaundiced') {
		flags.push({
			id: 'FLAG-SKIN-003',
			category: 'Skin Colour',
			message: 'Jaundice noted — investigate hepatobiliary cause.',
			priority: 'high'
		});
	}
	if (data.skinInspection.colour === 'cyanotic') {
		flags.push({
			id: 'FLAG-SKIN-004',
			category: 'Skin Colour',
			message: 'Cyanosis noted — assess oxygenation urgently.',
			priority: 'urgent'
		});
	}
	if (data.skinInspection.lesionTypes.includes('ulcer')) {
		flags.push({
			id: 'FLAG-SKIN-005',
			category: 'Lesions',
			message: 'Ulcerative lesion present — characterise and document carefully.',
			priority: 'medium'
		});
	}
	if (data.skinInspection.lesionTypes.includes('suspicious-pigmented')) {
		flags.push({
			id: 'FLAG-SKIN-006',
			category: 'Lesions',
			message: 'Suspicious pigmented lesion — consider dermatology referral for ABCDE evaluation.',
			priority: 'high'
		});
	}

	// ─── Hair / scalp alerts ──────────────────────────────────
	if (data.hairScalpExamination.alopecia === 'yes') {
		flags.push({
			id: 'FLAG-HAIR-001',
			category: 'Hair',
			message: `Alopecia present${data.hairScalpExamination.alopeciaPattern ? ` (${data.hairScalpExamination.alopeciaPattern})` : ''} — consider underlying cause.`,
			priority: 'low'
		});
	}
	if (data.hairScalpExamination.scalpFindings.includes('lice')) {
		flags.push({
			id: 'FLAG-HAIR-002',
			category: 'Scalp',
			message: 'Pediculosis (head lice) identified — treat and inform contacts.',
			priority: 'medium'
		});
	}

	// ─── Nail alerts ──────────────────────────────────────────
	if (data.nailExamination.nailFindings.includes('clubbing')) {
		flags.push({
			id: 'FLAG-NAIL-001',
			category: 'Nails',
			message: 'Nail clubbing — investigate cardiopulmonary cause.',
			priority: 'medium'
		});
	}
	if (data.nailExamination.nailFindings.includes('koilonychia')) {
		flags.push({
			id: 'FLAG-NAIL-002',
			category: 'Nails',
			message: 'Koilonychia (spoon nails) — investigate iron-deficiency anaemia.',
			priority: 'low'
		});
	}
	if (
		data.nailExamination.nailCapillaryRefill === 'sluggish' ||
		data.nailExamination.nailCapillaryRefill === 'absent'
	) {
		flags.push({
			id: 'FLAG-NAIL-003',
			category: 'Nails',
			message: 'Sluggish/absent capillary refill — assess peripheral perfusion.',
			priority: 'high'
		});
	}

	// ─── Presenting concern alerts ───────────────────────────
	if (data.presentingSkinConcern.bleeding === 'yes') {
		flags.push({
			id: 'FLAG-CONCERN-001',
			category: 'Presenting Concern',
			message: 'Active bleeding from skin lesion reported.',
			priority: 'high'
		});
	}
	if (data.presentingSkinConcern.discharge === 'yes') {
		flags.push({
			id: 'FLAG-CONCERN-002',
			category: 'Presenting Concern',
			message: 'Discharge from skin lesion reported — consider infection.',
			priority: 'medium'
		});
	}
	if (data.presentingSkinConcern.painScore !== null && data.presentingSkinConcern.painScore >= 7) {
		flags.push({
			id: 'FLAG-CONCERN-003',
			category: 'Pain',
			message: `Severe pain (${data.presentingSkinConcern.painScore}/10) — analgesia review required.`,
			priority: 'high'
		});
	}

	// ─── Documentation alerts ────────────────────────────────
	if (
		data.photographyDocumentation.photosTaken === 'yes' &&
		data.photographyDocumentation.consentObtained !== 'yes'
	) {
		flags.push({
			id: 'FLAG-DOC-001',
			category: 'Documentation',
			message: 'Photographs taken without documented consent — review information-governance policy.',
			priority: 'urgent'
		});
	}

	// ─── Care-plan alerts ────────────────────────────────────
	if (
		data.clinicalImpressionCarePlan.referralRequired === 'yes' &&
		!data.clinicalImpressionCarePlan.referralDetails
	) {
		flags.push({
			id: 'FLAG-PLAN-001',
			category: 'Care Plan',
			message: 'Referral required but no referral details recorded.',
			priority: 'medium'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
