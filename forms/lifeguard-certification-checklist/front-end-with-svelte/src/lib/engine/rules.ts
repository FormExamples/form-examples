// RLSS UK NPLQ / ILSF Lifeguard Competency Verification rules (declarative).
//
// Each rule maps a single observed competency to a tri-state value:
//   'yes' = demonstrated correctly (passes the rule)
//   'no'  = not yet demonstrated (deficiency)
//   'na'  = not assessed in this session (excluded from grading)
//   ''    = examiner has not yet recorded an answer (excluded)
//
// Critical competencies (per RLSS NPLQ): any 'no' on a rule with
// critical=true forces an overall Fail. Non-critical rules contribute to
// the deficiency count which determines Pass / Needs Development.
//
// Numeric measurements (50 m swim time, CPR rate/depth) are also surfaced as
// rules: the rule fires 'no' when a numeric value is recorded outside the
// NPLQ / resuscitation-council range, 'yes' when it's in range, and falls back
// to the explicit tri-state field otherwise.

import type { AssessmentData, LifeguardRule, TriState } from './types';
import { swim50mWithinTarget, compressionRateInRange, compressionDepthInRange } from './utils';

/** Read a tri-state field, normalising missing/unknown values to ''. */
function read(d: AssessmentData, section: keyof AssessmentData, field: string): TriState {
	const sec = d[section] as unknown as Record<string, unknown> | undefined;
	const v = sec ? sec[field] : undefined;
	if (v === 'yes' || v === 'no' || v === 'na') return v;
	return '';
}

export const lifeguardRules: LifeguardRule[] = [
	// --- Step 2: Physical Fitness & Swim Competency ------------------------
	{
		id: 'LIFE-PF-50M-TIME',
		step: 2,
		category: 'Swim Competency',
		label: 'Completes 50 m timed swim in 60 seconds or less (NPLQ standard).',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => {
			const explicit = read(d, 'physicalFitnessSwim', 'swim50mWithinTime');
			if (explicit !== '') return explicit;
			const t = d.physicalFitnessSwim.swim50mTimeSeconds;
			if (t === null || t === undefined) return '';
			return swim50mWithinTarget(t) ? 'yes' : 'no';
		}
	},
	{
		id: 'LIFE-PF-DIVE',
		step: 2,
		category: 'Swim Competency',
		label: 'Sustained surface dive to required depth and recovers an object.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'physicalFitnessSwim', 'sustainedSurfaceDive')
	},
	{
		id: 'LIFE-PF-200M',
		step: 2,
		category: 'Swim Competency',
		label: 'Sustained 200 m swim using mixed strokes (front crawl, breast, back).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'physicalFitnessSwim', 'swim200mMixedStrokes')
	},
	{
		id: 'LIFE-PF-TREAD',
		step: 2,
		category: 'Swim Competency',
		label: 'Treads water for 2 minutes with hands clear of the surface.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'physicalFitnessSwim', 'treadWaterTwoMinutes')
	},
	{
		id: 'LIFE-PF-TOW',
		step: 2,
		category: 'Swim Competency',
		label: 'Tows a casualty 50 m through the water using an approved hold.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'physicalFitnessSwim', 'towCasualty50m')
	},

	// --- Step 3: Supervision, Scanning & Zoning ----------------------------
	{
		id: 'LIFE-SCAN-ZONE',
		step: 3,
		category: 'Supervision',
		label: 'Understands and articulates zone of responsibility.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'understandsZoneOfResponsibility')
	},
	{
		id: 'LIFE-SCAN-PATTERN',
		step: 3,
		category: 'Scanning',
		label: 'Maintains an effective, systematic scanning pattern across the zone.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'effectiveScanningPattern')
	},
	{
		id: 'LIFE-SCAN-1020',
		step: 3,
		category: 'Scanning',
		label: 'Applies the 10/20 rule (10 s to recognise, 20 s to reach).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'tenTwentyScanRule')
	},
	{
		id: 'LIFE-SCAN-DISTRESS',
		step: 3,
		category: 'Scanning',
		label: 'Recognises early signs of a distressed or drowning swimmer.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'recognisesDistressedSwimmer')
	},
	{
		id: 'LIFE-SCAN-ROTATION',
		step: 3,
		category: 'Supervision',
		label: 'Performs zone rotations safely and at appropriate intervals.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'appropriateRotation')
	},
	{
		id: 'LIFE-SCAN-WHISTLE',
		step: 3,
		category: 'Supervision',
		label: 'Uses whistle and hand signals correctly to communicate with team.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'supervisionScanningZoning', 'usesWhistleAndSignals')
	},

	// --- Step 4: Rescue Scenario — Conscious Casualty -----------------------
	{
		id: 'LIFE-RC-RECOG',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Recognises the incident and alerts the team without delay.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'recognitionAndAlert')
	},
	{
		id: 'LIFE-RC-ENTRY',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Enters the water without losing sight of the casualty.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'entryWithoutLossOfSight')
	},
	{
		id: 'LIFE-RC-AID',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Approaches with a floating aid (torpedo buoy, throw bag, etc.).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'approachWithFloatingAid')
	},
	{
		id: 'LIFE-RC-REASSURE',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Reassures and instructs the casualty during the rescue.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'reassuresCasualty')
	},
	{
		id: 'LIFE-RC-TOW',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Tows the casualty safely to the side of the pool / shore.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'towToSafety')
	},
	{
		id: 'LIFE-RC-EXTRICATE',
		step: 4,
		category: 'Conscious Rescue',
		label: 'Extricates the casualty from the water with appropriate technique.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueConscious', 'extricationFromWater')
	},

	// --- Step 5: Rescue Scenario — Unconscious Casualty ---------------------
	{
		id: 'LIFE-RU-RECOG',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Recognises unconscious casualty and activates emergency response.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'recognitionAndAlert')
	},
	{
		id: 'LIFE-RU-ENTRY',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Performs safe entry and rapid approach to the casualty.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'safeEntryAndApproach')
	},
	{
		id: 'LIFE-RU-AIRWAY',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Manages the airway in the water (head tilt, mouth clear of water).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'airwayManagementInWater')
	},
	{
		id: 'LIFE-RU-TOW',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Effective tow of unconscious casualty to safety, airway protected.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'effectiveTowToSafety')
	},
	{
		id: 'LIFE-RU-EXTRICATE',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Safe extrication of unconscious casualty without injury.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'safeExtrication')
	},
	{
		id: 'LIFE-RU-HANDOVER',
		step: 5,
		category: 'Unconscious Rescue',
		label: 'Communicates clear handover signal to colleagues / EMS.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'rescueUnconscious', 'handoverHandsignal')
	},

	// --- Step 6: Spinal Injury Management -----------------------------------
	{
		id: 'LIFE-SP-MECH',
		step: 6,
		category: 'Spinal Management',
		label: 'Recognises mechanism of injury suggesting suspected spinal trauma.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'recognisesMechanism')
	},
	{
		id: 'LIFE-SP-HEADSPLINT',
		step: 6,
		category: 'Spinal Management',
		label: 'Applies head-splint hold safely in the water.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'headSplintHold')
	},
	{
		id: 'LIFE-SP-INLINE',
		step: 6,
		category: 'Spinal Management',
		label: 'Maintains in-line stabilisation throughout movement.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'maintainsInlineStabilisation')
	},
	{
		id: 'LIFE-SP-ROLL',
		step: 6,
		category: 'Spinal Management',
		label: 'Performs careful in-water roll if face-down (where indicated).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'carefulRollIfNeeded')
	},
	{
		id: 'LIFE-SP-BOARD',
		step: 6,
		category: 'Spinal Management',
		label: 'Uses spineboard correctly to extricate suspected spinal casualty.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'useOfSpineboard')
	},
	{
		id: 'LIFE-SP-SECURE',
		step: 6,
		category: 'Spinal Management',
		label: 'Secures casualty to spineboard with straps and head blocks.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'spinalInjuryManagement', 'secureCasualtyToBoard')
	},

	// --- Step 7: CPR & AED --------------------------------------------------
	{
		id: 'LIFE-CPR-COMPRESSIONS',
		step: 7,
		category: 'CPR & AED',
		label: 'Effective compressions to standard rate (100-120/min) and depth (5-6 cm).',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => {
			const explicit = read(d, 'cprAed', 'effectiveCompressions');
			if (explicit !== '') return explicit;
			// Derive from numeric measurements: must be in range on BOTH.
			const rate = d.cprAed.compressionRate;
			const depth = d.cprAed.compressionDepth;
			if ((rate === null || rate === undefined) && (depth === null || depth === undefined)) return '';
			const rateOk = rate === null || rate === undefined ? true : compressionRateInRange(rate);
			const depthOk = depth === null || depth === undefined ? true : compressionDepthInRange(depth);
			return rateOk && depthOk ? 'yes' : 'no';
		}
	},
	{
		id: 'LIFE-CPR-VENTILATIONS',
		step: 7,
		category: 'CPR & AED',
		label: 'Delivers effective ventilations producing visible chest rise.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'cprAed', 'effectiveVentilations')
	},
	{
		id: 'LIFE-CPR-AED-PROMPT',
		step: 7,
		category: 'CPR & AED',
		label: 'Delivers AED shock promptly without unsafe contact during shock.',
		critical: true,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'cprAed', 'aedDeliveredPromptly')
	},
	{
		id: 'LIFE-CPR-AED-SAFE',
		step: 7,
		category: 'CPR & AED',
		label: 'Calls "all clear" and verifies no contact before pressing shock.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'cprAed', 'safeShockNoUnsafeContact')
	},
	{
		id: 'LIFE-CPR-QUALITY',
		step: 7,
		category: 'CPR & AED',
		label: 'Maintains continuous high-quality CPR with minimal interruptions.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'cprAed', 'continuousQualityCpr')
	},

	// --- Step 8: First Aid & Oxygen Therapy ---------------------------------
	{
		id: 'LIFE-FA-BLEEDING',
		step: 8,
		category: 'First Aid',
		label: 'Controls external bleeding (direct pressure, dressings, elevation).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'bleedingControl')
	},
	{
		id: 'LIFE-FA-BURNS',
		step: 8,
		category: 'First Aid',
		label: 'Manages burns appropriately (cool water, cover, do not break blisters).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'burnsManagement')
	},
	{
		id: 'LIFE-FA-FRACTURE',
		step: 8,
		category: 'First Aid',
		label: 'Immobilises suspected fractures and supports the limb.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'fractureImmobilisation')
	},
	{
		id: 'LIFE-FA-RECOVERY',
		step: 8,
		category: 'First Aid',
		label: 'Places unresponsive breathing casualty in the recovery position.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'recoveryPositionUse')
	},
	{
		id: 'LIFE-FA-OXYGEN',
		step: 8,
		category: 'First Aid',
		label: 'Administers oxygen therapy correctly via mask at appropriate flow.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'oxygenTherapyAdministration')
	},
	{
		id: 'LIFE-FA-MASK',
		step: 8,
		category: 'First Aid',
		label: 'Uses pocket mask or bag-valve-mask with effective seal.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'firstAidOxygen', 'usesPocketMaskOrBVM')
	},

	// --- Step 9: Legal, Regulatory & Incident Reporting ---------------------
	{
		id: 'LIFE-LR-DUTY',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Demonstrates understanding of duty of care and lifeguard responsibilities.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'dutyOfCareUnderstood')
	},
	{
		id: 'LIFE-LR-PSWP',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Knows venue Pool Safety Operating Procedures (PSOP / NOP / EAP).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'pswpKnowledge')
	},
	{
		id: 'LIFE-LR-EAP',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Can correctly invoke the Emergency Action Plan (EAP).',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'eapInvocation')
	},
	{
		id: 'LIFE-LR-REPORT',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Completes incident report accurately and contemporaneously.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'incidentReportCompleted')
	},
	{
		id: 'LIFE-LR-RIDDOR',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Demonstrates awareness of RIDDOR reportable events.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'riddorAwareness')
	},
	{
		id: 'LIFE-LR-SAFEGUARD',
		step: 9,
		category: 'Legal & Regulatory',
		label: 'Understands safeguarding obligations for children and adults at risk.',
		critical: false,
		defaultExpectation: 'yes',
		evaluate: (d) => read(d, 'legalRegulatoryIncident', 'safeguardingChildrenAdults')
	}
];
